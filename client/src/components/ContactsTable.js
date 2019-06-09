import React from "react";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import './Contact.css';

export default class ContactsTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            houseid: null,
            contacts: []
        }
    }

    // todo populates each row in the contacts table?
    makeContacts() {
            return (
                <tr >
                    <td>
                        col 1
                    </td>
                    <td>
                        col 2
                    </td>
                    <td>
                       col 3
                    </td>
                    <td>
                       col 4
                    </td>
                </tr>
        );
    }

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
                            <tbody> {this.makeContacts()} </tbody>
                            <tfoot></tfoot>
                        </Table>

                    </Col>
                </Row>
            </div>
        )
    }
}
