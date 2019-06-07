import React, {Component} from "react";
import ReactDOM from 'react-dom';
import {
    Route,
    NavLink,
    HashRouter
} from "react-router-dom";

import Login from './Login';

import Home from "../components/Home";
import Calendar from "../components/Calendar";
import Contact from "../components/Contact";
import Expenses from "../components/Expenses";
import Management from '../components/Management';


import * as BootStrap from 'react-bootstrap';

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            households: [],
            userName: "User Name",
            selectedHousehold: {
                houseid: 0,
                address: "Address"
            }
        }
    }

    render() {

        return (
            <HashRouter>
                <div>
                    <BootStrap.Navbar bg="light" expand="lg">
                        <BootStrap.Navbar.Brand id={'brand'} href={'#home'}>Roomies</BootStrap.Navbar.Brand>
                        <BootStrap.Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <BootStrap.Navbar.Collapse id="basic-navbar-nav">
                            <BootStrap.Nav className="mr-auto">
                                <BootStrap.Nav.Link active={true} href="#dashboard">Dashboard</BootStrap.Nav.Link>
                                <BootStrap.Nav.Link href="#contact">Contacts</BootStrap.Nav.Link>
                                <BootStrap.Nav.Link href="#expenses">Expenses</BootStrap.Nav.Link>
                                <BootStrap.Nav.Link href="#calendar">Calendar</BootStrap.Nav.Link>
                                <BootStrap.Nav.Link href="#management">Manage House</BootStrap.Nav.Link>
                            </BootStrap.Nav>
                            <BootStrap.DropdownButton alignRight variant={'light'} title={this.state.selectedHousehold.address} id="dropdown-basic-button">
                                {this.makeHouseholds()}
                            </BootStrap.DropdownButton>
                            <BootStrap.DropdownButton alignRight title={this.state.userName}>
                                <BootStrap.Dropdown.Item key={0}>Manage Households...</BootStrap.Dropdown.Item>
                                <BootStrap.Dropdown.Item key={1} onClick={this.logout}>Logout</BootStrap.Dropdown.Item>
                            </BootStrap.DropdownButton>

                        </BootStrap.Navbar.Collapse>
                    </BootStrap.Navbar>

                    <div className="content">
                        <Route exact path="/dashboard" component={Home}/>
                        <Route path="/calendar" component={Calendar}/>
                        <Route path="/contact" component={Contact}/>
                        <Route path={'/expenses'} component={Expenses}/>
                        <Route path={'/management'} component={Management}/>

                    </div>

                </div>


            </HashRouter> // foundation for the navigation and browser history handling
        );
    }

    async componentDidMount() {
        try {
            let data = await this.getHouseholds();
            let name = await this.getUserName();
            this.setState({
                households: data,
                userName: name,
                selectedHousehold: data[0]
            })
        } catch (e) {
            console.log(e.message);
        }
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

    async getUserName() {
        try {
            let userid = window.sessionStorage.getItem('userid');
            const response = await fetch(`/users/${userid}`, {
                method: 'GET',
                headers: {
                    "content-type": 'application/json'
                }
            });
            let data = await response.json();
            return data.name;
        } catch (e) {throw e;}
    }

    makeHouseholds() {
        let result = [];
        result.push(<BootStrap.Dropdown.Item key={-2}>Add Household...</BootStrap.Dropdown.Item>);
        result.push(<BootStrap.Dropdown.Divider key={-1}/>);
        let key = 0;
        this.state.households.forEach((value) => {
            result.push(<BootStrap.Dropdown.Item key={key} eventKey={key} onSelect={(evt) => this.switchHousehold(evt)}>{value.address}</BootStrap.Dropdown.Item>);
            key++;
        });
        return result;
    }

    async logout() {
        try {
            const response = await fetch('/auth/logout', {
                method: 'GET',
                headers: {
                    "content-type": 'application/json'
                }
            });
            if (response.status === 200) {
                ReactDOM.render(<Login/>,document.getElementById('root'));
            }
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Switches the currently selected household!!!
     * @param key
     */
    switchHousehold(key) {
        this.setState(
            {
                selectedHousehold: this.state.households[key]
            }
        )
    }

}

