import { Outlet } from "react-router-dom";
import { Navigation } from "../components/Navigation";


export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">

      <Navigation />

      <main className="flex-1 md:ml-72 min-h-screen">
        <div className="max-w-[90rem] mx-auto p-6 md:p-8 pb-24">
          <Outlet />
        </div>
      </main>

    </div>
  );
}