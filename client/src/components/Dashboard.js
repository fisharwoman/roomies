import React, { Component } from "react";
import WidgetBulletin from './DashboardWidgets/Widget-Bulletin';
import WidgetExpenses from './DashboardWidgets/Widget-Expenses';

 
class Dashboard extends Component {

    render() {
        let userid = window.sessionStorage.getItem('userid');
        return (
            <div>
                <div style={{width: "50%"}}>
                    <WidgetBulletin houseid={1}/>
                </div>
                <div style={{float: 'left', width: "30%"}}>
                    <WidgetExpenses/>
                </div>
            </div>
        );
    }
}

export default Dashboard;
