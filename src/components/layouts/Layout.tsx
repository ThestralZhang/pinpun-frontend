import { Outlet, useLocation } from 'react-router-dom';
import { Container, Content, IconButton, Sidebar, Sidenav, Stack, Text } from 'rsuite';
import { ArrowLeft, ArrowRight } from '@rsuite/icons';
import { useState } from 'react';
import UserProfile from '@/components/layouts/UserProfile.tsx';
import SideMenu from '@/components/layouts/SideMenu.tsx';
import NewItemDropdown from '@/components/layouts/NewItemDropdown.tsx';

export default function Layout() {
  const { pathname } = useLocation();

  const [expand, setExpand] = useState(true);

  if (pathname === '/login' || pathname === '/signup') {
    return <Outlet />;
  }

  return (
    <Container className="h-full">
      <Sidebar
        className="flex flex-col border-r-1 border-gray-300"
        width={expand ? 200 : 56}
        collapsible
      >
        <Sidenav.Header>
          <Text color="blue" weight="bold" align="center" size="md" className="py-2">
            PinPun
          </Text>
        </Sidenav.Header>
        <SideMenu expand={expand} />
        <NewItemDropdown expand={expand} />
        <Stack justifyContent={expand ? 'flex-end' : 'center'}>
          <IconButton
            onClick={() => setExpand(!expand)}
            appearance="subtle"
            size="lg"
            icon={expand ? <ArrowLeft /> : <ArrowRight />}
          />
        </Stack>
      </Sidebar>

      <Container id="main-container">
        <Content>
          <UserProfile />
          <Outlet />
        </Content>
      </Container>
    </Container>
  );
}
