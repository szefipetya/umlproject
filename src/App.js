import React, { Component } from 'react'
import ClassBox from './ClassBox'
import { findReact } from './Utils/utils'
import ToolBox from './ToolBox'
import MenuBar from './MenuBar'
class App extends Component {
    toolBoxWidth = 300;
    menuBarHeight = 80;

    constructor() {
        super();
        this.fullWidth = document.querySelector('html').clientWidth;
        this.fullHeight = document.querySelector('html').clientHeight;
        this.state.model.clip.width = this.fullWidth - this.state.model.toolbox.width;
        this.state.model.clip.height = this.fullHeight - this.state.model.menubar.height;

    }
    state = {
        server: {
            userid: '001'
        },
        model: {

            toolbox: {
                width: 120
            },
            menubar: {
                height: 40
            },
            canvas: {
                edit_element_id: null,
                edit_classTitle_id: null,
                scale: 1,
                posx: 0,
                posy: 0,
                width: 1400,
                height: 1000,
                gridSize: 10,
                drawMode: 'cursor',
                drawRect: {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                },
                selectedClassIds: [
                    1
                ]
            },
            clip: {
                width: 1000,
                height: 550
            },
            class_general: {
                padding_scaled: 3,
                border_scaled: 1.5,
                min_width: 80,
                min_width_scaled: 80,
                min_height: 75,
                min_height_scaled: 75,
                fontsize: 16,
                fontsize_scaled: 16,
            },
            selectedClass: null,
            classes: [
                {
                    id: "c1",
                    posx: 10,
                    posy: 20,
                    width: 114,
                    height: 250,
                    posx_scaled: 10,
                    posy_scaled: 20,
                    width_scaled: 114,
                    height_scaled: 250,
                    min_height: 75,
                    min_height_scaled: 75,
                    z: 2,
                    edit: false,
                    name: 'Class1',
                    class_type: 'classDG',
                    elements: [
                        {
                            group_name: 'attributes',
                            group_syntax: 'attribute',
                            elements: [
                                {
                                    id: 1,
                                    visibility: '+',
                                    edit: false,
                                    name: 'attr1',
                                    type: 'int'
                                },
                                {
                                    id: 2,
                                    visibility: '+',
                                    edit: false,
                                    name: 'attr2',
                                    type: 'int'
                                }
                            ]
                        },
                        {
                            group_name: 'functions',
                            group_syntax: 'function',
                            elements: [
                                {
                                    id: 3,
                                    visibility: '-',
                                    edit: false,
                                    name: 'func1',
                                    type: 'int'
                                },
                                {
                                    id: 4,
                                    visibility: '#',
                                    edit: false,
                                    name: 'func2',
                                    type: 'int'
                                }
                            ]
                        }
                    ]
                },
                {
                    id: "c2",
                    posx: 10,
                    posy: 20,
                    width: 114,
                    height: 250,
                    posx_scaled: 200,
                    posy_scaled: 20,
                    width_scaled: 114,
                    height_scaled: 250,
                    min_height: 75,
                    min_height_scaled: 75,
                    z: 1,
                    edit: false,
                    name: 'Person',
                    class_type: 'classDG',
                    elements: [
                        {
                            group_name: 'attributes',
                            group_syntax: 'attribute',
                            elements: [
                                {
                                    id: 5,
                                    visibility: '+',
                                    edit: false,
                                    name: 'name',
                                    type: 'string'
                                },
                                {
                                    id: 6,
                                    visibility: '#',
                                    edit: false,
                                    name: 'age',
                                    type: 'intssssssssssssssssssssssssssssssssssssssssssssssss'
                                }
                            ]
                        },
                        {
                            group_name: 'functions',
                            group_syntax: 'function',
                            elements: [
                                {
                                    id: 7,
                                    visibility: '-',
                                    edit: false,
                                    name: 'apply()',
                                    type: 'void'
                                },
                                {
                                    id: 8,
                                    visibility: '#',
                                    edit: false,
                                    name: 'promote()',
                                    type: 'void'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
    edit_target;
    interaction_blocked = false;

    disableEdits = (e, bool) => {
        let isnewButton = Array.from(e.target.classList).includes('class-element-group-new_element-button')
        if (isnewButton) {
            this.newButton = e.target;
            this.newButtonTransition = this.newButton.style.transition;
            this.newButtonFontSize = this.newButton.style.fontSize;
            this.newButton.style.transition = 'none'
            this.newButton.style.fontSize = '1.2em'
            this.newButton.style.height = '1.0em'
        }
        let isElem = Array.from(e.target.classList).includes('class-element')
        if (bool || (e.target.nodeName != 'INPUT')) {
            console.log('false on all');
            this.state.model.classes.map((clas) => {
                if (clas.edit)
                    if (clas.name.trim() != '') {
                        clas.edit = false;
                        this.state.model.canvas.edit_classTitle_id = null;
                    } else {
                        clas.name = "Class";
                        clas.edit = false;
                        this.state.model.canvas.edit_classTitle_id = null;
                    }
                if (clas.save)
                    clas.save();
                clas.elements.map((egroup) => {
                    egroup.elements.map((e) => {
                        if (e && e.edit) {
                            this.state.model.canvas.edit_element_id = null;
                            console.log("EDITED FOUND ")
                            e.edit = false;
                            e.save();
                            e.forceUpdate();
                        }
                    })
                })
            })
            this.inputDOM = undefined;
        }
        else {
            if (e.target.id == '#editor-input')
                this.inputDOM = e.target;
        }
    }

    handleAsync = async (e) => {
        await this.disableEdits(e, false);
        this.forceUpdate();
    }
    onMouseDown = (e) => {
        e.persist();
        this.handleAsync(e);
    }
    onKeyPress = (e) => {
        if (e.which == 13 || e.keyCode == 13) {//enter
            this.disableEdits(e, true);
        }
        if (e.key.match('Delete') || e.keyCode == 46) {
            console.log('del');
            e.preventDefault();
            this.state.model.canvas.selectedClassIds.map((id) => {
                this.state.model.classes = this.state.model.classes.filter((clas) => clas.id != id);
            });
            console.log(this.state.model.classes)
        }
        this.forceUpdate();
    }
    onMouseUp = (e) => {
        let prop = this.findPropertyByRegex(document.querySelector('.edit-box'), '__reactEventHandlers*')
        if (prop) prop.onMouseUp(e);
        if (this.newButton) {
            this.newButton.style.height = '0.85em'
            this.newButton.style.transition = this.newButtonTransition;
            this.newButton.style.fontSize = this.newButtonFontSize;
        }
    }
    onMouseMove = (e) => {
        let prop = this.findPropertyByRegex(document.querySelector('.edit-box'), '__reactEventHandlers*')
        if (prop) { prop.onMouseMove(e) }
    }
    findPropertyByRegex = (o, r) => {
        for (var key in o) {
            if (key.match(r)) {
                return o[`${key}`];
            }
        }
        return undefined;
    };
    render() {
        return (
            <div id='app' tabIndex="0" onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp} onMouseDown={this.onMouseDown} onKeyDown={this.onKeyPress}>
                <MenuBar obj={this.state.model.menubar} />
                <div id='main' style={{ height: `${this.fullHeight - this.state.model.menubar.height}px` }}>
                    <ToolBox model={this.state.model} obj={this.state.model.toolbox} />
                    <ClassBox model={this.state.model} />
                </div>

            </div>
        );
    }
}

export default App;