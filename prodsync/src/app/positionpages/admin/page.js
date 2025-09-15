import AdminDashboard from '../../components/adminui/AdminDashboard';
import RequireRole from '../../components/RequireRole';

export default function AdminPage() {
  return (
    <RequireRole allowed={['admin']}>
      <AdminDashboard />
    </RequireRole>
  );
}
