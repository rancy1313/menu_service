import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SignUp from './signUp.js';
import Login from './login.js';
import Home from './home.js';

function NavbarFrontEnd() {
    return (
        <BrowserRouter>
            <Navbar bg="dark test" variant="dark">
                <Container>
                    <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/home">Home</Nav.Link>
                        <Nav.Link as={Link} to="/SignUp">Sign Up</Nav.Link>
                        <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <Routes>
                <Route path='/SignUp' element={<SignUp />} />
                <Route path='/login' element={<Login />} />
                <Route path='/home' element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

export default NavbarFrontEnd;