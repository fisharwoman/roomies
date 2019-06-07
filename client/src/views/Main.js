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
            households: []
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
                            <BootStrap.DropdownButton drop={'down'} variant={'outline-dark'} title="Select House" id="dropdown-basic-button">
                                {this.makeHouseholds()}
                            </BootStrap.DropdownButton>
                            <BootStrap.Button variant={'outline-dark'} onClick={this.logout}>Logout</BootStrap.Button>

                            {/*<BootStrap.Form inline>*/}
                                {/*<BootStrap.FormControl type="text" placeholder="Search" className="mr-sm-2"/>*/}
                                {/*<BootStrap.Button variant="outline-success">Search</BootStrap.Button>*/}
                            {/*</BootStrap.Form>*/}
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
            this.setState({households: data})
        } catch (e) {
            console.log(e.message);
        }
    }

    makeHouseholds() {
        let result = [];
        result.push(<BootStrap.Dropdown.Item key={0.0}>Add Household...</BootStrap.Dropdown.Item>);
        result.push(<BootStrap.Dropdown.Divider key={0.1}/>);
        this.state.households.forEach((value) => {
            result.push(<BootStrap.Dropdown.Item key={value.houseid}>{value.address}</BootStrap.Dropdown.Item>);
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

}

