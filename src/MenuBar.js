import React, { Component } from 'react';

class MenuBar extends Component {
    constructor(props) {
        super(props);
        this.state = props.obj
    }
    render() {
        return (

            <nav className="menubar navbar navbar-expand-md navbar-dark bg-dark p-0 px-2" style={{ minHeight: this.state.height - 1 }}>
                <button className="navbar-toggler" data-toggle="collapse" data-target="#collapse_target">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <a className="navbar-brand">Uml Conference</a>
                <div className="collapse navbar-collapse" id="collapse_target">
                    <span className="navbar-text"></span>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="#Home">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#Social">Social</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#Groups">Groups</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#Projects">Projects</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#Credit">Credit</a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" data-toggle="dropdown" data-target="dropdown_target" href="#Add">Quick Actions
                      <span className="carret">
                                </span>
                            </a>
                            <div className="dropdown-menu " aria-labelledby="dropdown_target">
                                <a href="#new_message" className="dropdown-item">New Message</a>
                                <a href="#new_project" className="dropdown-item">New Project</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}
{/*  <div classNameName='menubar' style={{ height: this.state.height }}>
                <div classNameName="menubar-item">Home</div>
                <div classNameName="menubar-item">Messages</div>
                <div classNameName="menubar-item">Projects</div>
                <div classNameName="menubar-item">Contact us</div>
            </div>   */}
export default MenuBar;
