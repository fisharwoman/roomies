import React, {Component} from 'react';
import {Button, Collapse} from 'react-bootstrap';
import Form from "react-bootstrap/Form";
import HouseholdManagementHouse from "./HouseholdManagementHouse";

class AddRoomForm extends Component{
    state={
        roomname: null
    };

    handleAddNewRoom(){

    }

    render(){
        return (
            <td className="add-room-form">
                <row>
                Add a Room <br/>
                <label htmlFor={"roomname"}>Room Name: &nbsp;&nbsp; </label>
                <input type={"text"} name={"roomname"} placeholder={"room name goes here"}
                       onChange={event => {this.setState({roomname: event.target.value})}}/>
                <input type={"button"} name={"submitAddForm"} value={"+"} onClick={this.handleAddNewRoom} />
                </row>
            </td>
        );
    }


}

export default AddRoomForm
