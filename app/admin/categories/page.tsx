import AdminLayout from "@/components/Adminlayout";
import CategoriesPage from "@/components/Categoriespage";
import { ProtectedRoute } from "@/lib/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <CategoriesPage />
      </AdminLayout>
    </ProtectedRoute>
  );
}
