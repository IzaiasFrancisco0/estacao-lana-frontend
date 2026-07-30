import { AlertTriangle } from "lucide-react";
import { getProducts } from "../../storage/storage";

export function LowStock() {
  const products = getProducts();

  const lowStockProducts = products
    .filter((product) => product.quantity < 10)
    .sort((a, b) => a.quantity - b.quantity);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

      <div className="flex items-center gap-3 mb-6">

        <div className="w-11 h-11 rounded-xl bg-yellow-100 flex items-center justify-center">
          <AlertTriangle
            size={22}
            className="text-yellow-600"
          />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Estoque Baixo
          </h2>

          <p className="text-slate-500">
            Produtos que precisam de reposição.
          </p>
        </div>

      </div>

      {lowStockProducts.length === 0 ? (
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-8 text-center">

          <p className="font-bold text-emerald-800">
            Todos os produtos possuem estoque suficiente.
          </p>

        </div>
      ) : (
        <div className="space-y-3">

          {lowStockProducts.map((product) => (

            <div
              key={product.id}
              className="
                flex
                justify-between
                items-center
                bg-slate-50/50
                border
                border-slate-100
                rounded-xl
                p-4
                hover:border-blue-200
                hover:bg-white
                hover:shadow-sm
                transition-all
              "
            >
              <div>

                <h3 className="font-bold text-slate-800">
                  {product.name}
                </h3>

                <p className="text-xs font-medium text-slate-400 mt-0.5">
                  Localização: {product.location}
                </p>

              </div>

              <span
                className="
                  bg-rose-100
                  text-rose-700
                  px-4
                  py-2
                  rounded-xl
                  font-bold
                  text-sm
                "
              >
                {product.quantity.toFixed(2)} t
              </span>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}