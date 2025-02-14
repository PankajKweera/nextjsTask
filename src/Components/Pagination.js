export default function Pagination({ page, setPage, results, limit }) {
    return (
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>Prev</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page + 1)} disabled={results.length < limit}>Next</button>
      </div>
    );
  }
  