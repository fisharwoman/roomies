import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import { ViewState, EditingState} from "@devexpress/dx-react-scheduler";
import {
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
import './styles/calendar.css';
import {Button} from 'react-bootstrap';

const theme = createMuiTheme({ palette: { type: "light", primary: blue } });


export default class Calendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      currentDate: new Date()
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
              <Button size={'sm'} className={'calendar-button'} variant={'outline-primary'}>Add Event</Button>
              <Button size={'sm'} className={'calendar-button'} variant={'outline-primary'}>Add Reminder</Button>
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
                  <AppointmentTooltip showCloseButton={true} showDeleteButton={true}/>
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
          type: 'reminder'
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
          title: value.title + ` (${value.roomname})`,
          startDate: new Date(value.startdate),
          endDate: endDate,
          id: value.eventid,
          location: value.roomname,
          type: 'event'
        }
      });
      return data;
    } catch (e) {throw e;}
  }

  async commitChanges({added, changed, deleted}) {
    let data = this.state.data;
    if (deleted) {
      try {
        let appointment = data.filter(appt => appt.id === deleted);
        if (appointment[0].type === 'event') {
          await fetch(`/calendar-entries/events/${deleted}`, {
            method: 'DELETE',
          });
        } else {
          await fetch(`/calendar-entries/reminders/${deleted}`, {
            method: 'DELETE'
          });
        }
        data = data.filter(appt => appt.id !== deleted);
        this.setState({data: data});
      } catch (e) {console.log(e.message);}
    }
  }
}
