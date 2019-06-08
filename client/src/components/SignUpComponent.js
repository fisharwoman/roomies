import React from 'react';
import ReactDOM from 'react-dom';
import Main from '../views/Main';
import {Button, Form} from "react-bootstrap";

export default class SignUpComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: null,
            email: null,
            phoneNo: null,
            password: null,
            confirmPassword: null
        }
    }

    // render() {
    //     return (
    //         <div className={"App"}>
    //             <label htmlFor="name">Name: </label>
    //             <input type={"text"} name={"name"} placeholder={"John Doe"}
    //                    onChange={(event) => {this.setState({name: event.target.value})}}/><br/>
    //             <label htmlFor="email">Email: </label>
    //             <input type={"email"} name={"email"} placeholder={"johndoe@example.com"}
    //                    onChange={(event) => {this.setState({email: event.target.value})}}
    //             />
    //             <label htmlFor="phoneNo">Phone Number: </label>
    //             <input type={"tel"} name={"phoneNo"} placeholder={"###-###-####"}
    //                    onChange={(event) => {this.setState({phoneNo: event.target.value})}}
    //             />
    //             <label htmlFor="password">Password: </label>
    //             <input type={"password"} name={"password"}
    //                    onChange={(event) => {this.setState({password: event.target.value})}}
    //             />
    //             <label htmlFor="confirm-password">Confirm Password: </label>
    //             <input type={"password"} name={"confirm-password"}
    //                    onChange={(event) => {this.setState({confirmPassword: event.target.value})}}
    //             />
    //             <input type={"button"} name={"Sign-up"} onClick={this.signUp.bind(this)} value={"Sign Up"}/>
    //         </div>
    //     );
    // }

    render() {
        return (
            <Form onSubmit={e => this.handleSubmit(e)}>
                <Form.Group>
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                        type={'text'} placeholder={'John Doe'}
                        onChange={e => {this.setState({name: e.target.value})}}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type={'email'} placeholder={"johndoe@example.com"}
                        onChange={event => {this.setState({email: event.target.value})}}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                        type={'tel'} placeholder={'999-999-9999'}
                        onChange={e => {this.setState({phoneNo: e.target.value})}}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        onChange={event => {this.setState({password: event.target.value})}}
                        type={'password'} placeholder={'Password'}/>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        onChange={event => {this.setState({confirmPassword: event.target.value})}}
                        type={'password'} placeholder={'Password'}/>
                </Form.Group>
                <Button block variant={'primary'} type={'Submit'}>Sign Up</Button>
            </Form>
        )
    }

    async handleSubmit(e) {
        e.preventDefault();
        try {
            await this.signup();
        } catch (e) {
            console.log(e);
        }
    }

    async signup() {
        console.log(this.state);
        const newUser = {
            name: this.state.name,
            email: this.state.email,
            phoneNo: this.state.phoneNo,
            password: this.state.password
        };
        if (!newUser.name || !newUser.email || !newUser.phoneNo || !newUser.password) return;
        if (newUser.password !== this.state.confirmPassword) {alert('Passwords dont match'); return;}
        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });
            if (response.status === 200) {
                let data = await response.json();
                const lResp = await fetch('/auth/login', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: newUser.email,
                        password: newUser.password
                    })
                });
                if (lResp.status === 200) window.sessionStorage.setItem('userid',data.userid);
                else {
                    alert('Error with signup');
                    return;
                }
                ReactDOM.render(<Main />, document.getElementById('root'));
            }
            else alert("Sign up failed, dumbass");
        } catch (e) {
            alert(e); // TODO: CHANGE THIS
        }
    }

}