import AdminLayout from "@/components/Adminlayout";
import OverviewPage from "@/components/Overviewpage";
import { ProtectedRoute } from "@/lib/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <OverviewPage />
      </AdminLayout>
    </ProtectedRoute>
  );
}
