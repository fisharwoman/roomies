import React, {Component} from "react";
import Button from "react-bootstrap/Button";
import './Contact.css';
import AddContactForm from "./AddContactForm";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";

class Contact extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedHouseholdId: this.props.selectedHousehold.houseid,
            showAddCollapsible: false,
            contacts: []
        };
        this.onAddClick = this.onAddClick.bind(this);
        this.addNewContact = this.addNewContact.bind(this);
    }


    // GET contacts listing based on householdID. .get('/houses/:houseID'
    async getContactsFromHouse(houseid) {
        try {
            const response = await fetch(`/contacts/houses/${houseid}`, {
                method: "GET"
            });
            let data = await response.json();
            console.log("CONTACTS FROM HOUSE " + JSON.stringify(data));
            console.log(response);
            return data;
        } catch (e) {
            throw e;
        }
    }


    async componentDidMount() {
        let data = await this.getContactsFromHouse(this.state.selectedHouseholdId);
        this.setState({contacts: data});

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

    // name, phone number, relationship, owner
    render() {
        // console.log("CONTACTS"+JSON.stringify(this.state.contacts));
        return (
            <div >
                <div className={"Cop"}>

                    <h2 className={'title'}>Contacts</h2>
                    <Button className={'ab'} variant={"outline-success"}
                            onClick={this.onAddClick.bind(this)}>Add </Button>
                    <Button className={'ab'} variant={"outline-info"}
                            onClick={this.onEditClick.bind(this)}>Edit</Button>
                    <Button className={'ab'} variant={"outline-danger"}
                            onClick={this.onRemoveClick.bind(this)}>Remove</Button>

                </div>
                {this.state.showAddCollapsible ?
                    <AddContactForm addNew={this.addNewContact}/> :
                    null
                }
                <div className={'contentPanel'}>
                    <div id={'contactsTable'}>
                        <Row>
                            <Col>
                                <Table hover size={'sm'}>
                                    <thead>
                                    <tr>
                                        <th>Contact Name</th>
                                        <th>Phone Number</th>
                                        <th>Relationship</th>
                                        <th>Owner</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.contacts.map((row) => (
                                            <tr key={row.contactsid}>
                                                <td key={row.name}>{row.name}</td>
                                                <td key={row.phoneno}>{row.phoneno}</td>
                                                <td key={row.relationship}>{row.relationship}</td>
                                                <td key={row.listedby}>{row.listedby}</td>
                                            </tr>
                                        )
                                    )
                                    }
                                    </tbody>

                                    <tfoot></tfoot>
                                </Table>

                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }

    async addNewContact(cname, cphone, crel, crm) {
        try {
            let cid = await this.postContact(cname, cphone, crel, crm);
            // console.log("cid"+cid);
            if (cid != null) {
                this.setState((state => ({
                    contacts: state.contacts.concat([{contactsid: cid, name: cname, phoneno: cphone, relationship: crel,listedby: crm}])
                })))
             } else {
                 alert("Error in adding this contact.");
             }
        } catch (e) {
            alert("Error. Something unexpected happened in our system!");
        }

    }

    // POST contacts/
    async postContact(cname, cphone, crel, crm) {
        try {
            const response = await fetch(`/contacts/`, {
                method: "POST",
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify({
                    name: cname,
                    phoneNo: cphone,
                    relationship : crel,
                    listedby: crm
                })
            });
            // console.log(response);
            let data = await response.json();
            return data.cid;
        } catch (e) {
            throw e;
        }
    }


}

export default Contact;
