interface Props {
  search: string;
  setSearch: (value: string) => void;
}

export default function UserSearch({ search, setSearch }: Props) {
  return (
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Buscar por nombre..."
      className="border rounded-lg px-3 py-2 w-full mb-4"
    />
  );
}
