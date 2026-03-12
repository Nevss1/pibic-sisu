import { Box, CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        flex: 1,
        minHeight: "60vh",
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );
}
