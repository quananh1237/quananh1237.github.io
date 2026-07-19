export type StatItem = {
  id: string;
  label: string;
  value: number;
  change: number;
  spark: number[];
};

export type Product = {
  name: string;
  revenue: number;
  share: number;
};

export type Order = {
  id: string;
  customer: string;
  email: string;
  product: string;
  amount: number;
  status: "Completed" | "Pending" | "Cancelled" | "Processing";
  date: string;
  avatarBg: string;
};

export type DashboardData = {
  stats: StatItem[];
  chart: { month: string; value: number }[];
  products: Product[];
  orders: Order[];
};
