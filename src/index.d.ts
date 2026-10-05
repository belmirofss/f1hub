export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Tabs: undefined;
      Home: undefined;
      Calendar: undefined;
      Standings: undefined;
      Archive: undefined;
      RaceWeekend: { season: string; round: string };
      Season: { season: string };
      Settings: undefined;
    }
  }

  declare module "*.png";
}
