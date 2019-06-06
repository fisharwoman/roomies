import React from 'react';
import ReactDOM from 'react-dom';
import Main from '../views/Main';


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
            <div className={"App"}>
                <label htmlFor={"username"}>Email: </label>
                <input type={"text"} name={"username"} placeholder={"jondoe@example.com"}
                    onChange={event => {this.setState({email: event.target.value})}}
                /><br/>
                <label htmlFor={"password"}>Password: </label>
                <input type={"password"} name={"placeholder"}
                    onChange={event => {this.setState({password: event.target.value})}}
                />
                <input type={"button"} name={"login"} value={"Login"} onClick={this.tryToLogin.bind(this)}/>
            </div>
        );
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
            if (response.status === 200) {
                ReactDOM.render(<Main/>, document.getElementById('root'));
            }
            else {alert('Login failed'); return;}
        } catch (e) {
            alert(e.message);
        }
    }


}