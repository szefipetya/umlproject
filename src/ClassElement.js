import React, { Component } from 'react';

class ClassElement extends Component {
    constructor(props) {
        super(props)
        this.state = this.props.obj;
        this.state.istitle = this.props.istitle;
        this.state.parent = this.props.parent;
        this.state.save = this.saveEvent;
        this.parentClass = this.props.parentClass;
        this.state.forceUpdate = this.force;
    }
    parentClass;
    deleteSelfFromParent = () => {
        this.props.delete(this.state.id);
    }
    force = () => {
        this.forceUpdate();
    }
    saveEvent = () => {
        if (this.state.istitle) {
        }
        else if (this.state.name == '') {
            this.deleteSelfFromParent();
            console.log('deleted', this.state)
        }
        this.forceUpdate();
    }

    onClick = (e) => {
        this.state.edit = true;
        this.targetDOM = e.target;
        this.state.parent.parent.canvas.edit_element_id = this.state.id;
        this.forceUpdate(() => {
            let inputDOM = document.querySelector('#editor-input');
            if (inputDOM) {
                this.inputDOM = inputDOM;
                inputDOM.focus();
            }
        })
    }
    setVisibility = (e) => {
        let vis = '+';
        let l = false;
        if (e.target.value[0] == '+' ||
            e.target.value[0] == '-' ||
            e.target.value[0] == '#' ||
            e.target.value[0] == '~'
        ) {
            l = true;
            vis = e.target.value[0];
        }
        this.state.visibility = vis;
        return l;

    }
    setNameAndType = (e, l) => {
        let splitted = e.target.value.split(':');
        this.state.name = splitted[0].trim();
        if (l) {
            this.state.name = this.state.name.substr(1);
        }
        if (splitted[1])
            this.state.type = splitted[1].trim();
        else {
            this.state.type = ''
        }
    }
    onInput = (e) => {
        let isVisibilitySymbolWritten = this.setVisibility(e);

        this.setNameAndType(e, isVisibilitySymbolWritten)
        this.forceUpdate();
    }
    showedText = '';
    titleScale = 1.5;
    elementScale = 2.35;
    render() {
        let { name, type, id } = this.state;
        let str;
        if (type == '') { str = '' } else {
            str = ':'
        }
        let strfull;
        if (type)
            strfull = name + str + type;
        else {
            strfull = name
        }
        this.showedText = strfull;

        let clname;
        if (this.state.istitle) {
            this.clname = 'class-title class-element'
            if (this.state.parent.edit) {
                let inputwidth;
                let val1 = this.state.parent.parent.model.class_general.fontsize_scaled / this.elementScale * (strfull.length + 1);
                let val2 = this.state.parent.width_scaled - (this.state.parent.general.padding_scaled + this.state.parent.general.border_scaled) * 2;
                inputwidth = Math.max(val1, val2);
                //old width: `${(strfull.length + 1) * (this.state.parent.parent.model.class_general.fontsize_scaled / this.titleScale)}px`
                return (
                    <div className={this.clname}>
                        <input id='editor-input' type="text" onInput={this.onInput}
                            style={{ width: `${inputwidth}px` }}
                            defaultValue={name} />
                    </div>
                )
            } else {
                let rescale = this.titleScale;
                let charwidth = this.state.parent.parent.parent.model.class_general.fontsize_scaled / rescale;
                let textwidth = (this.state.parent.parent.parent.model.class_general.fontsize_scaled / rescale) * (strfull.length);
                let width = this.state.parent.parent.width_scaled -
                    (this.state.parent.parent.general.padding_scaled + this.state.parent.parent.general.border_scaled) * 2;
                ;

                let l = false;
                if (textwidth > width) {
                    this.showedText = strfull.substr(0, strfull.length - Math.round(
                        ((textwidth - width) / charwidth) + 1.5
                    ))
                    l = true;
                }
                name = this.showedText.split(':')[0];
                let dots = ''
                if (l) { dots += '...' }

                return (
                    <div data-id={this.state.parent.id} onClick={this.onClick} className={this.clname}>
                        {/* {this.state.id} */}{name}
                        <span className='class-element-dots'>{dots}</span>
                    </div>
                );
            }
        }
        else {
            this.clname = 'class-element';
            if (this.state.edit) {

                let inputwidth;
                let val1 = this.state.parent.parent.parent.model.class_general.fontsize_scaled / this.elementScale * (strfull.length + 1);
                let val2 = this.state.parent.parent.width_scaled - (this.state.parent.parent.general.padding_scaled + this.state.parent.parent.general.border_scaled) * 2;
                inputwidth = Math.max(val1, val2);

                return (
                    <div data-id={id} className={this.clname} onClick={this.onClick}>
                        <input id='editor-input' type="text" onInput={this.onInput}
                            style={{ width: `${inputwidth}px` }}
                            defaultValue={this.state.visibility + name + str + type}
                        />
                    </div>
                );
            }
            else {
                let l = false;
                clname = this.clname;
                let rescale = this.elementScale;
                let charwidth = this.state.parent.parent.parent.model.class_general.fontsize_scaled / rescale;
                let textwidth = (this.state.parent.parent.parent.model.class_general.fontsize_scaled / rescale) * (strfull.length + 1);
                let width = this.state.parent.parent.width_scaled -
                    (this.state.parent.parent.general.padding_scaled + this.state.parent.parent.general.border_scaled) * 2;
                ;
                if (textwidth > width) {
                    this.showedText = strfull.substr(0, strfull.length - Math.round(
                        ((textwidth - width) / charwidth) + 1.5
                    ))
                    l = true;
                }
                name = this.showedText.split(':')[0];
                str = this.showedText.includes(':');
                type = this.showedText.split(':')[1];
                let type_dispayed;
                let str_displayed;
                if (str) { str_displayed = ':' } else str_displayed = ''
                if (type) { type_dispayed = type; } else type_dispayed = ''
                let dots = ''
                if (l) { dots += '...' }
                return (
                    <div data-id={id} className={clname} onClick={this.onClick}>
                        <span className='class-element-visibility'>{/* {this.state.id} */}{this.state.visibility}</span>
                        <span className='class-element-name'>{name}</span>
                        <span className='class-element-separator'>{str_displayed}</span>
                        <span className='class-element-type'>{type_dispayed}</span>
                        <span className='class-element-dots'>{dots}</span>
                    </div>
                );
            }
        }

    }
}
/* () => { if (type) { return type } else return '' } */
export default ClassElement;