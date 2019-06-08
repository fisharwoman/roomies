import React, {Component} from 'react';
import {Button, Collapse} from 'react-bootstrap';
import Form from "react-bootstrap/Form";
import HouseholdManagementHouse from "./HouseholdManagementHouse";

class AddRoomForm extends Component{

    constructor(props) {
        super(props);

        this.state={
            roomname: null
        };
        this.handleAddNewRoom = this.handleAddNewRoom.bind(this);
    }

    handleAddNewRoom(){
        console.log(this.state.roomname);
        this.props.addNew(this.state.roomname);
    }

    render(){
        return (
            <div className="add-room-form">

                Add a Room <br/>
                <label htmlFor={"roomname"}>Room Name: &nbsp;&nbsp; </label>
                <input type={"text"} name={"roomname"} placeholder={"room name goes here"}
                       onChange={event => {this.setState({roomname: event.target.value})}}/>
                <input type={"button"} name={"submitAddForm"} value={"+"} onClick={this.handleAddNewRoom} />

            </div>
        );
    }


}

export default AddRoomForm
