/* global window */
/* eslint no-undef: "error" */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Openlayers from './openlayers/Openlayers';
// import Leaflet from './leaflet/Leaflet';
import { LEAFLET, OPENLAYERS } from './constant';
import './assets/css/map.css';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.type,
      map: this.props.map,
      nodes: this.props.nodes,
      targets: this.props.targets,
      nurses: this.props.nurses,
      seniors: this.props.seniors,
      lamps: this.props.lamps,
      supporters: this.props.supporters,
      users: this.props.users,
      routes: this.props.routes,
      position: this.props.position,
      showPoi: this.props.showPoi,
      select: this.props.select,
      heatmap: this.props.heatmap,
      history: this.props.history
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      type: newProps.type,
      map: newProps.map,
      nodes: newProps.nodes,
      targets: newProps.targets,
      nurses: newProps.nurses,
      seniors: newProps.seniors,
      lamps: newProps.lamps,
      supporters: newProps.supporters,
      users: newProps.users,
      routes: newProps.routes,
      position: newProps.position,
      showPoi: newProps.showPoi,
      select: newProps.select,
      heatmap: newProps.heatmap,
      history: newProps.history
    });
  }

  componentDidMount() {
    window.loadOpenlayers = () =>
      this.setState({
        type: OPENLAYERS
      });

    window.loadLeaflet = () =>
      this.setState({
        type: LEAFLET
      });

    window.loadMap = (data) =>
      this.setState({
        map: data
      });

    window.loadNodes = (data) =>
      this.setState({
        nodes: data
      });

    window.loadTargets = (data) =>
      this.setState({
        targets: data
      });

    window.loadNurses = (data) =>
      this.setState({
        nurses: data
      });

    window.loadLamps = (data) =>
      this.setState({
        lamps: data
      });

    window.loadSupporters = (data) =>
      this.setState({
        supporters: data
      });

    window.loadUsers = (data) =>
      this.setState({
        users: data
      });

    window.loadSeniors = (data) =>
      this.setState({
        seniors: data
      });

    window.loadRoutes = (data) =>
      this.setState({
        routes: data
      });

    window.loadPosition = (data, follow) =>
      this.setState(
        {
          position: data
        },
        () => (follow ? setTimeout(() => window.center(), 2) : null)
      );

    window.togglePoi = () =>
      this.setState((prevState) => ({
        showPoi: !prevState.showPoi
      }));

    window.loadSelect = (data) =>
      this.setState({
        select: data
      });

    window.loadHeatmap = (data) =>
      this.setState({
        heatmap: data
      });

    window.loadHistory = (data) =>
      this.setState({
        history: data
      });
  }

  render() {
    return (
      <div>
        {this.state.type === OPENLAYERS ? (
          <Openlayers
            zoom={this.props.zoom}
            maxZoom={this.props.maxZoom}
            minZoom={this.props.minZoom}
            map={this.state.map}
            lamps={this.state.lamps}
            nodes={this.state.nodes}
            targets={this.state.targets}
            nurses={this.state.nurses}
            seniors={this.state.seniors}
            supporters={this.state.supporters}
            users={this.state.users}
            routes={this.state.routes}
            position={this.state.position}
            showPoi={this.state.showPoi}
            select={this.state.select}
            heatmap={this.state.heatmap}
            history={this.state.history}
            onFeatureClick={this.props.onFeatureClick}
            onSingleClick={this.props.onSingleClick}
            onDoubleClick={this.props.onDoubleClick}
          />
        ) : (
          ''
        )}
        {/* {this.state.type === LEAFLET ? (
          <Leaflet
            map={this.state.map}
            lamps={this.state.lamps}
            nodes={this.state.nodes}
            targets={this.state.targets}
            nurses={this.state.nurses}
            seniors={this.state.seniors}
            supporters={this.state.supporters}
            users={this.state.users}
            routes={this.state.routes}
            position={this.state.position}
            showPoi={this.state.showPoi}
            select={this.state.select}
          />
        ) : (
          ''
        )} */}
        <select className={'floor-select'}>
          <option value="grapefruit">Grapefruit</option>
          <option value="lime">Lime</option>
          <option selected value="coconut">
            Coconut
          </option>
          <option value="mango">Mango</option>
        </select>
      </div>
    );
  }
}

Map.defaultProps = {
  type: OPENLAYERS,
  map: null,
  heatmap: null,
  history: null,
  showPoi: true,
  routes: null,
  position: null,
  lamps: [],
  nodes: [],
  targets: [],
  nurses: [],
  seniors: [],
  supporters: [],
  users: [],
  select: null,
  zoom: 21,
  maxZoom: 24,
  minZoom: 18,
  onFeatureClick: () => true,
  onSingleClick: () => false,
  onDoubleClick: () => false
};

Map.propTypes = {
  type: PropTypes.string,
  map: PropTypes.object,
  heatmap: PropTypes.object,
  history: PropTypes.object,
  showPoi: PropTypes.bool,
  lamps: PropTypes.array,
  nodes: PropTypes.array,
  targets: PropTypes.array,
  nurses: PropTypes.array,
  seniors: PropTypes.array,
  supporters: PropTypes.array,
  users: PropTypes.array,
  routes: PropTypes.object,
  position: PropTypes.object,
  select: PropTypes.object,
  zoom: PropTypes.number,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  onFeatureClick: PropTypes.func,
  onSingleClick: PropTypes.func,
  onDoubleClick: PropTypes.func
};

export default Map;
