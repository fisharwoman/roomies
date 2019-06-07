import React from 'react';
import Collapsible from "./Collapsible";
import Button from "react-bootstrap/Button";
import './Management.css';


export default class Management extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddCollapsible: false,
        };
        this.onAddClick = this.onAddClick.bind(this);
    }

    onAddClick() {
        this.setState(prevState => ({
            showAddCollapsible: !prevState.showAddCollapsible
        }));
    }

    render() {
        return (
            <div className={"Add"}>
                Households
                <input type={"button"} className={"ab"} name={"AddButton"} onClick={this.onAddClick.bind(this)} value={"Add"}/>
                <input type={"button"} className={"eb"} name={"EditButton"} onClick={buttonAction.bind(this)} value={"Edit"}/>
                <input type={"button"} className={"rb"} name={"RemoveButton"} onClick={buttonAction.bind(this)} value={"Remove"}/>
                {this.state.showAddCollapsible ?
                    <Collapsible /> :
                    null
                }
            </div>
        );


        function buttonAction() {
            console.log("button pressed console");
            alert("button pressed alert");
        }
    }

}
