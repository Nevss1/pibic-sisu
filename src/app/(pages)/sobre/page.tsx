import {
  Box,
  Container,
  Divider,
  List,
  ListItem,
  Typography,
} from "@mui/material";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom color="text.primary">
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="body1" color="text.secondary" sx={{ mb: 2, textAlign: "justify" }}>
      {children}
    </Typography>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <List dense disablePadding sx={{ mb: 2, pl: 2 }}>
      {items.map((item) => (
        <ListItem key={item} sx={{ py: 0.25, px: 0 }}>
          <Typography variant="body2" color="text.secondary">
            {"• "}
            {item}
          </Typography>
        </ListItem>
      ))}
    </List>
  );
}

export default function SobrePage() {
  return (
    <Container>
      <Box sx={{ py: 2, px: 2 }}>
        <Typography
          variant="h4"
          fontWeight={500}
          gutterBottom
          color="text.primary"
          sx={{ mb: 1 }}
        >
          Sobre a Plataforma
        </Typography>

        <Typography variant="body2" color="text.disabled" sx={{ mb: 4 }}>
          Dashboard SISU/UFMA — dados de 2017 a 2023
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <Section title="O que é o Dashboard SISU/UFMA">
          <Body>
            Esta plataforma é uma ferramenta web interativa para análise
            histórica dos dados do Sistema de Seleção Unificada (SISU)
            referentes à Universidade Federal do Maranhão (UFMA). O objetivo é
            transformar dados públicos em informações acessíveis, permitindo
            explorar cursos, campi, notas, modalidades de cota, perfil de
            candidatos e panorama geral da instituição ao longo dos anos.
          </Body>
          <Body>
            Por meio de gráficos e indicadores, é possível acompanhar a evolução
            histórica da concorrência, compreender o comportamento das notas de
            corte e conhecer o perfil dos candidatos aprovados em cada curso da
            UFMA.
          </Body>
        </Section>

        <Section title="Fonte dos Dados">
          <Body>
            Os dados utilizados são públicos e oficiais, provenientes dos
            arquivos CSV de chamadas regulares do SISU, disponibilizados pelo
            Ministério da Educação (MEC) por meio da plataforma Dados Abertos.
          </Body>
          <Body>
            O recorte temporal desta versão cobre as edições de{" "}
            <strong>2017 a 2023</strong> (14 edições no total). Dados de 2024 em
            diante não estão incluídos nesta versão do sistema.
          </Body>
        </Section>

        <Section title="Privacidade e Tratamento dos Dados">
          <Body>
            A base de dados utilizada neste dashboard <strong>não contém</strong>{" "}
            informações pessoais identificadoras. Durante o processo de
            tratamento, as seguintes colunas foram removidas:
          </Body>

          <BulletList
            items={[
              "CPF do candidato",
              "Nome do candidato",
              "Número de inscrição ENEM",
            ]}
          />

          <Body>
            O sistema trabalha exclusivamente com dados analíticos e
            agregáveis — como ano, edição, curso, campus, notas por área do
            ENEM, aprovação, matrícula, sexo, modalidade de cota, grau e turno
            —, sem possibilidade de identificação individual de candidatos.
          </Body>
        </Section>

        <Section title="O que pode ser analisado">
          <Body>A plataforma permite explorar:</Body>

          <BulletList
            items={[
              "Concorrência por curso e campus ao longo dos anos",
              "Notas médias e notas de corte por modalidade",
              "Evolução histórica de inscrições e aprovações",
              "Distribuição por modalidades de cota (Ampla Concorrência, Bônus Maranhão, Escola Pública, PPI, Indígenas, PcD)",
              "Perfil de aprovação por sexo, notas e modalidade",
              "Visão geral institucional da UFMA no SISU",
            ]}
          />
        </Section>

        <Section title="Limitações">
          <BulletList
            items={[
              "Os dados têm finalidade informativa e histórica — não refletem o processo seletivo atual.",
              "Cada linha da base representa uma inscrição em uma opção do SISU, não necessariamente um candidato único (um candidato pode ter se inscrito em até 2 opções).",
              "O recorte atual termina em 2023; edições posteriores não estão disponíveis.",
              "A qualidade das informações depende da estrutura e completude dos arquivos públicos originais do MEC.",
              "Este dashboard não substitui as informações oficiais e atualizadas do SISU/MEC ou da UFMA.",
            ]}
          />
        </Section>

        <Divider sx={{ mb: 4 }} />

        <Section title="Relação com o PIBIC">
          <Body>
            Este dashboard foi desenvolvido por{" "}
            <strong>Rafael Soares Britto Neves</strong>, estudante de Ciência da
            Computação da UFMA, no âmbito do Programa Institucional de Bolsas de
            Iniciação Científica (PIBIC/CNPq), sob orientação do{" "}
            <strong>Prof. Dr. Mário Antonio Meireles Teixeira</strong>.
          </Body>
          <Body>
            O trabalho está vinculado ao plano de pesquisa{" "}
            <em>
              "Análise de Desempenho de Workloads de Ciência de Dados em
              Ambientes Conteinerizados com Docker"
            </em>
            , associado ao projeto CNPq{" "}
            <em>
              "Avaliação de Desempenho de Aplicações em Ambientes
              Conteinerizados com Docker"
            </em>
            .
          </Body>
          <Body>
            O pipeline de tratamento de dados e este dashboard constituem a
            infraestrutura analítica e o workload real de Ciência de Dados do
            projeto — servindo como base para uma futura etapa de avaliação de
            desempenho em ambientes Docker, ainda em planejamento.
          </Body>
        </Section>
      </Box>
    </Container>
  );
}
