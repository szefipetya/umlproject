import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { findReact } from './Utils/utils';
import { circularReplacer } from './Utils/json';

//root.addEventListener('onwheel', zoom)
(async function () {
    const root = document.querySelector('#root')
    await ReactDOM.render(<App />, root);
    //if (!localStorage["umlConference_local"]) {
    localStorage.setItem('umlConference_local',
        JSON.stringify(findReact(document.getElementById('app')).state, circularReplacer()));

    // }
})()

console.dir(findReact(document.getElementById('app')));
