import React from 'react';

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

    render() {
        return (
            <div className={"App"}>
                <label htmlFor="name">Name: </label>
                <input type={"text"} name={"name"} placeholder={"John Doe"}
                       onChange={(event) => {this.setState({name: event.target.value})}}/><br/>
                <label htmlFor="email">Email: </label>
                <input type={"email"} name={"email"} placeholder={"johndoe@example.com"}
                       onChange={(event) => {this.setState({email: event.target.value})}}
                />
                <label htmlFor="phoneNo">Phone Number: </label>
                <input type={"tel"} name={"phoneNo"} placeholder={"###-###-####"}
                       onChange={(event) => {this.setState({phoneNo: event.target.value})}}
                />
                <label htmlFor="password">Password: </label>
                <input type={"password"} name={"password"}
                       onChange={(event) => {this.setState({password: event.target.value})}}
                />
                <label htmlFor="confirm-password">Confirm Password: </label>
                <input type={"password"} name={"confirm-password"}
                       onChange={(event) => {this.setState({confirmPassword: event.target.value})}}
                />
                <input type={"button"} name={"Sign-up"} onClick={this.signUp.bind(this)} value={"Sign Up"}/>
            </div>
        );
    }

    async signUp() {
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
            if (response.status === 200) alert("Signup Successful");
            else alert("Sign up failed, dumbass");
        } catch (e) {
            alert(e); // TODO: CHANGE THIS
        }
    }

}