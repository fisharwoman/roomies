import React from 'react';
import '../styles/Widgets.css';
import {Button} from 'react-bootstrap';

export default class WidgetBulletin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            houseid: this.props.houseid,
            bulletins: [
                {
                    title: "Pizza in the fridge",
                        body: "Happiness happens when you shape music so sincerely that whatsoever you are growing is your meditation. One must synthesise the wind in order to emerge the spirit of unconditional dimension.",
                    name: "RG",
                    datecreated: '2019-06-14 07:00',
                    createdby: 3
                },
                {
                    title: "I'm cooking dinner",
                    body: "Mix each side of the pickles with one jar of carrots.",
                    name: "MG",
                    datecreated: '2019-06-14 12:00',
                    createdby: 2
                }
            ]
        }
    }

    render() {
        if (this.state.bulletins.length === 0) {
            return (
                <div>
                    <h4>Looks like there aren't any bulletins posted yet. Why dont you break the ice...</h4>
                </div>
            )
        } else {
            return (
                <div className={'content-window'}>
                    <h4>Household Bulletins:</h4>
                    <ul>
                        {this.makeBulletins()}
                    </ul>
                    <Button>Create Post</Button>
                </div>
            )
        }
    }

    makeBulletins() {
        return this.state.bulletins.map((value,index) => {
            return(<li  key={index}><BulletinPost data={value} userid={2}/></li>);
        })
    }
}

class BulletinPost extends React.Component {
    render() {
        return (
            <div style={{display: 'inline-block'}}>
                <div id={'bulletin-creator'}>{this.props.data.name}</div>
                <div className={'talk-bubble tri-right left-top'}>
                    <h5>{this.props.data.title}</h5>
                    <p>{this.props.data.body}</p>
                    <small><em>{"Posted: " + this.props.data.datecreated}</em></small>
                    {this.props.data.createdby === this.props.userid ?
                        <Button style={{float: 'right'}} size={'sm'} variant={'outline-danger'}>Remove</Button> :
                        null
                    }
                </div>
            </div>
        )
    }
}