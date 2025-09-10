'use client';

import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Timecard from '../../components/timecard/Timecard';
import ProtectedRoute from '../../components/ProtectedRoute';
import { RoleGuard } from '../../components/RoleGuard';
import { ROLES } from '../../lib/roles';

export default function TimecardPage() {
  const { user, userRole } = useContext(AuthContext);

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.HR, ROLES.EMPLOYEE, ROLES.ACCOUNTANT, ROLES.FRONT_DESK, ROLES.SALES_AGENT, ROLES.TELEMARKETER, ROLES.AUDITOR]}>
        <div className="min-h-screen bg-gray-50">
          <Timecard user={user} userRole={userRole} />
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
