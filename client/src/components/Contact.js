import React, {Component} from "react";
import Button from "react-bootstrap/Button";
import './Contact.css';
import AddContactForm from "./AddContactForm";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import EditContactForm from "./EditContactForm";

class Contact extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedHouseholdId: this.props.selectedHousehold.houseid,
            showAddCollapsible: false,
            showEditCollapsible: false,
            curContactId: null,
            contacts: []
        };
        this.onAddClick = this.onAddClick.bind(this);
        this.onEditClick = this.onEditClick.bind(this);
        this.addNewContact = this.addNewContact.bind(this);
        this.editContact = this.editContact.bind(this);
    }

    // name, phone number, relationship, owner
    render() {
        // console.log("CONTACTS"+JSON.stringify(this.state.contacts));
        return (
            <div>
                <div className={"Cop"}>

                    <h2 className={'title'}>Contacts</h2>
                    <Button className={'ab'} variant={"outline-success"}
                            onClick={this.onAddClick.bind(this)}>Add </Button>

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
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.contacts.map((row, index) => (
                                            <tr key={row.contactsid + index}>
                                                <td width="20%" key={row.name}>{row.name}</td>
                                                <td width="15%" key={row.phoneno}>{row.phoneno}</td>
                                                <td width="20%" key={row.relationship}>{row.relationship}</td>
                                                <td width="20%" key={row.listedby + index}>{row.listedbyname}</td>
                                                <td width="20%" key={row.contactsid}>
                                                    <Button
                                                        size={'sm'}
                                                        className={'edit'}
                                                        variant={"outline-info"}
                                                        value={row.contactsid}
                                                        onClick={this.onEditClick}
                                                    >Edit</Button>
                                                    <Button
                                                        size={'sm'}
                                                        className={'remove'}
                                                        variant={"outline-danger"}
                                                        value={row.contactsid}
                                                        key={index}
                                                        onClick={this.handleRemoveContact}
                                                    >Remove</Button></td>
                                            </tr>
                                        )
                                    )
                                    }
                                    </tbody>

                                    <tfoot></tfoot>
                                </Table>

                            </Col>
                        </Row>
                        <Row>
                            {this.state.showEditCollapsible ?
                                <EditContactForm cid={this.state.curContactId} editContact={this.editContact}/> :
                                null
                            }
                        </Row>
                    </div>
                </div>
            </div>
        );
    }

    // GET contacts listing based on householdID. .get('/houses/:houseID'
    async getContactsFromHouse(houseid) {
        try {
            const response = await fetch(`/contacts/houses/${houseid}`, {
                method: "GET"
            });
            let data = await response.json();
            return data;
        } catch (e) {
            throw e;
        }
    }

    // todo something is going wrong with our database?
    async componentDidMount() {
        try {
            let data = await this.getContactsFromHouse(this.state.selectedHouseholdId);
            console.log(data);
            this.setState({contacts: data});
        } catch (e) {
            console.log(e);
        }
    }

    onAddClick() {
        this.setState(prevState => ({
            showAddCollapsible: !prevState.showAddCollapsible
        }));
    }


    // todo i don't think delete contact is properly working... a bunch of things become null
    // might this need error handling?
    // contacts/:contactid
    handleRemoveContact = async (e) => {
        // console.log(cid);
        const cid = e.target.value;
        const idx = e.target.key;
        try {
            await fetch(`/contacts/${cid}`, {
                method: "DELETE"
            });
            let contacts = this.state.contacts;
            contacts.splice(idx,1);
            this.setState({contacts: contacts});
        } catch (e) {
            throw e;
        }
    }


    async addNewContact(cname, cphone, crel, crm) {
        try {
            let cid = await this.postContact(cname, cphone, crel, crm);
            if (cid != null) {
                this.setState((state => ({
                    contacts: state.contacts.concat([{
                        contactsid: cid,
                        name: cname,
                        phoneno: cphone,
                        relationship: crel,
                        listedby: crm
                    }]),
                    showAddCollapsible: false
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
                    relationship: crel,
                    listedby: crm
                })
            });
            let data = await response.json();
            return data.cid;
        } catch (e) {
            throw e;
        }
    }


    async editContact(cid, newPhone) {
        try {
            let resp = await this.patchContact(cid, newPhone);
            let contacts = this.state.contacts;
            for (let i in contacts) {
                let contact = contacts[i];
                if (contact.contactsid == cid) {
                    contact.phoneno = newPhone;
                    break;
                }
            }

            this.setState({
                contacts: contacts,
                showEditCollapsible: false
            })

        } catch (e) {
            alert("Error.");
        }
    }

    // PATCH contacts/:contactid
    async patchContact(cid, newPhone) {
        let contacts = this.state.contacts;
        let curCon = null;
        for (let i in contacts) {
            let contact = contacts[i];
            if (contact.contactsid == cid) {
                curCon = contact;
                break;
            }
        }
        try {
            const response = await fetch(`/contacts/${cid}`, {
                method: "PUT",
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify({
                    name: curCon.name,
                    phoneNo: newPhone,
                    relationship: curCon.relationship,
                    listedby: curCon.listedby
                })
            });
            return response;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    onEditClick = (e) => {
        const cid = e.target.value;
        this.setState(prevState => ({
            showEditCollapsible: !prevState.showEditCollapsible,
            curContactId: cid
        }));
    }

}

export default Contact;
