import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

export function Navigation() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const menu = [
    {
      title: "Dashboard",
      path: "/",
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: "Mercadorias",
      path: "/products",
      icon: <Package size={20} />,
    },
    {
      title: "Entrada",
      path: "/stock-in",
      icon: <ArrowDownToLine size={20} />,
    },
    {
      title: "Saída",
      path: "/stock-out",
      icon: <ArrowUpFromLine size={20} />,
    },
    {
      title: "Histórico",
      path: "/history",
      icon: <History size={20} />,
    },
  ];

  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-72 bg-slate-900 text-white flex-col shadow-xl">
        <div className="h-20 flex items-center justify-center border-b border-slate-700">
          <h1 className="text-2xl font-bold text-white">
            Controle de Estoque
          </h1>
        </div>

        <nav className="p-4 flex-1">
          {menu.map((item) => (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                    : "hover:bg-slate-800 text-slate-400 hover:text-white"
                }`
              }
            >
              {item.icon}
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-8 py-6 border-t border-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] z-50">
        <div className="grid grid-cols-6 h-16">
          {menu.map((item) => (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center transition ${
                  isActive
                    ? "text-blue-600"
                    : "text-slate-500 hover:text-blue-600"
                }`
              }
            >
              {item.icon}
              <span className="text-[11px] mt-1">{item.title}</span>
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="cursor-pointer flex flex-col items-center justify-center text-slate-500 hover:text-red-600 transition"
          >
            <LogOut size={20} />
            <span className="text-[11px] mt-1">Sair</span>
          </button>
        </div>
      </nav>
    </>
  );
}