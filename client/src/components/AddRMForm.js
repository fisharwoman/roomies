import React, {Component} from 'react';
import {Form, Button} from "react-bootstrap";

class AddRMForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            // rmname: null,
            roommateEmail: null
        };
    }

    handleAddNewRM = () => {
        this.props.addNew(this.state.roommateEmail); //this.state.rmname
    }

    // API Adds the roommate of specified ID to the household of specified ID
    //  <label htmlFor={"Name"}>Roommate Name: &nbsp;&nbsp; </label>
    //                     <input type={"text"} name={"rmname"}
    //                            onChange={event => {
    //                                this.setState({rmname: event.target.value})
    //                            }}/> <br/>
    render() {
        return (
                <Form className="form">
                    Add a Roommate <br/>
                    <Form.Group>
                        <Form.Label>Roommate Email: &nbsp;&nbsp; </Form.Label>
                        <Form.Control type={"email"}
                               onChange={event => {
                                   this.setState({roommateEmail: event.target.value})
                               }}/>
                        <Button variant={'outline-primary'} onClick={this.handleAddNewRM}>Add Room</Button>
                    </Form.Group>
                </Form>
        );
    }
}

export default AddRMForm
