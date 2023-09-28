import axios from "axios";
import { F1_API } from "./constants";

export const Api = axios.create({
  baseURL: F1_API,
  params: {
    limit: 1000,
  }
});
