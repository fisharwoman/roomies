import React from 'react';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/**
 * A component to encapsulate one manageable household
 */

export default class HouseholdManagementHouse extends React.Component {

    constructor(props) {
        super(props);
        console.log(props.house);
        this.state = {
            houseName: this.props.house.name ? this.props.house.name : "House Name",
            address: this.props.house.address,
            roommates: this.props.house.roommates,
            rooms: this.props.house.rooms,
            houseid: this.props.house.houseid
        }
    }


    render() {
        return (
            <div>
                <Row>
                    <Col>
                        <h3>{this.state.houseName}</h3>
                        <p>{this.state.address}</p>
                    </Col>
                    <Col>
                        <Table>
                            {this.makeRoommates()}
                            <tr><input type={"button"} value={"Add"} onClick={this.handleAddRoommate}/></tr>
                        </Table>
                    </Col>
                    <Col>
                        <ul>{this.makeRooms()}</ul>
                        <input type={"button"} value={"Add Room"} onClick={this.handleAddRoom}/>
                    </Col>
                </Row>
            </div>
        )
    }

    makeRoommates() {
        return this.state.roommates.map((value, key) => {
            return (
                <tr key={key}>
                    {value}
                </tr>
            );
        });
    }

    makeRooms() {
        return this.state.rooms.map((value, key) => {
            return (
                <li key={key}>
                    {value}
                    <input type={"button"} value={"Remove"} onClick={this.handleRemoveClick.bind(this)}/>
                </li>
            );
        });
    }

    handleRemoveClick() {
        alert("You tried to delete a room");
    }

    handleAddRoommate() {
        alert("Attempting to add a roommate");
    }

    handleAddRoom() {
        alert("Attempting to add a room");
    }
}