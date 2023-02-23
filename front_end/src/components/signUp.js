import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
//import FormContainer from 'react-bootstrap/FormContainer';
//import CountrySelect from 'react-bootstrap-country-select';
import { useState, useEffect } from 'react';
import { Multiselect } from "multiselect-react-dropdown";
// phone number input code
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import Card from 'react-bootstrap/Card';

function SignUp() {
    const allergies = ['Milk', 'Egg', 'Fish', 'Crustacean Shell Fish', 'Tree Nuts', 'Wheat', 'Peanuts', 'Soybeans', 'Sesame']
    // set the date of birth value here to preset the date of birth option to current date
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var newDate = year + "-" + month.toString().padStart(2, '0') + "-" + day.toString().padStart(2, '0');

    const [form, setForm] = useState({'dob': newDate, 'name': '', 'username': '', 'password': '',
                                      'confirm_password': '', 'allergies': ['None'], 'phone_number': '',
                                      'user_addresses': {'delivery_address1': {'address_name': '', 'city': '',
                                      'address': '', 'zipcode': ''}}});

    const [errors, setErrors] = useState({});
    const [saved_addresses, setSaved_addresses] = useState([]);
    const setField = (field, value) => {
        console.log('field: ', field);
        console.log('value: ', value);
        /*
           1. if it is a delivery address change then those are done differently
              b/c they are kept in a object.

           2. We want to update the current address the user is editing which is the last item in the
              user_addresses
        */
        if (field in form['user_addresses'][Object.keys(form.user_addresses)[Object.keys(form.user_addresses).length - 1]]) {
            // assign delivery_address to tmp var
            const tmp = form.user_addresses
            // tmp and form.delivery_address point to same dict,
            // but changes are not saved so we use the setForm func to save the changes
            tmp[Object.keys(form.user_addresses)[Object.keys(form.user_addresses).length - 1]][field] = value
            setForm({
                ...form,
                'user_addresses':tmp
            })
        } else {
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
        }
    }

    function AddressCards({ index, id, address_name, city, address, zipcode }) {
        return (
            <Card style={{ width: '23rem' }}>
                <div id={'card_'+id}>
                    <Card.Body>
                        <Card.Title>{ index + 1 }. { address_name }</Card.Title>
                        <Card.Text>{ address }, { city } { zipcode }.</Card.Text>
                    </Card.Body>
                </div>
                <EditPage index={index} id={id} address_name={address_name} city={city} address={address} zipcode={zipcode} />
            </Card>
        );
    }

    function deleteAddress(e, id) {
        e.preventDefault();
        const tmp = form.user_addresses;
        delete tmp[id];
        setForm({
            ...form,
            'user_addresses':tmp
        })
        setSaved_addresses(saved_addresses.filter(address => address !== id));
    }

    function EditPage({ index, id, address_name, city, address, zipcode }) {
        const [editForm, setEditForm] = useState({ 'id': id, 'address_name': address_name, 'city': city,
                                                 'address': address, 'zipcode': zipcode });

        return (
        <>
            <Card.Body>
                <button className={'btn btn-danger'} onClick={(e) => deleteAddress(e, id)}>Delete</button>{' '}
                <button id={'editButton_'+id} className={'btn btn-warning'} onClick={(e) => { editAddress(e, id, editForm) } }>Edit</button>
                <div id={'div_'+id}>
                    <Form.Control isInvalid={!!errors[('editField_'+id)]} hidden/>
                    <Form.Control.Feedback type='invalid'>
                        { errors[('editField_'+id)] }
                    </Form.Control.Feedback>
                </div>
            </Card.Body>

            <div className={'editPage hidden'} id={'editPage_'+id}>
                <Card.Title>Delivery Address { index + 1 }</Card.Title>
                <Form.Group controlId={'edit_'+id}>
                    <Form.Label>Name: { address_name }</Form.Label>
                    <Form.Control
                        placeholder='Save address as...'
                        value={editForm.address_name}
                        onChange={(e) => setEditForm({...editForm, 'address_name': e.target.value})}
                        isInvalid={!!errors['address_name_' + id]}
                    ></Form.Control>
                    <Form.Control.Feedback type='invalid'>
                        { errors['address_name_' + id] }
                    </Form.Control.Feedback>
                    <br />
                    <Form.Label>City: { city }</Form.Label>
                    <Form.Control
                        placeholder='City'
                        value={editForm.city}
                        onChange={(e) => setEditForm({...editForm, 'city': e.target.value})}
                        isInvalid={!!errors['city_' + id]}
                    ></Form.Control>
                    <Form.Control.Feedback type='invalid'>
                        { errors['city_' + id] }
                    </Form.Control.Feedback>
                    <br />
                    <Form.Label>Address: { address }</Form.Label>
                    <Form.Control
                        placeholder='Address'
                        value={editForm.address}
                        onChange={(e) => setEditForm({...editForm, 'address': e.target.value})}
                        isInvalid={!!errors['address_' + id]}
                    ></Form.Control>
                    <Form.Control.Feedback type='invalid'>
                        { errors['address_' + id] }
                    </Form.Control.Feedback>
                    <br />
                    <Form.Label>Zipcode: { zipcode }</Form.Label>
                    <Form.Control
                        placeholder='Zipcode'
                        value={editForm.zipcode}
                        onChange={(e) => setEditForm({...editForm, 'zipcode': e.target.value})}
                        isInvalid={!!errors['zipcode_' + id]}
                    ></Form.Control>
                    <Form.Control.Feedback type='invalid'>
                        { errors['zipcode_' + id] }
                    </Form.Control.Feedback>
                </Form.Group>
            </div>
        </>
        );
    }

    function editAddress(e, id, editForm) {
        e.preventDefault();

        delete errors[('editField_' + id)];
        setErrors(errors);

        const div = document.getElementById('div_' + id);

        const edit_page = document.getElementById('editPage_' + id);

        const card = document.getElementById('card_' + id);

        const edit_button = document.getElementById('editButton_' + id);

        const newErrors = {};

        for (const field in editForm) {
            if (editForm[field] === '') {
                /*console.log('value too short')
                const tmp_field = field + '_' + id;
                newErrors[tmp_field] = 'Please fill out the rest of the field.';

                setErrors(newErrors);
                console.log('newErrors:', newErrors)*/

                newErrors[('editField_'+id)] = 'Changes were not saved because a field was empty.';
                setErrors(newErrors);
                break;
            }
        }

        if (Object.keys(newErrors).length <= 0) {
            div.classList.toggle('hidden');
            edit_page.classList.toggle('hidden');
            card.classList.toggle('hidden');
            edit_button.classList.toggle('btn-warning');
            edit_button.classList.toggle('btn-success');

            if (edit_page.classList.contains('hidden')) {
                edit_button.innerText = 'Edit';
                form.user_addresses[id] = editForm;
                setForm({
                    ...form,
                    'user_addresses': form.user_addresses
                })
                /*
                // delete all errors as there should be none at this point
                for (const field in editForm) {
                    const tmp_field = field + '_' + id;
                    delete errors[tmp_field];
                }
                console.log(errors)*/


            } else {
                edit_button.innerText = 'Save Changes';
            }
        }
    }

    // this function is to get a list of the addresses to map over them and display them in cards
    function getAddresses() {
        const addresses = [];
        // loop through the keys to append them to a list and return them
        for (const key in form.user_addresses) {
            // we do not want the latest address because that is the one that is being saved
            if (key !== Object.keys(form.user_addresses)[Object.keys(form.user_addresses).length - 1]) {
                addresses.push(key)
            }
        }
        return addresses;
    }

    function setPhoneNumber(value) {

        setForm({
            ...form,
            'phone_number':value
        })

        if(!!errors['phone_number'])
        setErrors({
            ...errors,
            'phone_number':null
        })

        // check if value is not null first to make sure .length doesn't crash
        if (value && value.length > 12) {
            const newErrors = {'phone_number': 'Phone number too long.'};
            setErrors(newErrors);
        }
    }

    function setAllergies(selectedList, selectedItem) {
        setField('allergies', selectedList);
    }

    function addNewAddress(e) {
        e.preventDefault();
        const current_address = form['user_addresses'][Object.keys(form.user_addresses)[Object.keys(form.user_addresses).length - 1]];
        // form['user_addresses'][Object.keys(form.user_addresses)[Object.keys(form.user_addresses).length - 1]]
        // 'Please fill out all fields before adding a new address.'
        const newErrors = {}
        for (const key in current_address) {
            if (current_address[key] === '') {
                // add a new key/value with the key letting the user know which specific field is still empty
                newErrors[[key]] = 'Please fill out all fields before adding a new address.';
            }
        }
        for (const key in form.user_addresses) {
            if (current_address.address_name.toUpperCase() === form.user_addresses[key].address_name.toUpperCase() && current_address !== form.user_addresses[key]) {
                newErrors['address_name'] = 'This name has been used for a previous address. Please choose a different name.';
            }
        }
        // if there are any errors then alert the user
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            //setSaved_addresses(saved_addresses.push(Object.keys(form.user_addresses)[Object.keys(form.user_addresses).length - 1]));
            setSaved_addresses(saved_addresses => [...saved_addresses, Object.keys(form.user_addresses)[Object.keys(form.user_addresses).length - 1]])
            // if there are no errors then we add a new address
            // we cannot directly change the form so we assign it to a tmp var to then reassign in setForm function
            const tmp = form.user_addresses
            /*
                We need to create a new delivery_address key in the form's user_addresses object. To do so, I set it
                up to retrieve the last key in the object, strip 'delivery_address' from the key name to get left with
                the integer id of that key, and then add 1 to that to name the new key. We do this because when a key
                is deleted, it will change the number of existing keys, so I just pull most recent one to increment
                1 as to not use the name of an existing key.
            */
            tmp['delivery_address' + (parseInt(Object.keys(form.user_addresses)[Object.keys(form.user_addresses).length - 1].replace('delivery_address', '')) + 1)]
                                                        = {'address_name': '', 'city': '', 'address': '', 'zipcode': ''};
            // replace the old user_addresses with a new one that has the new address saved
            setForm({
                    ...form,
                    'user_addresses':tmp
            })
            // loop through the keys in the current address to delete the old errors
            for (const key in current_address) {
                delete errors[key];
            }
        }
    }

    function getAge(userBirthday) {

        let today = new Date();
        let birthDay = new Date(userBirthday);
        let months = today.getMonth() - birthDay.getMonth();
        let calculatedAge = today.getFullYear() - birthDay.getFullYear();

        if ((birthDay.getDate() > today.getDate() && months === 0) || (months < 0)) {
            calculatedAge--;
        }

        return calculatedAge;
    }

    const validateForm = () => {
        const {dob, name, username, password, confirm_password, phone_number, user_addresses } = form;
        const newErrors = {};

        if (getAge(dob) < 18) {
            newErrors.dob = 'You need to be at least 18 years old.';
        }

        if (name === '') {
            newErrors.name = 'Please enter a preferred name.';
        }

        if (username === '') {
            newErrors.username = 'Please enter a username.';
        } else {
            // we do not want to pass an empty string in our username var or 404
            // check if username is already taken
            fetch(`/username-check/${username}/user`).then(
                res => res.text()
            ).then(
                data => {
                    // if username is taken then throw error
                    if (data === 'True') {
                        setErrors({...errors, 'username': 'Username is already taken.'})
                    }
                }
            )
        }

        if (password.length < 8) {
            newErrors.password = 'Password is must be minimum 8 characters.';
        }

        if (password !== confirm_password) {
            newErrors.confirm_password = 'Passwords must match.';
        }

        if (phone_number.length > 0 && phone_number.length < 12) {
            newErrors.phone_number = 'Phone number is too short.';
        } else if (phone_number.length === 0) {
            newErrors.phone_number = 'Please enter a phone number.';
        }

        /*else {
            fetch(`/phone_number-check/${phone_number}`).then(
                res => res.text()
            ).then(
                data => {
                    // if username is taken then throw error
                    if (data === 'True') {
                        newErrors.phone_number = 'Phone number is already taken.';
                    }
                    console.log('test', data)
                }
            )
        }*/

        /*
           I am deleting any addresses that were not specifically saved by the user. If the
           the user filled in all the fields in the delivery address form then no errors
           will get triggered, and the address will be saved. However, I only want to store
           addresses the user specifically chose to save.
        */
        // We only do this if there are no errors because this will delete the current form
        // since the current form is always temporary and never saved
        const tmp = form.user_addresses;

        if (Object.keys(newErrors).length === 0) {
            for (const key in user_addresses) {
                if (!(saved_addresses.includes(key))) {
                    delete tmp[key];
                    setForm({
                        ...form,
                        'user_addresses':tmp
                    })
                }
            }
        }
        console.log(newErrors);
        return newErrors;
    }

    const handleSubmit = e => {
        e.preventDefault()
        // validate form to see if there are any errors
        const formErrors = validateForm()
        // if formErrors errors keys are greater than 0 then there are errors and can't submit form
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
        } else {
            // we send form to the back end
            fetch("/test", {
                method: "POST",
                body: JSON.stringify( form ),
              }).then((_res) => {
                window.location.href = "/home";
              });
        }
    }

    const current_address = form['user_addresses'][Object.keys(form.user_addresses)[Object.keys(form.user_addresses).length - 1]];

    return (
        <div>
            <Form className="formSubmission">
                <Form.Group controlId='name'>
                    <Form.Label>Preferred Name</Form.Label>
                    <Form.Control
                        type='text'
                        value={form.name}
                        onChange={(e) => setField('name', e.target.value)}
                        isInvalid={!!errors.name}
                    ></Form.Control>
                    <Form.Control.Feedback type='invalid'>
                        { errors.name }
                    </Form.Control.Feedback>
                </Form.Group>
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
                <Form.Group controlId='confirm_password'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type='password'
                        value={form.confirm_password}
                        onChange={(e) => setField('confirm_password', e.target.value)}
                        isInvalid={!!errors.confirm_password}
                    ></Form.Control>
                    <Form.Control.Feedback type='invalid'>
                        { errors.confirm_password }
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId='dob'>
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                        type='date'
                        value={form.dob}
                        onChange={(e) => setField('dob', e.target.value)}
                        isInvalid={!!errors.dob}
                    ></Form.Control>
                    <Form.Control.Feedback type='invalid'>
                        { errors.dob }
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId='phone_number'>
                    <Form.Label>Phone Number</Form.Label>
                    <PhoneInput
                      defaultCountry="US"
                      placeholder="Enter phone number"
                      value={form.phone_number}
                      onChange={setPhoneNumber}/>
                    <Form.Control
                      isInvalid={!!errors.phone_number}
                      hidden
                    ></Form.Control>
                    <Form.Control.Feedback type='invalid'>
                        { errors.phone_number }
                    </Form.Control.Feedback>
                </Form.Group>
                { (Object.keys(form.user_addresses).length > 1) ? (
                    getAddresses().map(function(address, index) {
                        return <div key={index}><AddressCards
                                    index={index}
                                    id={address}
                                    address_name={form.user_addresses[address].address_name}
                                    city={form.user_addresses[address].city}
                                    address={form.user_addresses[address].address}
                                    zipcode={form.user_addresses[address].zipcode}
                              /></div>;
                    })
                ) : (null)

                }
                {current_address ?
                <Form.Group controlId='delivery_address'>
                    <Form.Label>Default Delivery Address (Optional)</Form.Label>
                    <Form.Control
                        placeholder='Save address as...'
                        value={current_address.address_name}
                        onChange={(e) => setField('address_name', e.target.value)}
                        isInvalid={!!errors.address_name}
                    ></Form.Control>
                    <Form.Control.Feedback type='invalid'>
                        { errors.address_name }
                    </Form.Control.Feedback>
                    <br />
                    <Form.Control
                        placeholder='City'
                        value={current_address.city}
                        onChange={(e) => setField('city', e.target.value)}
                        isInvalid={!!errors.city}
                    ></Form.Control>
                    <Form.Control.Feedback type='invalid'>
                        { errors.city }
                    </Form.Control.Feedback>
                    <br />
                    <Form.Control
                        placeholder='Address'
                        value={current_address.address}
                        onChange={(e) => setField('address', e.target.value)}
                        isInvalid={!!errors.address}
                    ></Form.Control>
                    <Form.Control.Feedback type='invalid'>
                        { errors.address }
                    </Form.Control.Feedback>
                    <br />
                    <Form.Control
                        placeholder='Zipcode'
                        value={current_address.zipcode}
                        onChange={(e) => setField('zipcode', e.target.value)}
                        isInvalid={!!errors.zipcode}
                    ></Form.Control>
                    <Form.Control.Feedback type='invalid'>
                        { errors.zipcode }
                    </Form.Control.Feedback>
                    <br />
                    <button className={'btn btn-success'} onClick={addNewAddress}>
                        {(Object.keys(form.user_addresses).length === 1) ? 'Save Address' : 'Save Another Address'}
                    </button>
                </Form.Group>
                : null }
                {/*
                <Form.Group controlId='delivery_address'>
                    <Form.Label>Default Delivery Address (Optional)</Form.Label>
                    <Form.Control
                        placeholder='Save address as...'
                        value={form['user_addresses'][Object.keys(form.user_addresses)[Object.keys(form.user_addresses).length - 1]].address_name}
                        onChange={(e) => setField('address_name', e.target.value)}
                        isInvalid={!!errors.address_name}
                    ></Form.Control>
                    <Form.Control.Feedback type='invalid'>
                        { errors.address_name }
                    </Form.Control.Feedback>
                    <br />
                    <Form.Control
                        placeholder='City'
                        value={form['user_addresses'][Object.keys(form.user_addresses)[Object.keys(form.user_addresses).length - 1]].city}
                        onChange={(e) => setField('city', e.target.value)}
                        isInvalid={!!errors.city}
                    ></Form.Control>
                    <Form.Control.Feedback type='invalid'>
                        { errors.city }
                    </Form.Control.Feedback>
                    <br />
                    <Form.Control
                        placeholder='Address'
                        value={form['user_addresses'][Object.keys(form.user_addresses)[Object.keys(form.user_addresses).length - 1]].address}
                        onChange={(e) => setField('address', e.target.value)}
                        isInvalid={!!errors.address}
                    ></Form.Control>
                    <Form.Control.Feedback type='invalid'>
                        { errors.address }
                    </Form.Control.Feedback>
                    <br />
                    <Form.Control
                        placeholder='Zipcode'
                        value={form['user_addresses'][Object.keys(form.user_addresses)[Object.keys(form.user_addresses).length - 1]].zipcode}
                        onChange={(e) => setField('zipcode', e.target.value)}
                        isInvalid={!!errors.zipcode}
                    ></Form.Control>
                    <Form.Control.Feedback type='invalid'>
                        { errors.zipcode }
                    </Form.Control.Feedback>
                    <br />
                    <button className={'btn btn-success'} onClick={addNewAddress}>
                        {(Object.keys(form.user_addresses).length === 1) ? 'Save Address' : 'Save Another Address'}
                    </button>
                </Form.Group>
                */}
                {/*<Form.Group controlId='gender'>
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                        placeholder='Select Gender'
                        value={form.gender}
                        isInvalid={!!errors.gender}
                        onChange={(e) => {
                            setField('gender', e.target.value)
                        }}>
                        <option>Select Gender</option>
                        <option>Man</option>
                        <option>Woman</option>
                        <option>Other</option>
                    </Form.Select>
                    <Form.Control.Feedback type='invalid'>
                        { errors.gender }
                    </Form.Control.Feedback>
                </Form.Group>*/}
                <p>Allergies</p>
                <Multiselect onSelect={setAllergies} showArrow options={allergies} isObject={false} />

                <Form.Group>
                    <Button
                        type='submit'
                        onClick={handleSubmit}
                        className='my-2'
                        variant='primary'>Sign Up</Button>
                </Form.Group>
            </Form>
            <h1>list: {saved_addresses}</h1>
        </div>
    );
}

export default SignUp;