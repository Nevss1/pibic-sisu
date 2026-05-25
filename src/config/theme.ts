import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: false;
    md: false;
    lg: false;
    xl: false;
    mobile: true;
    tabletSmall: true;
    tablet: true;
    laptop: true;
    desktop: true;
    desktopLarge: true;
  }

  interface Palette {
    competition: {
      low: string;
      midLow: string;
      mid: string;
      high: string;
      veryHigh: string;
    };
  }

  interface PaletteOptions {
    competition?: {
      low?: string;
      midLow?: string;
      mid?: string;
      high?: string;
      veryHigh?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#ae8f58",
      light: "#D5B071",
      dark: "#8a6e3a",
      contrastText: "#ffffff",
    },
    background: {
      default: "#FEF9F6",
      paper: "#ffffff",
    },
    text: {
      primary: "#1A1A2E",
      secondary: "#6B7280",
    },
    divider: "#E8E1D9",
    competition: {
      low: "#4e9a8f",
      midLow: "#8fbe6e",
      mid: "#D5B071",
      high: "#e07b39",
      veryHigh: "#c0392b",
    },
  },
  typography: {
    fontFamily: '"Roboto", sans-serif',
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontSize: '1.0625rem',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '0.9375rem',
      fontWeight: 600,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.9375rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    caption: {
      fontSize: '0.75rem',
    },
  },
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: "laptop",
        sx: {
          paddingTop: 4,
        }
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "rgba(174,143,88,0.12)",
            "&:hover": { backgroundColor: "rgba(174,143,88,0.18)" },
          },
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#E8E1D9",
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontSize: "0.75rem",
          lineHeight: 1,
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      mobile: 600,
      tabletSmall: 900,
      tablet: 1050,
      laptop: 1200,
      desktop: 1440,
      desktopLarge: 1800,
    },
  },
});

export default theme;
