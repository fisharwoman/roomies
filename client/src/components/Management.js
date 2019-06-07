import React from 'react';
import Collapsible from "./Collapsible";
import Button from "react-bootstrap/Button";
import './Management.css';
import divWithClassName from "react-bootstrap/es/utils/divWithClassName";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


export default class Management extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddCollapsible: false,
        };
        this.onAddClick = this.onAddClick.bind(this);
    }

    onAddClick() {
        this.setState(prevState => ({
            showAddCollapsible: !prevState.showAddCollapsible
        }));
    }

    render() {
        return (
            <div className={"Hop"}>
                Households
                <input type={"button"} className={"ab"} name={"AddButton"} onClick={this.onAddClick.bind(this)}
                       value={"Add"}/>
                <input type={"button"} className={"eb"} name={"EditButton"} onClick={buttonAction.bind(this)}
                       value={"Edit"}/>
                <input type={"button"} className={"rb"} name={"RemoveButton"} onClick={buttonAction.bind(this)}
                       value={"Remove"}/>
                {this.state.showAddCollapsible ?
                    <Collapsible/> :
                    null
                }

                {/* The following section is an example of displaying 2 single-column tables side by side.
                I think that we could write loops or something to populate them from our database.
                But this is kind of painful so maybe there is a better way?
                */}
                <Container>
                    <Row> Household 1 <br/> </Row>
                    <Row>
                        <Col>
                            <Table border hover size="sm">
                                <thead>
                                <tr>
                                    <th>Roommates</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>1</td>

                                </tr>
                                <tr>
                                    <td>2</td>

                                </tr>
                                <tr>
                                    <td>3</td>
                                </tr>
                                </tbody>
                            </Table>
                        </Col>
                        <Col>
                            <Table  border hover size="sm">
                                <thead>
                                <tr>
                                    <th>Rooms</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>1</td>

                                </tr>
                                <tr>
                                    <td>2</td>

                                </tr>
                                <tr>
                                    <td>3</td>
                                </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row>

                    <Row> Household 2 <br/> </Row>
                    <Row>
                        <Col>
                            <Table  border hover size="sm">
                                <thead>
                                <tr>
                                    <th>Roommates</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>1</td>

                                </tr>
                                <tr>
                                    <td>2</td>

                                </tr>
                                <tr>
                                    <td>3</td>
                                </tr>
                                </tbody>
                            </Table>
                        </Col>
                        <Col>
                            <Table  border hover size="sm">
                                <thead>
                                <tr>
                                    <th>Rooms</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>1</td>

                                </tr>
                                <tr>
                                    <td>2</td>

                                </tr>
                                <tr>
                                    <td>3</td>
                                </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
                {/* End of table container. */}

            </div>


        );


        function buttonAction() {
            console.log("button pressed console");
            alert("button pressed alert");
        }
    }

}
