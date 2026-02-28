import { Dados } from "@/app/types"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"


type BarraConfig = {
  dataKey: string
  fill: string
  stroke?: string
}

type SerieTemporalBarraProps = {
  dados: Dados
  barras: BarraConfig[]
  xAxisKey?: string
  height?: number
}

export const SerieTemporalBarra = ({ dados, barras, xAxisKey = "ano", height = 300 }: SerieTemporalBarraProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={dados}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis width={60} />
        <Tooltip />
        <Legend />
        {barras.map((barra) => (
          <Bar
            key={barra.dataKey}
            dataKey={barra.dataKey}
            fill={barra.fill}
            activeBar={{ fill: 'pink', stroke: 'blue' }}
            radius={[10, 10, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}