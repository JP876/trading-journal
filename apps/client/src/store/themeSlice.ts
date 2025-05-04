import { StateCreator } from 'zustand';

export type themeMode = 'dark' | 'light' | 'system';

export interface IThemeSlice {
  mode: themeMode;
  setThemeMode: (mode?: themeMode) => void;
}

const themeModeKey = 'trading_journal-theme_mode';
const initialMode = (localStorage.getItem(themeModeKey) as themeMode) || 'system';

const createThemeSlice: StateCreator<IThemeSlice> = (set) => ({
  mode: initialMode,
  setThemeMode: (mode = initialMode) => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    let newMode = mode;

    if (mode === 'system') {
      newMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    localStorage.setItem(themeModeKey, newMode);

    root.classList.add(newMode);
    return set(() => ({ mode: newMode }));
  },
});

export default createThemeSlice;
