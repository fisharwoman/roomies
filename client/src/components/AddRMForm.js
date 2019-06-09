import React, {Component} from 'react';
import Form from "react-bootstrap/Form";

class AddRMForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            rmname: null,
            rmid: null
        };
        this.handleAddNewRM= this.handleAddNewRM.bind(this);
    }

    handleAddNewRM() {
        this.props.addNew(this.state.rmname, this.state.rmid);
    }

    // API Adds the roommate of specified ID to the household of specified ID
    render() {
        return (

                <Form className="form">
                    Add a Roommate <br/>
                    <label htmlFor={"Name"}>Roommate Name: &nbsp;&nbsp; </label>
                    <input type={"text"} name={"rmname"}
                           onChange={event => {
                               this.setState({rmname: event.target.value})
                           }}/> <br/>
                    <label htmlFor={"Id"}>Roommate ID: &nbsp;&nbsp; </label>
                    <input type={"text"} name={"rmid"}
                           onChange={event => {
                               this.setState({rmid: event.target.value})
                           }}/> <br/>
                    <input type={"button"} name={"handleAddNewRM"} value={"+"}
                           onClick={this.handleAddNewRM}/> <br/>
                </Form>

        );
    }
}

export default AddRMForm
