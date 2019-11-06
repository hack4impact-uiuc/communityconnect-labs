import React from "react";
import mapboxgl from "mapbox-gl";
import logoWithText from "../resources/ccl_logo_text.png"
import logo from "../resources/ccl_logo.png"
import "../styles/sidebar.css";
mapboxgl.accessToken =
"pk.eyJ1IjoibWVnaGFieXRlIiwiYSI6ImNrMXlzbDYxNzA3NXYzbnBjbWg5MHd2bGgifQ._sJyE87zG6o5k32efYbrAA";

var MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder');
class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        isOpen: true,
        isSearch: false,
    };
    this.geocoder =  new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    });
  }

  render() {
    return (
        <div>
            {this.state.isOpen ? 
                this.state.isSearch ?
                    (
                        <div className = "sidebar sidebarOpen col-3 col-s-3">
                            <img src={logoWithText} alt="CCL Logo" class="sidebar-logo-text"/>
                            <span className="header-text">Search</span>
                            <span className="sub-header-text">using tracts, addresses or zipcodes</span>
                            <input className="search-input" type="text" ></input>
                            {/* <div id="geocoder">{this.geocoder}</div> */}
                            <button className="search-button" type="button">Search</button>
                            <p onClick = {() => {this.setState({isOpen: false})}}>&lt; Minimize</p>
                        </div>
                    )
                    :
                    (
                        <div className = "sidebar sidebarOpen col-3 col-s-3">
                            <img src={logoWithText} alt="CCL Logo" className="sidebar-logo-text"/>
                            <span class="header-text">Welcome, lets get started!</span>
                            <p>Take a tour ></p>
                            <p onClick = {() => {this.setState({isSearch: true})}}>Start directly ></p>
                            <p onClick = {() => {this.setState({isOpen: false})}}>&lt; Minimize</p>
                        </div>
                    )
                :
                (
                    <div className = "sidebar sidebarClosed col-1 col-s-1" onClick = {() => {this.setState({isOpen: true})}}>
                        <img src={logo} alt="CCL Logo" className="sidebar-logo"/>
                    </div>
                )
            }
        </div>
    );
  }
}

export default Sidebar;
