import { Image } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Theme } from "../theme";

type Props = {
  url: string | undefined;
};

export const FlagIcon = ({ url }: Props) => {
  if (!url) {
    return <Entypo name="block" size={24} color={Theme.colors.light} />;
  }

  return (
    <Image
      source={{
        uri: url,
      }}
      style={{
        width: 24,
        height: 24,
      }}
    />
  );
};
