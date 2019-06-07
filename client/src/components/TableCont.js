import React, {Component} from 'react';
import './Collapsible.css';
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/es/Row";
import Col from "react-bootstrap/Col";


class TableCont extends Component{

    renderRow(n){
        for (let i = 0; i < n; i++) {
            console.log("unsure how to do this in react....");
        }
    };

    render(){
        return(
            <div
                className= "table-cont">
                {/* hardcoded example of 2 tables side by side for each household.
                can wrap this part up in a container if needed.
                these are repetitive elements that should be rendered per household table,
                per row using some function.*/}
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
                {/* can wrap this part up in a container if needed */}
            </div>
        );
    }
}

export default TableCont
