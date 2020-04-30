import React from 'react';
import Class from './Class'
import { rkey, round, unFocus, findReact } from './Utils/utils';


class ClassBox extends React.Component {
    resizePadding = 14;
    holding = false;
    targetCurrentId = 1;
    gridSize = 10;
    state = {
        canvas: null,
        class_general: null
    }
    targetInner;
    targetinner;
    targetClass;
    targetResizeHoverXR = false;
    targetResizeHoverYR = false;
    targetResizeHoverXL = false;
    targetResizeHoverYL = false;
    targetResizeGrabXR = false;
    targetResizeGrabYR = false;
    targetResizeGrabXL = false;
    targetResizeGrabYL = false;
    targetWidth_stored;
    targetHeight_stored;
    stored_diffx;
    stored_diffy;
    stored_mx;
    stored_my;
    //draw
    drawedClassPositionSpecified = false;
    //selection
    zoom = (event) => {
        event.preventDefault();
        let scale = 1;
        let canvas = { ...this.state.canvas }
        scale += event.deltaY * -0.004;
        // Restrict scale
        scale = scale.clamp(0.96, 1.04);
        this.state.classes.map((e) => {
            e.posx_scaled *= scale;
            e.posy_scaled *= scale;
            e.width_scaled *= scale;
            e.height_scaled *= scale;
        })
        this.state.class_general.fontsize_scaled *= scale;
        this.state.class_general.padding_scaled *= scale;
        this.state.class_general.border_scaled *= scale;
        this.state.class_general.min_height_scaled *= scale;
        this.state.class_general.min_width_scaled *= scale;
        this.state.canvas.scale *= scale;
        this.state.canvas.posx *= scale;
        this.state.canvas.posy *= scale;
        this.state.canvas.width *= scale;
        this.state.canvas.height *= scale;
        this.state.canvas.gridSize *= scale;

        this.borderString_scale = `${this.state.class_general.border_scaled}px gold solid`;
        this.onMouseUp();
        this.forceUpdate();
    }
    constructor(props) {
        super(props);
        this.state = props.model;
        this.parent = props.parent;
        let classes = { ...this.state.classes };
        this.borderString_scale = `${this.state.class_general.border_scaled}px gold solid`;
        this.borderString = `${this.state.class_general.border_scaled}px grey solid`;
    }

    findClassDomById = (id) => {
        let dom = Array.from(document.querySelector('.edit-box')
            .querySelectorAll('.d-class')).filter((clas) => clas.dataset.id == id)[0]
        return dom;
        /*  this.state.canvas.selectedClassIds.include()
             clas.dataset.id == this.sele) */
    }
    findClassById = (id) => {
        let cls = this.state.classes.filter((e) => { return e.id == id });
        return cls;
    }
    resizeExistingClass = (e) => {
        let nohover = 0;
        if (this.holdingAny && !this.targetResizeGrabXR && !this.targetResizeGrabYR
            && !this.targetResizeGrabXL && !this.targetResizeGrabYL && this.targetClass != undefined) {
            unFocus();
            this.targetClass.posx_scaled = e.clientX - this.targetRect.left - this.xdiff
            this.targetClass.posy_scaled = e.clientY - this.targetRect.top - this.ydiff
            this.targetClass.posx_scaled = round(this.targetClass.posx_scaled, this.state.canvas.gridSize)
            this.targetClass.posy_scaled = round(this.targetClass.posy_scaled, this.state.canvas.gridSize)
            this.forceUpdate();
            return;
        }
        //resize xr
        if (this.setTargets(e) && this.xdiff >= this.targetClass.width_scaled - this.resizePadding &&
            this.xdiff <= this.targetClass.width_scaled) {
            document.getElementById('root').style.cursor = 'ew-resize';
            this.targetResizeHoverXR = true;
        } else {
            nohover++;
        }
        if (this.targetResizeGrabXR && this.targetClass_stored) {
            unFocus();
            this.targetClass_stored.width_scaled = this.xdiff_rel_to_stored + (this.targetWidth_stored - this.stored_xdiff);
            this.targetDOM.style.borderRight = this.borderString_scale;
            this.forceUpdate();
            //return;
        }
        //resize xl
        if (this.setTargets(e) && this.xdiff <= this.resizePadding &&
            this.xdiff >= 0) {
            document.getElementById('root').style.cursor = 'ew-resize';
            this.targetResizeHoverXL = true;
        } else {
            nohover++;
        }
        if (this.targetResizeGrabXL && this.targetClass_stored) {
            unFocus();

            this.targetClass_stored.posx_scaled = e.clientX - this.targetRect.left - this.stored_xdiff;
            let mx = e.clientX - this.targetRect.left;
            this.targetClass_stored.width_scaled = this.targetWidth_stored - (mx - this.stored_mx);
            this.targetDOM.style.borderLeft = this.borderString_scale;
            this.targetClass_stored.posx_scaled = round(this.targetClass_stored.posx_scaled, this.state.canvas.gridSize)
        }
        //  }
        //resize yr
        if (this.setTargets(e)
            && this.ydiff >= this.targetClass.height_scaled - this.resizePadding &&
            this.ydiff <= this.targetClass.height_scaled) {
            document.getElementById('root').style.cursor = 'ns-resize';
            this.targetResizeHoverYR = true;
        } else {
            nohover++;
        }
        if (this.targetResizeGrabYR && this.targetClass_stored) {
            unFocus();
            this.targetClass_stored.height_scaled = this.ydiff_rel_to_stored + (this.targetHeight_stored - this.stored_ydiff);
            this.targetDOM.style.borderBottom = this.borderString_scale;
        }

        //  }

        //resize yl
        if (this.setTargets(e) && this.ydiff <= this.resizePadding &&
            this.ydiff >= 0) {
            document.getElementById('root').style.cursor = 'ns-resize';
            this.targetResizeHoverYL = true;
        } else {
            nohover++;
        }
        if (this.targetResizeGrabYL && this.targetClass_stored) {
            unFocus();
            this.targetClass_stored.posy_scaled = e.clientY - this.targetRect.top - this.stored_ydiff;
            let my = e.clientY - this.targetRect.top;
            this.targetClass_stored.height_scaled = this.targetHeight_stored - (my - this.stored_my);
            this.targetDOM.style.borderTop = this.borderString_scale;
            this.targetClass_stored.posy_scaled = round(this.targetClass_stored.posy_scaled, this.state.canvas.gridSize)
            // return;
        }
        if (nohover == 4) {
            document.getElementById('root').style.cursor = 'default';

        }

        //  }
        if (this.targetResizeHoverXR && this.targetResizeHoverYR) {
            document.getElementById('root').style.cursor = 'nw-resize';
        }
        if (this.targetResizeHoverXR && this.targetResizeHoverYL) {
            document.getElementById('root').style.cursor = 'ne-resize';
        }
        if (this.targetResizeHoverXL && this.targetResizeHoverYR) {
            document.getElementById('root').style.cursor = 'sw-resize';
        }
        if (this.targetResizeHoverXL && this.targetResizeHoverYL) {
            document.getElementById('root').style.cursor = 'nw-resize';
        }
        this.targetResizeHoverXR = false;
        this.targetResizeHoverYR = false;
        this.targetResizeHoverXL = false;
        this.targetResizeHoverYL = false;
        if (this.targetClass != undefined) {
            this.targetClass.width_scaled = round(this.targetClass.width_scaled, this.state.canvas.gridSize)
            this.targetClass.height_scaled = round(this.targetClass.height_scaled, this.state.canvas.gridSize)
            this.corrigateTargetClassDimensions();
        }
        //   this.corrigateCanvasPosition();
        //  this.corrigateTargetClassPosition();
        this.forceUpdate();
    }
    resizeDrawedClass = (e) => {
        let ebox = e.target.closest('.edit-box');
        if (ebox) {
            var rect = ebox.getBoundingClientRect();
            var x = e.clientX - rect.left; //x position within the element.
            var y = e.clientY - rect.top;

            this.findClassById(this.drawedClassId)[0].width_scaled = x - this.drawedClassX;
            this.findClassById(this.drawedClassId)[0].height_scaled = y - this.drawedClassY;
            unFocus();
            this.forceUpdate();
        }
    }
    repositionCanvas = (e) => {
        if (this.holding) {
            if (this.clipDOM) {
                this.state.canvas.posx = e.clientX - this.clipDOM.getBoundingClientRect().left - this.xdiff;
                this.state.canvas.posy = e.clientY - this.clipDOM.getBoundingClientRect().top - this.ydiff;
                this.forceUpdate();
                /* this.setState({ canvas }) */
                return true;
            }
        }
        return false;
    }
    onMouseMove = (e) => {
        e.persist();
        //ha, éppen class-t rajzol az illető
        if (this.drawedClassPositionSpecified && this.state.canvas.drawMode == 'class') {
            this.resizeDrawedClass(e);
            return;
        }
        //ha a 'canvas-ra kattintott, és úgy mozgat
        if (!this.dclass || e.target.className == 'edit-box') {
            if (this.repositionCanvas(e)) return;
        }
        //CLASS//
        this.resizeExistingClass(e);

    }
    /**Amikor a felhasználó Mozgatható elemre vagy a Canvas-ra kattint,
         * akkor menti a kattintott dolog aktuális helyét és méreteit*/
    setStoredTargets = (e) => {
        if (this.targetInner != undefined) {
            let dclass = e.target.closest('.d-class');
            if (dclass) {
                this.dclass = dclass;
                this.targetClass_stored = this.findClassById(dclass.dataset.id)[0];
                this.targetWidth_stored = this.targetClass_stored.width_scaled;
                this.targetHeight_stored = this.targetClass_stored.height_scaled;
                this.targetRect_stored = dclass.parentNode.getBoundingClientRect();
                this.targetInner_stored = dclass.getBoundingClientRect();

                this.stored_mx = e.clientX - this.targetRect_stored.left;
                this.stored_my = e.clientY - this.targetRect_stored.top;
                this.stored_xdiff = e.clientX - this.targetInner_stored.left;
                this.stored_ydiff = e.clientY - this.targetInner_stored.top;
                this.targetDOM = dclass;
                return true;
            }
        } else {
            return false;
        }
    }
    /**Amikor a felhasználó éppen átméretez,
    mindig pillanatnyi méretezés előtti állapotát menti.
     **/
    setTargets = (e) => {
        let dclass = e.target.closest('.d-class');
        if (!dclass) {
            dclass = e.target.querySelector('.d-class');
        }
        if (dclass) {
            if (e.target.className != 'edit-box' && e.target.nodeName != 'INPUT') {
                this.targetClass = this.findClassById(dclass.dataset.id)[0];
                this.targetRect = dclass.parentNode.getBoundingClientRect();
                this.targetInner = dclass.getBoundingClientRect();
            }
            if (this.targetInner != undefined) {
                this.xdiff = e.clientX - this.targetInner.left;
                this.ydiff = e.clientY - this.targetInner.top;
                if (this.targetInner_stored != undefined) {
                    this.xdiff_rel_to_stored = e.clientX - this.targetInner_stored.left;
                    this.ydiff_rel_to_stored = e.clientY - this.targetInner_stored.top;
                }
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    getHighestClassZIndex = () => {
        let max = 0;
        this.state.classes.map((e) => { if (e.z > max) max = e.z });

        if (max > 1000) {
            this.state.classes.map((e) => { e.z--; });
        }
        return max + 1;
    }


    updateClassSelection = () => {
        this.state.classes.map((clas) => {
            this.findClassDomById(clas.id).classList.remove('d-class-selected');

        })
        this.state.canvas.selectedClassIds.map((id) => {
            this.findClassDomById(id).classList.add('d-class-selected');
        })
    }
    selectClickedClassOnly = () => {
        this.state.canvas.selectedClassIds = [];
        if (this.targetClass_stored)
            this.state.canvas.selectedClassIds.push(this.targetClass_stored.id)

    }
    onMouseDown = (e) => {
        if (this.state.canvas.drawMode == 'class') {
            var rect = e.target.closest('.edit-box').getBoundingClientRect();
            var x = e.clientX - rect.left; //x position within the element.
            var y = e.clientY - rect.top;
            this.drawedClassX = x;
            this.drawedClassY = y;
            this.drawedClassId = 'c' + this.getNewClassId();
            let newclass = {
                id: this.drawedClassId,
                width: 1,
                height: 1,
                posx_scaled: x,
                posy_scaled: y,
                width_scaled: 1,
                height_scaled: 1,
                z: this.getHighestClassZIndex(),
                edit: false,
                name: '',
                class_type: 'classDG',
                elements: [
                    {
                        group_name: 'attributes',
                        group_syntax: 'attribute',
                        elements: [
                        ]
                    },
                    {
                        group_name: 'functions',
                        group_syntax: 'function',
                        elements: [
                        ]
                    }
                ]
            }
            this.state.classes.push(newclass)
            this.targetClass = newclass;
            this.drawedClassPositionSpecified = true;
        } else if (this.state.canvas.drawMode == 'cursor') {
            //EDIT BOX//
            if (e.target.className == 'edit-box') {
                let rect;
                let inner;
                rect = e.target.parentNode.getBoundingClientRect();
                inner = e.target.getBoundingClientRect();
                this.xdiff = e.clientX - inner.left;
                this.ydiff = e.clientY - inner.top;
                console.log(this.xdiff)
                console.log(this.ydiff)
                this.holding = true;
                this.clipDOM = e.target.closest('.edit-box-clip')
                //selection off
                this.state.canvas.selectedClassIds = [];
                this.updateClassSelection();

            }
            //CLASS//
            if (e.target.className != 'edit-box' && e.target.nodeName != 'INPUT' && this.targetClass) {
                this.setTargets(e);
                this.setStoredTargets(e);
                //selection
                this.selectClickedClassOnly();
                this.updateClassSelection();
                //zindex problem
                let max = this.getHighestClassZIndex();
                if (this.targetClass)
                    this.targetClass.z = max;
                //grabxr
                let n = 0;
                if (this.xdiff >= this.targetClass.width_scaled - this.resizePadding) {
                    n++;
                    this.targetResizeGrabXR = true;
                    this.targetCurrentId = this.targetClass.id;
                }
                //grabxl

                if (this.xdiff < this.resizePadding) {
                    n++;
                    this.targetResizeGrabXL = true;
                    this.targetCurrentId = this.targetClass.id;

                }
                //grabyr

                if (this.ydiff >= this.targetClass.height_scaled - this.resizePadding) {
                    n++;
                    this.targetResizeGrabYR = true;
                    this.targetCurrentId = this.targetClass.id;

                }
                //grabyl
                if (this.ydiff <= this.resizePadding) {
                    n++;
                    this.targetResizeGrabYL = true;
                    this.targetCurrentId = this.targetClass.id;
                }
                if (n == 0) {
                    this.holdingAny = true;
                }

            }
        }
    }
    onMouseUp = (e) => {
        if (this.state.canvas.drawMode == 'class') {
            this.state.canvas.drawMode = 'cursor';
            let drawedclass = this.findClassDomById(this.drawedClassId)
            if (drawedclass)
                drawedclass.querySelector('.class-title').click();
            this.drawedClassPositionSpecified = false;
            this.drawedClassId = undefined;
            this.forceUpdate();
        }
        findReact(document.querySelector('.toolbox')).updateSelected()

        if (this.targetDOM != undefined)
            this.targetDOM.style.border = `${this.state.class_general.border_scaled}px solid rgba(255, 255, 255, 0.19)`
        this.holdingAny = false;
        this.holding = false;
        this.corrigateTargetClassPosition();
        this.corrigateTargetClassDimensions();
        this.targetResizeGrabXR = false;
        this.targetResizeGrabYR = false;
        this.targetResizeGrabXL = false;
        this.targetResizeGrabYL = false;
        this.targetInner = undefined;
        this.targetRect = undefined;;
        this.targetClass = undefined;;
        this.corrigateCanvasPosition();

        this.forceUpdate();
    }
    corrigateCanvasPosition = () => {
        let canvas = { ...this.state.canvas }
        let clip = { ...this.state.clip }
        let c = 0;
        if (this.state.canvas.posx > 0) {
            this.state.canvas.posx = 0;
            c++;
        }
        if (this.state.canvas.posy > 0) {
            this.state.canvas.posy = 0;
            c++;
        }
        if (this.state.canvas.posx + this.state.canvas.width < clip.width) {
            this.state.canvas.posx = clip.width - this.state.canvas.width;
            c++;
        }
        if (this.state.canvas.posy + this.state.canvas.height < clip.height) {
            this.state.canvas.posy = clip.height - this.state.canvas.height;
            c++;
        }
        if (c > 0) {
            this.ebox = document.querySelector('.edit-box');
            this.ebox.style.transition = `all ${this.targetCorrigateTransition}ms ease`
            setTimeout(() => {
                this.ebox.style.transition = 'unset'
            }, this.targetCorrigateTransition)
            this.forceUpdate();
            /*  this.setState({ canvas }) */
        }
    }
    targetCorrigateTransition = 300;

    corrigateTargetClassPosition = () => {
        if (this.targetClass_stored != undefined) {
            let canvas = { ...this.state.canvas }
            let c = 0;
            const { posx_scaled, posy_scaled, width_scaled, height_scaled } = this.targetClass_stored;
            if (posx_scaled < 0) {
                this.targetClass_stored.posx_scaled = 0; c++;
            }
            if (posy_scaled < 0) {
                this.targetClass_stored.posy_scaled = 0; c++;
            }
            if (posx_scaled + width_scaled > (canvas.width)) {
                this.targetClass_stored.posx_scaled = canvas.width - width_scaled; c++;
            }
            if (posy_scaled + height_scaled > canvas.height) {
                this.targetClass_stored.posy_scaled = canvas.height - height_scaled; c++;
            }
            if (c > 0) {
                if (this.targetDOM) {
                    this.targetDOM.style.transition = `all ${this.targetCorrigateTransition}ms ease`
                    setTimeout(() => {
                        this.targetDOM.style.transition = 'unset'
                    }, this.targetCorrigateTransition)
                }
                this.forceUpdate();
            }
        }
    }
    corrigateTargetClassDimensions = () => {
        if (this.targetClass != undefined) {
            if (this.targetClass.width_scaled < this.state.class_general.min_width_scaled)
                this.targetClass.width_scaled = round(this.state.class_general.min_width_scaled, this.state.canvas.gridSize)
            if (this.targetClass.height_scaled < this.state.class_general.min_height_scaled)
                this.targetClass.height_scaled = round(this.state.class_general.min_height_scaled, this.state.canvas.gridSize)
        }
    }
    renderClasses = (elem) => {
        return <Class model={this.state} general={this.state.class_general} canvas={this.state.canvas} key={elem.id} obj={elem} />
    }
    render() {
        const { posx, posy, width, height } = this.state.canvas
        return (
            <div className="">
                <div className="edit-box-container">
                    <div className="edit-box-clip" style={{ width: this.state.clip.width, height: this.state.clip.height }}>
                        <div id="dgbox" className="edit-box"
                            style={{
                                top: posy, left: posx, width: width, height: height,
                                backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.11) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.11) 1px, transparent 1px)'
                                , backgroundSize: `${this.state.canvas.gridSize}px ${this.state.canvas.gridSize}px`

                            }}
                            onMouseMove={this.onMouseMove}

                            onMouseUp={this.onMouseUp}
                            onMouseDown={this.onMouseDown}
                            onWheel={this.zoom}
                        >
                            <svg style={{ zIndex: '0' }}>
                                {/*                                 <line x1="0" y1="0" x2="200" y2="200" style={{ stroke: 'rgb(255,0,0)', strokeWidth: 2 }} />
 */}                            </svg>
                            {this.state.classes.map(this.renderClasses)}

                        </div>
                    </div>
                </div>
            </div >
        );
    }
    getNewClassId = () => {
        let found = false;
        let match = 0;
        let id = undefined;
        for (let i = 0; i < this.state.classes.length - 1; i++) {
            if (Math.abs(this.state.classes[i].id - this.state.classes[i + 1].id) >= 2) {
                id = Math.min(this.state.classes[i].id, this.state.classes[i + 1].id) + 1;
            }
        }
        if (!id) {
            id = this.state.classes[this.state.classes.length - 1].id + 1;
        }
        return id;
    }
}

export default ClassBox;