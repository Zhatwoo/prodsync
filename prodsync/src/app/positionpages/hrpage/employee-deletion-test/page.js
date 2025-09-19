'use client';

import EmployeeDeletionTest from '../../../components/hrui/employeesrecordmodal/EmployeeDeletionTest';
import RequireRole from '../../../components/RequireRole';

export default function EmployeeDeletionTestPage() {
  return (
    <RequireRole allowed={['hr', 'HR', 'HR Manager', 'admin', 'administrator']}>
      <div className="w-full">
        <EmployeeDeletionTest />
      </div>
    </RequireRole>
  );
}
