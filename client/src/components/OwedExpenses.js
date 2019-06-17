import React, { Component } from 'react';
import {
    Table, Button, Form
} from 'react-bootstrap';

export default class OwedExpenses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            houseid: props.houseid,
            expenses: [],
            selectedExpenseID: null,
            partialExpenses: {},
            selectedPartials: [],
            showAddExpense: false
        }
    }

    render() {
        return (
            <div>
            <Button style={{float: 'none'}} variant={'outline-primary'} onClick={() => {this.setState({
                showAddExpense: !this.state.showAddExpense})}}>Add Expense</Button>
                {this.state.showAddExpense ? 
                    <AddExpenseForm/> :
                    null
                }
            <div>
                <div style={{float: 'left', display: 'inline', width: '45%'}}>
                    <h3>Owed expenses</h3>
                    <Table>
                        <thead>
                            <tr>
                                <td>Date</td>
                                <td>Description</td>
                                <td>Amount</td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.makeExpenses()}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td>Total Money Owing:</td>
                                {this.sumOwing()}
                                <td></td>
                            </tr>
                        </tfoot>
                    </Table>
                </div>

                <div style={{float: 'left',display: 'inline', width: '45%', marginLeft: '10px'}}>
                <h3>Expense #{this.state.selectedExpenseID} Splits</h3>
                    <Table>
                        <thead>
                            <tr>
                                <td>Borrower</td>
                                <td>Amount</td>
                                <td>Date Paid</td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.makePartialExpenses()}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td>Total Money Owing:</td>
                                {this.sumOwing()}
                                <td></td>
                            </tr>
                        </tfoot>
                    </Table>
                </div>
                </div>
            </div>
        )
    }

    addComponent() {

    }

    async componentDidMount() {
        try {
            let data = await this.getExpenses();
            console.log(data);
            let partials = await this.getPartialExpenses(data);
            this.setState({
                expenses: data,
                partialExpenses: partials
            });
        } catch (e) {
            console.log(e)
        }
    }

    async getExpenses() {
        try {
            let response = await fetch(`expenses/households/${this.state.houseid}/users/${this.props.userid}`, {
                method: "GET"
            });
            let data = await response.json(); 
            return data;
        } catch (e) {
            throw e;
        }
    }

    async getPartialExpenses(data) {
        try {
            let partialExpenses = {};
            await Promise.all(data.map(async (value) => {
                let response = await fetch(`expenses/splits/${value.expenseid}`, {
                    method: "GET"
                });
                let partials = await response.json();
                partialExpenses[value.expenseid] = partials;
            }));
            
            return partialExpenses;

        } catch (e) {
            throw e;
        }
    }

    makeExpenses() {
        return this.state.expenses.map((value) => {
            return (
                <tr style={this.state.selectedExpenseID === value.expenseid ? 
                { backgroundColor:'#007bff',
                  color: 'white' } : {}} key={value.expenseid} onClick={() => this.selectExpense(value.expenseid)}>
                    <td>{value.expensedate}</td>
                    <td>{value.description}</td>
                    <td>{value.amount}</td>
                </tr>
            )
        })
    }

    async selectExpense(expenseid) {
        console.log("TARGET: " + expenseid);
        this.setState({
            selectedExpenseID: expenseid
        });
    }

    makePartialExpenses() {
        if (this.state.selectedExpenseID === null) return;
        return this.state.partialExpenses[this.state.selectedExpenseID].map((value, index) => {
            return (
                <tr key={index}>
                    <td>{value.borrower}</td>
                    <td>{value.amount}</td>
                    <td>{value.datepaid}</td>
                </tr>
            )
        })
    }

    sumOwing() {
        return (
            <td>$500.00</td>
        )
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            houseid: newProps.houseid
        });
    }
}

class AddExpenseForm extends Component{

    constructor(props) {
        super(props);
        this.state = {
            amount: null,
            description: '',
            expenseType: null,
            splitters: []
        };

    }

    handleAddNewExpense() {
        alert("form submitted");
    }

    makeExpenseTypes(){
        return(
            <option>
                "This is an option"
            </option>
        )
        // TODO: make this bitch
    }

    makeRoommates() {
        return(
            <option key={1}>"Option 1"</option>
        )
        // TODO: YEEEEET make this
    }

    render(){
        return(
            <div className= "container">
                <Form className="form">
                    Add a Shared Expense <br/>
                    <Form.Group>
                        <Form.Label>Amount</Form.Label>
                        <Form.Control type={'number'}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Expense Type</Form.Label>
                        <Form.Control as={'select'}>
                            { this.makeExpenseTypes() }
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Split With</Form.Label>
                        <Form.Control as={'select'} multiple>
                            { this.makeRoommates() }
                        </Form.Control>
                    </Form.Group>
                    <Form.Control type={'submit'} />
                </Form>
            </div>
        );
    }
}