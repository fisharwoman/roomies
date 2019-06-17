import React from 'react';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './Management.css';
import AddRoomForm from "./AddRoomForm";
import AddRMForm from "./AddRMForm";
import EditHouseForm from "./EditHouseForm"

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
            showAddRMForm: false,
            showEditHouseForm: false
        };
        //  console.log(JSON.stringify(this.state));
        this.handleAddRoom = this.handleAddRoom.bind(this); // may or may not need this
        this.addNewRoom = this.addNewRoom.bind(this);
        this.handleAddRM = this.handleAddRM.bind(this); // may not need this
        this.addNewRM = this.addNewRM.bind(this);
        this.editHouse = this.editHouse.bind(this);
    }


    // updates house address by calling the api and updating front end if successful
    async editHouse(newaddr) {
        try {
            let houseid = this.state.houseid;
            let resp = await this.patchHouse(newaddr, houseid);

            if (resp.status === 200) {
                this.setState(prevState => ({
                    address: newaddr
                }));
            } else {
                alert("Error. System error for editing household address.");
            }
        } catch(e){
            alert("Error.");
        }
    }

    // PATCH households/:houseID/ (for editing house address)
    async patchHouse(newaddr, houseid) {
        try {
            const response = await fetch(`/households/${houseid}/`, {
                method: "PATCH",
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify({address: newaddr})
            });
            console.log(response);
            return response;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    // toogles edit household form
    onEditClick() {
        this.setState(prevState => ({
            showEditHouseForm: !prevState.showEditHouseForm
        }));
    }

    render() {
        return (
            <div id={'houseComponent'}>
                <Row>
                    <Col>
                        <h3>{this.state.houseName}

                            <Button variant={"outline-danger"} className={"rh"}
                                    onClick={() => this.props.removeHousehold(this.state.houseid)}>Remove</Button>
                            <Button variant={"outline-info"} className={"eh"}
                                    onClick={this.onEditClick.bind(this)}>Edit</Button></h3>
                        <p>{this.state.address}</p>
                        {this.state.showEditHouseForm ?
                            <EditHouseForm editHouse={this.editHouse}/> :
                            null
                        }
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
                                <td><Button variant={"outline-success"} onClick={this.handleAddRM.bind(this)}>Add
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
                                <td><Button variant={"outline-success"} onClick={this.handleAddRoom.bind(this)}>Add
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
    async addNewRoom(newRoomName) {
        try {
            let houseid = this.state.houseid;
            console.log(houseid);
            let postResp = await this.addRoomAPI(houseid, newRoomName);
            if (postResp.status === 200) {
                this.setState((state => ({
                    rooms: state.rooms.concat([newRoomName]),
                    showAddRoomForm: false
                })))
            } else {
                alert("Error. This room has already been added.");
            }
        } catch (e) {
            alert("Error. Something unexpected happened in our system!");
        }

    }

    // POST households/:houseID/rooms/:roomName
    async addRoomAPI(houseid, roomname) {
        try {
            const response = await fetch(`/households/${houseid}/rooms/${roomname}`, {
                method: "POST",
                headers: {
                    "content-type": 'application/json'
                }
            });
            console.log(response);
            return response;
        } catch (e) {
            throw e;
        }
    }

    // GET RM name, POST RM to household database, display RM if success
    async addNewRM(rmid) {
        try {
            let rmname = await this.getRMName(rmid);
            let postResp = await this.postRMName(this.state.houseid, rmid);

            if (postResp.status === 200) {
                this.setState((state => ({
                    roommates: state.roommates.concat([rmname]),
                    showAddRMForm: false
                })));
            } else {
                alert("Error. This roommate has already been added."); // duplicate roommate, or roommate that doesn't exist
            }
        } catch (e) {
            alert("Error. This roommate doesn't exist in our system.")
        }
        // console.log(this.state.roommates);
    }

    // GET /user/:userID
    async getRMName(rmid) {
        try {
            console.log(rmid);
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
    async postRMName(houseid, rmid) {
        try {
            console.log(houseid, rmid);
            const response = await fetch(`/households/${houseid}/roommates/${rmid}`, {
                method: 'POST',
                headers: {
                    "content-type": 'application/json'
                }
            });
            console.log(response);
            return response;
        } catch (e) {
            throw e;
        }
    }

    handleAddRM() {
        this.setState(prevState => ({
            showAddRMForm: !prevState.showAddRMForm
        }));
    }


    // updates house address by calling the api and updating front end if successful
    async editHouse(newaddr) {
        try {
            let houseid = this.state.houseid;
            let resp = await this.patchHouse(newaddr, houseid);

            if (resp.status === 200) {
                this.setState(prevState => ({
                    address: newaddr,
                    showEditHouseForm: false
                }));
            } else {
                alert("Error. System error for editing household address.");
            }
        } catch(e){
            alert("Error.");
        }
    }

    // todo works in front end, returns status 200, but changes to undefined in db.
    // PATCH households/:houseID/ (for editing house address)
    async patchHouse(newaddr, houseid) {
        try {
            const response = await fetch(`/households/${houseid}/`, {
                method: "PATCH",
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify({Address: newaddr})
            });
            console.log(response);
            return response;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    // toogles edit household form
    onEditClick() {
        this.setState(prevState => ({
            showEditHouseForm: !prevState.showEditHouseForm
        }));
    }

}
