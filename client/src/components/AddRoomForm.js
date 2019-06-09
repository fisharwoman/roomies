import React, {Component} from 'react';
import Form from "react-bootstrap/Form";

class AddRoomForm extends Component{

    constructor(props) {
        super(props);

        this.state={
            roomname: null
        };
        this.handleAddNewRoom = this.handleAddNewRoom.bind(this);
    }

    handleAddNewRoom(){
        // console.log(this.state.roomname);
        this.props.addNew(this.state.roomname);
    }

    render(){
        return (
            <Form className="add-room-form">
                Add a Room <br/>
                <label htmlFor={"roomname"}>Room Name: &nbsp;&nbsp; </label>
                <input type={"text"} name={"roomname"} placeholder={"room name goes here"}
                       onChange={event => {this.setState({roomname: event.target.value})}}/>
                <input type={"button"} name={"handleNewAddRoom"} value={"+"} onClick={this.handleAddNewRoom} />
            </Form>
        );
    }


}

export default AddRoomForm
