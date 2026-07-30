import { Trophy, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

export function MostMovedProduct() {
  const movements =
    JSON.parse(localStorage.getItem("movements")) || [];

  const products = {};

  movements.forEach((movement) => {
    if (!products[movement.product]) {
      products[movement.product] = {
        name: movement.product,
        entries: 0,
        outputs: 0,
        total: 0,
      };
    }

    const quantity = Number(movement.quantity);

    if (movement.type === "Entrada") {
      products[movement.product].entries += quantity;
    }

    if (movement.type === "Saída") {
      products[movement.product].outputs += quantity;
    }

    products[movement.product].total += quantity;
  });

  const ranking = Object.values(products).sort(
    (a, b) => b.total - a.total
  );

  const top = ranking[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

      <div className="flex items-center gap-3 mb-6">

        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">

          <Trophy
            size={24}
            className="text-amber-600"
          />

        </div>

        <div>

          <h2 className="text-xl font-bold text-slate-800">
            Produto Mais Movimentado
          </h2>

          <p className="text-slate-500">
            Considerando entradas e saídas.
          </p>

        </div>

      </div>

      {!top ? (

        <div className="bg-slate-50 rounded-2xl p-10 text-center border border-dashed border-slate-200">

          <p className="text-slate-500 font-medium">
            Nenhuma movimentação registrada.
          </p>

        </div>
      ) : (
        <>
          <h3 className="text-2xl font-black text-slate-900 mb-6">
            {top.name}
          </h3>

          <div className="space-y-4">

            <div className="flex justify-between items-center p-3.5 bg-emerald-50/30 rounded-xl border border-emerald-100/50">

              <div className="flex items-center gap-2">

                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <ArrowDownToLine size={18} />
                </div>

                <span className="font-semibold text-slate-700">Entradas</span>

              </div>

              <span className="font-bold text-emerald-600 text-lg">
                +{top.entries.toFixed(2)}
              </span>

            </div>

            <div className="flex justify-between items-center p-3.5 bg-rose-50/30 rounded-xl border border-rose-100/50">

              <div className="flex items-center gap-2">

                <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">
                  <ArrowUpFromLine size={18} />
                </div>

                <span className="font-semibold text-slate-700">Saídas</span>

              </div>

              <span className="font-bold text-rose-600 text-lg">
                -{top.outputs.toFixed(2)}
              </span>

            </div>

            <div className="pt-4 flex justify-between items-center">

              <span className="font-bold text-slate-500">
                Total movimentado
              </span>

              <div className="text-right">
                <span className="text-3xl font-black text-blue-600">
                  {top.total.toFixed(2)}
                </span>
                <span className="ml-1 text-slate-400 font-bold">t</span>
              </div>

            </div>

          </div>

        </>

      )}

    </div>
  );
}