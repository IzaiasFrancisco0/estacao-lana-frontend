import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useInventory } from "../hooks/useInventory";

const schema = z.object({
  selectedProduct: z.string().min(1, "Selecione um produto"),
  quantity: z.string().min(1, "Insira uma quantidade").refine((val) => {
    const num = Number(val.replace(",", "."));
    return !isNaN(num) && num > 0;
  }, "Quantidade deve ser maior que 0"),
  unitReceived: z.enum(["t", "kg", "m3"]),
  client: z.string().min(1, "Informe o cliente"),
  reason: z.string().min(1, "Informe o motivo"),
});

export function StockOut() {
  const { products, updateProduct, addMovement } = useInventory();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      selectedProduct: "",
      quantity: "",
      unitReceived: "t",
      client: "",
      reason: "Venda",
    },
  });

  const watchedValues = watch();

  const productSelected = products.find(
    (p) => p.id === watchedValues.selectedProduct
  );

  function convertToTons(value, unit, product) {
    const quantity = Number(value.replace(",", "."));
    if (unit === "t") return quantity;
    if (unit === "kg") return quantity / 1000;
    if (unit === "m3") return quantity * product.tonsPerM3;
    return quantity;
  }

  const quantityInTons =
    productSelected && watchedValues.quantity
      ? convertToTons(watchedValues.quantity, watchedValues.unitReceived, productSelected)
      : 0;

  const stockAfter = productSelected ? productSelected.quantity - quantityInTons : 0;

  function handleStockOut(data) {
    const product = products.find((p) => p.id === data.selectedProduct);

    if (quantityInTons > product.quantity) {
      toast.error("Estoque insuficiente.");
      return;
    }

    const updatedProducts = products.map((p) => {
      if (p.id !== data.selectedProduct) return p;
      return {
        ...p,
        quantity: p.quantity - quantityInTons,
        lastExit: new Date().toLocaleDateString("pt-BR"),
      };
    });

    updateProduct(updatedProducts);

    addMovement({
      type: "Saída",
      product: product.name,
      quantity: Number(data.quantity.replace(",", ".")),
      unit: data.unitReceived,
      clientSupplier: data.client,
      reason: data.reason,
    });

    setValue("selectedProduct", "");
    setValue("quantity", "");
    setValue("client", "");
    setValue("reason", "Venda");
    setValue("unitReceived", "t");

    toast.success("Saída registrada com sucesso!");
  }


  return (
    <div className="flex justify-center px-2 sm:px-4">
      <div className="w-full max-w-2xl">
        <div className="mb-6 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Saída de Estoque</h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">Registre retiradas de materiais.</p>
        </div>

        <form onSubmit={handleSubmit(handleStockOut)} className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 md:p-10 space-y-4 sm:space-y-6">
          <div>
            <label className="text-xs sm:text-sm font-semibold text-slate-700 ml-1">Produto</label>
            <select
              {...register("selectedProduct")}
              className="w-full mt-1.5 border border-slate-200 rounded-lg sm:rounded-xl px-3 py-2.5 sm:py-3.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50/50 text-sm"
            >
              <option value="">Selecione um produto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            {errors.selectedProduct && <p className="text-red-500 text-[10px] sm:text-xs mt-1">{errors.selectedProduct.message}</p>}
          </div>

          {productSelected && (
            <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 sm:p-5">
              <h3 className="font-bold text-orange-900 mb-3 sm:mb-4 text-sm sm:text-sm flex items-center gap-2">Status do Estoque</h3>
              <div className="grid grid-cols-2 gap-4 sm:gap-5 text-xs sm:text-sm">
                <div className="bg-white/60 p-3 sm:p-3 rounded-lg border border-orange-100/50">
                  <p className="text-slate-500 mb-0.5">Disponível</p>
                  <span className="block font-bold text-slate-800 text-sm sm:text-lg">{productSelected.quantity.toFixed(2)} t</span>
                </div>
                <div className="bg-white/60 p-3 rounded-lg border border-orange-100/50">
                  <p className="text-slate-500 mb-0.5">Localização</p>
                  <span className="block font-bold text-slate-800 text-xs sm:text-sm">{productSelected.location}</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="text-sm sm:text-sm font-semibold text-slate-700 ml-1">Quantidade</label>
              <input
                type="text"
                inputMode="decimal"
                {...register("quantity")}
                className="w-full mt-1.5 border border-slate-200 rounded-lg sm:rounded-xl px-4 py-3 sm:py-3.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                placeholder="0,00"
              />
              {errors.quantity && <p className="text-red-500 text-xs sm:text-xs mt-1">{errors.quantity.message}</p>}
            </div>
            <div>
              <label className="text-sm sm:text-sm font-semibold text-slate-700 ml-1">Unidade</label>
              <select
                {...register("unitReceived")}
                className="w-full mt-1.5 border border-slate-200 rounded-lg sm:rounded-xl px-4 py-3 sm:py-3.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white text-sm"
              >
                <option value="t">Toneladas (t)</option>
                <option value="m3">Metro cúbico (m³)</option>
                <option value="kg">Quilogramas (kg)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="text-sm sm:text-sm font-semibold text-slate-700 ml-1">Cliente</label>
              <input
                {...register("client")}
                className="w-full mt-1.5 border border-slate-200 rounded-lg sm:rounded-xl px-4 py-3 sm:py-3.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                placeholder="Nome do cliente/obra"
              />
              {errors.client && <p className="text-red-500 text-xs sm:text-xs mt-1">{errors.client.message}</p>}
            </div>
            <div>
              <label className="text-sm sm:text-sm font-semibold text-slate-700 ml-1">Motivo</label>
              <select
                {...register("reason")}
                className="w-full mt-1.5 border border-slate-200 rounded-lg sm:rounded-xl px-4 py-3 sm:py-3.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white text-sm"
              >
                <option>Venda</option>
                <option>Entrega</option>
                <option>Transferência</option>
                <option>Uso Interno</option>
                <option>Perda</option>
              </select>
            </div>
          </div>

          {productSelected && watchedValues.quantity && (
            <div className={`rounded-xl p-4 sm:p-5 border ${stockAfter < 0 ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
              <h3 className={`font-bold mb-3 sm:mb-4 text-sm sm:text-sm ${stockAfter < 0 ? 'text-red-900' : 'text-slate-900'}`}>
                Conferência de Saída
              </h3>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div className="space-y-0.5">
                  <p className="text-xs text-slate-500 font-medium">ATUAL</p>
                  <p className="font-bold text-slate-700 text-sm sm:text-sm">{productSelected.quantity.toFixed(2)} t</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-slate-500 font-medium">SAÍDA</p>
                  <p className={`font-bold text-sm sm:text-sm ${stockAfter < 0 ? 'text-red-600' : 'text-slate-600'}`}>-{quantityInTons.toFixed(2)}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-slate-500 font-medium">FINAL</p>
                  <p className={`font-bold text-sm sm:text-sm ${stockAfter < 0 ? 'text-red-600' : 'text-slate-900'}`}>{stockAfter.toFixed(2)} t</p>
                </div>
              </div>
              {stockAfter < 0 && (
                <p className="text-red-600 text-xs mt-3 font-bold text-center italic">⚠️ Atenção: Saldo insuficiente!</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full cursor-pointer bg-slate-900 hover:bg-black text-white font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all shadow-lg active:scale-[0.98] text-sm sm:text-base"
          >
            Registrar Saída
          </button>
        </form>
      </div>
    </div>
  );
}