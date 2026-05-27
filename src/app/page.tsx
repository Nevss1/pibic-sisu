"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
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
import { useNomeCursos } from "@/src/hooks";
import { useRouter } from "next/navigation";
import { toTitleCase } from "../utils";
import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import BackgroundParticles from "./BackgroundParticles";

export default function HomePage() {
  const { data: cursos = [] } = useNomeCursos();
  const router = useRouter();
  const theme = useTheme();
  const isDesktopSelector = useMediaQuery(theme.breakpoints.up("tabletSmall"), {
    noSsr: true,
  });

  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [selectedCurso, setSelectedCurso] = useState<string | null>(null);
  const [desktopSelectorAnchor, setDesktopSelectorAnchor] = useState<HTMLElement | null>(null);
  const [mobileSelectorOpen, setMobileSelectorOpen] = useState(false);
  const [selectorSearch, setSelectorSearch] = useState("");
  const spotlightRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 25 });

  const cursoOptions = useMemo(
    () => cursos.map((c: { no_curso: string }) => toTitleCase(c.no_curso)),
    [cursos]
  );

  const filteredCursoOptions = useMemo(() => {
    const search = selectorSearch.trim().toLowerCase();
    if (!search) return cursoOptions;
    return cursoOptions.filter((curso: string) =>
      curso.toLowerCase().includes(search)
    );
  }, [cursoOptions, selectorSearch]);

  const selectedCursoUrl = selectedCurso
    ? `/cursos/${encodeURIComponent(selectedCurso.toLowerCase())}`
    : "/cursos";
  const selectorOpen = Boolean(desktopSelectorAnchor) || mobileSelectorOpen;

  const closeCourseSelector = () => {
    setDesktopSelectorAnchor(null);
    setMobileSelectorOpen(false);
    setSelectorSearch("");
  };

  const openCourseSelector = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (isDesktopSelector) {
      setDesktopSelectorAnchor(event.currentTarget);
      return;
    }

    setMobileSelectorOpen(true);
  };

  const navigateWithFade = (url: string) => {
    if (pendingUrl) return;
    closeCourseSelector();
    setPendingUrl(url);
  };

  const courseSelectorContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: { xs: "100%", tabletSmall: 420 },
        maxWidth: "calc(100vw - 32px)",
        height: { xs: "auto", tabletSmall: 460 },
        maxHeight: { xs: "min(82dvh, 720px)", tabletSmall: "min(72vh, 460px)" },
        p: 2,
        pb: { xs: "calc(16px + env(safe-area-inset-bottom))", tabletSmall: 2 },
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 1.5 }}>
        <Typography variant="h6" sx={{ color: "#1e1b16" }}>
          Selecionar curso
        </Typography>
        <Button
          onClick={closeCourseSelector}
          sx={{
            minWidth: 0,
            color: "rgba(30,27,22,0.72)",
            fontSize: 14,
            textTransform: "none",
          }}
        >
          Cancelar
        </Button>
      </Box>

      <TextField
        value={selectorSearch}
        onChange={(event) => setSelectorSearch(event.target.value)}
        placeholder="Buscar curso..."
        fullWidth
        size="small"
        sx={{
          mb: 1.5,
          "& .MuiInputBase-input": {
            fontSize: 16,
          },
          "& .MuiOutlinedInput-root": {
            color: "#1e1b16",
            backgroundColor: "#fff",
            "& fieldset": { borderColor: "rgba(213,176,113,0.45)" },
            "&:hover fieldset": { borderColor: "rgba(213,176,113,0.7)" },
            "&.Mui-focused fieldset": { borderColor: "#D5B071" },
          },
        }}
      />

      <List
        id="home-course-selector-list"
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          px: 0,
          py: 0.5,
        }}
      >
        {filteredCursoOptions.length === 0 ? (
          <Typography
            sx={{
              px: 1.5,
              py: 2,
              color: "rgba(30,27,22,0.58)",
              fontSize: 14,
            }}
          >
            Nenhum curso encontrado.
          </Typography>
        ) : filteredCursoOptions.map((curso: string) => (
          <ListItemButton
            key={curso}
            selected={curso === selectedCurso}
            onClick={() => {
              setSelectedCurso(curso);
              navigateWithFade(`/cursos/${encodeURIComponent(curso.toLowerCase())}`);
            }}
            sx={{
              minHeight: 52,
              alignItems: "flex-start",
              borderRadius: 2,
              px: 1.5,
              py: 1.1,
              mb: 0.25,
              "&.Mui-selected": {
                backgroundColor: "rgba(213,176,113,0.15)",
                "&:hover": { backgroundColor: "rgba(213,176,113,0.2)" },
              },
              "&:hover": {
                backgroundColor: "rgba(213,176,113,0.08)",
              },
            }}
          >
            <ListItemText
              primary={curso}
              slotProps={{
                primary: {
                  sx: {
                    color: curso === selectedCurso ? "#8a6e3a" : "rgba(30,27,22,0.82)",
                    fontSize: 15,
                    lineHeight: 1.35,
                    whiteSpace: "normal",
                    overflowWrap: "anywhere",
                  },
                },
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  useEffect(() => {
    const update = () => {
      if (!spotlightRef.current) return;
      spotlightRef.current.style.background = `radial-gradient(700px circle at ${springX.get()}px ${springY.get()}px, rgba(213,176,113,0.22), transparent 70%)`;
    };
    update();
    const unsubX = springX.on("change", update);
    const unsubY = springY.on("change", update);
    return () => { unsubX(); unsubY(); };
  }, [springX, springY]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center overflow-hidden relative" style={{ backgroundColor: "#FEF9F6" }}>
      <div ref={spotlightRef} className="absolute inset-0 pointer-events-none transition-none" />

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.4) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <motion.img
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        src="/ufma-logo.png"
        alt="UFMA Logo"
        className="mb-4 md:mb-6 size-36 md:size-60 relative z-10"
      />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-2xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4 text-center relative z-10 px-4"
      >
        SISU UFMA {" "}
        <span style={{ color: "#D5B071" }}>Dashboard Analítico</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="text-sm md:text-base text-slate-500 mb-6 md:mb-10 text-center max-w-lg relative z-10 px-6"
      >
        Explore séries históricas, notas de corte, distribuições estatísticas e
        indicadores completos dos cursos da UFMA no SISU.
      </motion.p>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
        className="relative z-10 w-full px-6 sm:px-10 flex justify-center"
      >
        <Button
          variant="outlined"
          fullWidth
          onClick={openCourseSelector}
          aria-haspopup="dialog"
          aria-expanded={selectorOpen}
          aria-controls={selectorOpen ? "home-course-selector-list" : undefined}
          sx={{
            width: "min(400px, 100%)",
            minHeight: 56,
            justifyContent: "space-between",
            gap: 1.5,
            px: 1.75,
            color: selectedCurso ? "#1e1b16" : "rgba(100,116,139,0.9)",
            backgroundColor: "rgba(255,255,255,0.48)",
            borderColor: "rgba(213,176,113,0.5)",
            borderRadius: 2,
            fontSize: 16,
            lineHeight: 1.35,
            textAlign: "left",
            textTransform: "none",
            overflow: "hidden",
            backdropFilter: "blur(8px)",
            "&:hover": {
              borderColor: "rgba(213,176,113,0.7)",
              backgroundColor: "rgba(213,176,113,0.06)",
            },
          }}
        >
          <Box component="span" sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {selectedCurso ?? "Selecionar curso"}
          </Box>
          <KeyboardArrowDownIcon
            sx={{
              flexShrink: 0,
              color: "rgba(100,116,139,0.75)",
              transform: selectorOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.18s ease",
            }}
          />
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className="relative z-10 w-full px-6 sm:px-10 flex justify-center"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 2,
            width: "min(400px, 100%)",
          }}
        >
          <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(174,143,88,0.25)" }} />
          <span style={{ fontSize: 12, color: "rgba(100,116,139,0.7)" }}>ou</span>
          <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(174,143,88,0.25)" }} />
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.45, duration: 0.4 }}
        className="relative z-10 w-full px-6 sm:px-10 flex justify-center mt-3"
      >
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            width: "min(400px, 100%)",
            flexDirection: { xs: "column", mobile: "row" },
          }}
        >
          <Button
            onClick={() => navigateWithFade(selectedCursoUrl)}
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              borderColor: "rgba(174,143,88,0.45)",
              color: "rgba(30,27,22,0.75)",
              fontSize: 13,
              textTransform: "none",
              "&:hover": {
                borderColor: "#ae8f58",
                backgroundColor: "rgba(174,143,88,0.06)",
              },
            }}
          >
            Explorar cursos
          </Button>
          <Button
            onClick={() => navigateWithFade("/perfil")}
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              borderColor: "rgba(174,143,88,0.45)",
              color: "rgba(30,27,22,0.75)",
              fontSize: 13,
              textTransform: "none",
              "&:hover": {
                borderColor: "#ae8f58",
                backgroundColor: "rgba(174,143,88,0.06)",
              },
            }}
          >
            Analisar meu perfil
          </Button>
        </Box>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="mt-8 md:mt-12 text-xs text-slate-500 relative z-10 px-4 text-center"
      >
        Trabalho de Iniciação Científica - Rafael Neves - PIBIC/CNPq 2025/2026
      </motion.p>

      <BackgroundParticles />

      <Popover
        open={Boolean(desktopSelectorAnchor)}
        anchorEl={desktopSelectorAnchor}
        onClose={closeCourseSelector}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          display: { xs: "none", tabletSmall: "block" },
        }}
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
        {courseSelectorContent}
      </Popover>

      <Drawer
        anchor="bottom"
        open={mobileSelectorOpen}
        onClose={closeCourseSelector}
        sx={{
          display: { tabletSmall: "none" },
          "& .MuiDrawer-paper": {
            width: "100%",
            maxWidth: "100vw",
            maxHeight: "min(82dvh, 720px)",
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            backgroundColor: "#FEF9F6",
            overflow: "hidden",
          },
        }}
      >
        {courseSelectorContent}
      </Drawer>

      {pendingUrl && (
        <motion.div
          className="absolute inset-0 z-50"
          style={{ backgroundColor: "#FEF9F6" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          onAnimationComplete={() => router.push(pendingUrl)}
        />
      )}
    </div>
  );
}
