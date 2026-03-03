"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TableChartIcon from "@mui/icons-material/TableChart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

const DRAWER_WIDTH = 220;

const NAV_ITEMS = [
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: open ? DRAWER_WIDTH : 0,
          flexShrink: 0,
          transition: "width 0.2s",
          "& .MuiDrawer-paper": {
            width: open ? DRAWER_WIDTH : 0,
            boxSizing: "border-box",
            overflowX: "hidden",
            transition: "width 0.2s",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Box
            component="img"
            src="/ufma-logo.png"
            alt="UFMA Logo"
            sx={{ width: 96, height: 96 }}
          />
        </Box>

        <Divider />

        <List>
          {NAV_ITEMS.map(({ href, label, icon }) => (
            <ListItem key={href} disablePadding>
              <ListItemButton component={Link} href={href}>
                <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box
          sx={{ mt: "auto", p: 1, display: "flex", justifyContent: "flex-end" }}
        >
          <IconButton onClick={() => setOpen(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <AppBar
          position="static"
          sx={{ bgcolor: "white", color: "text.primary" }}
        >
          <Toolbar>
            {!open && (
              <IconButton
                onClick={() => setOpen(true)}
                edge="start"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontWeight: 400 }}>
              Dashboard SISU UFMA
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ flex: 1, p: 5 }}>{children}</Box>
      </Box>
    </Box>
  );
}
