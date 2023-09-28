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

export type Race = {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: Circuit;
  date: string;
  time: string;
  FirstPractice: {
    date: string;
    time: string;
  };
  Qualifying: {
    date: string;
    time: string;
  };
  SecondPractice: {
    date: string;
    time: string;
  };
  Sprint?: {
    date: string;
    time: string;
  };
};

export type Driver = {
  driverId: string;
  permanentNumber: string;
  code: string;
  url: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
}

export type Constructor = {
  constructorId: string;
  url: string;
  name: string;
  nationality: string;
}

export type DriverStanding = {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: Driver;
  Constructors: Constructor[]
}

export type ConstructorStanding = {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Constructor: Constructor
}

export enum StandingType {
  DRIVERS = 'drivers',
  CONSTRUCTORS = 'constructors',
}
