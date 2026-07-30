import { CalendarDays, RefreshCw } from "lucide-react";

export function DashboardHeader() {
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white w-full rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

        <div>

          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard
          </h1>

          <p className="text-slate-500 mt-1 font-medium">
            Bem-vindo! Acompanhe o status do estoque em tempo real.
          </p>

        </div>

        <div className="flex flex-col items-start md:items-end gap-4">

          <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-600 font-semibold text-sm">

            <CalendarDays size={18} className="text-blue-500" />

            <span className="capitalize">
              {today}
            </span>

          </div>

          <button
            className="
              flex
              items-center
              gap-2
              px-6
              py-3
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-bold
              transition
              shadow-lg
              shadow-blue-100
              active:scale-95
            "
          >
            <RefreshCw size={18} />

            Atualizar Dados
          </button>

        </div>

      </div>

    </div>
  );
}