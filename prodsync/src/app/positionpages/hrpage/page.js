'use client';

import HrDashboard from '../../components/hrui/HrDashboard';
import RequireRole from '../../components/RequireRole';

export default function HrPage() {
  return (
    <RequireRole allowed={['hr', 'HR', 'HR Manager', 'admin', 'administrator']}>
      <div className="w-full">
        <HrDashboard />
      </div>
    </RequireRole>
  );
}
