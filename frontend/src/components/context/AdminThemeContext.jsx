import { createThemeContext } from "./createThemeContext";

export const {
  ThemeProvider: AdminThemeProvider,
  useTheme: useAdminTheme,
} = createThemeContext("admin-theme");