import React from "react";
import { Navbar, Container, Image, NavDropdown, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getUser, useUserActions } from "../hooks/user.actions";
import useSWR from "swr";  // Add this import
import { fetcher } from "../helpers/axios";  // Add this import

function NavigationBar() {
  const userActions = useUserActions();
  
  // Fetch current user data from API instead of localStorage
  const localUser = getUser();
  const currentUser = useSWR(
    localUser ? `/user/${localUser.id}/` : null,
    fetcher
  );

  const handleAvatarError = (e) => {
    e.target.src = "https://api.dicebear.com/7.x/identicon/svg";
  };

  if (!localUser || !currentUser.data) {
    return <div>Loading!</div>;
  }

  const user = currentUser.data; // Use API data instead of localStorage

  return (
    <Navbar bg="primary" variant="dark">
      <Container>
        <Navbar.Brand className="fw-bold" as={Link} to={`/`}>
          Postagram
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <NavDropdown
              title={
                <Image 
                  src={user.avatar} 
                  roundedCircle 
                  width={36} 
                  height={36}
                  onError={handleAvatarError}  // Add error handler
                />
              }
            >
              <NavDropdown.Item as={Link} to={`/profile/${user.id}/`}>
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item onClick={userActions.logout}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;