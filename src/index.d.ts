export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Tabs: undefined;
      Home: undefined;
      Calendar: undefined;
      Standings: undefined;
      Archive: undefined;
      RaceWeekend: { season: string; round: string; tab?: "analysis" | "radio" };
      Driver: { driverId: string };
      Team: { constructorId: string };
      Circuit: { circuitId: string };
      Teammates: { season: string; constructorId?: string };
      Season: { season: string };
      Settings: undefined;
      Search: undefined;
    }
  }

  declare module "*.png";
}
