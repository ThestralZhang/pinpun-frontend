import { Outlet, useLocation } from 'react-router-dom';
import MainSideNav from './MainSideNav';
import SettingsSideNav from './SettingsSideNav';
import UserProfile from './UserProfile';

export default function Layout() {
  const { pathname } = useLocation();

  if (pathname === '/login' || pathname === '/signup') {
    return <Outlet />;
  }

  const isSettings = pathname.startsWith('/settings');

  return (
    <div className="flex h-screen">
      <MainSideNav />

      {isSettings && <SettingsSideNav />}

      <div className="flex-1 relative">
        <UserProfile />
        <main className="p-4 mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
