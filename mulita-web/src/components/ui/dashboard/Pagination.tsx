interface Props {
  page: number;
  setPage: (p: number) => void;
  total: number;
  limit: number;
}

export default function Pagination({ page, setPage, total, limit }: Props) {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex justify-center gap-2 mt-4">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Anterior
      </button>

      <span className="px-3 py-1">
        Página {page} de {totalPages || 1}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
}
