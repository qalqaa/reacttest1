import { useQuery } from "@tanstack/react-query";
import { LiferayQuery, LiferayQueryNoArgs } from "./liferay";
import { Country } from "./App";

export const useCountries = () => {
  return useQuery<Country[]>({
    queryKey: ["countries"],
    queryFn: async () => await LiferayQueryNoArgs("/country/get-countries"),
  });
};
