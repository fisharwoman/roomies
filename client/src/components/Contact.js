import React, {Component} from "react";
import Button from "react-bootstrap/Button";
import './Contact.css';
import ContactsTable from "./ContactsTable";
import AddHouseForm from "./Management";
import AddContactForm from "./AddContactForm";

class Contact extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showAddCollapsible: false
        };
        this.onAddClick = this.onAddClick.bind(this);
    }

    onAddClick() {
        this.setState(prevState => ({
            showAddCollapsible: !prevState.showAddCollapsible
        }));
    }

    onEditClick() {
        alert("edit");
    }

    onRemoveClick() {
        alert("remove");
    }

    // this seems to work
    // GET contacts listing based on householdID. .get('/houses/:houseID'
    async getContactsFromHouse(houseid) {
        try {
            const response = await fetch(`/contacts/houses/${houseid}`, {
                method: "GET"
            });
            let data = await response.json();
            data = data.map((value) => {
                console.log(data);
            });
            console.log(response);
            // return data;
        } catch (e) {
            throw e;
        }
    }

    // this seems to work
    // GET contacts info from contact id .get('/:contactsID'
    async getEachContact(contactsid){
        try {
            const response = await fetch(`/contacts/${contactsid}`, {
                method: "GET"
            });
            let data = await response.json();
            data = data.map((value) => {
                console.log(data);
            });
            console.log(response);
            // return data;
        } catch (e) {
            throw e;
        }
    }

    getInfo(){
        this.getContactsFromHouse(2);
        this.getEachContact(1);
    }

    // name, phone number, relationship, owner
    render() {
        return (
            <div >
                <div className={"Cop"}>

                    <h2 className={'title'}>Contacts</h2>
                    <Button className={'ab'} variant={"outline-success"}
                            onClick={this.onAddClick.bind(this)}>Add</Button>
                    <Button className={'ab'} variant={"outline-info"}
                            onClick={this.onEditClick.bind(this)}>Edit</Button>
                    <Button className={'ab'} variant={"outline-danger"}
                            onClick={this.onRemoveClick.bind(this)}>Remove</Button>

                </div>
                {this.state.showAddCollapsible ?
                    <AddContactForm/> :
                    null
                }
                <div className={'contentPanel'}>
                    {this.getInfo()}
                </div>
            </div>
        );
    }


}

export default Contact;
