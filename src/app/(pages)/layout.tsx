"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { toTitleCase } from "@/src/utils";
import { NAV_ITEMS, ROUTE_LABELS } from "@/src/config";

const DRAWER_WIDTH = 260;


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const isLaptop = useMediaQuery(theme.breakpoints.up("laptop"));
  const [open, setOpen] = useState(true);

  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label =
      ROUTE_LABELS[segment] ?? toTitleCase(decodeURIComponent(segment));
    const isLast = index === segments.length - 1;
    return isLast ? (
      <Typography key={href} sx={{ color: "text.primary", fontSize: 14 }}>
        {label}
      </Typography>
    ) : (
      <Link
        key={href}
        href={href}
        style={{ color: "inherit", textDecoration: "none", fontSize: 14 }}
      >
        {label}
      </Link>
    );
  });

  const isSelected = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          minHeight: { mobile: "64px", tabletSmall: "76px" },
          background: "linear-gradient(135deg, rgba(174,143,88,0.10) 0%, rgba(174,143,88,0.03) 100%)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            component="img"
            src="/ufma-logo.png"
            alt="UFMA Logo"
            sx={{ width: 38, height: 38 }}
          />
          <Box>
            <Typography variant="subtitle2" fontWeight={700} lineHeight={1.2} letterSpacing="-0.01em">
              SISU UFMA
            </Typography>
            <Typography variant="caption" color="text.secondary" lineHeight={1}>
              Análise de dados
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={() => setOpen(false)} sx={{ p: 0.5 }}>
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
      </Box>

      <Divider />

      <List sx={{ px: 1.5, pt: 1 }}>
        {NAV_ITEMS.map(({ href, label, icon }) => (
          <ListItem key={href} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              href={href}
              selected={isSelected(href)}
              sx={{ borderRadius: 2, py: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: isSelected(href) ? "primary.main" : "text.secondary" }}>
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={label}
                slotProps={{
                  primary: {
                    fontSize: 14,
                    fontWeight: isSelected(href) ? 600 : 400,
                    color: isSelected(href) ? "text.primary" : "text.secondary",
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {isLaptop ? (
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
              borderRight: "1px solid",
              borderColor: "divider",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={open}
          onClose={() => setOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          minWidth: 0,
        }}
      >
        <Toolbar
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            borderBottom: 1,
            borderColor: "divider",
            minHeight: { mobile: "56px !important", tabletSmall: "76px !important" },
            px: 3,
            background: "rgba(254, 249, 246, 0.85)",
            backdropFilter: "blur(10px)",
          }}
        >
          {(!isLaptop || !open) && (
            <IconButton
              onClick={() => setOpen(true)}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Breadcrumbs
            separator={<NavigateNextIcon sx={{ fontSize: 16 }} />}
            aria-label="breadcrumb"
          >
            {breadcrumbs}
          </Breadcrumbs>
        </Toolbar>
        <Box sx={{ flex: 1, p: 0 }}>{children}</Box>
      </Box>
    </Box>
  );
}
