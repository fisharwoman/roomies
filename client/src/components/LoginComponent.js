import React from 'react';
import ReactDOM from 'react-dom';
import Main from '../views/Main';
import { Button, Form, Card} from 'react-bootstrap';
import './styles/Login.css';


export default class LoginComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null
        }
    }


    render() {
        return (
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type={'email'} placeholder={"johndoe@example.com"}
                            onChange={event => {this.setState({email: event.target.value})}}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            onChange={event => {this.setState({password: event.target.value})}}
                            type={'password'} placeholder={'Password'}/>
                    </Form.Group>
                    <Button block variant={'primary'} type={'Submit'}>Log In</Button>
                </Form>
        )
    }

    async handleSubmit(e) {
        e.preventDefault();
        try {
            await this.tryToLogin();
        } catch (e) {
            alert(e);
        }
    }
    async tryToLogin() {
        const login = {
            username: this.state.email,
            password: this.state.password
        };
        if (!login.username || !login.password) return;
        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(login)
            });
            const data = await response.json();
            if (response.status === 200) {
                window.sessionStorage.setItem('userid',data.userid);
                ReactDOM.render(<Main/>, document.getElementById('root'));
            }
            else {alert('Login failed'); return;}
        } catch (e) {
            alert(e.message);
        }
    }


}