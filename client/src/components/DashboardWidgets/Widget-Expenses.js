import React from 'react';
import '../styles/Widgets.css';

import {ListGroup, Table} from 'react-bootstrap';


export default class WidgetExpenses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            houseid: this.props.houseid,
            housename: this.props.housename,
            owedExpenses: [],
            owingExpenses: []
        }
        this.props.addObserver(this.parentDidUpdate);
    }
    render() {
        return (
                <ListGroup id={'expense-widget-group'}>
                    <ListGroup.Item variant={'success'} className={'expense-widget-table'}>
                        <strong>Unsettled Expenses You Made in {this.state.housename}</strong>
                        {this.makeOwedExpensesTable()}
                    </ListGroup.Item>
                    <ListGroup.Item variant={'danger'} className={'expense-widget-table'}>
                        <strong>Expenses You Haven't Settled</strong>
                        {this.makeOwingExpensesTable(this.state.owingExpenses)}
                    </ListGroup.Item>
                </ListGroup>
        )
    }

    async componentDidMount() {
        try {
            let owedExpenses = await this.getOwedExpenses();
            let owingExpenses = await this.getOwingExpenses();
            this.setState({
                owedExpenses: owedExpenses,
                owingExpenses: owingExpenses
            });
        } catch (e) {console.log(e);}
    }


    makeOwedExpensesTable() {
        if (this.state.owedExpenses.length > 0) {
            return (
                <Table size={'sm'} responsive hover>
                    <thead><tr><td>Description</td><td>Total Expense</td><td>Left To Be Paid</td></tr></thead>
                    <tbody>
                        {this.makeExpenseTableRows(this.state.owedExpenses)}
                    </tbody>
                </Table>
            )
        } else {
            return (
                <em><br/>Any expenses you've made are settled. Hooray!</em>
            )
        }
    }

    makeOwingExpensesTable() {
        if (this.state.owingExpenses.length > 0) {
            return (
                <Table size={'sm'} responsive hover>
                    <thead><tr><td>Description</td><td>Total Expense</td><td>You Owe</td></tr></thead>
                    <tbody className={'expense-widget-table-scrollable'}>
                        {this.makeExpenseTableRows(this.state.owingExpenses)}
                    </tbody>
                </Table>
            )
        } else {
            return (
                <em><br/>Looks like you're all squared up with the other roommates!</em>
            )
        }
    }

    makeExpenseTableRows(data) {
        return data.map((value,index) => {
            return(
                <tr key={index}>
                    <td>{value.description}</td>
                    <td>{value.amount}</td>
                    <td>{value.outstanding}</td>
                </tr>
            )
        });
    }

    async getOwedExpenses() {
        try {
            let userid = window.sessionStorage.getItem('userid');
            let response = await fetch(`/expenses/households/${this.state.houseid}/roommates/${userid}/owed`, {
                method:'GET'
            });
            let data = await response.json();
            return data;
        } catch (e) {console.log(e);}
    }

    async getOwingExpenses() {
        try {
            let userid = window.sessionStorage.getItem('userid');
            let response = await fetch(`/expenses/households/${this.state.houseid}/roommates/${userid}/owing`, {
                method: 'GET'
            });
            let data = await response.json();
            return data;
        } catch (e) {console.log(e);}
    }

    // TODO: add connection to backend
    parentDidUpdate = (e) => {
        if (e.hasOwnProperty('houseid') && e.hasOwnProperty('housename')) {
            this.setState({
                houseid: e.houseid,
                housename: e.housename
            }, async ()=>{
                let owedExpenses = await this.getOwedExpenses();
                let owingExpenses = await this.getOwingExpenses();
                this.setState({
                    owedExpenses: owedExpenses,
                    owingExpenses: owingExpenses
                });
            });
        }
    }
}