import { Nav } from 'rsuite';
import { Link } from 'react-router-dom';

export default function MainSideNav() {
  return (
    <Nav vertical className="h-full w-60 bg-gray-50">
      <Nav.Item as={Link} to="/">
        Explore
      </Nav.Item>
      <Nav.Item as={Link} to="/follows">
        My Follows
      </Nav.Item>
      <Nav.Item as={Link} to="/my-pins">
        My Pins
      </Nav.Item>
      <Nav.Item as={Link} to="/settings/profile">
        Settings
      </Nav.Item>
    </Nav>
  );
}
