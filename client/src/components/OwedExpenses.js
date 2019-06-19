import React, { Component } from 'react';
import {
    Table, Button, Form
} from 'react-bootstrap';
// import AddExpenseForm from './AddExpenseForm';

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
        };
    }

    render() {
        return (
            <div>
            <Button className="expense-button" style={{float: 'none'}} variant={'outline-primary'} onClick={() => {this.setState({
                showAddExpense: !this.state.showAddExpense})}}>Add Expense</Button>
                {this.state.showAddExpense ? 
                    <AddExpenseForm houseid={this.state.houseid} addNewExpense={this.addNewExpense}/> :
                    null
                }
            <div>
                <div style={{float: 'left', display: 'inline', width: '45%'}}>
                    <h3>Expenses Owed</h3>
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
                                <td>Total Expenditure:</td>
                                <td></td>
                                {this.sumOwing()}
                            </tr>
                        </tfoot>
                    </Table>
                </div>

                <div style={{float: 'left',display: 'inline', width: '45%', marginLeft: '10px'}}>
                <h3>Selected Expense Splits</h3>
                { this.state.selectedExpenseID === null ? 
                    <h4>Click on an expense to view its splits.</h4> :
                    this.state.selectedPartials.length > 0 ?
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
                                {this.sumPartialOwing()}
                                <td></td>
                            </tr>
                        </tfoot>
                    </Table> :
                    <h4>There are no partial expenses to show.</h4>
                }
                </div>
                </div>
            </div>
        )
    }

    async componentDidMount() {
        try {
            let data = await this.getExpenses();
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

    formatDate = (date) => {
        if (date === null) return 'Not Paid';
        let dateFormat = new Date(date);
        let newDate = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: '2-digit'
        }).format(dateFormat);
        return `${newDate}`
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
                <tr className="clickable-row" style={this.state.selectedExpenseID === value.expenseid ? 
                { backgroundColor:'#007bff',
                  color: 'white' } : {}} key={value.expenseid} onClick={() => this.selectExpense(value.expenseid)}>
                    <td>{this.formatDate(value.expensedate)}</td>
                    <td>{value.description}</td>
                    <td>{value.amount}</td>
                </tr>
            )
        })
    }

    async selectExpense(expenseid) {
        console.log("TARGET: " + expenseid);
        this.setState({
            selectedExpenseID: expenseid,
            selectedPartials: this.state.partialExpenses[expenseid]
        });
    }

    makePartialExpenses() {
        if (this.state.selectedExpenseID === null) return;
        return this.state.partialExpenses[this.state.selectedExpenseID].map((value, index) => {
            return (
                <tr key={index}>
                    <td>{value.name}</td>
                    <td>{value.amount}</td>
                    <td>{this.formatDate(value.datepaid)}</td>
                </tr>
            )
        })
    }

    sumOwing() {
        /**
         * TODO: get this value via an aggregation (SUM) query
         * as opposed to iteration
         */
        let sum = 0;
        for(let e of this.state.expenses) {
            var amount = Number(e.amount.replace(/[^0-9.-]+/g,""));
            sum += amount;
        }
        /**
         * TODO: make a call to this.formatMoney() instead, although this works
         */
        let money = sum.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        return (
            <td>${ money }</td>
        );
    }

    sumPartialOwing() {
        if(this.state.selectedExpenseID !== null) {
            /**
             * TODO: get this value via an aggregation (SUM) query
             * as opposed to iteration
             */
            let sum = 0;
            for(let e of this.state.selectedPartials) {
                var amount = Number(e.amount.replace(/[^0-9.-]+/g,""));
                sum += amount;
            }
            /**
            * TODO: make a call to this.formatMoney() instead, although this works
            */
            let money = sum.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            return (
                <td>${ money }</td>
            );
        } else {
            return (
                <td>$0.00</td>
            )
        }
    }

    addNewExpense = async () => {
        try {
            let data = await this.getExpenses();
            let partials = await this.getPartialExpenses(data);
            this.setState({
                expenses: data,
                partialExpenses: partials,
                showAddExpense: false
            });
        } catch (e) {
            console.log(e.message);
        }
    }

    formatMoney(n, c, d, t) {
        var c = isNaN(c = Math.abs(c)) ? 2 : c,
          d = d == undefined ? "." : d,
          t = t == undefined ? "," : t,
          s = n < 0 ? "-" : "",
          i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
          j = (j = i.length) > 3 ? j % 3 : 0;
      
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };

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
            houseid: this.props.houseid,
            amount: null,
            description: '',
            expenseType: null,
            expenseTypes: [],
            roommates: [],
            splitters: []
        };

    }

    makeExpenseTypes(){
        return this.state.expenseTypes.map((v, index) => {
            return(
                <option key={index} value={v.expensetypeid}>{v.categoryname} - {v.typename}</option>
            )
        });

    }

    async getExpenseTypes() {
        try {
            let response = await fetch(`/expenses/types`, {
                method: "GET"
            });
    
            let data = await response.json();
            return data;
        } catch(e) {
            console.log(e);
        }

    }

    makeRoommates() {
        return this.state.roommates.map((v, index) => {
            return(
                <option key={index} value={v.userid}>{v.name}</option>
            )
        });
    }

    async getRoommates() {
        let roommates = await fetch(`households/${this.state.houseid}/roommates`, {
            method: 'GET'
        });
        let data = await roommates.json();
        return data;
    }

    handleSubmit = async (e) => {
        try {
            console.log(this.state);
            e.preventDefault();
            let userid = window.sessionStorage.getItem('userid');


            let response = await fetch(`/expenses/expense/`, {
                method: "POST",
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    expenseDate: new Date(),
                    amount: this.state.amount,
                    description: this.state.description,
                    createdBy: userid,
                    houseID: this.state.houseid,
                    expenseType: this.state.expenseType
                })
            });
            let expense = await response.json();
            await this.splitExpenses(expense);
            await this.props.addNewExpense();
            this.setState({
                amount: null,
                description: '',
                expenseType: null,
                splitters: []
            });
        } catch (e) {
            console.log(e);
        }
    };

    async splitExpenses(expense) {
        try {
            let proportion = 1 / this.state.splitters.length;
             proportion = proportion.toFixed(2);
            let splits = this.state.splitters.map(v => {
                return {
                    roommateID: v,
                    proportion: proportion
                }
            });
            const splitObj = {
                roommateProportions: splits,
                date: expense.expensedate
            };
            await fetch(`/expenses/splits/${expense.expenseid}`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(splitObj)
            });
        } catch (e) {
            console.log(e);
        }
    }

    render(){
        return(
                <Form style={style} onSubmit={this.handleSubmit}>
                    <h3 style={{ alignText: 'center' }}>Add a Shared Expense</h3>
                    <Form.Row style={tableRow}>
                        <Form.Group>
                            <Form.Label>Amount</Form.Label>
                            <Form.Control onChange={(e)=>{this.setState({amount: e.target.value})}} type={'number'} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control onChange={(e) => {this.setState({description: e.target.value})}}/>
                        </Form.Group>
                    <Form.Group>
                        <Form.Label>Expense Type</Form.Label>
                        <Form.Control as={'select'} onChange={(e) => {this.setState({expenseType: e.target.value})}}>
                            <option key={-1}>Choose an expense type...</option>
                            { this.makeExpenseTypes() }
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Split Evenly Among</Form.Label>
                        <Form.Control as={'select'} multiple onChange={this.handleRoommateSelectChange}>
                            { this.makeRoommates() }
                        </Form.Control>
                    </Form.Group>
                    <Form.Control type={'submit'} />
                    </Form.Row>
                </Form>
        );
    }

    handleRoommateSelectChange = (options) => {
        options = options.target.options;
        let r = [];
        for (let o of options) {
            if (o.selected) r.push(o.value);
        }
        this.setState({splitters: r});
    }

    async componentDidMount() {
        try {
            let types = await this.getExpenseTypes();
            let roommates = await this.getRoommates();
            this.setState({
                expenseTypes: types,
                roommates: roommates
            });
        } catch (e) {
            console.log(e)
        }

    }
}

const style = {
    display: 'inline-block',
    width: '95%',
    margin: '40px',
    maxWidth: '100%',
    padding: '50px',
    borderStyle: 'solid',
    borderColor: '#007bff',
    borderRadius: '10px',
}

const tableRow = {
    maxWidth: '100%',
    width: '100%'
}