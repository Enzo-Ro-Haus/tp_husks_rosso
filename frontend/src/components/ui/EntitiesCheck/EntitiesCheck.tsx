import { useState } from "react";

interface Entity {
  id: number | string;
  nombre: string;
}

interface EntitiesCheckProps<T extends Entity> {
  data: T[];
  onSubmit: (selected: T[]) => void;
  labelKey?: keyof T;
}

export const EntitiesCheck = <T extends Entity>({
  data,
  onSubmit,
  labelKey = "nombre",
}: EntitiesCheckProps<T>) => {
  const [selectedIds, setSelectedIds] = useState<(number | string)[]>([]);

  const toggleCheckbox = (id: number | string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((val) => val !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedItems = data.filter((item) => selectedIds.includes(item.id));
    onSubmit(selectedItems);
  };

  return (
    <form onSubmit={handleSubmit}>
      {data.map((item) => (
        <div key={item.id}>
          <label>
            <input
              type="checkbox"
              value={item.id}
              checked={selectedIds.includes(item.id)}
              onChange={() => toggleCheckbox(item.id)}
            />
            {String(item[labelKey])}
          </label>
        </div>
      ))}
      <button type="submit">Aceptar</button>
    </form>
  );
};