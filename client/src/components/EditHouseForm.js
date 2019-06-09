import React, {Component} from 'react';
import Form from "react-bootstrap/Form";
import './Management.css';

class EditHouseForm extends Component{

    constructor(props) {
        super(props);

        this.state={
            newaddr: null
        };
        this.handleEditAddr=this.handleEditAddr.bind(this);
    }

    handleEditAddr(){
        this.props.editHouse(this.state.newaddr);
    }

    // this should also change a house name?
    render(){
        return (
            <Form className="edit-house-form">
                Edit a Household <br/>
                <label htmlFor={"newaddr"}>New Address: &nbsp;&nbsp; </label>
                <input type={"text"} name={"roomname"}
                       onChange={event => {this.setState({newaddr: event.target.value})}}/>
                <input type={"button"} name={"handleEditAddr"} value={"+"} onClick={this.handleEditAddr} />
            </Form>
        );
    }
}

export default EditHouseForm
