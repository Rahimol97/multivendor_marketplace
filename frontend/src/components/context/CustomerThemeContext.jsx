import { createThemeContext } from "./createThemeContext";

export const {
  ThemeProvider: CustomerThemeProvider,
  useTheme: useCustomerTheme,
} = createThemeContext("customer-theme");