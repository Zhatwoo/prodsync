import AccountingDashboard from '../../components/accountinfui/AccountingDashboard';
import RequireRole from '../../components/RequireRole';

export default function AccountingPage() {
  return (
    <RequireRole allowed={['accounting', 'admin']}>
      <AccountingDashboard />
    </RequireRole>
  );
}
