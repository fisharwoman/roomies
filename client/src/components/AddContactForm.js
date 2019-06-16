import React, {Component} from 'react';
import {Button, Collapse} from 'react-bootstrap';
import './Form.css';
import Form from "react-bootstrap/Form";

class AddContactForm extends Component{

    constructor(props) {
        super(props);

        this.state={
            cname: null,
            cphone: null,
            crel: null,
            crm: null
        };
        this.handleAddNewContact=this.handleAddNewContact.bind(this);
    }

    handleAddNewContact() {
        this.props.addNew(this.state.cname, this.state.cphone, this.state.crel, this.state.crm);
    }

    render(){
        return(
            <div

                className= "container">
                <Form className="form">
                    Add a Contact <br/>
                    <label htmlFor={"cname"}>Contact Name: &nbsp;&nbsp; </label>
                    <input type={"text"} name={"cname"} placeholder={"John Doe"}
                           onChange={event => {this.setState({cname: event.target.value})}} /> <br/>
                    <label htmlFor={"cphone"}>Phone: &nbsp;&nbsp; </label>
                    <input type={"tel"} name={"cphone"} placeholder={"xxx-xxx-xxxx"}
                           onChange={event => {this.setState({cphone: event.target.value})}} /> <br/>
                    <label htmlFor={"crel"}>Relationship: &nbsp;&nbsp; </label>
                    <input type={"text"} name={"crel"}
                           onChange={event => {this.setState({crel: event.target.value})}} /> <br/>
                    <label htmlFor={"crm"}>Roommate: &nbsp;&nbsp; </label>
                    <input type={"text"} name={"crm"}
                           onChange={event => {this.setState({crm: event.target.value})}} /> <br/>
                    <input type={"button"} name={"handleAddNewContact"} value={"+"}
                           onClick={this.handleAddNewContact} /> <br/>
                </Form>

            </div>
        );
    }
}

export default AddContactForm
