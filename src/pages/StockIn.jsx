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
});

export function StockIn() {
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
        },
    });

    const watchedValues = watch();

    const productSelected = products.find(
        (product) => product.id === watchedValues.selectedProduct
    );

    function convertToTons(quantity, unit, product) {
        const value = Number(quantity.replace(",", "."));

        switch (unit) {
            case "t":
                return value;
            case "kg":
                return value / 1000;
            case "m3":
                return value * product.tonsPerM3;
            default:
                return value;
        }
    }
    
    const quantityInTons =
        productSelected && watchedValues.quantity
            ? convertToTons(watchedValues.quantity, watchedValues.unitReceived, productSelected)
            : 0;

    const stockAfter = productSelected
        ? productSelected.quantity + quantityInTons
        : 0;

    function handleStockIn(data) {
        const product = products.find((p) => p.id === data.selectedProduct);
        
        const updatedProducts = products.map((p) => {
            if (p.id === data.selectedProduct) {
                return {
                    ...p,
                    quantity: p.quantity + convertToTons(data.quantity, data.unitReceived, p),
                    lastEntry: new Date().toLocaleDateString("pt-BR"),
                };
            }
            return p;
        });

        updateProduct(updatedProducts);

        addMovement({
            type: "Entrada",
            product: product.name,
            quantity: Number(data.quantity.replace(",", ".")),
            unit: data.unitReceived,
            clientSupplier: product.supplier,
            reason: "Compra",
        });

        setValue("selectedProduct", "");
        setValue("quantity", "");
        setValue("unitReceived", "t");

        toast.success("Entrada registrada com sucesso!");
    }


    const preview = productSelected && watchedValues.quantity && (() => {
        const q = Number(watchedValues.quantity.replace(",", "."));
        if (watchedValues.unitReceived === "t") {
            return {
                unit: "t",
                current: productSelected.quantity.toFixed(2),
                entry: q.toFixed(2),
                final: stockAfter.toFixed(2)
            };
        }
        if (watchedValues.unitReceived === "kg") {
            return {
                unit: "kg",
                current: (productSelected.quantity * 1000).toFixed(0),
                entry: q.toFixed(0),
                final: (stockAfter * 1000).toFixed(0)
            };
        }
        return {
            unit: "m³",
            current: (productSelected.quantity / productSelected.tonsPerM3).toFixed(2),
            entry: q.toFixed(2),
            final: (stockAfter / productSelected.tonsPerM3).toFixed(2)
        };
    })();

    return (
        <div className="flex justify-center items-start px-2 sm:px-4">
            <div className="w-full max-w-2xl">
                <div className="mb-6 text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                        Entrada de Estoque
                    </h1>
                    <p className="text-sm md:text-base text-slate-500 mt-1">
                        Registre a chegada de novos materiais.
                    </p>
                </div>

                <form onSubmit={handleSubmit(handleStockIn)} className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 md:p-10">
                    <div className="space-y-4 sm:space-y-6">
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
                            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 sm:p-5">
                                <h3 className="font-bold text-blue-900 mb-3 sm:mb-4 text-sm sm:text-sm flex items-center gap-2">Informações do Produto</h3>
                                <div className="grid grid-cols-2 gap-4 sm:gap-5 text-xs sm:text-sm">
                                    <div className="bg-white/60 p-3 sm:p-3 rounded-lg border border-blue-100/50">
                                        <p className="text-slate-500 mb-0.5">Estoque atual</p>
                                        <span className="block font-bold text-slate-800 text-sm sm:text-lg">{productSelected.quantity.toFixed(2)} t</span>
                                    </div>
                                    <div className="bg-white/60 p-3 rounded-lg border border-blue-100/50">
                                        <p className="text-slate-500 mb-0.5">Fornecedor</p>
                                        <span className="block font-bold text-slate-800 text-xs sm:text-sm">{productSelected.supplier}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 sm:gap-5">
                            <div>
                                <label className="text-sm sm:text-sm font-semibold text-slate-700 ml-1">Qtd. recebida</label>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="0,00"
                                    {...register("quantity")}
                                    className="w-full mt-1.5 border border-slate-200 rounded-lg sm:rounded-xl px-4 py-3 sm:py-3.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                />
                                {errors.quantity && <p className="text-red-500 text-xs sm:text-xs mt-1">{errors.quantity.message}</p>}
                            </div>
                            <div>
                                <label className="text-sm sm:text-sm font-semibold text-slate-700 ml-1">Unidade</label>
                                <select
                                    {...register("unitReceived")}
                                    className="w-full mt-1.5 border border-slate-200 rounded-lg sm:rounded-xl px-4 py-3 sm:py-3.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white text-sm"
                                >
                                    <option value="t">Tonelada (t)</option>
                                    <option value="m3">Metro cúbico (m³)</option>
                                    <option value="kg">Quilograma (kg)</option>
                                </select>
                            </div>
                        </div>

                        {preview && (
                            <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 sm:p-5">
                                <h3 className="font-bold text-emerald-900 mb-3 sm:mb-4 text-sm sm:text-sm">Resumo</h3>
                                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                                    <div className="space-y-0.5">
                                        <p className="text-xs text-emerald-600 font-medium">ATUAL</p>
                                        <p className="font-bold text-slate-700 text-sm sm:text-sm">{preview.current} {preview.unit}</p>
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs text-emerald-600 font-medium">ENTRADA</p>
                                        <p className="font-bold text-emerald-600 text-sm sm:text-sm">+{preview.entry}</p>
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs text-emerald-600 font-medium">FINAL</p>
                                        <p className="font-bold text-slate-900 text-sm sm:text-sm">{preview.final} {preview.unit}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all shadow-lg active:scale-[0.98] text-sm sm:text-base"
                        >
                            Confirmar Entrada
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}