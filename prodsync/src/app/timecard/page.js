'use client';

import { useAuth } from '../../contexts/AuthContext';
import Timecard from '../../components/timecard/Timecard';
import ProtectedRoute from '../../components/ProtectedRoute';
import RoleGuard from '../../components/RoleGuard';
import { ROLES } from '../../lib/roles';

export default function TimecardPage() {
  const { user } = useAuth();
  const userRole = user?.role;

  return (
    <ProtectedRoute>
      <RoleGuard roles={[ROLES.ADMIN, ROLES.HR, ROLES.EMPLOYEE, ROLES.ACCOUNTANT, ROLES.FRONT_DESK, ROLES.SALES_AGENT, ROLES.TELEMARKETER, ROLES.AUDITOR]}>
        <div className="min-h-screen bg-gray-50">
          <Timecard user={user} userRole={userRole} />
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
