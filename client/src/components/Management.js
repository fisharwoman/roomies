import React from 'react';
import ReactDOM from "react-dom";
import Main from "./LoginComponent";


export default class Management extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addButtonClicked: false
        }
    }

    render() {
        return (
            <div className={"Add"}>
                Households
                <input type={"button"} name={"AddButton"} onClick={handleAddButton.bind(this)} value={"Add"}/>
                <input type={"button"} name={"EditButton"} onClick={buttonAction.bind(this)} value={"Edit"}/>
                <input type={"button"} name={"RemoveButton"} onClick={buttonAction.bind(this)} value={"Remove"}/>
            </div>
        );

        function handleAddButton() {
            this.setState({
                addButtonClicked: true
            });
            alert("add button pressed");

        }

        function buttonAction() {
            console.log("button pressed console");
            alert("button pressed alert");
        }
    }

}
