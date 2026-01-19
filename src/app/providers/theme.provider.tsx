 
import { MantineProvider, createTheme } from '@mantine/core';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

const themeDark = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Inter, sans-serif',
  colors: {
    // Custom color palette for dark theme - Pure black theme matching window borders
    // Use theme.colors.current[index] to access these colors
    current: [
      '#FFFFFF',           // [0] Primary text color (pure white for maximum contrast)
      '#E5E7EB',           // [1] Secondary text color (very light gray)
      '#D1D5DB',           // [2] Tertiary text color (light gray)
      '#9CA3AF',           // [3] Disabled text color (medium gray)
      '#0A0A0A',           // [4] Background color (near black)
      '#000000',           // [5] Surface/header color (pure black - matches window borders)
      '#000000',           // [6] Deep background (pure black - matches window borders)
      '#1A1A1A',           // [7] Card/surface background (very dark gray)
      '#3B82F6',           // [8] Primary blue accent (vibrant blue)
      '#2563EB',           // [9] Primary blue hover (darker blue)
      '#1D4ED8',           // [10] Primary blue active (deep blue)
      '#60A5FA',           // [11] Light blue accent (bright light blue)
      '#93C5FD',           // [12] Very light blue (highlights, glows)
      '#0F0F0F',           // [13] Elevated surface (very dark gray)
      '#2A2A2A',           // [14] Border color (dark gray - visible on black)
      '#404040',           // [15] Subtle border (medium dark gray)
    ],
  },
  components: {
    Button: {
      defaultProps: {
        size: 'md',
      },
    },
    Card: {
      defaultProps: {
        shadow: 'sm',
        radius: 'md',
        withBorder: true,
      },
    },
  },
});

const themeLight = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Inter, sans-serif',
  colors: {
    // Custom color palette for light theme - Pure white theme matching window borders
    // Use theme.colors.current[index] to access these colors
    current: [
      '#0A0A0A',           // [0] Primary text color (near black for maximum contrast)
      '#1A1A1A',           // [1] Secondary text color (very dark gray)
      '#2A2A2A',           // [2] Tertiary text color (dark gray)
      '#6B7280',           // [3] Disabled text color (medium gray)
      '#FAFAFA',           // [4] Background color (off-white)
      '#FFFFFF',           // [5] Surface/header color (pure white - matches window borders)
      '#FFFFFF',           // [6] Pure white (main background - matches window borders)
      '#F5F5F5',           // [7] Card/surface background (very light gray)
      '#2563EB',           // [8] Primary blue accent (vibrant blue)
      '#1D4ED8',           // [9] Primary blue hover (darker blue)
      '#1E40AF',           // [10] Primary blue active (deep blue)
      '#3B82F6',           // [11] Light blue accent (bright blue)
      '#60A5FA',           // [12] Very light blue (highlights, glows)
      '#FFFFFF',           // [13] Elevated surface (pure white)
      '#E0E0E0',           // [14] Border color (light gray - visible on white)
      '#C0C0C0',           // [15] Subtle border (medium gray)
    ],
  },
  components: {
    Button: {
      defaultProps: {
        size: 'md',
      },
    },
    Card: {
      defaultProps: {
        shadow: 'sm',
        radius: 'md',
        withBorder: true,
      },
    },
  },
});

interface ThemeProviderProps {
  children: ReactNode;
}

interface ColorSchemeContextValue {
  colorScheme: 'light' | 'dark';
  setColorScheme: (scheme: 'light' | 'dark') => void;
}

const ColorSchemeContext = createContext<ColorSchemeContextValue | null>(null);

export function useThemeColorScheme() {
  const context = useContext(ColorSchemeContext);

  if (!context) {
    throw new Error('useThemeColorScheme must be used within ThemeProvider');
  }

  return context;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Manage color scheme state - load from localStorage or default to 'light'
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mantine-color-scheme');

      return (stored === 'dark' || stored === 'light') ? stored : 'light';
    }

    return 'light';
  });

  // Save to localStorage when colorScheme changes
  useEffect(() => {
    localStorage.setItem('mantine-color-scheme', colorScheme);
  }, [colorScheme]);

  // Select theme based on color scheme
  const theme = colorScheme === 'dark' ? themeDark : themeLight;

  return (
    <ColorSchemeContext.Provider value={{ colorScheme, setColorScheme }}>
      <MantineProvider theme={theme} forceColorScheme={colorScheme}>
        {children}
      </MantineProvider>
    </ColorSchemeContext.Provider>
  );
}
