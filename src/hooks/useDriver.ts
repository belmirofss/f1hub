import { useQuery } from "@tanstack/react-query";
import { Api } from "../api";
import { Driver } from "../types";

type Response = {
  MRData: {
    DriverTable: {
      Drivers: Driver[];
    };
  };
};

export const useDriver = ({ driverId }: { driverId: string }) => {
  return useQuery({
    queryKey: ["DRIVER", driverId],
    queryFn: () => Api.get<Response>(`drivers/${driverId}.json`),
    select: (response) => response.data.MRData.DriverTable.Drivers[0],
    staleTime: 1000 * 60 * 60 * 24,
  });
};
