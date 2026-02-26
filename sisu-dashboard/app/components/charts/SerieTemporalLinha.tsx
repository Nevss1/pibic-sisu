import { Dados } from "@/app/types"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type LinhaConfig = {
  dataKey: string
  name: string
  stroke: string
}

type SerieTemporalLinhaProps = {
  dados: Dados
  linhas: LinhaConfig[]
  height?: number
}

export const SerieTemporalLinha = ({ dados, linhas, height = 300}: SerieTemporalLinhaProps) => {
  return (
    <ResponsiveContainer
      width="60%" height={height}
    >
      <LineChart 
        data={dados} 
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="ano" />
        <YAxis domain={([min, max]) => [Math.floor(min - (min * 0.1)), Math.ceil(max + (max * 0.1))]}  />
        <Tooltip animationEasing="ease-in" />
        <Legend />
        {linhas.map((linha) => (
          <Line 
            dataKey={linha.dataKey}
            name={linha.name}
            stroke={linha.stroke}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}