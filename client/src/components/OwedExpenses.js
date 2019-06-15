import React from 'react';
import {
    Table, Button
} from 'react-bootstrap';

export default class OwedExpenses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            houseid: props.houseid,
            expenses: [],
            selectedExpenseID: null,
            partialExpenses: []
        }
    }

    render() {
        return (
            <div>
                <div>
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

                <div>
                <h3>Expense #{this.state.selectedExpenseID} Splits</h3>
                    <Table>
                        <thead>
                            <tr>
                                <td>Date</td>
                                <td>Description</td>
                                <td>Amount</td>
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
        )
    }

    async componentDidMount() {
        try {
            let data = await this.getExpenses();
            this.setState({
                expenses: data
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

    async getPartialExpenses() {
        try {
            let response = await fetch(`expenses/splits/${this.state.selectedExpenseID}`, {
                method: "GET"
            });

            let result = [];

            // TODO: iterate over response to get each partial expense
            // response.forEachAsync(async (value) => {
            //     const data = await fetch(value, {
            //         method: "GET",
            //         headers: {
            //             "content-type": 'application/json'
            //         }
            //     });
            //     result.push(await response.json(data));
            // });

            console.log(result);
            return result;

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

    async selectExpense(e) {
        await this.setState({
            selectedExpenseID: e

        })

        try {
            this.setState({

            })
            let result = await this.getPartialExpenses();
        } catch (e) {
            console.log(e);
        }
    }

    makePartialExpenses() {
        return this.state.expenses.map((value) => {
            return (
                <tr key={value.expenseid}>
                    <td>{value.date}</td>
                    <td>{value.description}</td>
                    <td>{value.amount}</td>
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