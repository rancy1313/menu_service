import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
//import FormContainer from 'react-bootstrap/FormContainer';
//import CountrySelect from 'react-bootstrap-country-select';
import { useState, useEffect } from 'react';
import axios from 'axios';


function LoginUser() {
    // userValidation is used to trigger the useEffect hook when a backend call is needed
    // to validate the user
    const [userValidation, setUserValidation] = useState(0);

    // form is what we pass to the backend to log the user in
    const [form, setForm] = useState({'username': '', 'password': '', 'login': ''});

    // errors is used to alert the users of any login errors
    const [errors, setErrors] = useState({});

    // useEffect will be used to validate the user on the backend
    useEffect(() => {

        async function fetchData() {

            // call to back end to see if user exits with username/password
            // returns True user exits and False if no user found
            const request = await axios({
                                            method: "POST",
                                            url: "/validate-user",
                                            data: form,
                                          });


            // validate the form to see if there are any errors.
            // pass backend response to throw a login error if needed
            const formErrors = validateForm(request.data)

            // call handle submit with form errors
            handleSubmit(formErrors);

        }

        if (userValidation !== 0)
            fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userValidation])

    const setField = (field, value) => {
        console.log('field: ', field);
        console.log('value: ', value);

        // just change the field in the form
        setForm({
            ...form,
            [field]:value
        })

        // reset errors if there are no new errors
        if(!!errors[field])
        setErrors({
            ...errors,
            [field]:null
        })

        // reset login errors
        delete errors.login;
    }


    function validateForm(data) {
        // get certain fields from the form to check if there are any errors
        const { username, password } = form;
        const newErrors = {};

        // username cannot be null
        if (username === '') {
            newErrors.username = 'Please enter a username.';
        }

        if (password.length < 8) {
            // password must be at least 8 chars
            newErrors.password = 'Password is must be minimum 8 characters.';
        }

        // check if there are no errors and if data is true then throw login error
        if (Object.keys(newErrors).length === 0 && data === 'False') {
            newErrors.login = 'Login failed. Username or Password are incorrect.';
        }

        return newErrors;
    }

    const validateUser = e => {
        e.preventDefault();

        // trigger useEffect by updating userValidation
        setUserValidation(userValidation+1);
    }

    // this function is to make sure there are no errors in the form before sending it to the backend
    function handleSubmit(formErrors) {

        // if formErrors errors keys are greater than 0 then there are errors and can't submit form
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);

        } else {
            // we send form to the back end
            fetch("/login", {
                method: "POST",
                body: JSON.stringify( form ),
            }).then((_res) => {
                // direct to user home and then pass current user info from backend
                window.location.href = "/home";
            });
        }
    }

    return (
        <div>
        <Form className="formSubmission">
            <Form.Control
              isInvalid={!!errors.login}
              hidden
            ></Form.Control>
            <Form.Control.Feedback type='invalid'>
                    { errors.login }
                </Form.Control.Feedback>
            <Form.Group controlId='username'>
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type='text'
                    value={form.username}
                    onChange={(e) => setField('username', e.target.value)}
                    isInvalid={!!errors.username}
                ></Form.Control>
                <Form.Control.Feedback type='invalid'>
                    { errors.username }
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type='password'
                    value={form.password}
                    onChange={(e) => setField('password', e.target.value)}
                    isInvalid={!!errors.password}
                ></Form.Control>
                <Form.Control.Feedback type='invalid'>
                    { errors.password }
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Button
                    type='submit'
                    onClick={validateUser}
                    className='my-2'
                    variant='primary'>Login</Button>
            </Form.Group>
        </Form>

        </div>
    );
}

export default LoginUser;