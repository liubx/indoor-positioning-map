import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  CONTROL_LAYER,
  EVENT_LAYER,
  INDOOR_LAYER,
  LAMP_LAYER,
  NODE_LAYER,
  NURSE_LAYER,
  POI_LAYER,
  LABEL_SELECT_LAYER,
  POSITION_LAYER,
  ROUTE_LAYER,
  SENIOR_LAYER,
  SUPPORTER_LAYER,
  TARGET_LAYER,
  TRIGGER_LAYER,
  USER_LAYER,
  OUTDOOR_LAYER
} from '../constant';
import LlMapLayer from './Map';
import LlOutdoorLayer from './Outdoor';
import LlIndoorLayer from './Indoor';
import LlPoiLayer from './Poi';
import {
  createLampLabel,
  createNodeLabel,
  createNurseLabel,
  createSeniorLabel,
  createSupporterLabel,
  createTargetLabel,
  createUserLabel
} from './util';
import LlLabelLayer from './Label';
import LlPositionLayer from './Position';
import LlEventLayer from './Event';
import LlRouteLayer from './Route';
import LlControlLayer from './Control';
import LlTriggerLayer from './Trigger';
import LlLabelSelect from './LabelSelect';
import 'leaflet/dist/leaflet.css';
import {
  OUTDOOR_DEFAULT_ZOOM,
  OUTDOOR_MAX_ZOOM,
  OUTDOOR_MIN_ZOOM
} from './config';
class Leaflet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      update: false
    };
  }
  componentWillUpdate(newProps) {
    if (
      newProps.lamps !== this.props.lamps ||
      newProps.nodes !== this.props.nodes ||
      newProps.targets !== this.props.targets ||
      newProps.nurses !== this.props.nurses ||
      newProps.seniors !== this.props.seniors ||
      newProps.supporters !== this.props.supporters ||
      newProps.users !== this.props.users
    ) {
      this.setState({
        update: !this.state.update
      });
    }
  }

  render() {
    return (
      <LlMapLayer
        maxZoom={this.props.maxZoom}
        minZoom={this.props.minZoom}
        zoom={this.props.zoom}
      >
        <LlOutdoorLayer key={OUTDOOR_LAYER} />
        <LlIndoorLayer map={this.props.map} key={INDOOR_LAYER} />
        {this.props.showPoi ? (
          <LlPoiLayer map={this.props.map} key={POI_LAYER} />
        ) : null}
        <LlLabelLayer
          data={this.props.lamps.filter(
            (data) =>
              !this.props.map ||
              (this.props.map &&
                this.props.map.floor &&
                data.floor === this.props.map.floor)
          )}
          key={LAMP_LAYER}
          createLabel={createLampLabel}
        />
        <LlLabelLayer
          data={this.props.nodes.filter(
            (data) =>
              !this.props.map ||
              (this.props.map &&
                this.props.map.floor &&
                data.floor === this.props.map.floor)
          )}
          key={NODE_LAYER}
          createLabel={createNodeLabel}
        />
        <LlLabelLayer
          data={this.props.targets.filter(
            (data) =>
              !this.props.map ||
              (this.props.map &&
                this.props.map.floor &&
                data.floor === this.props.map.floor)
          )}
          key={TARGET_LAYER}
          createLabel={createTargetLabel}
        />
        <LlLabelLayer
          data={this.props.nurses.filter(
            (data) =>
              !this.props.map ||
              (this.props.map &&
                this.props.map.floor &&
                data.tag.floor === this.props.map.floor)
          )}
          key={NURSE_LAYER}
          createLabel={createNurseLabel}
        />
        <LlLabelLayer
          data={this.props.seniors.filter(
            (data) =>
              !this.props.map ||
              (this.props.map &&
                this.props.map.floor &&
                data.tag.floor === this.props.map.floor)
          )}
          key={SENIOR_LAYER}
          createLabel={createSeniorLabel}
        />
        <LlLabelLayer
          data={this.props.supporters.filter(
            (data) =>
              !this.props.map ||
              (this.props.map &&
                this.props.map.floor &&
                data.floor === this.props.map.floor)
          )}
          key={SUPPORTER_LAYER}
          createLabel={createSupporterLabel}
        />
        <LlLabelLayer
          data={this.props.users.filter(
            (data) =>
              !this.props.map ||
              (this.props.map &&
                this.props.map.floor &&
                data.floor === this.props.map.floor)
          )}
          key={USER_LAYER}
          createLabel={createUserLabel}
        />
        <LlPositionLayer
          position={
            !this.props.map ||
            (this.props.map &&
              this.props.map.floor &&
              this.props.position &&
              this.props.position.floor === this.props.map.floor)
              ? this.props.position
              : null
          }
          key={POSITION_LAYER}
        />
        <LlLabelSelect
          key={LABEL_SELECT_LAYER}
          onFeatureClick={this.props.onFeatureClick}
          select={
            this.props.select &&
            this.props.select.floor === this.props.map.floor
              ? this.props.select
              : null
          }
          update={this.state.update}
        />
        <LlRouteLayer
          routes={this.props.routes}
          map={this.props.map}
          key={ROUTE_LAYER}
        />
        <LlEventLayer
          key={EVENT_LAYER}
          onSingleClick={this.props.onSingleClick}
          onDoubleClick={this.props.onDoubleClick}
        />
        <LlControlLayer
          position={this.props.position}
          map={this.props.map}
          key={CONTROL_LAYER}
        />
        <LlTriggerLayer
          position={this.props.position}
          map={this.props.map}
          key={TRIGGER_LAYER}
        />
      </LlMapLayer>
    );
  }
}

Leaflet.defaultProps = {
  map: null,
  zoom: OUTDOOR_DEFAULT_ZOOM,
  maxZoom: OUTDOOR_MAX_ZOOM,
  minZoom: OUTDOOR_MIN_ZOOM,
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
  onFeatureClick: () => true,
  onSingleClick: () => false,
  onDoubleClick: () => false
};

Leaflet.propTypes = {
  map: PropTypes.object,
  zoom: PropTypes.number,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
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
  onFeatureClick: PropTypes.func,
  onSingleClick: PropTypes.func,
  onDoubleClick: PropTypes.func
};

export default Leaflet;
