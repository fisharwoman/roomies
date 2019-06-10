import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import AddRoomForm from "./AddRoomForm";

export default class Expenses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // houseName: this.props.house.name ? this.props.house.name : "House Name",
            // address: this.props.house.address,
            // roommates: this.props.house.roommates,
            // rooms: this.props.house.rooms,
            houseid: props.selectedHousehold.houseid,
            // roommateid: window.sessionStorage.getItem('userid'),
            // roomname: "",
            showAddRoomForm: false,
            // showAddRMForm: false,
            // showEditHouseForm: false,
            expenses: []
        };
        // //  console.log(JSON.stringify(this.state));
        // this.handleAddRoom = this.handleAddRoom.bind(this); // may or may not need this
        // this.addNewRoom = this.addNewRoom.bind(this);
        // this.handleAddRM = this.handleAddRM.bind(this); // may not need this
        // this.addNewRM = this.addNewRM.bind(this);
        // this.editHouse = this.editHouse.bind(this);
    }

    render() {
        return(
        <div id={'expensesComponent'}>
            <Table hover size={'sm'}>
                <thead>
                <tr>
                    <th>Expenses</th>
                </tr>
                </thead>
                <tbody>
                {this.buildExpenseRows()}
                </tbody>
                <tfoot>
                <tr>
                </tr>
                </tfoot>
            </Table>
            {this.state.showAddRoomForm ?
                <AddRoomForm addNew={this.addNewRoom}/> :
                null
            }
        </div>
        );
    }

    async componentDidMount() {
        const data = await this.getHouseholdExpenses();
        this.setState({
            expenses: data
        });
    }

    async getHouseholdExpenses() {
        try {
            const response = await fetch(`/expenses/household/${this.state.houseid}/`, {
                method: "GET",
                headers: {
                    "content-type": 'application/json'
                }
            });
            let data = await response.json();
            return data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    buildExpenseRows() {
        return this.state.expenses.map((value)=> {
            return (<tr><td>{value.expenseid}</td></tr>)
        })
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            houseid: newProps.selectedHousehold.houseid
        });
    }

//     <div id={'expensesComponent'}>
//     <Table hover size={'sm'}>
//         <thead>
//         <tr>
//             <th>Roommates</th>
//         </tr>
//         </thead>
//         <tbody>
//         {this.makeRoommates()}
//         </tbody>
//         <tfoot>
//         <tr>
//             <td><Button variant={"outline-success"} onClick={this.handleAddRM.bind(this)}>Add
//                 Roommate</Button></td>
//         </tr>
//         </tfoot>
//     </Table>
//     {this.state.showAddRMForm ?
//         <AddRMForm addNew={this.addNewRM}/> :
//         null
//     }
// </div>
}