import React from 'react';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './Management.css';
import AddRoomForm from "./AddRoomForm";
import AddRMForm from "./AddRMForm";


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
            showAddRoomForm: false,
            showAddRMForm: false
        };
        //  console.log(JSON.stringify(this.state));
        this.handleAddRoom = this.handleAddRoom.bind(this); // may or may not need this
        this.addNewRoom = this.addNewRoom.bind(this);
        this.handleAddRM = this.handleAddRM.bind(this); // may not need this
        this.addNewRM = this.addNewRM.bind(this);
    }

    // first get RM Name from user id
    // GET RM NAME USING GET /user/:userID
    // then post RM to household database using
    // then add UserName to display (Q: roommates = [] of string rm names)?
    async addNewRM(rmid) {
        let rmname = await this.getRMName(rmid);
        this.postRMName(this.state.houseid, rmid);

        // todo make sure that if duplicate, the front end also doesn't add and alerts error
        this.setState((state => ({
            roommates: state.roommates.concat([rmname]) // this is client side
        })));
        // console.log(this.state.roommates);
    }

    // makes a GET request for rm name given rmid,
    // then makes a POST request to add rm to Household
    async getRMName(rmid) {
        try {
            const response = await fetch(`/users/${rmid}`, {
                method: 'GET',
                headers: {
                    "content-type": 'application/json'
                }
            });
            let data = await response.json();
            console.log(data.name);
            return data.name;
        } catch (e) {
            throw e;
        }
    }

    // POST households/:houseID/roommates/:roommateID
    async postRMName(houseid, rmid){
        try {
            console.log(houseid, rmid);
            const response = await fetch(`/households/${houseid}/roommates/${rmid}`, {
                method: 'POST',
                headers: {
                    "content-type": 'application/json'
                }
            });
            console.log(response);
        } catch (e) {throw e;}
    }


    handleAddRM() {
        this.setState(prevState => ({
            showAddRMForm: !prevState.showAddRMForm
        }));
    }

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
                                <td><Button variant={"outline-dark"} onClick={this.handleAddRM.bind(this)}>Add
                                    Roommate</Button></td>
                            </tr>
                            </tfoot>
                        </Table>
                        {this.state.showAddRMForm ?
                            <AddRMForm addNew={this.addNewRM}/> :
                            null
                        }
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
                                <td><Button variant={"outline-dark"} onClick={this.handleAddRoom.bind(this)}>Add
                                    Room</Button></td>
                            </tr>
                            </tfoot>
                        </Table>
                        {this.state.showAddRoomForm ?
                            <AddRoomForm addNew={this.addNewRoom}/> :
                            null
                        }
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

    // shows the collapsible form
    handleAddRoom() {
        this.setState(prevState => ({
            showAddRoomForm: !prevState.showAddRoomForm
        }));
    }

    // makes the api call and if successful adds new room name to frontend table display
    addNewRoom(newRoomName) {
        let houseid = this.state.houseid; // todo houseid for adding rooms
        this.addRoomAPI(houseid, newRoomName);

        // todo add an if statement here for possible error handling
        this.setState((state => ({
            rooms: state.rooms.concat([newRoomName])
        })))
    }

    // households/:houseID/rooms/:roomName
    // does the actual api call for adding rooms
    async addRoomAPI(houseid, roomname) {
        try {
            const response = await fetch(`/households/${houseid}/rooms/${roomname}`, {
                method: "POST",
                headers: {
                    "content-type": 'application/json'
                }
            });
            console.log(response);
        } catch (e) {
            throw e;
        }
    }

    // don't think this is needed anymore
    // households/:houseID/roommates/:roommateID
    async handleRemoveHH() {
        this.props.removeHousehold.bind(this.props.houseid);
    }

    handleEditHH() {
        alert("action edit");
    }

}
