import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: false;
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
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#ae8f58",
      contrastText: "#0d0b08",
    },
    background: {
      default: "#FEF9F6",
      paper: "#FEF9F6",
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
            backgroundColor: "rgba(213,176,113,0.15)",
            "&:hover": { backgroundColor: "rgba(213,176,113,0.22)" },
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
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