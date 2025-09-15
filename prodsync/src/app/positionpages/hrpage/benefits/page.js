'use client';

import Benefits from '../../../components/administratorui/benefits/Benefits';
import RequireRole from '../../../components/RequireRole';

export default function HrBenefitsPage() {
  return (
    <RequireRole allowed={['hr', 'HR', 'HR Manager', 'admin', 'administrator']}>
      <div className="w-full p-6 bg-white min-h-screen">
        <Benefits />
      </div>
    </RequireRole>
  );
}
