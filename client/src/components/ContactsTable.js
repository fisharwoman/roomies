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
            houseid: 1, //todo
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
                            <tbody>{this.makeContacts()}</tbody>
                            <tfoot></tfoot>
                        </Table>

                    </Col>
                </Row>
            </div>
        )
    }
}
