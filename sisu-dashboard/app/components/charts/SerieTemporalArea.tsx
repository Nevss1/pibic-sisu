import { Dados } from "@/app/types"
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type AreaConfig = {
  dataKey: string
  name: string
  stroke: string
}

type SerieTemporalAreaProps = {
  dados: Dados
  areas: AreaConfig[]
  height?: number
}

export const SerieTemporalArea = ({ dados, areas, height = 300 }: SerieTemporalAreaProps) => {
  return (
    <ResponsiveContainer
      width="60%" height={height}
    >
      <AreaChart 
        data={dados} 
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="ano" />
        <YAxis domain={([min, max]) => [Math.floor(min - (min * 0.1)), Math.ceil(max + (max * 0.1))]}  />
        <Tooltip animationEasing="ease-in" />
        <Legend />
        {areas.map((area) => (
          <Area 
            dataKey={area.dataKey}
            name={area.name}
            stroke={area.stroke}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}