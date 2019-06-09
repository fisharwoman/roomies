import React from "react";
import ReactDOM from 'react-dom';
import Main from './Main';
import {Card, Button} from 'react-bootstrap';
import '../index.css';
import LoginComponent from "../components/LoginComponent";
import SignUpComponent from "../components/SignUpComponent";

const SIGN_UP_TEXT = "Create an account";
const LOGIN_TEXT = "I already have an account";
export default class Login extends React.Component {

    constructor(props) {
        super(props);
        if (window.sessionStorage.getItem('userid')) {
            ReactDOM.render(<Main/>, document.getElementById('root'));
        }
        this.state = {
            isLoginWindow: true,
            switchViewLabel: SIGN_UP_TEXT
        }
    }

    render() {
        return (
            <div className={'container h-100'}>
                <div className={"row h-100 align-items-center"}>
                    <Card className={"card .mx-auto"}>
                        <Card.Header id={"card-header"}>Roomies</Card.Header>
                        {this.renderForm()}
                        {/*<input type={"button"} value={"Sign Up"} onClick={this.setForm.bind(this)}/>*/}
                        <div style={{padding: '20px'}}>
                            <Button variant={'primary'} block onClick={this.setForm.bind(this)}>{this.state.switchViewLabel}</Button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    setForm() {
        let newState = !this.state.isLoginWindow, newLabel;
        if (!newState) newLabel = LOGIN_TEXT;
        else newLabel = SIGN_UP_TEXT;
        this.setState({
            isLoginWindow: newState,
            switchViewLabel: newLabel
        });
    }

    renderForm() {
        if (this.state.isLoginWindow) {

            return(<LoginComponent/>);
        } else {
            return (<SignUpComponent/>);
        }
    }
}