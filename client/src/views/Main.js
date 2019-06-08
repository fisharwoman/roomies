import React, {Component} from "react";
import ReactDOM from 'react-dom';
import {
    Route,
    Redirect,
    NavLink,
    HashRouter
} from "react-router-dom";

import Login from './Login';

import Dashboard from "../components/Dashboard";
import Calendar from "../components/Calendar";
import Contact from "../components/Contact";
import Expenses from "../components/Expenses";
import Management from '../components/Management';
import '../index.css';

import * as BootStrap from 'react-bootstrap';
import { get } from "https";

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            households: [],
            userName: "User Name",
            selectedHousehold: {
                houseid: 0,
                address: "Address",
                name: ""
            }
        }
    }

    render() {

        return (
            <HashRouter>
                <div>
                    <BootStrap.Navbar className={'sticky-top'} bg="light" expand="lg">
                        <BootStrap.Navbar.Brand id={'brand'}>Roomies</BootStrap.Navbar.Brand>
                        <BootStrap.Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <BootStrap.Navbar.Collapse id="basic-navbar-nav">
                            <BootStrap.Nav defaultActiveKey={'#dashboard'} className="mr-auto">
                                <BootStrap.Nav.Link default={true} href="#dashboard">Dashboard</BootStrap.Nav.Link>
                                <BootStrap.Nav.Link href="#contact">Contacts</BootStrap.Nav.Link>
                                <BootStrap.Nav.Link href="#expenses">Expenses</BootStrap.Nav.Link>
                                <BootStrap.Nav.Link href="#calendar">Calendar</BootStrap.Nav.Link>
                                {/* <BootStrap.Nav.Link href="#management">Manage House</BootStrap.Nav.Link> */}
                            </BootStrap.Nav>
                            <BootStrap.DropdownButton alignRight variant={'light'} title={this.state.selectedHousehold.name || "No House Yet"} id="dropdown-basic-button">
                                {this.makeHouseholds()}
                            </BootStrap.DropdownButton>
                            <BootStrap.DropdownButton alignRight title={this.state.userName}>
                                <BootStrap.Dropdown.Item key={0} href="/#management">Manage Households...</BootStrap.Dropdown.Item>
                                <BootStrap.Dropdown.Item key={1} onClick={this.logout}>Logout</BootStrap.Dropdown.Item>
                            </BootStrap.DropdownButton>

                        </BootStrap.Navbar.Collapse>
                    </BootStrap.Navbar>

                    <div className="content">
                        <Route path="/dashboard" component={Dashboard}/>
                        <Route path="/calendar" component={Calendar}/>
                        <Route path="/contact" component={Contact}/>
                        <Route path='/expenses' component={Expenses}/>
                        <Route path='/management' component={Management}/>
                        <Redirect from={'/'} to={'/dashboard'}/>

                    </div>

                </div>


            </HashRouter> // foundation for the navigation and browser history handling
        );
    }

    async componentDidMount() {
        try {
            let data = await this.getHouseholds();
            console.log(data);
            if(data != []){
                let name = await this.getUserName();
                console.log("looj here");
                console.log(data);
                console.log(name);
                this.setState({
                    households: data,
                    userName: name,
                    selectedHousehold: data[0]
                })
            } else {
                console.log('we here');
                console.log();
                this.setState({
                    households: '',
                    userName: '',
                    selectedHousehold: ''
                })
            }

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
            result.push(<BootStrap.Dropdown.Item key={key} eventKey={key} onSelect={(evt) => this.switchHousehold(evt)}>{value.name}</BootStrap.Dropdown.Item>);
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

