import { Component } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { of } from 'rxjs';
import { tap, filter, map } from 'rxjs/operators';
import { createPositionLabel } from './util';

class LlPositionLayer extends Component {
  componentDidMount() {
    this.layer = L.featureGroup().addTo(this.context.map);
    this.loadPosition(this.props.position);
  }

  shouldComponentUpdate(newProps) {
    if (this.props.position === null || this.props.position === undefined) {
      return true;
    }
    return newProps.position !== this.props.position;
  }

  componentWillUpdate(newProps) {
    this.loadPosition(newProps.position);
  }

  loadPosition(position) {
    of(position)
      .pipe(
        tap(() => this.layer.clearLayers()),
        filter((position) => position !== null && position !== undefined),
        map((position) => createPositionLabel(position)),
        tap((position) => position.addTo(this.layer))
      )
      .subscribe();
  }

  render() {
    return false;
  }
}

LlPositionLayer.defaultProps = {
  position: null
};

LlPositionLayer.propTypes = {
  position: PropTypes.object
};

LlPositionLayer.contextTypes = {
  map: PropTypes.object
};

export default LlPositionLayer;
