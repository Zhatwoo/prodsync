'use client';

import PermissionTest from '../../../components/hrui/PermissionTest';
import RequireRole from '../../../components/RequireRole';

export default function PermissionTestPage() {
  return (
    <RequireRole allowed={['hr', 'HR', 'HR Manager', 'admin', 'administrator']}>
      <div className="w-full">
        <PermissionTest />
      </div>
    </RequireRole>
  );
}
