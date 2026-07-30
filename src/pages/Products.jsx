import { useState, useEffect } from "react";
import { getProducts, saveProducts } from "../storage/storage";
import { Edit2, Check, X, TrendingUp } from "lucide-react";

export function Products() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    const data = getProducts();
    setProducts(data);
  }, []);

  function statusStock(product) {
    if (product.quantity === 0) {
      return {
        text: "Sem estoque",
        color: "bg-red-100 text-red-700",
      };
    }

    if (product.quantity <= product.minimum) {
      return {
        text: "Estoque baixo",
        color: "bg-yellow-100 text-yellow-700",
      };
    }

    return {
      text: "Disponível",
      color: "bg-green-100 text-green-700",
    };
  }

  function convertToM3(product) {
    return (product.quantity / product.tonsPerM3).toFixed(1);
  }

  function handleEditPrice(product) {
    setEditingId(product.id);
    setNewPrice(product.pricePerTon || "");
  }

  function handleSavePrice(id) {
    const updatedProducts = products.map(p => {
      if (p.id === id) {
        return { ...p, pricePerTon: Number(newPrice) };
      }
      return p;
    });
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    setEditingId(null);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Controle de Mercadorias
          </h1>
          <p className="text-slate-500 mt-2">
            Gerenciamento de areia e brita disponíveis no depósito.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product) => {
          const status = statusStock(product);
          const percentage = (product.quantity / (product.minimum * 3)) * 100;
          const isEditing = editingId === product.id;

          return (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 p-7"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.id}</span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                    {product.name}
                  </h2>
                  <p className="text-sm text-slate-500 font-medium">{product.category}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.color}`}
                >
                  {status.text}
                </span>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Disponível</p>
                  <div className="flex items-baseline gap-1">
                    <strong className="text-2xl font-black text-slate-900">{product.quantity}</strong>
                    <span className="text-slate-500 text-xs font-bold">t</span>
                  </div>
                </div>

                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Equivalente</p>
                  <div className="flex items-baseline gap-1">
                    <strong className="text-2xl font-black text-slate-700">{convertToM3(product)}</strong>
                    <span className="text-slate-500 text-xs font-bold">m³</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nível do estoque</p>
                  <span className="text-xs font-black text-slate-700">{Math.round(Math.min(percentage, 100))}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      percentage < 30 ? 'bg-red-500' : percentage < 60 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-4 text-xs font-medium text-slate-600">
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg">
                  <span className="text-slate-400">📍</span>
                  <span>{product.location}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg">
                  <span className="text-slate-400">🚚</span>
                  <span>{product.supplier}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <TrendingUp size={14} />
                    <span>Preço p/ Ton</span>
                  </div>
                  
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">R$</span>
                        <input
                          type="number"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          className="w-20 pl-6 pr-2 py-1 border border-blue-500 rounded-lg outline-none text-xs font-bold"
                          autoFocus
                        />
                      </div>
                      <button onClick={() => handleSavePrice(product.id)} className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                        <Check size={12} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300">
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => handleEditPrice(product)}>
                      <strong className="text-slate-900 font-bold text-sm">
                        R$ {(product.pricePerTon || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </strong>
                      <Edit2 size={12} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                  <span className="text-slate-600 text-xs font-bold uppercase tracking-widest">Valor Total</span>
                  <strong className="text-lg text-blue-600 font-black">
                    R$ {(product.quantity * (product.pricePerTon || 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}