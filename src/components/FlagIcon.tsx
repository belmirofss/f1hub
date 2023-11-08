import { Image } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Theme } from "../theme";
import {
  buildCountryFlagUrlByName,
  buildCountryFlagUrlByNationality,
} from "../helpers/countries";

type Props = {
  nationality?: string | undefined;
  country?: string | undefined;
};

export const FlagIcon = ({ nationality, country }: Props) => {
  const urlByNationality = buildCountryFlagUrlByNationality(nationality ?? "");
  const urlByCountry = buildCountryFlagUrlByName(country ?? "");

  if (!urlByNationality && !urlByCountry) {
    return <Entypo name="block" size={24} color={Theme.colors.light} />;
  }

  return (
    <Image
      source={{
        uri: urlByNationality ?? urlByCountry,
      }}
      style={{
        width: 24,
        height: 24,
      }}
    />
  );
};
