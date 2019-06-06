import React, {Component} from "react";
import {
    Route,
    NavLink,
    HashRouter
} from "react-router-dom";
import Home from "../components/Home";
import Calendar from "../components/Calendar";
import Contact from "../components/Contact";
import Expenses from "../components/Expenses";

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
                    <BootStrap.Navbar bg="primary" expand="lg">
                        <BootStrap.Navbar.Brand href={'#'}>Roomies</BootStrap.Navbar.Brand>
                        <BootStrap.Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <BootStrap.Navbar.Collapse id="basic-navbar-nav">
                            <BootStrap.Nav className="mr-auto">
                                <BootStrap.Nav.Link href="#contact">Contacts</BootStrap.Nav.Link>
                                <BootStrap.Nav.Link href="#expenses">Expenses</BootStrap.Nav.Link>
                                <BootStrap.NavDropdown title="Household" id="basic-nav-dropdown">
                                    {this.makeHouseholds()}
                                </BootStrap.NavDropdown>
                            </BootStrap.Nav>
                            <BootStrap.Form inline>
                                <BootStrap.FormControl type="text" placeholder="Search" className="mr-sm-2"/>
                                <BootStrap.Button variant="outline-success">Search</BootStrap.Button>
                            </BootStrap.Form>
                        </BootStrap.Navbar.Collapse>
                    </BootStrap.Navbar>

                    <div className="content">
                        <Route exact path="/" component={Home}/>
                        <Route path="/stuff" component={Calendar}/>
                        <Route path="/contact" component={Contact}/>
                        <Route path={'/expenses'} component={Expenses}/>

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
        this.state.households.forEach((value) => {
            result.push(<BootStrap.NavDropdown.Item key={value.houseid}>{value.address}</BootStrap.NavDropdown.Item>);
        });
        return result;
    }

}

