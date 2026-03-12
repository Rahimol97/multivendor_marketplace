import { createThemeContext } from "./createThemeContext";

export const {
  ThemeProvider: VendorThemeProvider,
  useTheme: useVendorTheme,
} = createThemeContext("vendor-theme");