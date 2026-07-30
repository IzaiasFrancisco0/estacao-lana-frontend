import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Clock3,
} from "lucide-react";

export function RecentMovements() {
  const movements =
    JSON.parse(localStorage.getItem("movements")) || [];

  const recentMovements = [...movements]
    .sort((a, b) => b.id - a.id)
    .slice(0, 4);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

      <div className="flex items-center gap-3 mb-6">

        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
          <Clock3
            size={24}
            className="text-blue-600"
          />
        </div>

        <div>

          <h2 className="text-xl font-bold text-slate-800">
            Últimas Movimentações
          </h2>

          <p className="text-slate-500">
            As movimentações mais recentes do estoque.
          </p>

        </div>

      </div>

      {recentMovements.length === 0 ? (

        <div className="bg-slate-50 rounded-xl p-8 text-center">
          <p className="text-slate-500">
            Nenhuma movimentação encontrada.
          </p>
        </div>

      ) : (

        <div className="space-y-4">

          {recentMovements.map((movement) => (

            <div
              key={movement.id}
              className="
                flex
                justify-between
                items-center
                border
                rounded-xl
                p-4
                hover:bg-slate-50
                transition
              "
            >

              <div className="flex items-center gap-4">

                <div
                  className={`
                    w-11
                    h-11
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    ${
                      movement.type === "Entrada"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }
                  `}
                >

                  {movement.type === "Entrada" ? (
                    <ArrowDownToLine
                      className="text-green-600"
                      size={20}
                    />
                  ) : (
                    <ArrowUpFromLine
                      className="text-red-600"
                      size={20}
                    />
                  )}

                </div>

                <div>

                  <h3 className="font-semibold text-slate-800">
                    {movement.product}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {movement.date} • {movement.hour}
                  </p>

                </div>

              </div>

              <div className="text-right">

                <span
                  className={`
                    font-semibold
                    ${
                      movement.type === "Entrada"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  `}
                >
                  {movement.type === "Entrada" ? "+" : "-"}
                  {movement.quantity} {movement.unit}
                </span>

                <p className="text-xs text-slate-500 mt-1">
                  {movement.reason}
                </p>

              </div>

            </div>

          ))}
        </div>
      )}
    </div>
  );
}