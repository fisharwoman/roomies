import React from 'react';
import '../styles/Widgets.css';
import {Button, Card} from 'react-bootstrap';


export default class WidgetReminders extends React.Component{

    constructor(props) {
        console.log(props)
        super(props);
        this.state = {
            housename: this.props.housename,
            houseid: this.props.houseid,
            reminders:[],
        };
    }

    render() {
        return (
            <div className={'content-window'}>
                <h4>Reminders for everyone in {this.props.housename}</h4>
                {
                    this.state.reminders.length === 0 ?
                        null :
                        <ul className={'scrollable'}>{this.makereminders()}</ul>
                }
            </div>
        )
    }

    async componentDidMount() {
        try {
            let data = await this.getRemindersToAll();
            // console.log(data);
            this.setState({
                reminders: data
            });
        } catch (e) {
            console.log(e);
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        try {
            if (prevState.houseid !== this.state.houseid) {
                let data = await this.getRemindersToAll();
                this.setState({
                    reminders: data
                });
            }
        } catch (e) {
            console.log(e);
        }
    }


    getRemindersToAll = async () => {
        try {
            let response = await fetch(`/calendar-entries/reminderstoall/houses/${this.state.houseid}`, {
                method: 'GET'
            });
            let data = await response.json();
            return data;
        } catch (e) {
            throw e;
        }
    }

    makereminders = () => {
        // console.log(this.state.reminders);
        return this.state.reminders.map((value,index) => {
            console.log(value)
            return(
                <li  className={'scrollable-item'} key={index}>
                <ReminderCard data={value}/>
                </li>
            );
        })
    }

    parentDidUpdate = (e) => {
        if (e.hasOwnProperty('houseid')) {
            this.setState({
                houseid: e.houseid
            });
        }
    }
}


class ReminderCard extends React.Component{
         render() {
             return(
                <Card border= "secondary" bg="info" text="white" style={{ width: '15rem' }}>
                {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                <Card.Body>
                  <Card.Title>{this.props.data.title}</Card.Title>
                  <Card.Text> <small>Date: {this.formatDate(this.props.data.reminderdate)} </small>
                  </Card.Text>
                </Card.Body>
              </Card>
             )
         }

         formatDate = (date) => {
             let dateFormat = new Date(date);
             let newDate = new Intl.DateTimeFormat('en-US', {
                 year: 'numeric',
                 month: 'long',
                 day: '2-digit'
             }).format(dateFormat);
             console.log(newDate)
             return `${newDate}`
         }
       
       
}
