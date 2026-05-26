import SchoolIcon from "@mui/icons-material/School";
import BarChartIcon from "@mui/icons-material/BarChart";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LogoutIcon from "@mui/icons-material/Logout";

export const ROUTE_LABELS: Record<string, string> = {
  cursos: "Cursos",
  geral: "Visão Geral",
  perfil: "Análise de Perfil",
  informacao: "Informações disponíveis",
  sobre: "Sobre",
};

export const NAV_ITEMS = [
  { href: "/cursos", label: "Cursos", icon: <SchoolIcon /> },
  { href: "/geral", label: "Visão Geral", icon: <BarChartIcon /> },
  { href: "/perfil", label: "Análise de Perfil", icon: <AutoGraphIcon /> },
  {
    href: "/informacao",
    label: "Informações disponíveis",
    icon: <MenuBookIcon />,
  },
  { href: "/sobre", label: "Sobre", icon: <InfoOutlinedIcon /> },
  { href: "/", label: "Sair", icon: <LogoutIcon /> },
];
