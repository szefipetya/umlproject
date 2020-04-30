import React, { Component } from 'react';
import ClassElement from './ClassElement';

class ClassElementGroup extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.obj;
        this.state.parent = this.props.parent;
        this.delete = this.delete.bind(this);
        this.state.forceUpdate = this.forceUpdate;
    }
    delete(id) {
        console.dir("before: this.state.elements", this.state.elements)
        /*  this.setState({
             elements: this.state.elements.filter(function (el) {
                 return el.id !== id || el.name.length > 0
             })
         });
  */
        this.state.elements = this.state.elements.filter(function (el) {
            return el.id !== id || el.name.length > 0
        })

        console.dir("this.state.elements", this.state.elements)
        //        this.state.elements = this.state.elements.filter(el => el.id != id)
        this.forceUpdate();
    }
    renderElement = (el, ind) => {
        /*  if (el.name === "promote()" || el.name == "apply()")
             console.dir("rendering: ", el.name, el) */
        return <ClassElement delete={this.delete} parentClass={this} parent={this.state} key={el.id} obj={el} />
    }
    onMouseOver = (e) => {
        //e.target.
    }
    getNewId = () => {
        let found = false;
        let match = 0;
        let id = undefined;
        let maxid = 0;
        this.state.parent.model.classes.map((clas, ind) => {
            clas.elements.map((egroup, ind2) => {
                egroup.elements.map((elem, ind3) => {
                    if (elem.id > maxid) maxid = elem.id;
                })
            })
        })

        return maxid + 1;
    }
    pushNewElement = async (visibility, name, type) => {
        let id = this.getNewId()
        this.state.parent.parent.canvas.edit_element_id = id;

        await this.state.elements.push({
            edit: true,
            id: id,
            visibility: visibility,
            name: name,
            type: type
        })
        await this.forceUpdate(() => {
            let inputDOM = document.querySelector('#editor-input');
            if (inputDOM) {
                this.inputDOM = inputDOM
                inputDOM.focus();
            }
        });
    }
    onNewButtonClick = (e) => {
        let inputDOM = document.querySelector('#editor-input');
        if (!inputDOM)
            this.pushNewElement('', '', '');
        this.forceUpdate();
    }
    render() {
        return (
            <div className='class-element-group' onMouseOver={this.onMouseOver} >
                <div className='class-element-group-name'>{this.state.group_name}</div>
                {this.state.elements.map(this.renderElement)
                }
                < div className='class-element-group-new_element-button-wrapper' >
                    <div class='class-element class-element-group-new_element-button'
                        onClick={this.onNewButtonClick} parent={this.state} key={'new'}>+</div>
                </div >
            </div >
        );
    }
}

export default ClassElementGroup;