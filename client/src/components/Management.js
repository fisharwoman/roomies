import React from 'react';
import AddHouseForm from "./AddHouseForm";
import Button from "react-bootstrap/Button";
import './Management.css';
import HouseholdManagementHouse from "./HouseholdManagementHouse";


export default class Management extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddCollapsible: false,
            householdComponents: []
        };
        this.onAddClick = this.onAddClick.bind(this);
        this.addNewHouse = this.addNewHouse.bind(this);
    }

    render() {
        return (
            <div>
                <div className={"Hop"}>
                    <h2 className={'title'}>Households</h2>
                    <Button className={'ab'} variant={"outline-success"}
                            onClick={this.onAddClick.bind(this)}>Add</Button>
                    {this.state.showAddCollapsible ?
                        <AddHouseForm addNew={this.addNewHouse}/> :
                        null
                    }
                </div>
                <div className={'contentPanel'}>
                    {this.state.householdComponents}
                </div>
            </div>
        );
    }

    // used for table display
    async componentDidMount() {
        let data = await this.generateHouseholdComponents();
        this.setState({
            householdComponents: data
        });
    }

    // used for table display
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
            // console.log(JSON.stringify(data));
            data = data.map((value) => {
                return <HouseholdManagementHouse key={value.houseid} house={value}
                                                 removeHousehold={this.removeHousehold.bind(this)}/>
            });
            // this.setState({householdComponents: data});
            // console.log(JSON.stringify(data));
            return data;
        } catch (e) {
            console.log(e.message);
        }
    }

    // used for table display
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
                const resp = await fetch(`/users/${value.userid}`, {
                    method: 'GET'
                });
                let d = await resp.json();
                d = d.name;
                return d;
            }));
            return data;
        } catch (e) {
            throw e;
        }
    }

    // used for table display
    async getRooms(houseid) {
        try {
            const response = await fetch(`/households/${houseid}/rooms`, {
                method: "GET"
            });
            let data = await response.json();
            data = data.map((value) => {
                // console.log(data);
                return value.roomname;

            });
            return data;
        } catch (e) {
            throw e;
        }
    }

    // used for table display
    async getHouseholds() {
        try {
            const response = await fetch('/households/', {
                method: 'GET',
                headers: {
                    "content-type": 'application/json'
                }
            });
            let data = await response.json();
            // console.log(response);
            // console.log(data);
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
        } catch (e) {
            throw e;
        }
    }

    // todo currently not working for deleting user added houses due to problem in add (post) household
    // removes a household via DELETE api call
    async removeHousehold(houseid) {
        let userid = window.sessionStorage.getItem('userid');
        try {
            let response = await fetch(`/households/${houseid}/roommates/${userid}`, {
                method: "DELETE",
                headers: {
                    'content-type': 'application/json'
                }
            });
            if (response.status === 200) {
                let data = await this.generateHouseholdComponents();
                this.setState({
                    householdComponents: data
                });
            } else {
                alert("Error. This household could not be removed.");
            }
        } catch (e) {
            alert("Error. System error for removing household.");
            throw e;
        }
    }

    // toogles add household collapsible
    onAddClick() {
        this.setState(prevState => ({
            showAddCollapsible: !prevState.showAddCollapsible
        }));
    }

    // adds newly generated household component obj to household component
    async addNewHouse(newaddr, newname) {
        try {
            await this.addHouseAPI(newaddr, newname);
            let data = await this.generateHouseholdComponents();
            this.setState({
                householdComponents: data
            });
        } catch (e) {
            alert("Error. System error for adding household.");
        }
    }

    // todo this is not hooking up properly to backend
    // makes the api call for adding a household
    async addHouseAPI(address, name) {
        try {
            let userid = window.sessionStorage.getItem('userid');
            const response = await fetch(`/households/`, {
                method: "POST",
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify({address: address, name: name})
            });
            let data = await response.json();
            await fetch(`/households/${data.hid}/roommates/${userid}`,{
                method: 'POST',
                header:{
                    'content-type': 'application/json'
                }
            });
            return data.hid;

        } catch (e) {
            console.log(e);
            throw e;
        }
    }

}
