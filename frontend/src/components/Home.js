import React from "react";
import mapboxgl from "mapbox-gl";
import stateLayers from "../resources/stateLayers.js";
import Geocoder from "react-geocoder-autocomplete";
import { getResponseRatesByDate } from "../utils/apiWrapper";
import "../styles/index.css";
import "../styles/sidebar.css";
import logoWithText from "../resources/ccl_logo_text.png";
import logo from "../resources/ccl_logo.png";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWVnaGFieXRlIiwiYSI6ImNrMXlzbDYxNzA3NXYzbnBjbWg5MHd2bGgifQ._sJyE87zG6o5k32efYbrAA";

const MAX_ZOOM = 22;
const MIN_ZOOM = 2.5;
const MAX_BOUNDS_SW = new mapboxgl.LngLat(-175, 5);
const MAX_BOUNDS_NE = new mapboxgl.LngLat(-25, 73);
const MAX_BOUNDS = new mapboxgl.LngLatBounds(MAX_BOUNDS_SW, MAX_BOUNDS_NE);

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: -97,
      lat: 38,
      zoom: 3.7,
      isSidebarOpen: true,
      searchText: "",
      tractSelected: false,
      currentTract: {},
      geocoderValue: ""
    };
    this.map = null;
  }

  getCensusMBRColor = response_rate => {
    if (response_rate < 20) {
      return { color: "#c62828" };
    } else if (response_rate < 40) {
      return { color: "#EF6C00" };
    } else if (response_rate < 60) {
      return { color: "#FBC02D" };
    } else if (response_rate < 80) {
      return { color: "#2E7D32" };
    } else if (response_rate <= 100) {
      return { color: "#7CB342" };
    }
  };

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

    this.map.on("load", () => {
      getResponseRatesByDate("03252010").then(data => {
        const responseRates = data.data.result.response_rates;
        var tractData = {};
        responseRates.forEach(response_rate => {
          tractData[response_rate.tract_id] = response_rate.rate;
        });
        this.setState({
          tractData: tractData
        });

        const fillColor = ["match", ["get", "GEOID"]];

        // converting the response rate into a color
        const LIGHTEST = [233, 244, 222];
        const DARKEST = [64, 89, 34];
        const geoIds = Object.keys(tractData);
        geoIds.map(geoId => {
          const rate = tractData[geoId];
          const red = (1 - rate) * (LIGHTEST[0] - DARKEST[0]) + DARKEST[0];
          const green = (1 - rate) * (LIGHTEST[1] - DARKEST[1]) + DARKEST[1];
          const blue = (1 - rate) * (LIGHTEST[2] - DARKEST[2]) + DARKEST[2];
          const color = "rgba(" + red + ", " + green + ", " + blue + ", 0.8)";
          return fillColor.push(geoId, color);
        });

        fillColor.push("rgba(0,0,0,0)");

        stateLayers.map(stateLayer => {
          return this.map.addLayer(
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

    this.map.on("mousemove", e => {
      stateLayers.forEach(element => {
        const tracts = this.map.queryRenderedFeatures(e.point, {
          // TODO: get all layers using a .map on stateLayers instead of hardcoding IL
          layers: ["mapbox://meghabyte.ac7v02uw"]
        });

        if (tracts.length > 0) {
          this.setState({
            tractSelected: true,
            currentTract: {
              name: tracts[0].properties.NAMELSAD,
              id: tracts[0].properties.GEOID
            }
          });
        } else {
          this.setState({
            tractSelected: false,
            currentTract: null
          });
        }
      });
    });
  }

  render() {
    const { lng, lat, zoom, isSidebarOpen } = this.state;

    return (
      <div>
        <div className="map">
          <div className="inline-block absolute top right mt12 mr12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
            <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
          </div>
          <div
            ref={el => (this.mapContainer = el)}
            className="absolute top right bottom mapbox"
          />
        </div>
        <div>
          {isSidebarOpen ? (
            <div className="sidebar sidebarOpen">
              <img
                src={logoWithText}
                alt="CCL Logo"
                className="sidebar-logo-text"
              />
              <div className="geocoder">
                <Geocoder
                  accessToken={mapboxgl.accessToken}
                  value={this.state.searchText}
                  onInput={e => {
                    this.setState({ searchText: e });
                  }}
                  onSelect={e => {
                    this.map.flyTo({ center: e.center, zoom: 10 });
                  }}
                  showLoader={true}
                  inputClass="search-input"
                  inputPlaceholder="Search for county, address or zipcode"
                  resultClass="search-results"
                />
              </div>

              {this.state.tractSelected && (
                <div className="tractDetails">
                  <div className="tractDetails_inner">
                    <h1>{this.state.currentTract.id}</h1>
                    <h1>{this.state.currentTract.name}</h1>

                    <h2>Latest Censes Response Rate</h2>
                    <div
                      style={this.getCensusMBRColor(
                        this.state.tractData[this.state.currentTract.id] * 100
                      )}
                    >
                      <h3>
                        {this.state.tractData[this.state.currentTract.id] * 100}
                        %
                      </h3>
                      <h4 className="h3_yaer">in 2010</h4>
                    </div>

                    <h2>History</h2>
                    <div
                      style={this.getCensusMBRColor(
                        this.state.tractData[this.state.currentTract.id] * 100
                      )}
                    >
                      <h3>
                        {this.state.tractData[this.state.currentTract.id] * 100}
                        %
                      </h3>
                      <h4 className="h3_yaer">in 2000</h4>
                    </div>
                  </div>
                </div>
              )}

              <p
                className="absolute left bottom minimize"
                onClick={() => {
                  this.setState({ isSidebarOpen: false });
                }}
              >
                &lt; Minimize
              </p>
            </div>
          ) : (
            <div
              className="sidebar sidebarClosed col-1 col-s-1"
              onClick={() => {
                this.setState({ isSidebarOpen: true });
              }}
            >
              <img src={logo} alt="CCL Logo" className="sidebar-logo" />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Home;
