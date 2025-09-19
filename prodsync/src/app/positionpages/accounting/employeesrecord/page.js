import AdministratorDashboard from '../../../components/administratorui/AdministratorDashboard';
import RequireRole from '../../../components/RequireRole';

export default function EmployeesRecordPage() {
  return (
    <RequireRole allowed={['hr', 'HR', 'HR Manager', 'admin', 'administrator', 'accounting']}>
      <AdministratorDashboard />
    </RequireRole>
  );
}
