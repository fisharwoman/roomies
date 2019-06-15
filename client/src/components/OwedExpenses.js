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

    // async getPartialExpenses() {
    //     try {
    //         let response = await fetch(`expenses/splits/lender/${this.props.userid}`, {
    //             method: "GET"
    //         });
    //         let data = await response.json(); 
    //         return data;
    //     } catch (e) {
    //         throw e;
    //     }
    // }

    makeExpenses() {
        return this.state.expenses.map((value) => {
            return (
                <tr style={this.state.selectedExpenseID === value.expenseid ? 
                { backgroundColor:'#007bff',
                  color: 'white' } : {}} key={value.expenseid} onClick={e => this.selectExpense(value.expenseid)}>
                    <td>{value.expensedate}</td>
                    <td>{value.description}</td>
                    <td>{value.amount}</td>
                </tr>
            )
        })
    }

    selectExpense(e) {
        this.setState({
            selectedExpenseID: e
        })
        console.log(this.state.selectedExpenseID);
    }

    // makePartialExpenses() {
    //     return this.state.expenses.map((value) => {
    //         return (
    //             <tr key={value.expenseid}>
    //                 <td>{value.date}</td>
    //                 <td>{value.description}</td>
    //                 <td>{value.amount}</td>
    //             </tr>
    //         )
    //     })
    //  }

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