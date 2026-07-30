import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

export function StockChart() {
  const movements =
    JSON.parse(localStorage.getItem("movements")) || [];
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();

    date.setDate(date.getDate() - i);

    const formatted = date.toLocaleDateString("pt-BR");

    days.push({
      date: formatted,
      entradas: 0,
      saidas: 0,
    });
  }

  movements.forEach((movement) => {
    const day = days.find(
      (d) => d.date === movement.date
    );

    if (!day) return;

    if (movement.type === "Entrada") {
      day.entradas += Number(movement.quantity);
    }

    if (movement.type === "Saída") {
      day.saidas += Number(movement.quantity);
    }
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-8">

      <div className="mb-6">

        <h2 className="text-xl font-bold text-slate-800">
          Movimentações dos últimos 7 dias
        </h2>

        <p className="text-slate-500 mt-1">
          Entradas e saídas registradas recentemente.
        </p>

      </div>

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart data={days}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="entradas"
              name="Entradas"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
            />

            <Bar
              dataKey="saidas"
              name="Saídas"
              fill="#f43f5e"
              radius={[6, 6, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}