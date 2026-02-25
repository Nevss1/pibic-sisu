export type CardProps = {
  title: string;
  data: string | number;
}

export const Card = ({ title = "N/A", data="-" }: CardProps) => {

  return (
    <div className="bg-gray-200 p-4 rounded shadow flex-1 text-center text-white">
      <h3 className="text-gray-900 text-sm ">{title}</h3>
      <p className="text-2xl text-gray-900 font-bold ">{data}</p>
    </div>
  )
}
