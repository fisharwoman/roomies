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
        return (
            <div>
                <h3>Owing expenses</h3>
                <Table>
                    <thead>
                        <tr>
                            <td>Description</td>
                            <td>Amount</td>
                            <td>Roommate Owed</td>
                            <td>Paid?</td>
                            <td>asdfasd</td>
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
                            <td></td>
                        </tr>
                    </tfoot>
                </Table>
            </div>
            
        )
    }

    async componentDidMount() {
        let data = await this.getPartialExpenses();
        console.log(data);
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
        return (
            <tr>
                <td>Test data</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        )
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