import axios from 'axios';
import { useState, useEffect } from 'react';


export default function UserHome(props) {

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

    return (
        <div className='center'>
            <h1>Hello, { current_user.preferred_name }.</h1>
        </div>
    );
}