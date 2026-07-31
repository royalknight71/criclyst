function Pagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}) {
  return (
    <div className="mt-12 flex items-center justify-center gap-6">

      <button
        onClick={onPrevious}
        disabled={currentPage === 1}
        className="
          rounded-xl
          border
          border-slate-700
          px-5
          py-2.5
          text-sm
          font-medium
          text-white
          transition
          hover:border-cyan-400
          hover:text-cyan-400
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        ← Previous
      </button>

      <span className="text-slate-300">
        Page{" "}
        <span className="font-semibold text-cyan-400">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="font-semibold">
          {totalPages}
        </span>
      </span>

      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="
          rounded-xl
          border
          border-slate-700
          px-5
          py-2.5
          text-sm
          font-medium
          text-white
          transition
          hover:border-cyan-400
          hover:text-cyan-400
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        Next →
      </button>

    </div>
  );
}

export default Pagination;