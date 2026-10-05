import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ACCENT_OPTIONS, Theme } from "../theme";

const STORAGE_KEY = "F1HUB_SETTINGS";

type StoredSettings = {
  accent: string;
  clock24: boolean;
};

type Settings = StoredSettings & {
  // Text colour that stays readable on top of the accent colour
  onAccent: string;
  setAccent: (accent: string) => void;
  setClock24: (clock24: boolean) => void;
};

const DEFAULTS: StoredSettings = {
  accent: ACCENT_OPTIONS[0].value,
  clock24: true,
};

const SettingsContext = createContext<Settings>({
  ...DEFAULTS,
  onAccent: "#FFFFFF",
  setAccent: () => {},
  setClock24: () => {},
});

const isLight = (hex: string) => {
  const value = parseInt(hex.slice(1), 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 150;
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<StoredSettings>(DEFAULTS);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
      })
      .catch(() => {});
  }, []);

  const value = useMemo<Settings>(() => {
    const update = (patch: Partial<StoredSettings>) => {
      setSettings((current) => {
        const next = { ...current, ...patch };
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
    };

    return {
      ...settings,
      onAccent: isLight(settings.accent) ? Theme.colors.background : "#FFFFFF",
      setAccent: (accent) => update({ accent }),
      setClock24: (clock24) => update({ clock24 }),
    };
  }, [settings]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
