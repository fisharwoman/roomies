import React from 'react';
import Collapsible from "./Collapsible";
import Button from "react-bootstrap/Button";
import './Management.css';
import divWithClassName from "react-bootstrap/es/utils/divWithClassName";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TableCont from './TableCont';


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
                <input type={"button"} className={"sb"} name={"SearchButton"} onClick={buttonAction.bind(this)}
                       value={"Search"}/>
                {this.state.showAddCollapsible ?
                    <Collapsible/> :
                    null
                }

            <TableCont/>



            </div>


        );


        function buttonAction() {
            console.log("button pressed console");
            alert("button pressed alert");
        }
    }

}
