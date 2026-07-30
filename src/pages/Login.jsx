import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    if (!localStorage.getItem("authUser")) {
        localStorage.setItem("authUser", JSON.stringify({ user: "admin", password: "123" }));
    }

    function handleLogin() {
        const authData = JSON.parse(localStorage.getItem("authUser"));

        if (user === authData.user && password === authData.password) {
            localStorage.setItem("isLoggedIn", "true");
            toast.success("Login realizado com sucesso!");
            navigate("/");
        } else {
            toast.error("Usuário ou senha incorretos");
        }
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
            <form className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 p-8" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                        Controle de Estoque
                    </h1>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Usuário
                        </label>

                        <input
                            type="text"
                            placeholder="Digite o usuário"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Senha
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Digite a Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 transition"
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>
                    </div>


                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 rounded-lg cursor-pointer"
                    >
                        Entrar
                    </button>
                </div>
            </form>
        </div>
    );
}