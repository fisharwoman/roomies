import React, { Component } from "react";
import WidgetBulletin from './DashboardWidgets/Widget-Bulletin';
import WidgetExpenses from './DashboardWidgets/Widget-Expenses';

 
class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            houseid: this.props.houseid,
        };
        this.observers = [];
    }

    render() {
        let userid = window.sessionStorage.getItem('userid');
        return (
            <div>
                <div style={{width: "50%"}}>
                    <WidgetBulletin addObserver={this.subscribeToChanges.bind(this)} userid={userid} houseid={this.state.houseid}/>
                </div>
                <div style={{float: 'left', width: "30%"}}>
                    {/*Put other widgets in this div only*/}
                    <WidgetExpenses/>
                </div>
            </div>
        );
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.observers.forEach((value) => value({houseid: nextProps.houseid}));
        this.setState({
            houseid: nextProps.houseid
        });
    }

    subscribeToChanges(notify) {
        this.observers.push(notify);
    }
}

export default Dashboard;
