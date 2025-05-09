import { Nav } from 'rsuite';
import { Link } from 'react-router-dom';

export default function SettingsSideNav() {
  return (
    <Nav vertical className="h-full w-48 bg-gray-100">
      <Nav.Item as={Link} to="/settings/profile">
        Profile
      </Nav.Item>
      <Nav.Item as={Link} to="/settings/friends">
        Account
      </Nav.Item>
    </Nav>
  );
}
