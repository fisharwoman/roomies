import React, {Component} from "react";
import ReactDOM from 'react-dom';
import {
    Route,
    Redirect,
    NavLink,
    HashRouter,
} from "react-router-dom";

import Login from './Login';

import Dashboard from "../components/Dashboard";
import Calendar from "../components/Calendar";
import Contact from "../components/Contact";
import Expenses from "../components/Expenses";
import Management from '../components/Management';
import '../index.css';

import * as BootStrap from 'react-bootstrap';

const placeholder = {
    houseid: 0,
    address: '-',
    name: "You aren't in a house yet!"
};

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            households: [],
            userName: "User Name",
            selectedHousehold: placeholder,
            isLoading: true,
            redirect: '/dashboard'
        };
        this.observers = [];
    }

    render() {
        if (this.state.isLoading) return(<div></div>);
        if (this.state.selectedHousehold.houseid === 0) {
            return (
                <HashRouter>
                    <div>
                        <BootStrap.Navbar className={'sticky-top'} bg="light" expand="lg">
                            <BootStrap.Navbar.Brand id={'brand'}>Roomies</BootStrap.Navbar.Brand>
                            <BootStrap.Navbar.Toggle aria-controls="basic-navbar-nav"/>
                            <BootStrap.Navbar.Collapse id="basic-navbar-nav">
                                <BootStrap.Nav defaultActiveKey={'#newAcct'} className="mr-auto">
                                    <BootStrap.Nav.Link default={true} href="#newAcct">Dashboard</BootStrap.Nav.Link>
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
                            <Route path='/management' component={Management}/>
                            <Route path={'/newAcct'} render={(props) => <NewAcct update={this.update}/>}/>
                            <Redirect from={'/'} to={'/newAcct'}/>
                        </div>

                    </div>


                </HashRouter>
            )
        }
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
                        <Route path="/dashboard" render={(props) => <Dashboard houseid={this.state.selectedHousehold.houseid} housename = {this.state.selectedHousehold.name} addObserver={this.subscribeToChanges}/>}/>
                        <Route path="/calendar" render={(props) => <Calendar selectedHousehold = {this.state.selectedHousehold} />} />
                        <Route path="/contact" component={Contact}/>
                        <Route path='/expenses' component={(props) => <Expenses selectedHousehold = {this.state.selectedHousehold}/>} />
                        <Route path='/management' component={(props) => <Management update={this.update}/>}/>
                        <Redirect from={'/'} to={this.state.selectedHousehold.houseid === 0 ? '/management' : '/dashboard'}/>
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
                selectedHousehold: data[0] ? data[0] : this.state.selectedHousehold,
                isLoading: false
            });
        } catch (e) {
            console.log(e.message);
        }
    }

    subscribeToChanges = (notify) => {
        this.observers.push(notify);
    };

    update = async (v) => {
        if (v.hasOwnProperty('households')) {
            this.setState({
                households: v.households,
                selectedHousehold: v.households[0] ? v.households[0] : placeholder
            });
        }
    };

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
                window.sessionStorage.removeItem('userid');
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
        this.observers.forEach((value) => {
            value({
                houseid: this.state.households[key].houseid,
                housename: this.state.households[key].name
            });
        });
        this.setState(
            {
                selectedHousehold: this.state.households[key]
            }
        )
    }

}

class NewAcct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            address: ""
        }
    }
    render () {
        return (
            <div>
                <h3>Welcome to Roomies!</h3>
                <p style={{textAlign: 'center', verticalAlign: 'middle', margin: '20px auto'}}>We know you're eager to start using Roomies, but you need to be in a household before you do.</p>
                <ul>
                    <li>If you're looking to <em>join a household</em>, a roommate of that household can add you now</li>
                    <li>Otherwise, create a new household now to start using Roomies</li>
                </ul>
                <BootStrap.Form onSubmit={(e) => this.handleSubmit(e)} style={{display: 'inline'}}>
                    <BootStrap.Form.Row>
                        <BootStrap.Col>
                            <BootStrap.Form.Group>
                                <BootStrap.Form.Label>Household Name</BootStrap.Form.Label>
                                <BootStrap.Form.Control onChange={e=>this.setState({name: e.target.value})}/>
                            </BootStrap.Form.Group>
                        </BootStrap.Col>
                        <BootStrap.Col>
                            <BootStrap.Form.Group>
                                <BootStrap.Form.Label>Household Address</BootStrap.Form.Label>
                                <BootStrap.Form.Control onChange={e=>this.setState({address: e.target.value})} type={'address'} placeholder={'One Infinite Loop'}/>
                            </BootStrap.Form.Group>
                        </BootStrap.Col>
                        <BootStrap.Col>
                            <BootStrap.Button type={'submit'}>Create House</BootStrap.Button>
                        </BootStrap.Col>
                    </BootStrap.Form.Row>
                </BootStrap.Form>
            </div>
        )
    }

    async handleSubmit(e) {
        e.preventDefault();
        try {
            await this.addHouseAPI();
        } catch (e) {console.log(e);}
    }

    async addHouseAPI() {
        try {
            let userid = window.sessionStorage.getItem('userid');
            const response = await fetch(`/households/`, {
                method: "POST",
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify({address: this.state.address, name: this.state.name})
            });
            let data = await response.json();
            const response2 = await fetch(`/households/${data.hid}/roommates/${userid}`,{
                method: 'POST',
                header:{
                    'content-type': 'application/json'
                }
            });
            this.props.update({
                households: [{
                    houseid: data.hid,
                    address: this.state.address,
                    name: this.state.name
                }]
            });
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}

