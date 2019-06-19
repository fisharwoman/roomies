import React, {Component} from 'react';
import {Form, Button} from "react-bootstrap";

class AddRoomForm extends Component{

    constructor(props) {
        super(props);

        this.state={
            roomname: null
        };
    }

    handleAddNewRoom = () => {
        // console.log(this.state.roomname);
        this.props.addNew(this.state.roomname);
    };

    render(){
        return (
            <Form className="form">
                Add a Room <br/>
                <Form.Group>
                    <Form.Label>Room Name: &nbsp;&nbsp; </Form.Label>
                    <Form.Control placeholder={"Enter the room name..."}
                           onChange={event => {this.setState({roomname: event.target.value})}}/>
                    <Button variant={'outline-primary'} onClick={this.handleAddNewRoom}>Add Room</Button>
                </Form.Group>
            </Form>
        );
    }


}

export default AddRoomForm
