"use client";

import * as React from "react";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { usePathname } from "next/navigation";

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

interface CourseTabProps {
  label: string;
  href: string;
}

const CursoTab = styled((props: CourseTabProps) => (
  <Tab {...props} /> ))(({ theme }) => ({
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

export default function CursoTabs() {
  const pathname = usePathname();
  console.log(pathname)
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ bgcolor: "#ffffff" }}>
        <CursoTabsBar
          value={value}
          onChange={handleChange}
          aria-label="styled tabs example"
        >
          <CursoTab label="Overview" href={`${pathname}`} />
          <CursoTab label="Áreas" href={`${pathname}/areas`} />
          <CursoTab label="Modalidade" href={`${pathname}/modalidade`} />
        </CursoTabsBar>
      </Box>
    </Box>
  );
}
