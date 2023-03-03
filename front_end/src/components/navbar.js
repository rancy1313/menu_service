import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Routes, Route, Link } from "react-router-dom";
import SignUp from './signUp.js';
import Login from './login.js';
import Home from './home.js';
import Account from'./account_settings/account.js';
import UserHome from './user_home.js';
import axios from 'axios';
import { useState, useEffect } from 'react';
import  { Navigate } from 'react-router-dom'


function NavbarFrontEnd() {
    // used to display the current user's account
    const [current_user, setCurrent_user] = useState({});

    // fetch the current user from the back end on render
    useEffect(() => {

        async function fetchData() {
            // call back end
            const request = await axios.get('/get-current-user');
            // set response data to current user
            setCurrent_user(request.data);
        }
        fetchData();

    }, []);

    // the component used to handle a user logging out
    function Logout() {

        // call this function on render to logout the user on the back end
        useEffect(() => {
            async function fetchData() {
                // call back end to log out user
                const request = await axios.get('/logout');
                // set empty obj as current user
                setCurrent_user(request.data);
            }
            fetchData();

        }, [])

        return (
            <>
                <Navigate to="/home" />
                <Routes>
                    <Route path='/home' element={<Home />} />
                </Routes>

            </>
        );
    }

    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                    <Nav className="me-auto">

                        { typeof current_user.preferred_name !== 'undefined' ? null : (
                            <>
                                <Nav.Link href="/home">Home</Nav.Link>
                                <Nav.Link as={Link} to="/SignUp">Sign Up</Nav.Link>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                            </>
                        ) }

                        { typeof current_user.preferred_name !== 'undefined' ? (
                            <>
                                <Nav.Link as={Link} to="/user_home">Home</Nav.Link>
                                <Nav.Link as={Link} to="/account">Account</Nav.Link>
                                <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
                            </>
                        ) : null }

                    </Nav>
                </Container>
            </Navbar>
            <Routes>
                <Route path='/home' element={<Home />} />
                <Route path='/SignUp' element={<SignUp />} />
                <Route path='/login' element={<Login />} />
                <Route path='/user_home' element={<UserHome current_user={current_user} />} />

                <Route path='/account' element={<Account />} />
                {/*<Route path='/account' element={<Account current_user={current_user} />}*/}
                <Route path='/logout/*' element={<Logout />} />
            </Routes>
        </div>
    );
}

export default NavbarFrontEnd;