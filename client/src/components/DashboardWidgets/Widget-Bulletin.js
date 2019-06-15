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
            isShowingEditor: false,
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
                    this.state.bulletins.length === 0 ?
                        null :
                        <ul className={'scrollable'}>{this.makeBulletins()}</ul>
                }
                {
                    this.state.isShowingEditor ?
                        this.makeEditor() :
                        null
                }
                <Button onClick={() => this.setState({isShowingEditor: !this.state.isShowingEditor})}>
                    Create Post</Button>
            </div>
        )
    }

    async componentDidMount() {
        try {
            let data = await this.getBulletins();
            console.log(data);
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
        return (
            <Form onSubmit={() => this.addBulletin()}>
                <Form.Row>
                    <Col>
                        <Form.Group>
                            <Form.Label >Title</Form.Label>
                            <Form.Control onChange={e => this.handleTitle(e)}/>
                        </Form.Group>
                    </Col>
                    <Col xs={6}>
                        <Form.Group>
                            <Form.Label>Message</Form.Label>
                            <Form.Control
                                as={'textarea'} placeholder={'Enter your message here'}
                                onChange={e => this.handleBody(e)}
                            ></Form.Control>
                        </Form.Group>
                    </Col>
                    <Col xs={2}>
                        <Button variant={'outline-primary'} type={'submit'}>Post</Button>
                    </Col>
                </Form.Row>
            </Form>
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
        let formattedDate = new Date(date);
        return `${formattedDate.getFullYear()}-${formattedDate.getMonth()}-${formattedDate.getDate()}`;
    }

    async deleteBulletin() {
        try {
            await this.props.deleteBulletin(this.props.data.bid);
        } catch (e) {
            throw e;
        }
    }
}