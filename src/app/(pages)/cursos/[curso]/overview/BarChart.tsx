import { useCursoOverview } from "@/src/hooks"
import { Box, Card } from "@mui/material";

export default function BarChart({ curso }: { curso: string }) {
  const { data: dados } = useCursoOverview(curso);
  
  return (
    <Card>

    </Card>
  )
}