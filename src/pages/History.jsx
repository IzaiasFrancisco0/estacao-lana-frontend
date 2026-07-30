import { useEffect, useMemo, useState } from "react";
import { exportHistoryToExcel } from "../utils/exportExcel";
import { FileSpreadsheet, ArrowDownToLine, ArrowUpFromLine, ChevronLeft, ChevronRight } from "lucide-react";

export function History() {
  const [movements, setMovements] = useState([]);
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("movements")) || [];
      setMovements(data.reverse());
    } catch (error) {
      console.error("Erro ao ler movimentações:", error);
      setMovements([]);
    }
  }, []);

  const filteredMovements = useMemo(() => {
    return movements.filter((movement) => {
      const typeOk = filter === "Todos" || movement.type === filter;

      const searchOk = movement.product
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const movementDate = movement.date
        ? movement.date.split("/").reverse().join("-")
        : "";

      const startOk = !startDate || movementDate >= startDate;
      const endOk = !endDate || movementDate <= endDate;

      return typeOk && searchOk && startOk && endOk;
    });
  }, [movements, filter, search, startDate, endDate]);

  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);
  const paginatedMovements = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMovements.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMovements, currentPage]);

  const totalEntries = filteredMovements.filter((m) => m.type === "Entrada").length;
  const totalOutputs = filteredMovements.filter((m) => m.type === "Saída").length;
  const totalMovements = filteredMovements.length;

  function clearFilters() {
    setSearch("");
    setFilter("Todos");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Histórico de Movimentações
          </h1>
          <p className="text-slate-500 mt-2">
            Acompanhe todas as entradas e saídas do estoque.
          </p>
        </div>

        <button
          onClick={() => exportHistoryToExcel(filteredMovements)}
          className="flex items-center cursor-pointer justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-xl transition shadow-lg shadow-emerald-100 w-full md:w-auto"
        >
          <FileSpreadsheet size={20} />
          Exportar Excel
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-8 shadow-sm">
          <p className="text-slate-500 text-[10px] sm:text-sm font-medium">Entradas</p>
          <h2 className="text-2xl sm:text-5xl font-bold text-emerald-600 mt-1 sm:mt-2">
            {totalEntries}
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-8 shadow-sm">
          <p className="text-slate-500 text-[10px] sm:text-sm font-medium">Saídas</p>
          <h2 className="text-2xl sm:text-5xl font-bold text-rose-500 mt-1 sm:mt-2">
            {totalOutputs}
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-8 shadow-sm">
          <p className="text-slate-500 text-[10px] sm:text-sm font-medium">Total</p>
          <h2 className="text-2xl sm:text-5xl font-bold text-blue-600 mt-1 sm:mt-2">
            {totalMovements}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
            className="border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 bg-slate-50/50"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
            className="border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 bg-slate-50/50"
          />

          <select
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
            className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
          >
            <option value="Todos">Todos os Tipos</option>
            <option value="Entrada">Entrada</option>
            <option value="Saída">Saída</option>
          </select>

          <button
            onClick={clearFilters}
            className="bg-slate-800 cursor-pointer hover:bg-slate-900 text-white font-bold rounded-xl p-3 transition"
          >
            Limpar Filtros
          </button>
        </div>

        <input
          type="text"
          placeholder="Pesquisar produto..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 bg-slate-50/50"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {paginatedMovements.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 font-medium">
            Nenhuma movimentação encontrada com os filtros selecionados.
          </div>
        ) : (
          paginatedMovements.map((movement) => (
            <div
              key={movement.id}
              className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${movement.type === "Entrada"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-rose-50 text-rose-600"
                    }`}>
                    {movement.type === "Entrada" ? <ArrowDownToLine size={24} /> : <ArrowUpFromLine size={24} />}
                  </div>
                  <div>
                    <h2 className="font-extrabold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                      {movement.product}
                    </h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {movement.date} • {movement.hour}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-2xl font-black ${movement.type === "Entrada" ? "text-emerald-600" : "text-rose-600"
                    }`}>
                    {movement.type === "Entrada" ? "+" : "-"}{movement.quantity} {movement.unit}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{movement.reason}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 flex gap-4">
                <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold">
                  <span className="text-slate-400">👤</span>
                  <span>{movement.clientSupplier}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold">
                  <span className="text-slate-400">📝</span>
                  <span>{movement.reason}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-slate-600 font-medium">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}