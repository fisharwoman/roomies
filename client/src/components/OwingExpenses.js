import React from 'react';
import {
    Table, Button
} from 'react-bootstrap';

export default class OwingExpenses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            houseid: props.houseid,
            expenses: [],
            total: ""
        }
        this.props.addObserver(this.parentDidUpdate);
    }
    render() {
        return (
            <div>
                <h4>Owing expenses</h4>
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
        let total = await this.getTotalOwing();
        this.setState({
            expenses: data,
            total: total.total
        });
    }

    async getPartialExpenses() {
        try {
            let response = await fetch(`expenses/splits/household/${this.state.houseid}/borrower/${this.props.userid}`, {
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
                   <td>{value.lendername}</td>
                   <td>
                       {value.datepaid !== null ? 
                       this.formatDate(value.datepaid) : 
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
                // console.log(o);
                if (o.expenseid === expenseid) {
                    o.datepaid = date.datepaid;
                }
            }
            let total = await this.getTotalOwing();
            this.setState({
                expenses: data,
                total: total.total
            });
        } catch (e) {
            console.log(e);
        }
    }

    formatDate = (date) => {
        let dateFormat = new Date(date);
        let newDate = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: '2-digit'
        }).format(dateFormat);
       //  console.log(newDate)
        return `${newDate}`
    }

    async getTotalOwing() {
        try {
            let userid = window.sessionStorage.getItem('userid');
            let response = await fetch(`/expenses/splits/household/${this.state.houseid}/borrower/${userid}/total`,{
                method: 'GET'
            });
            let data = await response.json();
            return data;
        } catch (e) {
            throw e;
        }
    }

    sumOwing() {
        return (
            <td>{this.state.total}</td>
        )
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            houseid: newProps.houseid
        });
    }

    parentDidUpdate = async (e) => {
        try {
            if (e.hasOwnProperty('houseid')) {
                this.setState({houseid: e.houseid}, async () => {
                    let data = await this.getPartialExpenses();
                    let total = await this.getTotalOwing();
                    // TODO Convert lender ID to name
                    this.setState({
                        expenses: data,
                        total: total.total
                    });
                })
            }
        } catch (e) {
            console.log(e);
        }
    }




}