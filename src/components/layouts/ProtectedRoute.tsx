import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore.ts';

export default function ProtectedRoute() {
  const loginUser = useAuthStore((s) => s.user);

  if (!loginUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
