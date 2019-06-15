import React from 'react';
import OwedExpenses from './OwedExpenses';
import OwingExpenses from './OwingExpenses';
import {
    Button,
    Table
} from 'react-bootstrap';
import AddRoomForm from "./AddRoomForm";

export default class Expenses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            houseid: props.selectedHousehold.houseid,
            isShowingOwed: true
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
                <h3>Expenses</h3>
                <Button variant={'outline-primary'} onClick={()=>{this.handleViewSwitcher(true)}}>Owed</Button>
                <Button variant={'outline-primary'} onClick={()=>{this.handleViewSwitcher(false)}}>Owing</Button>
                {this.state.isShowingOwed ?
                    <OwedExpenses userid={window.sessionStorage.getItem("userid")} houseid={this.state.houseid}/> :
                    <OwingExpenses userid={window.sessionStorage.getItem("userid")} houseid={this.state.houseid}/>
                }
            </div>
        )
    }

    handleViewSwitcher(val) {
        this.setState({
            isShowingOwed: val
        });
    }


    async componentDidMount() {
       
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