import React, { Component } from 'react';
class ToolBox extends Component {
    constructor(props) {
        super(props);
        this.state = props.obj;
        this.state.model = props.model;
    }
    classClicked = (e) => {
        let a = [];

        if (e.target.className == 'toolbox-item') {
            this.state.model.canvas.drawMode = e.target.dataset.action;
            this.updateSelected();
        }
    }
    classDouble = (e) => {
        this.state.model.canvas.drawMode = 'class_permanent'

    }
    updateSelected = () => {
        this.toolboxDOM = document.querySelector('.toolbox');
        // Array.from(this.toolboxDOM.childNodes).map((child) => {
        for (var child = this.toolboxDOM.firstChild; child !== null; child = child.nextSibling) {
            if (child.dataset.action == this.state.model.canvas.drawMode) {
                child.classList.add('tool-selected');
            } else {
                child.classList.remove('tool-selected')
            }
        }
    }
    componentDidMount = () => {
        this.updateSelected();
    }
    render() {
        return (
            <div className='toolbox-wrapper'>
                <div onClick={this.classClicked} onDoubleClick={this.classDouble} className="toolbox" style={{ width: this.state.width, height: this.state.height }}>
                    <div data-action='cursor' className="toolbox-item">Cursor</div>
                    <div data-action='class' className="toolbox-item">Class</div>
                    <div data-action='derive' className="toolbox-item">derive</div>
                    <div data-action='associate' className="toolbox-item">associate</div>
                    <div data-action='aggregate' className="toolbox-item">aggregate</div>
                    <div data-action='compose' className="toolbox-item">compose</div>
                </div>
            </div>
        );
    }
}

export default ToolBox;