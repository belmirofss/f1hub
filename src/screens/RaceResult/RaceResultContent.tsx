import { View } from "react-native";
import { Race } from "../../types";
import { Text } from "react-native-paper";
import { Theme } from "../../theme";
import { SectionContainer } from "../../components/SectionContainer";
import { RaceResultContentInfo } from "./RaceResultContentInfo";
import { RaceResultContentResults } from "./RaceResultContentResults";

type Props = {
  race: Race;
};

export const RaceResultContent = ({ race }: Props) => {
  return (
    <View>
      <Text
        variant="titleLarge"
        style={{
          color: Theme.colors.secondary,
          fontFamily: Theme.fonts.special,
        }}
      >
        {race.raceName}
      </Text>
      <SectionContainer name="Info" expansable>
        <RaceResultContentInfo race={race} />
      </SectionContainer>

      {race.Results && (
        <View style={{ marginTop: Theme.space.s }}>
          <SectionContainer name="Results" expansable>
            <RaceResultContentResults results={race.Results} />
          </SectionContainer>
        </View>
      )}
    </View>
  );
};
