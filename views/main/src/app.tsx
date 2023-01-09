/* eslint-env browser */

import window from 'global/window';
import React from 'react';
import { connect } from 'react-redux';

import DeckGL from '@deck.gl/react';
import { MapView, MapController, RGBAColor } from '@deck.gl/core';
import GL from '@luma.gl/constants';
import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer } from '@deck.gl/layers';

import {
  EditableGeoJsonLayer,
  SelectionLayer,
  ModifyMode,
  TranslateMode,
  DuplicateMode,
  ElevationMode,
  DrawPointMode,
  DrawLineStringMode,
  DrawPolygonByDraggingMode,
  ViewMode,
  CompositeMode,
  SnappableMode,
  ElevatedEditHandleLayer,
  PathMarkerLayer,
  GeoJsonEditMode,
} from 'nebula.gl';

import sampleGeoJson from './sample-geojson.json';

import {
  Toolbox,
  ToolboxTitle,
  ToolboxRow,
  ToolboxButton,
  ToolboxCheckbox,
} from './toolbox';


import { IStore } from './store';
import { GetTasks } from './store/actions/tasks.actions';


const COMPOSITE_MODE = new CompositeMode([new DrawLineStringMode(), new ModifyMode()]);

const styles = {
  mapContainer: {
    alignItems: 'stretch',
    display: 'flex',
    height: '100vh',
  },
  checkbox: {
    margin: 10,
  },
};

const initialViewport = {
  bearing: 0,
  height: 0,
  latitude: 34.92338332,
  longitude: 137.21716002,
  pitch: 0,
  width: 0,
  zoom: 15,
};

const ALL_MODES: any = [
  {
    category: 'View',
    modes: [
      { label: 'View', mode: ViewMode },
    ],
  },
  {
    category: 'Draw',
    modes: [
      { label: 'Draw Point', mode: DrawPointMode },
      { label: 'Draw LineString', mode: DrawLineStringMode },
    ],
  },
  {
    category: 'Alter',
    modes: [
      { label: 'Modify', mode: ModifyMode },
    ],
  },
  {
    category: 'Composite',
    modes: [{ label: 'Draw LineString + Modify', mode: COMPOSITE_MODE }],
  },
];

const layer = new TileLayer({
  // https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
  data: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',

  minZoom: 0,
  maxZoom: 19,
  tileSize: 256,

  renderSubLayers: props => {
    const {
      bbox: { west, south, east, north }
    } = props.tile;

    return new BitmapLayer(props, {
      data: null,
      image: props.data,
      bounds: [west, south, east, north]
    });
  }
});

function hex2rgb(hex: string) {
  const value = parseInt(hex, 16);
  return [16, 8, 0].map((shift) => ((value >> shift) & 0xff) / 255);
}

const FEATURE_COLORS = [
  '00AEE4',
  'DAF0E3',
  '9BCC32',
  '07A35A',
  'F7DF90',
  'EA376C',
  '6A126A',
  'FCB09B',
  'B0592D',
  'C1B5E3',
  '9C805B',
  'CCDFE5',
].map(hex2rgb);

// TODO edit-modes:  delete once fully on EditMode implementation and just use handle.properties.editHandleType...
// Unwrap the edit handle object from either layer implementation
function getEditHandleTypeFromEitherLayer(handleOrFeature) {
  if (handleOrFeature.__source) {
    return handleOrFeature.__source.object.properties.editHandleType;
  } else if (handleOrFeature.sourceFeature) {
    return handleOrFeature.sourceFeature.feature.properties.editHandleType;
  } else if (handleOrFeature.properties) {
    return handleOrFeature.properties.editHandleType;
  }

  return handleOrFeature.type;
}

function getEditHandleColor(handle: {}): RGBAColor {
  switch (getEditHandleTypeFromEitherLayer(handle)) {
    case 'existing':
      return [0xff, 0x80, 0x00, 0xff];
    case 'snap-source':
      return [0xc0, 0x80, 0xf0, 0xff];
    case 'intermediate':
    default:
      return [0xff, 0xc0, 0x80, 0xff];
  }
}

interface IAppProps {
  getTodos(): void;
  tasks: [];
  isLoading: boolean;
}


class App extends React.Component<IAppProps,
  {
    viewport: Record<string, any>;
    testFeatures: any;
    mode: typeof GeoJsonEditMode;
    modeConfig: any;
    pointsRemovable: boolean;
    selectedFeatureIndexes: number[];
    editHandleType: string;
    selectionTool?: string;
    showGeoJson: boolean;
    pathMarkerLayer: boolean;
    featureMenu?: {
      index: number;
      x: number;
      y: number;
    };
  }
> {
  constructor(props: any) {
    super(props);

    this.state = {
      viewport: initialViewport,
      testFeatures: sampleGeoJson,
      mode: ViewMode,
      modeConfig: null,
      pointsRemovable: true,
      selectedFeatureIndexes: [],
      editHandleType: 'point',
      selectionTool: null,
      showGeoJson: false,
      pathMarkerLayer: false,
      featureMenu: null,
    };
    
    
    
  }


  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this.props.getTodos();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  _onChangeViewport = (viewport: Record<string, any>) => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport },
    });
  };

  _onLayerClick = (info: any) => {
    // const {getTodos} = this.props;
    console.log('onLayerClick', info); // eslint-disable-line

    if (info) {
      console.log(`select editing feature ${info.index}`); // eslint-disable-line
      // a feature was clicked
      if (info.index < 0) {
        this.setState(
          {
            mode: ViewMode,
            selectedFeatureIndexes: []
          }
        );
      } else {
        this.setState(
          {
            mode: ModifyMode,
            selectedFeatureIndexes: [info.index]
          }
        );
      }
    } else {
      console.log('deselect editing feature'); // eslint-disable-line
      // open space was clicked, so stop editing
      this.setState({ selectedFeatureIndexes: [] });
    }
  };

  _resize = () => {
    this.forceUpdate();
  };

  _error = (err: any) => {
    // eslint-disable-next-line
    alert(err);
  };

  _getHtmlColorForFeature(index: number, selected: boolean) {
    const length = FEATURE_COLORS.length;
    const color = FEATURE_COLORS[index % length].map((c) => c * 255).join(',');
    const alpha = selected ? 1.0 : 0.7;

    return `rgba(${color}, ${alpha})`;
  }

  _getDeckColorForFeature(index: number, bright: number, alpha: number): RGBAColor {
    const length = FEATURE_COLORS.length;
    const color = FEATURE_COLORS[index % length].map((c) => c * bright * 255);

    // @ts-ignore
    return [...color, alpha * 255];
  }

  _renderSelectFeatureCheckbox(index: number, featureType: string) {
    const { selectedFeatureIndexes } = this.state;
    return (
      <div key={index}>
        <ToolboxCheckbox
          style={styles.checkbox}
          type="checkbox"
          checked={selectedFeatureIndexes.includes(index)}
          onChange={() => {
            if (selectedFeatureIndexes.includes(index)) {
              this.setState({
                selectedFeatureIndexes: selectedFeatureIndexes.filter((e) => e !== index),
              });
            } else {
              this.setState({
                selectedFeatureIndexes: [...selectedFeatureIndexes, index],
              });
            }
          }}
        >
          <span
            style={{
              color: this._getHtmlColorForFeature(index, selectedFeatureIndexes.includes(index)),
            }}
          >
            {index}
            {': '}
            {featureType}
          </span>
          <a
            style={{ position: 'absolute', right: 12 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              this.setState({
                selectedFeatureIndexes: [index],
                featureMenu: { index, x: e.clientX, y: e.clientY },
              });
            }}
          >
            &gt;&gt;
          </a>
        </ToolboxCheckbox>
      </div>
    );
  }

  _renderSelectFeatureCheckboxes() {
    const {
      testFeatures: { features },
    } = this.state;
    const checkboxes = [];
    for (let i = 0; i < features.length; ++i) {
      checkboxes.push(this._renderSelectFeatureCheckbox(i, features[i].geometry.type));
    }
    return checkboxes;
  }

  _renderToolBox() {
    return (
      <Toolbox>
        {ALL_MODES.map((category) => (
          <ToolboxRow key={category.category}>
            <ToolboxTitle>{category.category} Modes</ToolboxTitle>
            {category.modes.map(({ mode, label }) => (
              <ToolboxButton
                key={label}
                selected={this.state.mode === mode}
                onClick={() => {
                  this.setState({ mode, modeConfig: {}, selectionTool: null });
                }}
              >
                {label}
              </ToolboxButton>
            ))}
          </ToolboxRow>
        ))}
      </Toolbox>
    );
  }

  _featureMenuClick(action: string) {
    const { index } = this.state.featureMenu || {};
    let testFeatures = this.state.testFeatures;

    if (action === 'delete') {
      const features = [...testFeatures.features];
      features.splice(index, 1);
      testFeatures = Object.assign({}, testFeatures, {
        features,
      });
    } else if (action === 'split') {
      // TODO
    } else if (action === 'info') {
      // eslint-disable-next-line
      console.log(testFeatures.features[index]);
    }

    this.setState({ featureMenu: null, testFeatures });
  }


  customizeLayers(layers: Record<string, any>[]) { }

  onEdit = ({ updatedData, editType, editContext }) => {
    let updatedSelectedFeatureIndexes = this.state.selectedFeatureIndexes;

    if (!['movePosition', 'extruding', 'rotating', 'translating', 'scaling'].includes(editType)) {
      // Don't log edits that happen as the pointer moves since they're really chatty
      const updatedDataInfo = featuresToInfoString(updatedData);
      // eslint-disable-next-line
      console.log('onEdit', editType, editContext, updatedDataInfo);
    }

    if (editType === 'removePosition' && !this.state.pointsRemovable) {
      // This is a simple example of custom handling of edits
      // reject the edit
      return;
    }

    if (editType === 'addFeature' && this.state.mode !== DuplicateMode) {
      const { featureIndexes } = editContext;
      // Add the new feature to the selection
      updatedSelectedFeatureIndexes = [...this.state.selectedFeatureIndexes, ...featureIndexes];
    }

    this.setState({
      testFeatures: updatedData,
      selectedFeatureIndexes: updatedSelectedFeatureIndexes,
    });
  };

  getFillColor = (feature, isSelected) => {
    const index = this.state.testFeatures.features.indexOf(feature);
    return isSelected
      ? this._getDeckColorForFeature(index, 1.0, 0.5)
      : this._getDeckColorForFeature(index, 0.5, 0.5);
  };

  getLineColor = (feature, isSelected) => {
    const index = this.state.testFeatures.features.indexOf(feature);
    return isSelected
      ? this._getDeckColorForFeature(index, 1.0, 1.0)
      : this._getDeckColorForFeature(index, 0.5, 1.0);
  };

  render() {
    const { testFeatures, selectedFeatureIndexes, mode } = this.state;
    let { modeConfig } = this.state;
    const { tasks, isLoading } = this.props;
    console.log('isLoading ', isLoading, tasks.length)

    const viewport: Record<string, any> = {
      ...this.state.viewport,
      height: window.innerHeight,
      width: window.innerWidth,
    };

    if (mode === ElevationMode) {
      modeConfig = {
        ...modeConfig,
        viewport,
        calculateElevationChange: (opts) =>
          ElevationMode.calculateElevationChangeWithViewport(viewport, opts),
      };
    } else if (mode === ModifyMode) {
      modeConfig = {
        ...modeConfig,
        viewport,
        lockRectangles: true,
      };
    } else if (mode instanceof SnappableMode && modeConfig) {
      if (mode._handler instanceof TranslateMode) {
        modeConfig = {
          ...modeConfig,
          viewport,
          screenSpace: true,
        };
      }

    } else if (mode === DrawPolygonByDraggingMode) {
      modeConfig = {
        ...modeConfig,
        throttleMs: 100,
      };
    }

    // Demonstrate how to override sub layer properties
    let _subLayerProps = {
      tooltips: {
        getColor: [255, 255, 255, 255],
      },
    };

    if (this.state.editHandleType === 'elevated') {
      _subLayerProps = Object.assign(_subLayerProps, {
        guides: {
          _subLayerProps: {
            points: {
              type: ElevatedEditHandleLayer,
              getFillColor: [0, 255, 0],
            },
          },
        },
      });
    }

    if (this.state.pathMarkerLayer) {
      _subLayerProps = Object.assign(_subLayerProps, {
        geojson: {
          _subLayerProps: {
            linestrings: {
              type: PathMarkerLayer,
              getMarkerColor: (x) => [255, 255, 255, 255],
              sizeScale: 1500,
            },
          },
        },
      });
    }

    const editableGeoJsonLayer = new EditableGeoJsonLayer({
      id: 'geojson',
      data: testFeatures,
      // @ts-ignore
      selectedFeatureIndexes,
      mode,
      modeConfig,
      autoHighlight: false,

      // Editing callbacks
      onEdit: this.onEdit,

      editHandleType: this.state.editHandleType,
      getEditHandleIcon: (d) => getEditHandleTypeFromEitherLayer(d),
      getEditHandleIconSize: 40,
      getEditHandleIconColor: getEditHandleColor,

      // Specify the same GeoJsonLayer props
      // lineWidthMinPixels: 2,
      pointRadiusMinPixels: 5,
      // getLineDashArray: () => [0, 0],

      // Accessors receive an isSelected argument
      getFillColor: this.getFillColor,
      getLineColor: this.getLineColor,

      // Can customize editing points props
      getEditHandlePointColor: getEditHandleColor,
      editHandlePointRadiusScale: 2,

      // customize tentative feature style
      // getTentativeLineDashArray: () => [7, 4],
      // getTentativeLineColor: () => [0x8f, 0x8f, 0x8f, 0xff],

      _subLayerProps,

      parameters: {
        depthTest: true,
        depthMask: false,

        blend: true,
        blendEquation: GL.FUNC_ADD,
        blendFunc: [GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA],
      },
    });

    const layers = [layer, editableGeoJsonLayer];

    if (this.state.selectionTool) {
      layers.push(
        // @ts-ignore
        new SelectionLayer({
          id: 'selection',
          // @ts-ignore
          selectionType: this.state.selectionTool,
          onSelect: ({ pickingInfos }) => {
            this.setState({
              selectedFeatureIndexes: pickingInfos.map((pi) => pi.index),
            });
          },
          layerIds: ['geojson'],

          getTentativeFillColor: () => [255, 0, 255, 100],
          getTentativeLineColor: () => [0, 0, 255, 255],
          lineWidthMinPixels: 3,
        })
      );
    }

    this.customizeLayers(layers);

    return (
      <div style={styles.mapContainer}>
        <DeckGL
          viewState={viewport}
          getCursor={editableGeoJsonLayer.getCursor.bind(editableGeoJsonLayer)}
          layers={layers}
          height="100%"
          width="100%"
          views={[
            new MapView({
              id: 'basemap',
              controller: {
                type: MapController,
                doubleClickZoom: false,
              },
              legacyMeterSizes: true,
            }),
          ]}
          onClick={this._onLayerClick}
          onViewStateChange={({ viewState }) => this.setState({ viewport: viewState })}
        >
          {/* {this.renderStaticMap(viewport)} */}
        </DeckGL>
        {this._renderToolBox()}
      </div>
    );
  }
}

function featuresToInfoString(featureCollection: any): string {
  const info = featureCollection.features.map(
    (feature) => `${feature.geometry.type}(${getPositionCount(feature.geometry)})`
  );

  return JSON.stringify(info);
}

function getPositionCount(geometry): number {
  const flatMap = (f, arr) => arr.reduce((x, y) => [...x, ...f(y)], []);

  const { type, coordinates } = geometry;
  switch (type) {
    case 'Point':
      return 1;
    case 'LineString':
    case 'MultiPoint':
      return coordinates.length;
    case 'Polygon':
    case 'MultiLineString':
      return flatMap((x) => x, coordinates).length;
    case 'MultiPolygon':
      return flatMap((x) => flatMap((y) => y, x), coordinates).length;
    default:
      throw Error(`Unknown geometry type: ${type}`);
  }
}

const mapStateToProps = (state: IStore) => ({
  tasks: state.tasks.tasks, 
  isLoading:state.tasks.isLoading
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    getTodos: () => dispatch({ type: GetTasks.Pending }),
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
