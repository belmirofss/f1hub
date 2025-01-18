import { useState } from "react";
import { Button, Text } from "react-native-paper";
import { Theme } from "../theme";

export const UseSeeAllSeeLess = () => {
  const [seeAll, setSetAll] = useState(false);

  const SeeAllSeeLessButton = () => (
    <Button mode="text" onPress={() => setSetAll((value) => !value)}>
      <Text
        variant="labelSmall"
        style={{
          color: Theme.colors.primary,
          fontFamily: Theme.fonts.special,
          textAlign: "center",
          textDecorationLine: "underline",
        }}
      >
        {seeAll ? "See less" : "See all"}
      </Text>
    </Button>
  );

  return { seeAll, SeeAllSeeLessButton };
};
