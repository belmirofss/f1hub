import { ConstructorStanding } from "../../types";
import { ListItemConstructor } from "../../components/ListItemConstructor";

type Props = {
  constructorStandings: ConstructorStanding[];
};

export const StandingsContructors = ({ constructorStandings }: Props) => {
  return constructorStandings.map((constructor) => (
    <ListItemConstructor
      key={constructor.Constructor.constructorId}
      position={constructor.position}
      points={constructor.points}
      constructorName={constructor.Constructor.name}
    />
  ));
};
