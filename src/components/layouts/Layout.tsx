import { Link, Outlet, useLocation } from 'react-router-dom';
import { Container, Content, IconButton, Nav, Sidebar, Sidenav, Stack, Text } from 'rsuite';
import {
  ArrowLeft,
  ArrowRight,
  Peoples,
  Pin,
  Setting,
  Explore,
  PublicOpinion,
  UserBadge,
} from '@rsuite/icons';
import { useState } from 'react';
import UserProfile from '@/components/layouts/UserProfile.tsx';

export default function Layout() {
  const { pathname } = useLocation();

  const [expand, setExpand] = useState(true);

  if (pathname === '/login' || pathname === '/signup') {
    return <Outlet />;
  }

  return (
    <Container className="h-full">
      <Sidebar className="flex flex-col" width={expand ? 200 : 56} collapsible>
        <Sidenav.Header>
          <Text color="blue" weight="bold" align="center" size="md" className="p-2">
            PinPun
          </Text>
        </Sidenav.Header>
        <Sidenav expanded={expand} appearance="subtle" className="flex-auto">
          <Sidenav.Body>
            <Nav defaultActiveKey="explore">
              <Nav.Item as={Link} to="/" eventKey="explore" icon={<Explore />}>
                Explore
              </Nav.Item>
              <Nav.Item as={Link} to="/follows" eventKey="follows" icon={<PublicOpinion />}>
                My Follows
              </Nav.Item>
              <Nav.Item as={Link} to="/my-pins" eventKey="my-pins" icon={<Pin />}>
                My Pins
              </Nav.Item>
              <Nav.Menu
                eventKey="settings"
                trigger="hover"
                title="Settings"
                icon={<Setting />}
                placement="rightStart"
              >
                <Nav.Item
                  as={Link}
                  to="/settings/profile"
                  eventKey="profile"
                  icon={<UserBadge className="mr-2" />}
                >
                  Profile
                </Nav.Item>
                <Nav.Item
                  as={Link}
                  to="/settings/friends"
                  eventKey="friends"
                  icon={<Peoples className="mr-2" />}
                >
                  Friends
                </Nav.Item>
              </Nav.Menu>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
        <Stack justifyContent={expand ? 'flex-end' : 'center'}>
          <IconButton
            onClick={() => setExpand(!expand)}
            appearance="subtle"
            size="lg"
            icon={expand ? <ArrowLeft /> : <ArrowRight />}
          />
        </Stack>
      </Sidebar>

      <Container>
        <Content>
          <UserProfile />
          <Outlet />
        </Content>
      </Container>
    </Container>
  );
}
