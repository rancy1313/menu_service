import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
//import FormContainer from 'react-bootstrap/FormContainer';
//import CountrySelect from 'react-bootstrap-country-select';
import { useState, useEffect } from 'react';

function LoginUser() {
    const [form, setForm] = useState({'username': '', 'password': '', 'login': ''});
    const [errors, setErrors] = useState({});
    const [work, setWork] = useState(0);

    useEffect(() => {
        console.log('use', errors)
        setErrors(errors)

        fetch(`/validate-user/${form.username}/${user.password}`).then(
            res => res.text()
        ).then(
             data => {

                // if user does not exit then throw login error
                if (data === 'True') {
                    //newErrors.login = 'Login failed. Username or Password are incorrect.';
                    setErrors({...errors, 'login': 'Login failed. Username or Password are incorrect.'});
                }
             }
        )

    }, [form]);

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
        if(!!errors['login'])
        setErrors({
            ...errors,
            ['login']:null
        })
    }

    // const validateForm = () => {
    function validateForm() {
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

        // if there are no form errors then we validate the user
        if (Object.keys(newErrors).length === 0) {
            // check if user exists with username and password entered
            fetch(`/validate-user/${username}/${password}`).then(
                res => res.text()
            ).then(
                 data => {

                    // if user does not exit then throw login error
                    if (data === 'True') {
                        newErrors.login = 'Login failed. Username or Password are incorrect.';
                        setErrors({...errors, 'login': 'Login failed. Username or Password are incorrect.'});
                    }
                 }
            )
        }

        newErrors.stop_submission = 'True.';
        return newErrors;
    }

    // this function is to make sure there are no errors in the form before sending it to the backend
    const handleSubmit = e => {
        e.preventDefault()

        // validate form to see if there are any errors
        const formErrors = validateForm()
        console.log('handleSubmit', formErrors, errors)

        // if formErrors errors keys are greater than 0 then there are errors and can't submit form
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);

        } else {
            // we send form to the back end
            fetch("/login", {
                method: "POST",
                body: JSON.stringify( form ),
            }).then((_res) => {
                window.location.href = "/home";
            });
        }
    }

    return (
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
                    onClick={handleSubmit}
                    className='my-2'
                    variant='primary'>Login</Button>
            </Form.Group>

        </Form>
    );
}

export default LoginUser;