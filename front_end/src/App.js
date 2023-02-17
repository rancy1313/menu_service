import './App.css';
import { useState, useEffect } from 'react';
import NavbarFrontEnd from './components/navbar.js'
import LoginUser from './components/login.js'
import SignUp from './components/signUp.js'

function App() {
    return (
        <div className="App">
            <NavbarFrontEnd />
        </div>
    );
}


export default App;
