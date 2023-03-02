import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Logout() {

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get('/logout');

        }
        fetchData();

    }, [])


    return null;
}