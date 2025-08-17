export type Prefs = {
  theme: "light" | "dark";
  fontSize: number;
  subscribed: boolean;
  subscriptionDate?: string;
  paymentMethod?: {
    cardBrand: string;
    lastFour: string;
    email: string;
  };
};

const KEY = "cifras:prefs";

export function loadPrefs(): Prefs {
  const raw = localStorage.getItem(KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as Prefs;
    } catch {}
  }
  return { theme: "light", fontSize: 16, subscribed: false };
}

export function savePrefs(p: Prefs) {
  localStorage.setItem(KEY, JSON.stringify(p));
}
