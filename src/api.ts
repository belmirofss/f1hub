import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { F1_API, OPENF1_API, OPEN_METEO_API } from "./constants";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Lets a few requests run at once and spaces out their starts, so screens
// that fire many queries together stay under the APIs' rate limits.
const createQueue = (concurrent: number, gapMs: number) => {
  let active = 0;
  let lastStart = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const waiting: (() => void)[] = [];

  const next = () => {
    if (timer || active >= concurrent || !waiting.length) return;
    const wait = lastStart + gapMs - Date.now();
    if (wait > 0) {
      timer = setTimeout(() => {
        timer = undefined;
        next();
      }, wait);
      return;
    }
    active++;
    lastStart = Date.now();
    waiting.shift()!();
    next();
  };

  return {
    acquire: () =>
      new Promise<void>((resolve) => {
        waiting.push(resolve);
        next();
      }),
    release: () => {
      active--;
      next();
    },
  };
};

type RetryConfig = InternalAxiosRequestConfig & { retries?: number };

// Queues every request and retries up to 3 times when rate limited (429)
const throttle = (instance: AxiosInstance, concurrent: number, gapMs: number) => {
  const queue = createQueue(concurrent, gapMs);

  instance.interceptors.request.use(async (config) => {
    await queue.acquire();
    return config;
  });
  instance.interceptors.response.use(
    (response) => {
      queue.release();
      return response;
    },
    async (error: AxiosError) => {
      queue.release();
      const config = error.config as RetryConfig | undefined;
      if (error.response?.status === 429 && config && (config.retries ?? 0) < 3) {
        config.retries = (config.retries ?? 0) + 1;
        const retryAfter = Number(error.response.headers["retry-after"]);
        await sleep(retryAfter > 0 ? retryAfter * 1000 : 1500 * config.retries);
        return instance(config);
      }
      throw error;
    }
  );
  return instance;
};

// Jolpica returns at most 100 rows per request, whatever `limit` asks for
export const PAGE_SIZE = 100;

// Jolpica: ~4 requests a second
export const Api = throttle(
  axios.create({
    baseURL: F1_API,
    params: {
      limit: PAGE_SIZE,
    },
  }),
  3,
  260
);

// OpenF1 free tier: 3 requests a second, 30 a minute
export const OpenF1 = throttle(axios.create({ baseURL: OPENF1_API }), 1, 400);

export const OpenMeteo = axios.create({ baseURL: OPEN_METEO_API });

type Paged = { MRData: { total: string } };

// Fetches every page of a Jolpica list endpoint ("drivers/norris/results.json")
export const getAllPages = async <T extends Paged>(url: string) => {
  const first = (await Api.get<T>(url)).data;
  const total = Number(first.MRData.total);
  const offsets: number[] = [];
  for (let offset = PAGE_SIZE; offset < total; offset += PAGE_SIZE) offsets.push(offset);
  const rest = await Promise.all(
    offsets.map((offset) => Api.get<T>(url, { params: { offset } }).then((r) => r.data))
  );
  return [first, ...rest];
};
