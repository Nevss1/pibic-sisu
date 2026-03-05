import { toTitleCase } from "@/src/utils";
import { Box, Container, Typography } from "@mui/material";

export default async function CursoPage({ params }: { params: Promise<{ curso: string }> }) {
  const { curso } = await params;
  const cursoDecoded = toTitleCase(decodeURIComponent(curso));

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          flexDirection: "row",
          py: 10,
          alignItems: "center",
        }}
      >
        <Typography variant="h4" color="text.primary">
          {cursoDecoded}
        </Typography>
      </Box>
    </Container>
  );
}
