import { Component } from 'react';
import Rx from 'rxjs/Rx';
import PropTypes from 'prop-types';
import * as L from 'leaflet';

class LlLabelLayer extends Component {
  componentDidMount() {
    this.layer = L.featureGroup().addTo(this.context.map);
    this.loadData(this.props.data);
  }

  shouldComponentUpdate(newProps) {
    if (this.props.data === null || this.props.data === undefined) {
      return true;
    }
    if (newProps.data === null) {
      return false;
    }
    if (newProps.data.length !== this.props.data.length) {
      return true;
    }
    return !newProps.data.every((v, i) => v === this.props.data[i]);
  }

  componentWillUpdate(newProps) {
    this.loadData(newProps.data);
  }

  loadData(data) {
    Rx.Observable.of(data)
      .do(() => this.layer.clearLayers())
      .filter((data) => data !== null && data !== undefined)
      .flatMap((data) => data)
      .map((data) => this.props.createLabel(data))
      .filter((data) => data !== null)
      .do((feature) => feature.addTo(this.layer))
      .subscribe();
  }

  render() {
    return false;
  }
}

LlLabelLayer.defaultProps = {
  data: null
};

LlLabelLayer.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  createLabel: PropTypes.func.isRequired
};

LlLabelLayer.contextTypes = {
  map: PropTypes.object
};

export default LlLabelLayer;
