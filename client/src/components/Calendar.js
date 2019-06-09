import React, { Component } from "react";
import { render } from "react-dom";
import Paper from "@material-ui/core/Paper";
import { ViewState, EditingState} from "@devexpress/dx-react-scheduler";
import {
  AppointmentForm,
  Scheduler,
  DayView,
  WeekView,
  Appointments,
  Toolbar,
  MonthView,
  DateNavigator,
  ViewSwitcher,
  AppointmentTooltip
} from "@devexpress/dx-react-scheduler-material-ui";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";

const theme = createMuiTheme({ palette: { type: "light", primary: blue } });


export default class Calendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      currentDate: new Date(),
      addedAppointments: {},
      appointmentChanges: {},
      editingAppointmentId: undefined
    };
  }

  currentDateChange(currentDate) {
    this.setState({ currentDate: currentDate })
  };




  render() {
    const { data, currentDate } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <Paper>
          <Scheduler data={data}>
            <ViewState
                defaultCurrentViewName="Month"
                currentDate={currentDate}
                onCurrentDateChange={this.currentDateChange.bind(this)}
            />
            <EditingState onCommitChanges={this.commitChanges.bind(this)}/>
            <DayView
              startDayHour={9}
              endDayHour={22}
            />
            <WeekView startDayHour={9} endDayHour={22} />
            <MonthView />
            <Toolbar />
            <DateNavigator />
            <ViewSwitcher />
            <Appointments />
            <AppointmentTooltip/>
            <AppointmentForm/>
          </Scheduler>
        </Paper>
      </MuiThemeProvider>
    );
  }

  async componentDidMount() {
    try {
      let houseID = this.props.selectedHousehold;
      if (!houseID) return;
      else {
        houseID = houseID.houseid;
        let reminders = await this.getReminders(houseID);
        let events = await this.getEvents(houseID);
        let data = reminders.concat(events);
        console.log(data);
        this.setState({data: data});
      }
    } catch (e) {
      console.log(e.message);
    }
  }


  async getReminders(houseid)  {
    try {
      const response = await fetch('/calendar-entries/reminders/houses/'+ houseid, {
        method: 'GET',
        headers: {
            "content-type": 'application/json'
        }
      });
      let data = await response.json();
      data = data.map((value) => {
        let endDate = new Date(value.reminderdate);
        endDate.setHours(endDate.getHours() + 1);
        return {
          title: value.title,
          startDate: new Date(value.reminderdate),
          endDate: endDate,
          id: value.reminderid,
        }
      });
      return data;
    } catch (e) {throw e;}
  }

  
  async getEvents(houseid) {
    try {
      let response = await fetch('/calendar-entries/events/houses/'+ houseid, {
        method: 'GET',
        headers: {
            "content-type": 'application/json'
        }
      });
      let data = await response.json();
      data = data.map((value) => {
        let endDate = new Date(value.enddate);
        return {
          title: value.title,
          startDate: new Date(value.startdate),
          endDate: endDate,
          id: value.eventid,
        }
      });
      return data;
    } catch (e) {throw e;}
  }

  commitChanges({added, changed, deleted}) {
    let data = this.state.data;
    if (added) {
      console.log(added);
    }
  }
}


class CustomLayout extends React.Component {
  render() {
    return (
        <AppointmentTooltip.LayoutProps
          onClick={e=>{alert('clicked');}}
        />
    )
  }
}