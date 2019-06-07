import React, {Component} from 'react';
import {Button, Collapse} from 'react-bootstrap';
import './Collapsible.css';
import Form from "react-bootstrap/Form";

class Collapsible extends Component{
    state={
        open:false,
        address: null,
        name: null,
        description: null
    };

    submitAddForm(){
        alert("form submitted");
    }

    render(){
        return(
            <div

                className= "container">
                <Form className="form">
                    Add a Household <br/>

                    <label htmlFor={"Address"}>Household Address: </label>
                    <input type={"text"} name={"address"} placeholder={"555 Some Street"}
                           onChange={event => {this.setState({address: event.target.value})}} /> <br/>

                    <label htmlFor={"Name"}>Household Name: </label>
                    <input type={"text"} name={"name"} placeholder={"My Household"}
                           onChange={event => {this.setState({name: event.target.value})}} /> <br/>

                    <label htmlFor={"Description"}>Household Description: </label>
                    <input type={"text"} name={"description"}
                           onChange={event => {this.setState({description: event.target.value})}} /> <br/>

                    <input type={"button"} name={"submitAddForm"} value={"+"}
                           onClick={this.submitAddForm.bind(this)} /> <br/>
                </Form>

                <Collapse in={this.state.open}>
                    <div>
                        <p>Content when the button is clicked</p>
                    </div>
                </Collapse>

            </div>
        );
    }
}

export default Collapsible
