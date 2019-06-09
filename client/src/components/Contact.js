import React, {Component} from "react";
import Button from "react-bootstrap/Button";
import './Management.css';
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

    // name, phone number, relationship
    render() {
        return (
            <div className={"Hop"}>
                <h2 className={'title'}>Contacts</h2>
                <Button className={'ab'} variant={"outline-success"} onClick={this.onAddClick.bind(this)}>Add</Button>
                <Button className={'ab'} variant={"outline-info"} onClick={this.onEditClick.bind(this)}>Edit</Button>
                <Button className={'ab'} variant={"outline-danger"}
                        onClick={this.onRemoveClick.bind(this)}>Remove</Button>
                {this.state.showAddCollapsible ?
                    <AddContactForm/> :
                    null
                }
                <div className={'contentPanel'}>
                    <ContactsTable/>
                </div>

            </div>
        );
    }


}

export default Contact;
