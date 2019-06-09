import React, { Component } from "react";
import { render } from "react-dom";
import Paper from "@material-ui/core/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
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
// import { appointments } from "./data";

const theme = createMuiTheme({ palette: { type: "light", primary: blue } });

export default class Calendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      currentDate: '2019-06-10'
    };
  }

  currentDateChange = (currentDate) => { this.setState({ currentDate }) };

  render() {
    const { data, currentDate } = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        <Paper>
          <Scheduler data={data}>
          <ViewState 
              defaultCurrentViewName="Month"
              currentDate={currentDate}
              onCurrentDateChange={this.currentDateChange}/>
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
            <AppointmentTooltip showOpenButton showCloseButton/>
            <AppointmentForm readOnly />
          </Scheduler>
        </Paper>
      </MuiThemeProvider>
    );
  }

  componentDidMount = async() => {
    try {
      let houseID = this.props.selectedHousehold;
      if (houseID && houseID.houseid > 0){
        let appt1 = await this.getReminders(houseID.houseid);
        let reminders = await appt1.json();
        reminders = reminders.reduce((acc, reminder) => {
          if (!reminder.reminderid) {
            return acc;
          }
          const endDate = new Date(reminder.reminderdate);
          const endDateHr = endDate.getHours();
          endDate.setHours(endDateHr + 1);
          
          const obj1 = {
            title: reminder.title,
            startDate: new Date(reminder.reminderdate),
            endDate,
            id: reminder.reminderid,
            location: "nil"
          }
          return acc.concat(obj1);
        }, [])
        let appt2 = await this.getEvents(houseID.houseid);
        let events = await appt2.json();
        events = events.reduce((acc, event) => {
          if (!event.eventid) {
            return acc;
          }
          const endDate = new Date(event.enddate);
          const endDateHr = endDate.getHours();
          endDate.setHours(endDateHr + 1);
          
          const obj = {
            title: event.title,
            startDate: new Date(event.startdate),
            endDate,
            id: event.eventid,
            location: event.roomname
          }
          return acc.concat(obj);
        }, [])

        let appts = reminders.concat(events);
        this.setState({ data: appts })
      }
    } catch (e) {
      console.log("strange error");
    }
  }


  getReminders = async (houseid) => {
    try {
      return fetch('/calendar-entries/reminders/houses/'+ houseid, {
        method: 'GET',
        headers: {
            "content-type": 'application/json'
        }
      });
    } catch (e) {throw e;}
  }

  
  getEvents = async (houseid) => {
    try {
      return fetch('/calendar-entries/events/houses/'+ houseid, {
        method: 'GET',
        headers: {
            "content-type": 'application/json'
        }
      });
    } catch (e) {throw e;}
  }

}

render(<Calendar />, document.getElementById("root"));
