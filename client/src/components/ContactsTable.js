import React from "react";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";

export default class ContactsTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            houseid: null
        }
    }

    makeContacts() {
        return (
            <div>Hi</div>
        )
    }

    render() {
        return (
            <div id={'houseComponent'}>
                <Row>
                    <Col>
                        <Table hover size={'sm'}>
                            <thead>
                            <tr>
                                <th>Contacts</th>
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
