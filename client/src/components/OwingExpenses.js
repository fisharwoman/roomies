import React from 'react';
import {
    Table, Button
} from 'react-bootstrap';

export default class OwingExpenses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            houseid: props.houseid,
            expenses: []
        }
    }
    render() {
        if (this.state.expenses.length === 0) {
            return (<div></div>);
        }
        return (
            <div>
                <h3>Owing expenses</h3>
                <Table>
                    <thead>
                        <tr>
                            <td>Description</td>
                            <td>Amount</td>
                            <td>Roommate Owed</td>
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
                            <td></td>
                        </tr>
                    </tfoot>
                </Table>
            </div>
            
        )
    }

    async componentDidMount() {
        let data = await this.getPartialExpenses();
        // TODO Convert lender ID to name
        this.setState({
            expenses: data
        });
    }

    async getPartialExpenses() {
        try {
            let response = await fetch(`expenses/splits/borrower/${this.props.userid}`, {
                method: "GET"
            });
            let data = await response.json(); 
            return data;
        } catch (e) {
            throw e;
        }
    }

    makePartialExpenses() {
       return this.state.expenses.map((value) => {
           return (
               <tr key={value.expenseid}>
                   <td>{value.description}</td>
                   <td>{value.amount}</td>
                   <td>{value.lender}</td>
                   <td>
                       {value.datepaid !== null ? 
                       value.datepaid : 
                       <Button value={value.expenseid} onClick={e => this.makePayment(e)} variant={'outline-success'}>Pay</Button>
                       }
                    </td>
               </tr>
           )
       })
    }

    async makePayment(e) {
       let expenseid = e.target.value;
        try {
            const response = await fetch(`/expenses/expense/splits/pay/${expenseid}/${this.props.userid}`, {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json'
                }
            });
            const date = await response.json();
            let data = this.state.expenses;
            for (let o of data) {
                console.log(o);
                if (o.expenseid === expenseid) {
                    o.datepaid = date.datepaid
                }
            }
            this.setState({
                expenses: data
            });
        } catch (e) {
            console.log(e);
        }
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