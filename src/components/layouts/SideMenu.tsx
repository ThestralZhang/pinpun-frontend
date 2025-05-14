import { Nav, Sidenav } from 'rsuite';
import { Link } from 'react-router-dom';
import { Explore, Peoples, Pin, PublicOpinion, Setting, UserBadge } from '@rsuite/icons';

export default function SideMenu({ expand }: { expand?: boolean }) {
  return (
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
  );
}
