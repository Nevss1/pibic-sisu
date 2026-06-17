"use client";

import {
  Box,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Popover,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import type { SelectOption } from "../perfil.types";

export function PerfilSelectField({
  label,
  value,
  placeholder,
  options,
  disabled = false,
  searchable = false,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  searchable?: boolean;
  onChange: (value: string) => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("tabletSmall"), { noSsr: true });
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const isOpen = Boolean(anchor) || drawerOpen;

  const filteredOptions = useMemo(() => {
    if (!searchable || !search.trim()) return options;
    const q = search.trim().toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search, searchable]);

  const handleOpen = (e: ReactMouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (isMobile) {
      setDrawerOpen(true);
    } else {
      setAnchor(e.currentTarget);
    }
    if (searchable) {
      setTimeout(() => searchRef.current?.focus(), 80);
    }
  };

  const handleClose = () => {
    setAnchor(null);
    setDrawerOpen(false);
    setSearch("");
  };

  const handleSelect = (val: string) => {
    onChange(val);
    handleClose();
  };

  const displayLabel = value
    ? (options.find((o) => o.value === value)?.label ?? value)
    : (placeholder ?? `Selecionar ${label.toLowerCase()}`);

  const selectorContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: { xs: "100%", tabletSmall: searchable ? 400 : 300 },
        maxWidth: "calc(100vw - 32px)",
        maxHeight: { xs: "min(72dvh, 520px)", tabletSmall: searchable ? 440 : 320 },
        p: 2,
        pb: { xs: "calc(16px + env(safe-area-inset-bottom))", tabletSmall: 2 },
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 1.5,
          flexShrink: 0,
        }}
      >
        <Typography variant="subtitle1" sx={{ color: "#1e1b16", fontWeight: 600 }}>
          {label}
        </Typography>
        <Button
          onClick={handleClose}
          sx={{ minWidth: 0, color: "rgba(30,27,22,0.72)", fontSize: 14, textTransform: "none" }}
        >
          Cancelar
        </Button>
      </Box>

      {searchable && (
        <TextField
          inputRef={searchRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar..."
          fullWidth
          size="small"
          sx={{
            mb: 1.5,
            flexShrink: 0,
            "& .MuiInputBase-input": { fontSize: 16 },
            "& .MuiOutlinedInput-root": {
              color: "#1e1b16",
              backgroundColor: "#fff",
              "& fieldset": { borderColor: "rgba(213,176,113,0.45)" },
              "&:hover fieldset": { borderColor: "rgba(213,176,113,0.7)" },
              "&.Mui-focused fieldset": { borderColor: "#D5B071" },
            },
          }}
        />
      )}

      <List sx={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden", px: 0, py: 0.5 }}>
        {filteredOptions.length === 0 ? (
          <Typography sx={{ px: 1.5, py: 2, color: "rgba(30,27,22,0.58)", fontSize: 14 }}>
            Nenhuma opção encontrada.
          </Typography>
        ) : (
          filteredOptions.map((opt) => (
            <ListItemButton
              key={opt.value}
              selected={opt.value === value}
              onClick={() => handleSelect(opt.value)}
              sx={{
                minHeight: 44,
                borderRadius: 2,
                px: 1.5,
                py: 0.9,
                mb: 0.25,
                "&.Mui-selected": {
                  backgroundColor: "rgba(213,176,113,0.15)",
                  "&:hover": { backgroundColor: "rgba(213,176,113,0.2)" },
                },
                "&:hover": { backgroundColor: "rgba(213,176,113,0.08)" },
              }}
            >
              <ListItemText
                primary={opt.label}
                slotProps={{
                  primary: {
                    sx: {
                      color: opt.value === value ? "#8a6e3a" : "rgba(30,27,22,0.82)",
                      fontSize: 14,
                      lineHeight: 1.35,
                      whiteSpace: "normal",
                      overflowWrap: "anywhere",
                      fontWeight: opt.value === value ? 600 : 400,
                    },
                  },
                }}
              />
            </ListItemButton>
          ))
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        component="span"
        sx={{
          fontSize: "0.68rem",
          fontWeight: 700,
          color: disabled ? "rgba(122,96,64,0.38)" : "#7A6A58",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          display: "block",
          mb: 0.75,
        }}
      >
        {label}
      </Typography>

      <Button
        variant="outlined"
        fullWidth
        disabled={disabled}
        onClick={handleOpen}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={label}
        endIcon={
          <KeyboardArrowDownIcon
            sx={{
              color: disabled ? "rgba(122,96,64,0.25)" : "rgba(100,116,139,0.75)",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.18s ease",
              flexShrink: 0,
            }}
          />
        }
        sx={{
          justifyContent: "space-between",
          minHeight: 44,
          px: 1.75,
          color: value ? "#1e1b16" : "rgba(100,116,139,0.9)",
          backgroundColor: "rgba(255,252,248,0.76)",
          borderColor: isOpen ? "#D5A642" : "rgba(174,143,88,0.28)",
          borderRadius: "12px",
          fontSize: 14,
          textAlign: "left",
          textTransform: "none",
          fontWeight: value ? 500 : 400,
          "&:hover": {
            borderColor: "rgba(174,143,88,0.5)",
            backgroundColor: "rgba(213,176,113,0.06)",
          },
          "&.Mui-disabled": {
            color: "rgba(122,96,64,0.38)",
            backgroundColor: "rgba(255,252,248,0.4)",
            borderColor: "rgba(174,143,88,0.08)",
          },
          "& .MuiButton-endIcon": { ml: "auto", mr: 0 },
        }}
      >
        <Box
          component="span"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
            textAlign: "left",
          }}
        >
          {displayLabel}
        </Box>
      </Button>

      {/* Desktop: Popover */}
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        sx={{ display: { xs: "none", tabletSmall: "block" } }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: 2,
              backgroundColor: "#FEF9F6",
              border: "1px solid rgba(213,176,113,0.28)",
              boxShadow: "0 18px 50px rgba(30,27,22,0.14)",
              overflow: "hidden",
            },
          },
        }}
      >
        {selectorContent}
      </Popover>

      {/* Mobile: Bottom Drawer */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={handleClose}
        sx={{
          display: { tabletSmall: "none" },
          "& .MuiDrawer-paper": {
            width: "100%",
            maxWidth: "100vw",
            maxHeight: "min(72dvh, 520px)",
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            backgroundColor: "#FEF9F6",
            overflow: "hidden",
          },
        }}
      >
        {selectorContent}
      </Drawer>
    </Box>
  );
}
