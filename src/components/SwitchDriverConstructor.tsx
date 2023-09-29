import { StandingType } from "../types";
import { SegmentedButtons, configureFonts } from "react-native-paper";
import { Theme } from "../theme";

type Props = {
  selected: StandingType;
  onChange: (value: StandingType) => void;
};

export const SwitchDriverConstructor = ({ selected, onChange }: Props) => {
  const standingsOptions = [
    {
      value: StandingType.DRIVERS,
      label: "Drivers",
    },
    {
      value: StandingType.CONSTRUCTORS,
      label: "Constructors",
    },
  ];

  return (
    <SegmentedButtons
      value={selected}
      onValueChange={(value) => onChange(value as StandingType)}
      buttons={standingsOptions.map((option) => ({
        ...option,
        labelStyle: {
          color:
            option.value === selected
              ? Theme.colors.darken
              : Theme.colors.primary,
        },
      }))}
      style={{ marginTop: Theme.space.xs }}
      theme={{
        roundness: 2,
        colors: {
          secondaryContainer: Theme.colors.primary,
        },
        fonts: configureFonts({
          config: {
            fontFamily: Theme.fonts.bold,
          },
        }),
      }}
    />
  );
};
