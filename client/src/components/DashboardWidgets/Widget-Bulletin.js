import React from 'react';
import '../styles/Widgets.css';

export default class WidgetBulletin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            houseid: this.props.houseid,
            bulletins: [
                {
                    title: "Pizza in the fridge",
                    body: "lorem ipsum doler",
                    creator: "Ross Geller",
                    datecreated: '2019-06-14 07:00'
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
                </div>
            )
        }
    }

    makeBulletins() {
        return this.state.bulletins.map((value,index) => {
            return(<li className={'bulletin-object'} key={index}><BulletinPost data={value}/></li>);
        })
    }
}

class BulletinPost extends React.Component {
    render() {
        return (
            <div>
                <h5>{this.props.data.title}</h5>
                <p>{this.props.data.body}</p>
                <small><em>{"Posted by: " + this.props.data.creator + " on " + this.props.data.datecreated}</em></small>
            </div>
        )
    }
}