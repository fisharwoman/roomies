import React from 'react';
import '../styles/Widgets.css';
import {Button, Form, Col} from 'react-bootstrap';

export default class WidgetBulletin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            houseid: this.props.houseid,
            bulletins:[],
            userid: this.props.userid,
            isShowingEditor: true,
            newBulletin: {
                title: '',
                body: '',
            }
        };
        this.props.addObserver(this.parentDidUpdate.bind(this));
    }

    render() {
        return (
            <div className={'content-window'}>
                <h4>Household Bulletins</h4>
                {
                    this.state.bulletins.length === -1 ?
                        null :
                        <ul className={'scrollable'}>{this.makeBulletins()}</ul>
                }
                <strong><span>Compose New Bulletin</span></strong>
                {this.makeEditor()}
            </div>
        )
    }

    async componentDidMount() {
        try {
            let data = await this.getBulletins();
            // console.log(data);
            this.setState({
                bulletins: data
            });
        } catch (e) {
            console.log(e);
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        try {
            if (prevState.houseid !== this.state.houseid) {
                let data = await this.getBulletins();
                this.setState({
                    bulletins: data
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    async getBulletins() {
        try {
            let response = await fetch(`/bulletins/${this.state.houseid}`, {
                method: 'GET'
            });
            let data = await response.json();
            data = data.map((value) => {
                value.name = value.name.split(' ').map((n)=>n[0]).join('');
                return value;
            });
            return data;
        } catch (e) {
            throw e;
        }
    }

    makeBulletins() {
        return this.state.bulletins.map((value,index) => {
            return(
                <li  className={'scrollable-item'} key={index}>
                <BulletinPost deleteBulletin={this.deleteBulletin.bind(this)} data={value} userid={this.state.userid}/>
                </li>
            );
        })
    }


    makeEditor() {
        let name = this.props.username.split(' ').map((n)=>n[0]).join('');
        return (
            <div style={{borderTopStyle: 'solid', borderTopWidth: '1px', borderTopColor: 'lightgray', paddingTop: '5px'}}>
                <div id={'bulletin-creator'}>{name}</div>
                <div style={{display:'inline-block'}} className={'talk-bubble tri-right left-top'}>
                    <input autoComplete={"false"} id={'new-bulletin-title'} onChange={(e) => this.handleTitle(e)} style={{backgroundColor: 'transparent', borderStyle: 'none', width:'100%', borderBottomStyle: 'solid', borderBottomWidth: '1pt'}} placeholder={'Title'}/>
                    <textarea id={'new-bulletin-text'} onChange={(e) => this.handleBody(e)} style={{backgroundColor: 'transparent', borderStyle: 'none', width:'100%'}} placeholder={'Message...'}/>
                </div>
                <Button variant={'outline-primary'} onClick={this.handleSubmit}>Post</Button>
            </div>
        )
    }

    handleTitle(e) {
        let obj = this.state.newBulletin;
        obj.title = e.target.value;
        this.setState({newBulletin: obj});
    }

    handleBody(e) {
        let obj = this.state.newBulletin;
        obj.body = e.target.value;
        this.setState({newBulletin: obj});
    }

    parentDidUpdate(e) {
        if (e.hasOwnProperty('houseid')) {
            this.setState({
                houseid: e.houseid
            });
        }
    }

    handleSubmit = async () => {
        if (this.state.newBulletin.title === '' || this.state.newBulletin.body === '') return;
        else try {
            await this.addBulletin();
            document.getElementById('new-bulletin-title').value = "";
            document.getElementById('new-bulletin-text').value = "";
        } catch (e) {
            console.log(e);
        }
    };

    async deleteBulletin(bid) {
        try {
            await fetch(`/bulletins/${bid}`, {
                method: 'DELETE'
            });
            let bulletins = this.state.bulletins;
            for (let i in bulletins) {
                let b = bulletins[i];
                if (b.bid === bid) {
                    bulletins.splice(i, 1);
                    break;
                }
            }
            this.setState({
                bulletins: bulletins
            });
        } catch (e) { console.log(e);}
    }

    async addBulletin() {
        try {
            let date = new Date();
            let newBulletin = {
                title: this.state.newBulletin.title,
                body: this.state.newBulletin.body,
                datecreated: date,
                createdby: this.state.userid,
                assignedto: this.state.houseid,
            };
            let result = await fetch('/bulletins/', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(newBulletin)
            });
            let nb = await result.json();
            nb.name = nb.name.split(' ').map((n)=>n[0]).join('');
            let data = this.state.bulletins;
            data.unshift(nb);
            this.setState({
                bulletins: data,
                isShowingEditor: false,
                newBulletin: {
                    title: '',
                    body: ''
                }
            });
        } catch (e) {
            console.log(e);
        }
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
                    <small><em>{"Posted: " + this.formatDate(this.props.data.datecreated)}</em></small>
                    {this.props.data.createdby === this.props.userid ?
                        <Button onClick={() => this.deleteBulletin()} style={{float: 'right'}} size={'sm'} variant={'outline-danger'}>Remove</Button> :
                        null
                    }
                </div>
            </div>
        )
    }

    formatDate(date) {
        let toFormatDate = new Date(date);
        let formattedDate =  new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: '2-digit'
        }).format(toFormatDate);
        return `${formattedDate}`;
    }

    async deleteBulletin() {
        try {
            await this.props.deleteBulletin(this.props.data.bid);
        } catch (e) {
            throw e;
        }
    }
}