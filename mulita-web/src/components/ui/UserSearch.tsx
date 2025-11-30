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
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
    />
  );
}
