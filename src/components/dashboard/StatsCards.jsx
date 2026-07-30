import {
  Package,
  Boxes,
  ArrowDownToLine,
  ArrowUpFromLine,
  TrendingUp,
} from "lucide-react";

import { getProducts } from "../../storage/storage";

export function StatsCards() {
  const products = getProducts();

  const movements =
    JSON.parse(localStorage.getItem("movements")) || [];

  const today = new Date().toLocaleDateString("pt-BR");

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const totalValue = products.reduce(
    (total, product) => total + (product.quantity * (product.pricePerTon || 0)),
    0
  );

  const entriesToday = movements.filter(
    (movement) =>
      movement.type === "Entrada" &&
      movement.date === today
  ).length;

  const outputsToday = movements.filter(
    (movement) =>
      movement.type === "Saída" &&
      movement.date === today
  ).length;

  const cards = [
    {
      title: "Itens",
      value: totalProducts,
      description: "Cadastrados",
      color: "bg-blue-500",
      icon: <Package size={22} />,
    },
    {
      title: "Estoque",
      value: `${totalStock.toFixed(2)} t`,
      description: "Total",
      color: "bg-emerald-500",
      icon: <Boxes size={22} />,
    },
    {
      title: "Entradas",
      value: entriesToday,
      description: "Hoje",
      color: "bg-emerald-600",
      icon: <ArrowDownToLine size={22} />,
    },
    {
      title: "Saídas",
      value: outputsToday,
      description: "Hoje",
      color: "bg-red-500",
      icon: <ArrowUpFromLine size={22} />,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

      {cards.map((card) => (

        <div
          key={card.title}
          className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            shadow-sm
            p-4
            hover:shadow-md
            transition-all
            group
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </p>

              <h2 className="text-2xl font-bold mt-1 text-slate-900">
                {card.value}
              </h2>

              <span className="text-[10px] font-medium text-slate-400 block">
                {card.description}
              </span>

            </div>

            <div
              className={`
                ${card.color}
                w-10
                h-10
                rounded-xl
                flex
                items-center
                justify-center
                text-white
                shadow-md
                shadow-slate-200
                group-hover:scale-105
                transition-transform
              `}
            >
              {card.icon}
            </div>

          </div>

        </div>

      ))}

    </div>
  );
}