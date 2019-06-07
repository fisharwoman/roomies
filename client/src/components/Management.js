import React from 'react';
import Collapsible from "./Collapsible";
import Button from "react-bootstrap/Button";
import './Management.css';
import HouseholdManagementHouse from "./HouseholdManagementHouse";
import RemovableContent from "./RemovableContent";


export default class Management extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddCollapsible: false,
            displayRemoveSelectables: false,
            householdComponents: [],
        };
        this.onAddClick = this.onAddClick.bind(this);
        this.onRemoveClick = this.onRemoveClick.bind(this);
    }

    onAddClick() {
        this.setState(prevState => ({
            showAddCollapsible: !prevState.showAddCollapsible
        }));
    }

    onRemoveClick() {
        this.setState(prevState => ({
            displayRemoveSelectables: !prevState.displayRemoveSelectables
        }));
    }

    render() {
        return (
            <div>
                <div className={"Hop"}>
                    <h2 className={'title'}>Households</h2>
                    <Button className={'ab'} variant={"outline-dark"} onClick={this.onAddClick.bind(this)}>Add</Button>
                    <Button className={'ab'} variant={"outline-dark"} onClick={this.onRemoveClick.bind(this)}>Remove</Button>
                    <Button className={'ab'} variant={"outline-dark"} onClick={buttonAction.bind(this)}>Edit</Button>
                    <Button className={'ab'} variant={"outline-dark"} onClick={buttonAction.bind(this)}>Search</Button>
                    {this.state.showAddCollapsible ?
                        <Collapsible/> :
                        null
                    }
                    {this.state.displayRemoveSelectables ?
                        <RemovableContent/> :
                        null
                    }
                </div>
                <div className={'contentPanel'}>
                    {this.state.householdComponents}
                </div>
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
        try {
            const response = await fetch(`/households/${houseid}/rooms`, {
                method: "GET"
            });
            let data = await response.json();
            data = data.map((value) => {
                return value.roomname;
            });
            return data;
        } catch (e) {throw e;}
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
