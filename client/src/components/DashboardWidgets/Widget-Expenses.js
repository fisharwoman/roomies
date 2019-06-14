import React from 'react';
import '../styles/Widgets.css';


export default class WidgetExpenses extends React.Component {
    render() {
        return (
            <div className={'content-window'}>
                <h4>In debt to this household</h4>
                <p>There will be an amount here of some sort</p>
            </div>
        )
    }
}