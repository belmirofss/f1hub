export type Location = {
  lat: string;
  long: string;
  locality: string;
  country: string;
};

export type Circuit = {
  circuitId: string;
  url: string;
  circuitName: string;
  Location: Location;
};

export type FastestLap = {
  rank: string;
  lap: string;
  Time: {
    time: string;
  };
  AverageSpeed: {
    units: string;
    speed: string;
  };
};

export type Result = {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: Driver;
  Constructor: Constructor;
  grid: string;
  laps: string;
  status: string;
  Time?: {
    millis: string;
    time: string;
  };
  FastestLap: FastestLap;
};

export type QualifyingResult = {
  number: string;
  position: string;
  points: string;
  Driver: Driver;
  Constructor: Constructor;
  grid: string;
  Q1: string;
  Q2: string;
  Q3: string
};

export type RaceBase = {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: Circuit;
  date: string;
  time?: string;
}

export type Race = RaceBase & {
  FirstPractice?: {
    date: string;
    time: string;
  };
  Qualifying?: {
    date: string;
    time: string;
  };
  SecondPractice?: {
    date: string;
    time: string;
  };
  Sprint?: {
    date: string;
    time: string;
  };
};

export type RaceResults = RaceBase & {
  Results?: Result[];
};

export type RaceSprintResults = RaceBase & { SprintResults?: Result[] };

export type QualifyingResults = RaceBase & { QualifyingResults?: QualifyingResult[] };

export type Driver = {
  driverId: string;
  permanentNumber: string;
  code: string;
  url: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
};

export type Constructor = {
  constructorId: string;
  url: string;
  name: string;
  nationality: string;
};

export type DriverStanding = {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: Driver;
  Constructors: Constructor[];
};

export type ConstructorStanding = {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Constructor: Constructor;
};

export type Season = {
  season: string;
  url: string;
};

export enum StandingType {
  DRIVERS = "drivers",
  CONSTRUCTORS = "constructors",
}
