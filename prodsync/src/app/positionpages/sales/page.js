import SalesDashboard from '../../components/salesui/SalesDashboard';
import RequireRole from '../../components/RequireRole';

export default function SalesPage() {
  return (
    <RequireRole allowed={['staff', 'admin']}>
      <SalesDashboard />
    </RequireRole>
  );
}
