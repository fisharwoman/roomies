import React from 'react';
import '../styles/Widgets.css';
import {Button, Card, Carousel} from 'react-bootstrap';


export default class WidgetReminders extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            housename: this.props.housename,
            houseid: this.props.houseid,
            reminders:[],
        };
        this.props.addObserver(this.parentDidUpdate);
    }

    render() {
        return (
            <div className={'content-window'} style={{height: '250px'}}>
                <h4>Reminders for all roommates of {this.props.housename}</h4>
                {
                    this.state.reminders.length === 0 ?
                        null :
                        <Carousel indicators={false} interval={3500}>{this.makereminders()}</Carousel>
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
                    reminders: data,
                    housename: this.state.housename
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
        return this.state.reminders.map((value,index) => {
            // console.log(value)
            // return(
            //     <Carousel.Item key={index}>
            //         <ReminderCard data={value} style={{display: 'flex', flexDirection: 'row'}}/>
            //     </Carousel.Item>
            // );
            return (<Carousel.Item key={index}><ReminderCard data={value}/></Carousel.Item>)
        })
    };

    parentDidUpdate = (e) => {
        if (e.hasOwnProperty('houseid')) {
            this.setState({
                houseid: e.houseid,
                housename: e.housename,
            });
        }
    };
}


class ReminderCard extends React.Component{
         render() {
             return(
                <Card border= "secondary" style={{ width: '25rem' }}>
                <Card.Body>
                  <Card.Text className={'text-center'}>{this.props.data.title}</Card.Text>
                </Card.Body>
                <Card.Footer className="text-muted"> <small>{this.formatDate(this.props.data.reminderdate)}</small>  </Card.Footer>
              </Card>
             );
         }

         formatDate = (date) => {
             let dateFormat = new Date(date);
             let newDate = new Intl.DateTimeFormat('en-US', {
                 year: 'numeric',
                 month: 'long',
                 day: '2-digit'
             }).format(dateFormat);
            //  console.log(newDate)
             return `${newDate}`
         }

         getCreator = async () => {
             console.log(this.props.data.creator)
            try {
                let creatorName = await fetch(`/users/${this.props.data.creator}`, {
                    method: 'GET'
            }); 
                console.log(creatorName);
                let data = await creatorName.json();
                return data.name;
            } catch (e) {
            throw e;
            }
        }       
       
}
