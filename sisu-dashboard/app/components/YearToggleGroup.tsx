type YearToggleGroupProps = {
  items: string[];
  selected: string[];
  onChange: (newSelected: string[]) => void 
};

export const YearToggleGroup = ({items, selected, onChange}: YearToggleGroupProps) => {
  const toggle = (item: string) => {
    if (selected.includes(item)){
      onChange(selected.filter((i) => i != item))
    } else {
      onChange([...selected, item])
    }
  }

  return (
    <div className="flex gap-2 mb-6">
      {items.map((ano) => (
        <button
          key={ano}
          onClick={() => toggle(ano)}
          className={`px-4 py-2 rounded ${
            selected.includes(ano)
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-gray-800"
          }`}
        >
          {ano}
        </button>
      ))}

      <button
        onClick={() => onChange([])}
        className={`px-4 py-2 rounded ${
          selected.length === 0
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        Todos
      </button>
    </div>
  );
};
