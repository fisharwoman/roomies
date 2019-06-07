import React, {Component} from 'react';
import {Button, Collapse} from 'react-bootstrap';
import './Collapsible.css';
import Form from "react-bootstrap/Form";

class RemovableContent extends Component{
    state={

    };


    render(){
        return(
            <div
                className= "removable-content">
                <div >
                    In an ideal world, this would generate a checkboxes for each household.
                    Will prolly delete this button later.
                </div>

            </div>
        );
    }
}

export default RemovableContent
