import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Multiselect } from "multiselect-react-dropdown";
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


//export default function Account(props) {
export default function Account() {

    // used to display the current user's account
    const [current_user, setCurrent_user] = useState({});

    // this form will be used to update the users information
    const [form, setForm] = useState({'preferred_name': '',
                                      'allergies': '',
                                      'user_addresses': '' });

    // if the data from the user is not up to specifications then there will be an error and the form will
    // not be sent to the backend
    const [errors, setErrors] = useState({});

    // only addresses that were saved by the user will be sent to the backend
    const [saved_addresses, setSaved_addresses] = useState([]);

    // fetch the current user from the back end on render
    useEffect(() => {

        async function fetchData() {
            // call back end
            const request = await axios.get('/get-current-user');
            // set response data to current user
            setCurrent_user(request.data);

            setForm({'preferred_name': request.data.preferred_name,
                     'allergies': request.data.allergies,
                     'user_addresses': request.data.user_addresses });


            // we remove the last address from the saved addresses list b/c that address is always
            // an empty current list.
            const remove_last_address = Object.keys(request.data.user_addresses);
            remove_last_address.pop();
            setSaved_addresses(remove_last_address);

        }
        fetchData();

    }, []);

    // this is to shorten the code needed to get the current address which is the address that is currently being edited
    const current_address = form['user_addresses'][Object.keys(form.user_addresses)[Object.keys(form.user_addresses).length - 1]];


    // set the available allergies to pass in the bootstrap selector
    const allergies = ['Milk', 'Egg', 'Fish', 'Crustacean Shell Fish', 'Tree Nuts', 'Wheat', 'Peanuts', 'Soybeans', 'Sesame']

    // this is used for the onSelect function of the Multiselect component and just updates the form by form
    function setAllergies(selectedList, selectedItem) {
        setField('allergies', selectedList);
    }

    // this component is to format the saved addresses
    function AddressCards({ index, id, address_name, city, address, zipcode }) {
        return (
            <Card style={{ width: '30rem', float: 'left' }}>
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

    // will delete any of the saved addresses of the user by searching for it with an id of the address
    function deleteAddress(e, id) {
        e.preventDefault();
        // delete the address
        delete form.user_addresses[id];
        // remove the address from the saved address list b/c then it wont be pass to the backend
        setSaved_addresses(saved_addresses.filter(address => address !== id));
    }

    // this function is to use the temporary editForm to update the corresponding address in the form
    function editAddress(e, id, editForm) {
        e.preventDefault();

        // we delete any of the previous errors as they were not saved
        delete errors[('editField_' + id)];

        // this div holds the errors and we toggle a hidden class to hide the errors when the user tries to edit again
        const div = document.getElementById('div_' + id);
        // the edit page has a hidden class that is toggled whne the edit button is pressed
        const edit_page = document.getElementById('editPage_' + id);
        // the address that the user is trying to edit is held in a card that has a hidden class that is toggled
        // to then show the edit page instead
        const card = document.getElementById('card_' + id);
        // we change the inner text/style from edit to save changes
        const edit_button = document.getElementById('editButton_' + id);
        // we hold any errors in here to update the errors object
        const newErrors = {};

        for (const field in editForm) {
            // if a field is empty then we throw an error and changes are not saved
            if (editForm[field] === '') {
                newErrors[('editField_'+id)] = 'Changes were not saved because all fields were not filled out.';
                setErrors(newErrors);
                // break b/c the error would be the same for whichever field it was
                break;
            }
        }

        // if there are no errors then proceed with updating the address
        if (Object.keys(newErrors).length === 0) {
            // toggle the div to hide the errors
            div.classList.toggle('hidden');
            // toggle the edit page to hide it
            edit_page.classList.toggle('hidden');
            // toggle the card to show the address again in the card component
            card.classList.toggle('hidden');
            // change the styles of the edit button back to yellow
            edit_button.classList.toggle('btn-warning');
            edit_button.classList.toggle('btn-success');

            // if edit page is hidden then we can save the changes
            if (edit_page.classList.contains('hidden')) {
                // change the text back to edit so the user can edit again
                edit_button.innerText = 'Edit';
                form.user_addresses[id] = editForm;
                setForm({
                    ...form,
                    'user_addresses': form.user_addresses
                });
            } else {
                // else change the text to save changes
                edit_button.innerText = 'Save Changes';
            }
        }
    }

    // this is format for the edit page that replaces the address when the user clicks the edit button
    function EditPage({ index, id, address_name, city, address, zipcode }) {

        // we use editForm as a temporary new address object to update the old address
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

    // this function is to get a list of the addresses to map over them and display them in cards
    function getAddresses() {
        // this list is to collect the addresses
        const addresses = [];

        // loop through the keys to append them to a list and return them
        for (const key in form.user_addresses) {

            // we do not want the latest address because that is the one that is being saved
            if (key !== Object.keys(form.user_addresses)[Object.keys(form.user_addresses).length - 1]) {
                addresses.push(key);
            }
        }

        return addresses;
    }

    // this function is for the user to save an address
    function saveNewAddress(e) {
        e.preventDefault();

        // hold any any errors to update the errors object
        const newErrors = {}

        // loop through the fields in the current address and check if any of them are empty
        for (const field in current_address) {
            // if empty the throw an error
            if (current_address[field] === '') {
                // add a new key/value with the key letting the user know which specific field is still empty
                newErrors[field] = 'Please fill out all fields before adding a new address.';
            }
        }

        // loop through all the saved addresses' name and if they match the current one then throw an error
        // addresses are supposed to have unique names
        for (const key in form.user_addresses) {
            // make the string upper to remove case sensitivity when comparing names
            // if the name matches throw error but make sure that the current address is also not the current one being looped
            if (current_address.address_name.toUpperCase() === form.user_addresses[key].address_name.toUpperCase() && current_address !== form.user_addresses[key]) {
                newErrors['address_name'] = 'This name has been used for a previous address. Please choose a different name.';
            }
        }

        // if there are any errors then alert the user
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {

            // update saved addresses list to include the new address
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
            });
            // loop through the keys in the current address to delete the old errors
            for (const key in current_address) {
                delete errors[key];
            }
        }
    }

    // this is used for our onChange function to update the form
    const setField = (field, value) => {
        /*
           1. if it is a delivery address change then those are updated differently
              b/c they are kept in a object.

           2. We want to update the current address the user is editing which is the last item in the
              user_addresses
        */
        if (field in form['user_addresses'][Object.keys(form.user_addresses)[Object.keys(form.user_addresses).length - 1]]) {
            // assign delivery_address to tmp var
            const tmp = form.user_addresses;
            // tmp and form.delivery_address point to same dict,
            // but changes are not saved so we use the setForm func to save the changes
            tmp[Object.keys(form.user_addresses)[Object.keys(form.user_addresses).length - 1]][field] = value;
            setForm({
                ...form,
                'user_addresses':tmp
            });
        } else {
            // just change the field in the form
            setForm({
                ...form,
                [field]:value
            });
            // reset errors if there are no new errors
            if(!!errors[field])
            setErrors({
                ...errors,
                [field]:null
            });

        }
    }

    // this function is to validate the form when the user tries to submit all their info
    const validateForm = () => {

        // get certain fields from the form to check if there are any errors
        const { preferred_name, user_addresses } = form;
        const newErrors = {};

        // name cannot be null
        if (preferred_name === '') {
            newErrors.preferred_name = 'Please enter a preferred name.';
        }

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
                    });
                }
            }
        }

        return newErrors;
    }

    const navigate = useNavigate();

    const handleSubmit = e => {
        e.preventDefault();

        const formErrors = validateForm();

        // if formErrors errors keys are greater than 0 then there are errors and can't submit form
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);

        } else {
            // we send form to the back end
            fetch("/save-profile-changes", {
                method: "POST",
                body: JSON.stringify( form ),
              }).then(() => {

                // navigate back to user home page
                navigate('/user_home');
              }
            );


        }
    }

    return (
        <div className='center'>
            <h1>Account. { current_user.preferred_name }.</h1>
            <Form className="formSubmission">
                <Form.Group controlId='preferred_name'>
                    <Form.Label>Preferred Name</Form.Label>
                    <Form.Control
                        type='text'
                        value={form.preferred_name}
                        onChange={(e) => setField('preferred_name', e.target.value)}
                        isInvalid={!!errors.preferred_name}
                    ></Form.Control>
                    <Form.Control.Feedback type='invalid'>
                        { errors.preferred_name }
                    </Form.Control.Feedback>
                </Form.Group>

                <p>Allergies</p>
                <Multiselect selectedValues={form.allergies} onSelect={setAllergies} onRemove={setAllergies} showArrow options={allergies} isObject={false} />

                { (Object.keys(form.user_addresses).length > 1) ? (
                    getAddresses().map(function(address, index) {
                        return <div key={index} className={'center_cards'}>
                                <AddressCards
                                    index={index}
                                    id={address}
                                    address_name={form.user_addresses[address].address_name}
                                    city={form.user_addresses[address].city}
                                    address={form.user_addresses[address].address}
                                    zipcode={form.user_addresses[address].zipcode}
                                /></div>;
                    })
                ) : (null) }

                <p style={{ clear: 'both' }}></p>
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
                    <button className={'btn btn-success'} onClick={saveNewAddress}>
                        {(Object.keys(form.user_addresses).length === 1) ? 'Save Address' : 'Save Another Address'}
                    </button>
                </Form.Group>
                : null }

                <Form.Group>
                    <Button
                        type='submit'
                        onClick={handleSubmit}
                        className='my-2'
                        variant='primary'>save Changes</Button>
                </Form.Group>
            </Form>
        </div>
    );
}