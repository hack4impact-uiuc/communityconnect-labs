import React from "react";
import mapboxgl from "mapbox-gl";
import stateLayers from "../resources/stateLayers.js";
import Geocoder from "react-geocoder-autocomplete";
// import Geocoder from "react-map-gl-geocoder";
import { getResponseRatesByDate } from "../utils/apiWrapper";
import "../styles/index.css";
import "../styles/sidebar.css";
import logoWithText from "../resources/ccl_logo_text.png"
import logo from "../resources/ccl_logo.png"

mapboxgl.accessToken =
  "pk.eyJ1IjoibWVnaGFieXRlIiwiYSI6ImNrMXlzbDYxNzA3NXYzbnBjbWg5MHd2bGgifQ._sJyE87zG6o5k32efYbrAA";

const MAX_ZOOM = 22;
const MIN_ZOOM = 2.5;
const MAX_BOUNDS_SW = new mapboxgl.LngLat(-175, 5);
const MAX_BOUNDS_NE = new mapboxgl.LngLat(-25, 73);
const MAX_BOUNDS = new mapboxgl.LngLatBounds(MAX_BOUNDS_SW, MAX_BOUNDS_NE);

class MapBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: -97,
      lat: 38,
      zoom: 3.7,
      isOpen: true,
      searchText: '',
      geocoderValue: '',
    };
    this.map = null;
    this.ref = React.createRef();

  }

  componentDidMount() {
    // TODO: Replace the log below with a valid tract request
    const { lng, lat, zoom } = this.state;

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/meghabyte/ck1yssrtr3sge1drt4qb8kdde",
      center: [lng, lat],
      zoom,
      maxZoom: MAX_ZOOM,
      minZoom: MIN_ZOOM,
      maxBounds: MAX_BOUNDS
    });

    getResponseRatesByDate("03312010").then(data => {
        // var responseRates = data.data.result.response_rates;
        // var tractData = responseRates.map(response_rate => {
        //     return { GEOID: response_rate.tract_id, response_rate: response_rate.rate }
        // });

        const tractData = [
          { GEOID: "12095010200", response_rate: 0.73 }, // florida (orlando)
          { GEOID: "06085505009", response_rate: 0.56 } // california- meg's home tract
        ];

        this.map.on("load", function() {

          var fillColor = ["match", ["get", "GEOID"]];

          // converting the response rate into a color
          const LIGHTEST = [233, 244, 222];
          const DARKEST = [64, 89, 34];
          tractData.forEach(row => {
            var rate = row["response_rate"];
            var red = (1 - rate) * (LIGHTEST[0] - DARKEST[0]) + DARKEST[0];
            var green = (1 - rate) * (LIGHTEST[1] - DARKEST[1]) + DARKEST[1];
            var blue = (1 - rate) * (LIGHTEST[2] - DARKEST[2]) + DARKEST[2];
            var color = "rgba(" + red + ", " + green + ", " + blue + ", 0.8)";
            fillColor.push(row["GEOID"], color);
          });

          fillColor.push("rgba(0,0,0,0)");

          stateLayers.map(stateLayer => {
            this.map && this.map.addLayer(
              {
                id: stateLayer.sourceURL,
                type: "fill",
                source: {
                  type: "vector",
                  url: stateLayer.sourceURL
                },
                "source-layer": stateLayer.sourceLayer,
                paint: {
                  "fill-color": fillColor
                }
              },
              "state-label"
            );
          });
        });
    });


    this.map.on("move", () => {
      const { lng, lat } = this.map.getCenter();

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: this.map.getZoom().toFixed(2)
      });
    });
  }

  render() {
    const { lng, lat, zoom } = this.state;

    return (
      <div>
        <div className = "map">
          <div className="inline-block absolute top right mt12 mr12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
            <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
          </div>
          <div
            ref={el => (this.mapContainer = el)}
            className="absolute top right bottom col-9 col-s-9"
          />
        </div>
        <div>
            {this.state.isOpen ? 
                (
                  <div className = "sidebar sidebarOpen col-3 col-s-3">
                      <img src={logoWithText} alt="CCL Logo" className="sidebar-logo-text"/>
                      <Geocoder
                        accessToken={mapboxgl.accessToken}
                        value={this.state.searchText}
                        onInput={(e) => {this.setState({searchText: e})}}
                        onSelect={(e) => {this.map.flyTo({center: e.center, zoom: 10})}}
                        showLoader={true}
                        inputClass='search-input'
                        inputPlaceholder= 'Search for tract, address or zipcode'
                        resultClass='search-results'
                        />
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
      </div>
      
    );
  }
}

export default MapBox;
