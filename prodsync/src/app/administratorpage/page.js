import AdministratorDashboard from '../components/administratorui/AdministratorDashboard';
import RequireRole from '../components/RequireRole';

export default function AdministratorPage() {
  return (
    <RequireRole allowed={['administrator', 'admin']}>
      <AdministratorDashboard />
    </RequireRole>
  );
}
