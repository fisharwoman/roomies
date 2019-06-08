import React from 'react';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './Management.css';
import Management from "./Management";

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
            roomname: "living room"
        }
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
                                    onClick={this.handleRemoveHH.bind(this.state.houseid, this.state.roommateid)}>Remove</Button>
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
                                <td><Button variant={"outline-dark"} onClick={this.handleAddRoom}>Add Room</Button></td>
                            </tr>
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
                        onClick={this.handleRemoveRoom.bind(this, this.state.houseid, value)}>Remove</Button>
                    </td>
                </tr>
            );
        });
    }

    handleEditHH() {
        alert("action edit");
    }

    //households/:houseID/rooms/:roomName
    async handleRemoveRoom(houseid, godd) {

        try {
            var test = await fetch(`/households/${houseid}/rooms/${godd}`, {
                method: "DELETE"
            });
            console.log(test);
        } catch (e) {
            throw e;
        }
    }

    handleAddRoommate() {
        alert("Attempting to add a roommate");
    }

    handleAddRoom() {
        alert("Attempting to add a room");
    }

    // households/:houseID/roommates/:roommateID
    async handleRemoveHH(houseid, roommateid) {
        alert("on delete");
        // roommate id is an object
        let userid = window.sessionStorage.getItem('userid');
        // console.log(userid); // returns 204 success but db does not change
        try {
            await fetch(`/households/${houseid}/roommates/${userid}`, {
                method: "DELETE"
            });
        } catch (e) {
            throw e;
        }
    }
}
