import AdminLayout from "@/components/Adminlayout";
import Bannerspage from "@/components/Bannerspage";
import { ProtectedRoute } from "@/lib/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <Bannerspage />
      </AdminLayout>
    </ProtectedRoute>
  );
}
