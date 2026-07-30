import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { StatsCards } from "../components/dashboard/StatsCards";
import { StockChart } from "../components/dashboard/StockChart";
import { LowStock } from "../components/dashboard/LowStock";
import { MostMovedProduct } from "../components/dashboard/MostMovedProduct";
import { RecentMovements } from "../components/dashboard/RecentMovements";

export function Dashboard() {
  return (
    <div className="space-y-8">
      <DashboardHeader />
      <StatsCards />
      <StockChart />
      <LowStock />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <MostMovedProduct />
        <RecentMovements />
      </div>
    </div>
  );
}