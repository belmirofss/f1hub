import { createContext, ReactNode, useState } from "react";

type AppContextData = {
  adShowed: boolean;
  markAdAsShowed: () => void;
};

const AppContext = createContext<AppContextData>({} as AppContextData);

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [adShowed, setAdShowed] = useState(false);
  const markAdAsShowed = () => setAdShowed(true);

  return (
    <AppContext.Provider
      value={{
        adShowed,
        markAdAsShowed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
