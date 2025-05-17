import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/layouts/Layout.tsx';
import ProtectedRoute from './components/layouts/ProtectedRoute.tsx';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Explore from './pages/Explore';
import Follows from './pages/Follows';
import MyPins from './pages/MyPins';
import NotFound from './pages/NotFound.tsx';
import { useEffect, useRef } from 'react';
import { api } from './api/client.tsx';
import ProfileSettings from '@/pages/ProfileSettings';
import FriendSettings from '@/pages/FriendSettings';
import UserHome from '@/pages/UserHome';
import NiceModal from '@ebay/nice-modal-react';
import PinboardView from '@/pages/PinboardView';

const queryClient = new QueryClient();

export default function App() {
  const didFetchCsrf = useRef(false);
  useEffect(() => {
    if (didFetchCsrf.current) return;
    didFetchCsrf.current = true;
    api.get('/csrf').catch((err) => {
      console.error('Failed to fetch CSRF token', err);
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <NiceModal.Provider>
          <Routes>
            <Route element={<Layout />}>
              {/* public */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* private */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Explore />} />
                <Route path="expore" element={<Explore />} />
                <Route path="follows" element={<Follows />} />
                <Route path="my-pins" element={<MyPins />} />
                <Route path="settings/profile" element={<ProfileSettings />} />
                <Route path="settings/friends" element={<FriendSettings />} />
                <Route path="users/:userId" element={<UserHome />} />
                <Route path="pinboards/:pinboardId" element={<PinboardView />} />
              </Route>

              {/* fallback */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </NiceModal.Provider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
