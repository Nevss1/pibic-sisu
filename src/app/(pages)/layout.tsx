"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  AppBar,
  Box,
  Breadcrumbs,
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
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { toTitleCase } from "@/src/utils";
import { NAV_ITEMS, ROUTE_LABELS } from "@/src/config";

const DRAWER_WIDTH = 250;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = ROUTE_LABELS[segment] ?? toTitleCase(decodeURIComponent(segment));
    const isLast = index === segments.length - 1;
    return isLast ? (
      <Typography key={href} sx={{ color: "text.primary" }}>
        {label}
      </Typography>
    ) : (
      <Link key={href} href={href} style={{ color: "inherit", textDecoration: "none" }}>
        {label}
      </Link>
    );
  });

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
          sx={{ bgcolor: "white" }}
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
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              {breadcrumbs}
            </Breadcrumbs>
          </Toolbar>
        </AppBar>
        <Box sx={{ flex: 1, p: 5 }}>{children}</Box>
      </Box>
    </Box>
  );
}
