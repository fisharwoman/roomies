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
import {Button, Form, Col} from 'react-bootstrap';

const theme = createMuiTheme({ palette: { type: "light", primary: blue } });

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      currentDate: new Date(),
      isAddingEvent: false,
      isAddingReminder: false
    };
  }

  currentDateChange(currentDate) {
    this.setState({ currentDate: currentDate })
  };

  addReminder() {
    this.setState({
      isAddingEvent: false,
      isAddingReminder: !this.state.isAddingReminder
    });
  }

  addEvent() {
    this.setState({
      isAddingEvent: !this.state.isAddingEvent,
      isAddingReminder: false
    });
  }

  addCalendarEntryCallback(calEntry) {
    alert("Submitted Event of "+JSON.stringify(calEntry));
    this.setState({
      isAddingEvent: false,
      isAddingReminder: false
    });
  }



  render() {
    const { data, currentDate } = this.state;
    return (
          <MuiThemeProvider theme={theme}>
            <Paper>
              <Button inline size={'sm'} className={'calendar-button'} variant={'outline-primary'} onClick={()=>this.addEvent()}>Add Event</Button>
              <Button inline size={'sm'} className={'calendar-button'} variant={'outline-primary'} onClick={() => this.addReminder()}>Add Reminder</Button>
              <AddCalendarEvent callback={this.addCalendarEntryCallback.bind(this)} isReminder={this.state.isAddingReminder} isEvent={this.state.isAddingEvent}/>
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

class AddCalendarEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      startDate: "",
      endDate: "",
      reminderDate: "",
      location: "",
      reminding: []
    }
  }

  render() {
    if (this.props.isReminder) {
      return (
          <Form onSubmit={e=>this.handleSubmit(e,'reminder')}>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Title</Form.Label>
                <Form.Control onChange={e=>this.setState({title: e.target.value})} placeholder={"Title"}/>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Reminder Date</Form.Label>
                <Form.Control onChange={e=>this.setState({reminderDate: e.target.value})} type={'datetime-local'}/>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Control type={'submit'}/>
              </Form.Group>
            </Form.Row>
          </Form>
      )
    } else if (this.props.isEvent) {
      return (
          <Form onSubmit={(e) => this.handleSubmit(e, 'event')}>
              <Form.Group as={Col}>
                <Form.Label>Title</Form.Label>
                <Form.Control onChange={e=>this.setState({title: e.target.value})} placeholder={"Title"}/>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Start</Form.Label>
                <Form.Control onChange={e=>this.setState({startDate: e.target.value})} type={'datetime-local'}/>
                <Form.Label>End</Form.Label>
                <Form.Control onChange={e=>this.setState({endDate: e.target.value})} type={'datetime-local'}/>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Location</Form.Label>
                <Form.Control onChange={e=>this.setState({location: e.target.value})} placeholder={"Location"}/>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Control type={'submit'}/>
              </Form.Group>
          </Form>
      )
    } else {
      return (null);
    }
  }

  handleSubmit(e,type) {
    e.preventDefault();
    if (type === 'event') {
      this.props.callback({
        title: this.state.title,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        location: this.state.location,
      });
    } else {
      this.props.callback({
        title: this.state.title,
        reminderDate: this.state.reminderDate,
        reminding: this.state.reminding
      });
    }
  }
}