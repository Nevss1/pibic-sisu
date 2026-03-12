"use client";

import * as React from "react";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { usePathname, useRouter } from "next/navigation";

interface CursoTabsBarProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const CursoTabsBar = styled((props: CursoTabsBarProps) => <Tabs {...props} />)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: theme.palette.primary.main,
  },
}));

const CursoTab = styled((props: { label: string }) => (
  <Tab {...props} />))(({ theme }) => ({
  textTransform: "none",
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: 18,
  marginRight: theme.spacing(1),
  color: theme.palette.text.secondary,
  "&.Mui-selected": {
    color: theme.palette.text.primary,
  },
  "&:hover": {
    color: theme.palette.text.primary,
    opacity: 1,
  },
}));

const TABS = ["overview", "areas", "modalidades"] as const;

function getBasePath(pathname: string) {
  return pathname.replace(/\/(areas|modalidades)$/, "");
}

function getTabIndex(pathname: string) {
  if (pathname.endsWith("/areas")) return 1;
  if (pathname.endsWith("/modalidades")) return 2;
  return 0;
}

export default function CursoTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const basePath = getBasePath(pathname);
  const value = getTabIndex(pathname);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    const segment = TABS[newValue];
    router.push(segment === "overview" ? basePath : `${basePath}/${segment}`);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box>
        <CursoTabsBar
          value={value}
          onChange={handleChange}
          aria-label="styled tabs example"
        >
          <CursoTab label="Overview" />
          <CursoTab label="Áreas" />
          <CursoTab label="Modalidade" />
        </CursoTabsBar>
      </Box>
    </Box>
  );
}
