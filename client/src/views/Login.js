import React from "react";
import LoginComponent from "../components/LoginComponent";
import SignUpComponent from "../components/SignUpComponent";

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoginWindow: true
        }
    }

    render() {
        return (
            <div className={"App"}>
                {this.renderForm()}
                <input type={"button"} value={"Sign Up"} onClick={this.setForm.bind(this)}/>
            </div>
        );
    }

    setForm() {
        this.setState({isLoginWindow: !this.state.isLoginWindow});
    }

    renderForm() {
        if (this.state.isLoginWindow) {
            return(<LoginComponent/>);
        } else {
            return (<SignUpComponent/>);
        }
    }
}