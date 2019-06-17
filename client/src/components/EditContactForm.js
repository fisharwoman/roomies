import React, {Component} from 'react';
import Form from "react-bootstrap/Form";
import './Contact.css';

class EditContactForm extends Component{

    constructor(props) {
        super(props);

        this.state={
            cid:this.props.cid,
            newPhone: null
        };
        this.handleEditPhone=this.handleEditPhone.bind(this);
    }

    handleEditPhone(){
       this.props.editContact(this.state.cid,this.state.newPhone);
    }

    // edit contact's phone number
    render(){
        return (
            <Form className="edit-contact-form">
                Edit a Contact <br/>
                <label htmlFor={"newPhone"}>New Phone Number: &nbsp;&nbsp; </label>
                <input type={"text"} name={"newPhone"} placeholder={"xxx-xxx-xxxx"}
                       onChange={event => {this.setState({newPhone: event.target.value})}}/>
                <input type={"button"} name={"handleEditPh"} value={"+"} onClick={this.handleEditPhone} />
            </Form>
        );
    }
}

export default EditContactForm
