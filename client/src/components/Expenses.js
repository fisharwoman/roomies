import React from 'react';
import OwedExpenses from './OwedExpenses';
import OwingExpenses from './OwingExpenses';
import {
    Button, Table, Form, Col,
} from 'react-bootstrap';
import AddRoomForm from "./AddRoomForm";

export default class Expenses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            houseid: props.selectedHousehold.houseid,
            isShowingOwed: true,
            isShowingReportMaker: false
        };
        this.observers = [];
    }

    render() {
        return(
            <div id={'expensesComponent'}>
                <h3>Expenses</h3>
                <Button variant={'outline-primary'} onClick={()=>{this.handleViewSwitcher(true)}}>Owed</Button>
                <Button variant={'outline-primary'} onClick={()=>{this.handleViewSwitcher(false)}}>Owing</Button>
                <Button variant={'outline-primary'} onClick={() => {this.setState({isShowingReportMaker: !this.state.isShowingReportMaker})}}>
                    Build Report
                </Button>
                {
                    this.state.isShowingReportMaker ?
                        <BuildReport addObserver={this.addObserver} houseid={this.state.houseid}/> :
                        null
                }
                {this.state.isShowingOwed ?
                    <OwedExpenses  userid={window.sessionStorage.getItem("userid")} houseid={this.state.houseid}/> :
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

    addObserver = (notify) => {
        this.observers.push(notify);
    };

    // componentWillReceiveProps(newProps) {
    //     this.setState({
    //         houseid: newProps.selectedHousehold.houseid
    //     });
    // }

    parentDidUpdate = (e) => {
        if (e.hasOwnProperty('houseid')) {
            this.setState({
                houseid: e.houseid
            },() => {
                this.observers.forEach((v)=>{v(e)});
            });
        }
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

class BuildReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            houseid: this.props.houseid,
            selectedColumns: []
        };
        this.props.addObserver(this.parentDidUpdate);
    }

    render() {
        return(
            <Form style={{display:'block', width: '400px', margin: '20px'}} inline onSubmit={(e) => {this.handleSubmit(e)}}>
                <Form.Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>Columns to include in report</Form.Label>
                            <Form.Control size={'sm'} as={'select'} multiple onChange={(e) => {this.handleSelect(e.target.options)}}>
                                <option value={'expensedate'}>Date of Expense</option>
                                <option value={'amount'}>Amount</option>
                                <option value={'expensedescription'}>Expense Description</option>
                                <option value={'typedescription'}>Expense Type</option>
                                <option value={'categorydescription'}>Expense Category</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Button type={'submit'}>Download CSV</Button>
                    </Col>
                </Form.Row>
            </Form>
        )
    }

    handleSelect(options) {
        let data = [];
        for (let o of options) {
            if (o.selected) data.push(o.value);
        }
        this.setState({
            selectedColumns: data
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        try {
            await this.sendReport();
        } catch (e) {
            console.log(e);
        }
    }

    async sendReport() {
        try {
            let userid = window.sessionStorage.getItem('userid');
            if (this.state.selectedColumns.length === 0) {alert('At least one column needs to be selected'); return;}
            let cols = JSON.stringify({cols: this.state.selectedColumns, houseid: this.state.houseid});
            let response = await fetch(`/expenses/roommates/${userid}/report`, {
                method: 'POST',
                headers: {
                    "content-type": 'application/json'
                },
                body: cols
            });
            let data = await response.json();
            let csvString = this.makeCsvString(data);
            let blob = new Blob([csvString],{type: 'text/csv;charset=utf-8;'});
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(blob, "report.csv");
            } else {
                let link = document.createElement('a');
                let url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "report.csv");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (e) {
            console.log(e);
        }
    }

    makeCsvString(data) {
        let csv = "";
        const newLine = "\n";
        if (data.length === 0) return;
        const keys = Object.keys(data[0]);
        console.log(keys);
        csv += this.makeCsvHeader(keys);
        csv += newLine;
        for (let line of data) {
            csv += this.makeCsvLine(line, keys);
            csv += newLine;
        }
        return csv;
    }

    makeCsvHeader(columns) {
        let header = "";
        let comma = ',';
        for (let h of columns) {
            header += h;
            header += comma;
        }
        return header;
    }

    makeCsvLine(data, keys) {
        let line = "";
        let comma = ",";
        for (let key of keys) {
            let o = data[key];
            if (typeof o === "string") {
                o = o.replace(',','');
            }
            line += o;
            line += comma;
        }
        return line;
    }

    parentDidUpdate = (e) => {
        if(e.hasOwnProperty('houseid')) {
            this.setState({
                houseid: e.houseid
            });
        }
    }

}