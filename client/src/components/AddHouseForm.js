import React, {Component} from 'react';
import {Button, Collapse} from 'react-bootstrap';
import './Form.css';
import Form from "react-bootstrap/Form";

class AddHouseForm extends Component{

    constructor(props) {
        super(props);

        this.state={
            address: null,
            name: null,
            newHouseComp: null
        };

        this.handleNewAddHouse=this.handleNewAddHouse.bind(this);
    }

    handleNewAddHouse() {
        // console.log("form submitted");

       this.props.addNew(this.state.address, this.state.name);
    }

    render(){
        return(
            <div

                className= "container">
                <Form className={'form'} style={{margin: 'none', maxWidth: 'none', justifyContent: 'center'}} inline>
                    <Form.Group style={{padding: '10px'}}>
                        <Form.Label>Address &nbsp;</Form.Label>
                        <Form.Control autoComplete={'false'} placeholder={"One Infinite Loop, CA"}
                               onChange={event => {this.setState({address: event.target.value})}} />
                    </Form.Group>
                    <Form.Group style={{padding: '10px'}}>
                        <Form.Label>Household Name &nbsp;</Form.Label>
                        <Form.Control autoComplete={'false'} placeholder={"My House..."}
                               onChange={event => {this.setState({name: event.target.value})}} />
                    </Form.Group>
                    <Button onClick={this.handleNewAddHouse}>Add House</Button>
                </Form>

            </div>
        );
    }
}

export default AddHouseForm
