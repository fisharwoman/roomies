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
      selectedHousehold: this.props.selectedHousehold,
      data: [],
      currentDate: new Date(),
      isAddingEvent: false,
      isAddingReminder: false,
      roomnames: [],
      roommates: [],
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

  async addCalendarEntryCallback(calEntry) {
    try {
      calEntry.houseid = this.state.selectedHousehold.houseid;
      if (calEntry.type === 'event') {
        let response = await fetch('/calendar-entries/events', {
          method: 'POST',
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify(calEntry)
        });
        if (response.status === 200) {
          this.setState({
            isAddingEvent: false,
            isAddingReminder: false
          }, this.componentDidMount);
        }
      } else {
          let response = await fetch('/calendar-entries/reminders', {
            method: 'POST',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify(calEntry)
          });
          if (response.status === 200) {
            this.setState({
              isAddingEvent: false,
              isAddingReminder: false
            }, this.componentDidMount);
          }
      }
    } catch (e) {console.log(e.message);}
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      selectedHousehold: nextProps.selectedHousehold
    }, this.componentDidMount);
  }


  render() {
    let data = this.state.data;
    const currentDate = this.state.currentDate;

    return (
          <MuiThemeProvider theme={theme}>
            <Paper>
              <Button inline size={'sm'} className={'calendar-button'} variant={'outline-primary'} onClick={()=>this.addEvent()}>Add Event</Button>
              <Button inline size={'sm'} className={'calendar-button'} variant={'outline-primary'} onClick={() => this.addReminder()}>Add Reminder</Button>
              <AddCalendarEvent callback={this.addCalendarEntryCallback.bind(this)}
                                roommates = {this.state.roommates} roomnames={this.state.roomnames}
                                isReminder={this.state.isAddingReminder} isEvent={this.state.isAddingEvent}/>
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
      let houseID = this.state.selectedHousehold;
      if (!houseID) return;
      else {
        let data = await this.loadData(houseID);
        console.log(data);
        let roomnames = await this.getRoomnamesOfHousehold();
        let roommates = await this.getRoommatesOfHousehold();
        console.log(data);
        this.setState({
          data: data,
          roommates: roommates,
          roomnames: roomnames
        });
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  async loadData(houseID) {
    houseID = houseID.houseid;
    console.log(houseID);
    let reminders = await this.getReminders(houseID);
    let events = await this.getEvents(houseID);
    let data = reminders.concat(events);
    return data;
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

  /* Gets the roomnames of a given household */
  async getRoomnamesOfHousehold() {
    try {
      let houseid = this.state.selectedHousehold.houseid;
      let response = await fetch(`/households/${houseid}/rooms`, {
        method: 'GET',
        headers: {
          "content-type": 'application/json'
        }
      });
      let data = await response.json();
      data = data.map(value => {return value.roomname});
      return data;
    } catch (e) {console.log(e);}
  }

  /* Gets info on the roommates of a given household */
  async getRoommatesOfHousehold() {
    try {
      let houseid = this.state.selectedHousehold.houseid;
      let response = await fetch(`/households/${houseid}/roommates`,{
        method:'GET',
        headers: {
          "content-type": 'application/json'
        }
      });
      let data = await response.json();
      return data;
    } catch (e) {console.log(e);}
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


/**
 * A form to add an element to the calendar
 */

class AddCalendarEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      startDate: "",
      endDate: "",
      reminderDate: "",
      location: "",
      reminding: [],
      roommates: this.props.roommates,
      roomnames: this.props.roomnames,
    }
  }

  render() {
    if (this.props.isReminder) {
      return (
          <Form style={{display: 'inline'}} onSubmit={e=>this.handleSubmit(e,'reminder')}>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Title</Form.Label>
                <Form.Control onChange={e=>this.setState({title: e.target.value})} placeholder={"Title"}/>
                <Form.Label>Reminder Date</Form.Label>
                <Form.Control onChange={e=>this.setState({reminderDate: e.target.value})} type={'datetime-local'}/>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Which roommates should be reminded</Form.Label>
                <Form.Control onChange={e=>{this.handleRoommateSelect(e.target.options);}} size={'sm'} as={'select'} multiple>
                  {this.makeRoommates()}
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Create Reminder</Form.Label>
                <Form.Control type={'submit'}/>
              </Form.Group>
            </Form.Row>
          </Form>
      )
    } else if (this.props.isEvent) {
      return (
          <Form style={{display: 'inline'}} onSubmit={(e) => this.handleSubmit(e, 'event')}>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Title</Form.Label>
                <Form.Control onChange={e=>this.setState({title: e.target.value})} placeholder={"Title"}/>
                <Form.Label>Location</Form.Label>
                <Form.Control onChange={e=>this.setState({location: e.target.value})} as={'select'}>
                  <option>Select a location...</option>
                  {this.makeLocations()}
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Start</Form.Label>
                <Form.Control onChange={e=>this.setState({startDate: e.target.value})} type={'datetime-local'}/>
                <Form.Label>End</Form.Label>
                <Form.Control onChange={e=>this.setState({endDate: e.target.value})} type={'datetime-local'}/>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Create Event</Form.Label>
                <Form.Control type={'submit'}/>
              </Form.Group>
            </Form.Row>
          </Form>
      )
    } else {
      return (null);
    }
  }

  makeLocations() {
    return this.state.roomnames.map((value) => {
      return (<option value={value}>{value}</option>)
    });
  }

  makeRoommates() {
    return this.state.roommates.map((value) => {
      return(<option value={value.userid}>{value.name}</option>);
    });
  }

  handleSubmit(e,type) {
    e.preventDefault();
    if (type === 'event') {
      this.props.callback({
        title: this.state.title,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        location: this.state.location,
        type: type
      });
    } else {
      this.props.callback({
        title: this.state.title,
        reminderDate: this.state.reminderDate,
        reminding: this.state.reminding,
        type: type
      });
    }
  }

  handleRoommateSelect(options) {
    let data = [];
    for (let o of options) {
      if (o.selected) data.push(o.value);
    }
    this.setState({reminding: data});

  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      roomnames: nextProps.roomnames,
      roommates: nextProps.roommates
    });
  }
}