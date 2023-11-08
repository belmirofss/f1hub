import { ListItemResult } from "../../components/ListItemResult";
import { Result } from "../../types";

type Props = {
  results: Result[];
};

export const RaceResultContentResults = ({ results }: Props) => {
  return results.map((result) => (
    <ListItemResult key={result.position} result={result} />
  ));
};
