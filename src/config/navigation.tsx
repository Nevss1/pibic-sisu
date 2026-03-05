import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TableChartIcon from "@mui/icons-material/TableChart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

export const ROUTE_LABELS: Record<string, string> = {
  cursos: "Cursos",
  geral: "Visão Geral",
  predicao: "Predição",
  colunas: "Informações disponíveis",
  conta: "Conta",
  sobre: "Sobre",
};

export const NAV_ITEMS = [
  { href: "/cursos", label: "Cursos", icon: <SchoolIcon /> },
  { href: "/geral", label: "Visão Geral", icon: <DashboardIcon /> },
  { href: "/predicao", label: "Predição", icon: <TrendingUpIcon /> },
  {
    href: "/colunas",
    label: "Informações disponíveis",
    icon: <TableChartIcon />,
  },
  { href: "/conta", label: "Conta", icon: <AccountCircleIcon /> },
  { href: "/sobre", label: "Sobre", icon: <TableChartIcon /> },
  { href: "/", label: "Sair", icon: <LogoutIcon /> },
];
