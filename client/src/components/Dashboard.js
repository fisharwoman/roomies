import React, { Component } from "react";
import WidgetBulletin from './DashboardWidgets/Widget-Bulletin';
import WidgetExpenses from './DashboardWidgets/Widget-Expenses';
import WidgetReminders from './DashboardWidgets/Widget-Reminders';
 
class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            houseid: this.props.houseid,
            housename: this.props.housename,
        };
        this.observers = [];
    }

    render() {
        let userid = window.sessionStorage.getItem('userid');
        return (
            <div>
                <div style={{width: "50%"}}>
                    <WidgetBulletin addObserver={this.subscribeToChanges} userid={userid} houseid={this.state.houseid}/>
                </div>
                <div style={{float: 'left', width: "47%"}}>
                    {/*Put other widgets in this div only*/}
                    <WidgetReminders addObserver={this.subscribeToChanges} houseid={this.state.houseid} housename={this.state.housename}/>
                    <WidgetExpenses/>
                </div>
            </div>
        );
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.observers.forEach((value) => value({houseid: nextProps.houseid,
        housename: nextProps.housename}));
        this.setState({
            houseid: nextProps.houseid,
            housename: nextProps.housename
        });
    }

    subscribeToChanges = (notify) => {
        this.observers.push(notify);
    }
}

export default Dashboard;
