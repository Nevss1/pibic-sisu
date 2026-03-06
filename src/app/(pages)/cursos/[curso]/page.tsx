import { toTitleCase } from "@/src/utils";
import { Box, Container, Typography } from "@mui/material";

export default async function CursoPage({ params }: { params: Promise<{ curso: string }> }) {
  const { curso } = await params;
  const nomeCurso = toTitleCase(decodeURIComponent(curso));

  return (
    <Container>
      <Box
        sx={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" color="text.primary">
          {nomeCurso}
        </Typography>
      </Box>
    </Container>
  );
}
