import React, {Component} from 'react';
import {Button, Collapse} from 'react-bootstrap';
import './AddHouseForm.css';
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
        console.log("form submitted");
        // this.createNewHouseComp();


       this.props.addNew(this.state.address, this.state.name);
      //  console.log(JSON.stringify(o));
    }

    createNewHouseComp(){
        // let name = this.state.name;
        // let address = this.state.address;
        // let obj = {name, address};
        // this.setState({newHouseComp: obj});
    }

    render(){
        return(
            <div

                className= "container">
                <Form className="form">
                    Add a Household <br/>
                    <label htmlFor={"Address"}>Household Address: &nbsp;&nbsp; </label>
                    <input type={"text"} name={"address"} placeholder={"555 Some Street"}
                           onChange={event => {this.setState({address: event.target.value})}} /> <br/>
                    <label htmlFor={"Name"}>Household Name: &nbsp;&nbsp; </label>
                    <input type={"text"} name={"name"} placeholder={"My Household"}
                           onChange={event => {this.setState({name: event.target.value})}} /> <br/>
                    <input type={"button"} name={"handleNewAddHouse"} value={"+"}
                           onClick={this.handleNewAddHouse} /> <br/>
                </Form>

            </div>
        );
    }
}

export default AddHouseForm
