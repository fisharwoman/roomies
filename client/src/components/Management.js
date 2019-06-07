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
import HouseholdManagementHouse from "./HouseholdManagementHouse";


export default class Management extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddCollapsible: false,
            householdComponents: [],
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
            <div>
                <h2>Households</h2>
                <div className={"Hop"}>
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
                </div>
                {this.state.householdComponents}
            </div>


        );


        function buttonAction() {
            console.log("button pressed console");
            alert("button pressed alert");
        }
    }

    async componentDidMount() {
        await this.generateHouseholdComponents();
    }

    async generateHouseholdComponents() {
        try {
            let data = await this.getHouseholds();
            data = await Promise.all(data.map(async (value) => {
                let roommates = await this.getRoommates(value.houseid);
                let rooms = await this.getRooms(value.houseid);
                value.roommates = roommates;
                value.rooms = rooms;
                return value;
            }));
            data = data.map((value, key) => {
                return <HouseholdManagementHouse key={key} house={value}/>
            });
            this.setState({householdComponents: data});
        } catch (e) {
            console.log(e.message);
        }
    }

    async getRoommates(houseid) {
        try {
            const response = await fetch(`/households/${houseid}/roommates`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json'
                }
            });
            let data = await response.json();
            data = Promise.all(data.map(async (value) => {
                const resp = await fetch(`/users/${value.roommateid}`, {
                    method: 'GET'
                });
                let d = await resp.json();
                d = d.name;
                return d;
            }));
            return data;
        } catch (e) {throw e;}
    }
    async getRooms(houseid) {
        return Promise.resolve([]);
    }

    async getHouseholds() {
        try {
            const response = await fetch('/households/', {
                method: 'GET',
                headers: {
                    "content-type": 'application/json'
                }
            });
            let data = await response.json();
            data = await Promise.all(data.map(async (value) => {
                const r = await fetch(value, {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json'
                    }
                });
                const d = await r.json();
                return d;
            }));
            return data;
        } catch (e) {throw e;}
    }

}
