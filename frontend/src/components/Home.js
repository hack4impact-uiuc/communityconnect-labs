import React from "react";
import Map from "./Map"
import Sidebar from "./Sidebar"

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        isOpen: true,
        // geocoderSearchText: ""
    };
  }



  render() {
    return (
        <div>
            <Sidebar/>
            <Map/>
        </div>
    );
  }
}

export default Home;
