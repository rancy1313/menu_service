import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
//import FormContainer from 'react-bootstrap/FormContainer';
//import CountrySelect from 'react-bootstrap-country-select';
import { useState } from 'react';

function LoginUser() {
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});

  return (
    <Form action='/home' className="formSubmission">
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" name="email" placeholder="Enter email" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" name="password" placeholder="Password" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

/*<Form.Group controlId='country'>
                    <Form.Label>Country</Form.Label>
                    <CountrySelect
                        className={!!errors.location && 'red-border'}
                        id='country'
                        autoComplete='off'
                        throwInvalidValueError={true}
                        required
                        valueAs='id'
                        value={form.location}
                        onChange={(selected) => {
                            console.log(selected)
                            setField('location', selected)
                        }}
                    />
                    <div className='red'>{errors.location}</div>
                </Form.Group>*/


export default LoginUser;