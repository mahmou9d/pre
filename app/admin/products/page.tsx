import AdminLayout from "@/components/Adminlayout";
import ProductsPage from "@/components/Productspage";
import { ProtectedRoute } from "@/lib/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <ProductsPage />
      </AdminLayout>
    </ProtectedRoute>
  );
}
