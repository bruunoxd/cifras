import { useEffect, useState } from "react";
import { loadPrefs, savePrefs, Prefs } from "../store/prefs";

export function useTheme() {
  const [prefs, setPrefs] = useState<Prefs>(loadPrefs());

  // Aplicar tema ao documento
  useEffect(() => {
    const root = document.documentElement;

    if (prefs.theme === "dark") {
      root.classList.add("dark-theme");
    } else {
      root.classList.remove("dark-theme");
    }

    // Aplicar tamanho da fonte
    root.style.setProperty("--app-font-size", `${prefs.fontSize}px`);
  }, [prefs.theme, prefs.fontSize]);

  const updatePrefs = (newPrefs: Partial<Prefs>) => {
    const updatedPrefs = { ...prefs, ...newPrefs };
    setPrefs(updatedPrefs);
    savePrefs(updatedPrefs);
  };

  return {
    prefs,
    updatePrefs,
    isDark: prefs.theme === "dark",
  };
}
