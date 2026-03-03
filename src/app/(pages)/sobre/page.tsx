import { Box, Typography, Container } from "@mui/material";

export default function SobrePage() {
  return (
    <Container maxWidth="md">
      <Box py={6}>
        <Typography
          variant="h4"
          gutterBottom
          fontWeight={600}
          color="text.primary"
        >
          Sobre a Plataforma
        </Typography>

        <Typography
          variant="body1"
          paragraph
          color="text.secondary"
          sx={{ textAlign: "justify" }}
        >
          Esta plataforma foi desenvolvida com o objetivo de organizar e
          apresentar, de forma clara e interativa, os dados do Sistema de
          Seleção Unificada (SISU) relacionados aos cursos da Universidade
          Federal do Maranhão (UFMA). A proposta é transformar dados públicos em
          informações acessíveis, permitindo uma visualização mais simples da
          concorrência e do comportamento histórico dos cursos.
        </Typography>

        <Typography
          variant="body1"
          paragraph
          color="text.secondary"
          sx={{ textAlign: "justify" }}
        >
          Por meio de gráficos e indicadores, é possível acompanhar a evolução
          do número de inscritos, a quantidade de vagas ofertadas e a relação
          candidato por vaga ao longo dos anos. A plataforma também permite
          explorar tendências históricas, auxiliando na compreensão do nível de
          competitividade de cada curso.
        </Typography>

        <Typography
          variant="body1"
          paragraph
          color="text.secondary"
          sx={{ textAlign: "justify" }}
        >
          O projeto busca contribuir para a transparência das informações
          públicas e para o apoio à tomada de decisão de estudantes,
          pesquisadores e demais interessados no processo de ingresso ao ensino
          superior.
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: "justify" }}
        >
          A iniciativa integra atividades acadêmicas voltadas à análise de dados
          e desenvolvimento de sistemas de visualização, unindo pesquisa e
          aplicação prática em um ambiente digital acessível.
        </Typography>
      </Box>
    </Container>
  );
}
