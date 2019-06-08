import React from 'react';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './Management.css';
import AddRoomForm from "./AddRoomForm";


/**
 * A component to encapsulate one manageable household
 */

export default class HouseholdManagementHouse extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            houseName: this.props.house.name ? this.props.house.name : "House Name",
            address: this.props.house.address,
            roommates: this.props.house.roommates,
            rooms: this.props.house.rooms,
            houseid: this.props.house.houseid,
            roommateid: window.sessionStorage.getItem('userid'),
            roomname: "",
            showAddRoomForm: false
        }
        this.handleAddRoom= this.handleAddRoom.bind(this); // possibly need this TODO
    }

// this.handleRemoveHH(this.state.houseid, this.state.roommateid)
    render() {
        return (
            <div id={'houseComponent'}>
                <Row>
                    <Col>
                        <h3>{this.state.houseName}
                            <br/>
                            <Button variant={"outline-dark"} className={"hh"}
                                    onClick={() => this.props.removeHousehold(this.state.houseid)}>Remove</Button>
                            <Button variant={"outline-dark"} className={"hh"}
                                    onClick={this.handleEditHH.bind()}>Edit</Button></h3>
                        <p>{this.state.address}</p>
                    </Col>
                    <Col>
                        <Table hover size={'sm'}>
                            <thead>
                            <tr>
                                <th>Roommates</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.makeRoommates()}
                            </tbody>
                            <tfoot>
                            <tr>
                                <td><Button variant={"outline-dark"} onClick={this.handleAddRoommate}>Add
                                    Roommate</Button></td>
                            </tr>
                            </tfoot>
                        </Table>
                    </Col>
                    <Col>
                        <Table hover size={'sm'}>
                            <thead>
                            <tr>
                                <th>Rooms</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.makeRooms()}
                            </tbody>
                            <tfoot>
                            <tr>
                                <td><Button variant={"outline-dark"} onClick={this.handleAddRoom.bind(this)}>Add Room</Button></td>
                            </tr>
                            {this.state.showAddRoomForm ?
                                <AddRoomForm/> :
                                null
                            }
                            </tfoot>
                        </Table>
                    </Col>
                </Row>
            </div>
        )
    }

    makeRoommates() {
        return this.state.roommates.map((value, key) => {
            return (
                <tr key={key}>
                    <td>
                        {value}
                    </td>
                </tr>
            );
        });
    }

    makeRooms() {
        return this.state.rooms.map((value, key) => {
            return (
                <tr key={key}>
                    <td>{value}<Button
                        size={'sm'}
                        className={'remove'}
                        variant={"outline-danger"}
                        onClick={this.handleRemoveRoom.bind(this, value)}>Remove</Button>
                    </td>
                </tr>
            );
        });
    }

    //households/:houseID/rooms/:roomName
    async handleRemoveRoom(roomname) {
        try {
            await fetch(`/households/${this.state.houseid}/rooms/${roomname}`, {
                method: "DELETE"
            });
            let rooms = this.state.rooms;
            for (let i in rooms) {
                if (rooms[i] === roomname) {
                    rooms.splice(i, 1);
                    break;
                }
            }
            this.setState({rooms: rooms});
        } catch (e) {
            throw e;
        }
    }

    handleAddRoommate() {
        // alert("Attempting to add a roommate");
        // console.log("Attempting to add a roommate");
    }

    // displays a form that shows upon click of add room button
    // takes in a room name
    // has submit button for on click events
    handleAddRoom() {
        // alert("add room pressed");
        this.handleAddRoomClick()
        let roomname = "Cafe";
        let houseid = this.state.houseid;
        this.addRoom(houseid, roomname);
    }

    handleAddRoomClick() {
        this.setState(prevState => ({
            showAddRoomForm: !prevState.showAddRoomForm
        }));
    }

    // alright, this hard-coded kind of works upon refresh...
    // need to get house id from the current table
    // need to get roomname from the user input form
    // need to make a user input form
    // on submit, send user input "roomname" as param to this function
    // households/:houseID/rooms/:roomName
    async addRoom(houseid, roomname) {
        // alert("Attempting to add a room");
        // houseid = this.state.houseid; // hardcoded for testing
        // roomname = "Office";
        try {
            const response = await fetch(`/households/${houseid}/rooms/${roomname}`, {
                method: "POST",
                headers: {
                    "content-type": 'application/json'
                }
            });
            // let data = await response.json();
            // data = data.map((value) => {
            //      console.log(data);
            //     console.log(value.roomname);
            // });
            // return data;
        } catch (e) {
            throw e;
        }
    }


    // households/:houseID/roommates/:roommateID
    async handleRemoveHH() {
        // let userid = window.sessionStorage.getItem('userid');
        // try {
        //     let response = await fetch(`/households/${this.state.houseid}/roommates/${userid}`, {
        //         method: "DELETE",
        //         headers: {
        //             'content-type': 'application/json'
        //         }
        //     });
        //     this.props.update();
        // } catch (e) {
        //     throw e;
        // }
        this.props.removeHousehold.bind(this.props.houseid);
    }

    handleEditHH() {
        alert("action edit");
    }

}
