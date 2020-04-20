let edit_box = document.querySelector(".edit-box");
let d_class = document.querySelector(".d-class");
edit_box.addEventListener("mousedown", click);
edit_box.addEventListener("mouseup", release);
edit_box.addEventListener("dragenter", dragEnter);
edit_box.addEventListener("onmousemove", move);
//edit_box.addEventListener("dragend", drop);
console.log("found");
let s_mx;
let s_my;

let s_cx;
let s_cy;
let dcx
let dcy;
let dc;

function click(e) {
    if (e.target.className == "d-class") {
        console.log("mousedown")
        dc = e.target;
        var rect = e.target.parentNode.getBoundingClientRect();
        s_mx = e.clientX - rect.left; //x position within the element.
        s_my = e.clientY - rect.top;
        console.log('mouse starting pos:')
        console.log(s_mx)
        console.log(s_my)
        s_dcx = e.target.offsetLeft;
        s_dcy = e.target.offsetTop;
        console.log('starting pos:')

        console.log(s_dcx)
        console.log(s_dcy)

    }
}

function dragEnter(e) {
    if (e.target.className == "d-class") {


    }
}

function move(e) {
    if (e.target.className == "d-class") {
        var rect = e.target.parentNode.getBoundingClientRect();
        dcx = e.clientX - rect.left; //x position within the element.
        dcy = e.clientY - rect.top;

    }
}

function release(e) {
    // if (e.target.className == "d-class" || e.target.className == "edit-box") {
    var rect = e.target.parentNode.getBoundingClientRect();
    e_mx = e.target.clientX; //x position within the element.
    e_my = e.target.clientY;
    console.log(e)
        // console.log('end of mouse:')
        // console.log(e_mx)
        // console.log(e_my)

    dc.style.left = s_mx + "px";
    dc.style.top = s_my + "px";
    //}


}