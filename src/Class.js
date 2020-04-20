import React, { Component } from 'react';
import { rkey, unFocus, round, getRelativeCoordinates } from './Utils/utils'
import ClassElement from './ClassElement';
import ClassElementGroup from './ClassElementGroup';
class Class extends Component {
    constructor(props) {
        super(props);
        this.state = props.obj
        this.holding = false;
        this.state.canvas = props.canvas;
        this.state.model = this.props.model;
        this.state.general = this.props.general;
    }
    xdiff = 0;
    ydiff = 0;
    resize_top = false;
    resize_left = false;
    resize_right = false;
    resize_bottom = false;
    renderElementGroup = (elementGroup, ind) => {
        return <ClassElementGroup parent={this.state} obj={elementGroup} key={ind} />
    }
    gridSize = 10;
    componentWillUpdate = () => {

    }

    render() {
        const { posx_scaled, posy_scaled, width_scaled, height_scaled, fontsize_scaled, z } = this.state;
        return (
            <div data-id={this.state.id}
                style={{
                    fontSize: this.state.model.class_general.fontsize_scaled,
                    top: posy_scaled,
                    left: posx_scaled,
                    width: width_scaled,
                    height: height_scaled,
                    zIndex: z,
                    padding: this.state.general.padding_scaled,
                    border: `${this.state.general.border_scaled}px solid rgba(255, 255, 255, 0.19)`
                }}
                className='d-class' >
                <ClassElement parent={this.state} obj={this.state} istitle='true' />
                <div className='class-elements'>{this.state.elements.map(this.renderElementGroup)}</div>
            </div>
        );
    }
}

export default Class;