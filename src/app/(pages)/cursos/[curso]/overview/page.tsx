import { toTitleCase } from "@/src/utils";
import { Box, Container, Typography } from "@mui/material";
import CursoTabs from "@/src/components/CursoTabs";

export default async function CursoPageOverview({ params }: { params: Promise<{ curso: string }> }) {
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
        <CursoTabs />
        <Typography variant="h4" color="text.primary">
          OVERVIEW!
        </Typography>
      </Box>
    </Container>
  );
}
