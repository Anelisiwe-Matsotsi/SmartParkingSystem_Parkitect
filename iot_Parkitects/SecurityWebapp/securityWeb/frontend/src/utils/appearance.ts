//Shared helpers so the saved appearance settings are applied on EVERY page,
import type { WebSettings } from "../services/api";

export type AppearanceSettings = Pick<
  WebSettings,
  "darkMode" | "compactTables" | "largerText" | "reducedMotion"
>;

const getUserSettingsKey = (uid: string, setting: string) =>
  `parkitects_${uid}_${setting}`;


export function applyAppearance(settings: AppearanceSettings) {
  const root = document.documentElement;

  root.setAttribute("data-theme", settings.darkMode ? "dark" : "light");
  root.setAttribute("data-compact", String(settings.compactTables));
  root.setAttribute("data-larger-text", String(settings.largerText));
  root.setAttribute("data-reduced-motion", String(settings.reducedMotion));
}

export function resetAppearance() {
  applyAppearance({
    darkMode: false,
    compactTables: false,
    largerText: false,
    reducedMotion: false,
  });
}

//Caches this user's settings so the right look shows immediately on the next page load
export function cacheAppearance(uid: string, settings: AppearanceSettings) {
  localStorage.setItem(getUserSettingsKey(uid, "theme"), settings.darkMode ? "dark" : "light");
  localStorage.setItem(getUserSettingsKey(uid, "compactTables"), String(settings.compactTables));
  localStorage.setItem(getUserSettingsKey(uid, "largerText"), String(settings.largerText));
  localStorage.setItem(getUserSettingsKey(uid, "reducedMotion"), String(settings.reducedMotion));
}

export function readCachedAppearance(uid: string): AppearanceSettings {
  return {
    darkMode: localStorage.getItem(getUserSettingsKey(uid, "theme")) === "dark",
    compactTables: localStorage.getItem(getUserSettingsKey(uid, "compactTables")) === "true",
    largerText: localStorage.getItem(getUserSettingsKey(uid, "largerText")) === "true",
    reducedMotion: localStorage.getItem(getUserSettingsKey(uid, "reducedMotion")) === "true",
  };
}
