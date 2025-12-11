export type CardProps = {
  title: string;
  data: string;
}

export const Card = ({ title = "N/A", data="-" }: CardProps) => {

  return (
    <div className="bg-gray-900 p-5 rounded shadow">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-bold">{data}</p>
    </div>
  )
}