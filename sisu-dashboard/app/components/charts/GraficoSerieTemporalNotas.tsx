import { Dados } from "@/app/types"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type Props = {
  dados: Dados
}

export const GraficoSerieTemporalNotas = ({dados}: Props) => {
  return (
    <ResponsiveContainer
      width="60%" height={300}
    >
      <LineChart 
        data={dados} 
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis />
        <YAxis domain={([min, max]) => [Math.floor(min - 50), Math.ceil(max + 50)]} />
        <Tooltip />
        <Legend />
          <Line
          dataKey="media_nota_candidato"
          name="Nota Média do Candidato"
          stroke="#2563eb"
        />
        <Line
          dataKey="media_nota_corte"
          name="Nota de Corte"
          stroke="#dc2626"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}