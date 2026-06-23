import AdminLayout from "@/components/Adminlayout";
import OrdersPage from "@/components/Orderspage";
import { ProtectedRoute } from "@/lib/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <OrdersPage />
      </AdminLayout>
    </ProtectedRoute>
  );
}
