import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { WIKIPEDIA_SUMMARY_API } from "../constants";

type Response = {
  extract?: string;
};

// Takes the Wikipedia link the F1 API gives ("http://en.wikipedia.org/wiki/Lando_Norris")
export const useWikipediaSummary = ({ url }: { url?: string }) => {
  const title = url?.split("/wiki/")[1];
  return useQuery({
    queryKey: ["WIKIPEDIA_SUMMARY", title],
    queryFn: () =>
      axios.get<Response>(
        `${WIKIPEDIA_SUMMARY_API}${encodeURIComponent(decodeURIComponent(title ?? ""))}`
      ),
    select: (response) => response.data.extract,
    enabled: !!title,
    staleTime: 1000 * 60 * 60 * 24,
  });
};
