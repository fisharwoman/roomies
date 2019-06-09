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


    onAddClick() {
        this.setState(prevState => ({
            showAddCollapsible: !prevState.showAddCollapsible
        }));
    }


    render() {
        return (
            <div>
                <div className={"Hop"}>
                    <h2 className={'title'}>Households</h2>
                    <Button className={'ab'} variant={"outline-success"} onClick={this.onAddClick.bind(this)}>Add</Button>
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
           // console.log(JSON.stringify(data));
            data = data.map((value) => {
                return <HouseholdManagementHouse key={value.houseid} house={value} removeHousehold={this.removeHousehold.bind(this)}/>
            });
            this.setState({householdComponents: data});
            // console.log(JSON.stringify(data));

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
               // console.log(data);
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
        } catch (e) {throw e;}
    }

    async removeHousehold(houseid) {
        let userid = window.sessionStorage.getItem('userid');
        try {
            let response = await fetch(`/households/${houseid}/roommates/${userid}`, {
                method: "DELETE",
                headers: {
                    'content-type': 'application/json'
                }
            });
            await this.generateHouseholdComponents();
        } catch (e) {
            throw e;
        }
    }

    // adds newly generated household component obj to household component
    async addNewHouse(newaddr, newname) {
        // console.log("hhh:" + newaddr );
        // console.log("hhh:" + newname );

        let hid = await this.addHouseAPI(newaddr, newname);

        // console.log("HID"+hid);

        let o = {};
        o.address = newaddr;
        o.name = newname;
        o.roommates = [];
        o.rooms = [];
        o.houseid = hid;

        let data = [];
        data.push(o);

        data = data.map((value) => {
            return <HouseholdManagementHouse key={value.houseid} house={value} removeHousehold={this.removeHousehold.bind(this)} />
        });
        //console.log(JSON.stringify(data));

        this.setState((state)=>({
            householdComponents: this.state.householdComponents.concat(data)
        }));

        // console.log("DATA"+ JSON.stringify(this.state.householdComponents)); // can set hid properly now
    }

    // makes the api call for adding a household
    async addHouseAPI(address, name){
          //  console.log("add hh api call");
        try {
            const response = await fetch(`/households/`, {
                method: "POST",
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify({address: address, name: name})
            });
            let data = await response.json();
            return data.hid;

        } catch (e) {
            throw e;
        }

    }

}
