import React, { Component } from "react";
import WidgetBulletin from './DashboardWidgets/Widget-Bulletin';
import WidgetExpenses from './DashboardWidgets/Widget-Expenses';

 
class Dashboard extends Component {
  render() {
    return (
      <div style={{position: 'float'}}>
        <WidgetBulletin houseid={1}/>
        <WidgetExpenses/>
      </div>
    );
  }
}

export default Dashboard;
