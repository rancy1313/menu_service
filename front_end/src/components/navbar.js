import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SignUp from './signUp.js';
import Login from './login.js';
import Logout from './logout.js';
import Home from './home.js';
import axios from 'axios';
import { useState, useEffect } from 'react';

function NavbarFrontEnd() {
    const [current_user, setCurrent_user] = useState({});

    useEffect(() => {

        async function fetchData() {
            const request = await axios.get('/get-current-user');
            console.log(request.data);

            const f = await setCurrent_user(request.data);
        }
        fetchData();

    }, [])

    const [triggerLogout, setTriggerLogout] = useState(0);

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get('/logout');
            console.log('request', request.data)
            const f = await setCurrent_user(request.data);
        }
        if (triggerLogout !== 0)
            fetchData();

    }, [triggerLogout])

    const handleLogout = e => {
        e.preventDefault();
        setTriggerLogout(triggerLogout+1);
    }

    return (
        <BrowserRouter>
            <Navbar bg="dark test" variant="dark">
                <Container>
                    <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/home">Home</Nav.Link>

                        { typeof current_user.preferred_name !== 'undefined' ? null : (
                        <>
                            <Nav.Link as={Link} to="/SignUp">Sign Up</Nav.Link>
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        </>
                        ) }

                        { typeof current_user.preferred_name !== 'undefined' ? (
                        <>
                            <Nav.Link as={Link} to="/home">Profile</Nav.Link>
                            <button id='btn-logout' onClick={handleLogout}>Logout</button>
                        </>
                        ) : null }

                    </Nav>
                </Container>
            </Navbar>
            <Routes>
                <Route path='/home' element={<Home current_user={current_user} />} />
                <Route path='/SignUp' element={<SignUp />} />
                <Route path='/login' element={<Login />} />
                <Route path='/logout' element={<Logout />} />
            </Routes>
        </BrowserRouter>
    );
}

export default NavbarFrontEnd;