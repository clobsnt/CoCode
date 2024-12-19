import React from "react";
import { useNavigate } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";

const Menu = ({ email }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <Navbar bg="primary" data-bs-theme="dark" style={{ padding: "10px 20px" }}>
                <Navbar.Brand href="/">CoCode</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/projects">Projects</Nav.Link>
                    <Nav.Link onClick={handleLogout}>{email}, Logout</Nav.Link>
                </Nav>
        </Navbar>
    );
};

export default Menu;