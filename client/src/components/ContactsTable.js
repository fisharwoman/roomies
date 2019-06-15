import React from "react";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import './Contact.css';
import HouseholdManagementHouse from "./Management";

export default class ContactsTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedHouseholdId: this.props.selectedHousehold.houseid,
            contacts: []
        }
    }

    // this seems to work
    // GET contacts listing based on householdID. .get('/houses/:houseID'
    async getContactsFromHouse(houseid) {
        try {
            const response = await fetch(`/contacts/houses/${houseid}`, {
                method: "GET"
            });
            let data = await response.json();
            console.log("CONTACTS FROM HOUSE " + JSON.stringify(data));
            console.log(response);
            return data;
        } catch (e) {
            throw e;
        }
    }

    // this works but i don't think we will need it
    // GET contacts info from contact id .get('/:contactsID'
    async getEachContact(contactsid) {
        try {
            const response = await fetch(`/contacts/${contactsid}`, {
                method: "GET"
            });
            let data = await response.json();
            data = data.map((value) => {
                console.log("EACH CONTACT " + JSON.stringify(data));
            });
            console.log(response);
            return data;
        } catch (e) {
            throw e;
        }
    }


    async componentWillMount() {
        let data = await this.getContactsFromHouse(this.state.selectedHouseholdId);
        this.setState({contacts: data});

    }

    // first i need to do an api call to get the contacts info for the correct household
    // then add it to an object or array to store the info
    // then use the info to make each row
    // append rows together into a table? or loop? or recurse
    // make buttons work for add, edit, remove


    render() {
        return (
            <div id={'contactsTable'}>
                <Row>
                    <Col>
                        <Table hover size={'sm'}>
                            <thead>
                            <tr>
                                <th>Contact Name</th>
                                <th>Phone Number</th>
                                <th>Relationship</th>
                                <th>Owner</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.contacts.map((row, index) => (
                                <tr key={index}>
                                    <td key={row.name}>{row.name}</td>
                                    <td key={row.phoneno}>{row.phoneno}</td>
                                    <td key={row.relationship}>{row.relationship}</td>
                                    <td key={row.listedby}>{row.listedby}</td>
                                </tr>
                            ))}
                            </tbody>

                            <tfoot></tfoot>
                        </Table>

                    </Col>
                </Row>
            </div>
        )
    }
}
