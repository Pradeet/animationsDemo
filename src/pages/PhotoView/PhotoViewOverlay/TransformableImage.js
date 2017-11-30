import React, { Component } from 'react';
import { Image, View } from 'react-native';
import ViewTransformer from 'react-native-view-transformer';
const invariant = require('fbjs/lib/invariant');

export default class TransformableImage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      height: 0,

      imageLoaded: false,
      pixels: undefined,
      keyAcumulator: 1
    };
  }

  componentWillMount() {
    if (!this.props.pixels) {
      this.getImageSize(this.props.source);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.sameSource(this.props.source, nextProps.source)) {
      this.setState({ pixels: undefined, keyAcumulator: this.state.keyAcumulator + 1 }); // image source changed, clear last image's pixels info if any
      this.getImageSize(nextProps.source);
    }
  }

  render() {
    let maxScale = 1;
    let contentAspectRatio = undefined;
    let width; // pixels
    let height; // pixels

    if (this.props.pixels) {
      // if provided via props
      width = this.props.pixels.width;
      height = this.props.pixels.height;
    } else if (this.state.pixels) {
      // if got using Image.getSize()
      width = this.state.pixels.width;
      height = this.state.pixels.height;
    }

    if (width && height) {
      contentAspectRatio = width / height;
      if (this.state.width && this.state.height) {
        maxScale = Math.max(width / this.state.width, height / this.state.height);
        maxScale = Math.max(1, maxScale);
      }
    }

    return (
      <ViewTransformer
        ref={(viewTransformerRef) => { this.viewTransformerRef = viewTransformerRef; }}
        key={`viewTransformer#${this.state.keyAccumulator}`} // when image source changes, we should use a different node to avoid reusing previous transform state
        enableTransform={this.props.enableTransform && this.state.imageLoaded} // disable transform until image is loaded
        enableScale={this.props.enableScale}
        enableTranslate={this.props.enableTranslate}
        enableResistance
        onTransformGestureReleased={this.props.onTransformGestureReleased}
        onViewTransformed={this.props.onViewTransformed}
        maxScale={maxScale}
        contentAspectRatio={contentAspectRatio}
        onLayout={this.onLayout}
        style={this.props.style}
      >
        <Image
          {...this.props}
          style={[this.props.style, { backgroundColor: 'transparent' }]}
          resizeMode={this.props.resizeMode}
          onLoadStart={this.onLoadStart}
          onLoad={this.onLoad}
          capInsets={{
            left: 0.1,
            top: 0.1,
            right: 0.1,
            bottom: 0.1
          }} // on iOS, use capInsets to avoid image downsampling
        />
      </ViewTransformer>
    );
  }

  onLoadStart = (e) => {
    if (this.props.onLoadStart) {
      this.props.onLoadStart(e);
    }
    this.setState({
      imageLoaded: false
    });
  }

  onLoad = (e) => {
    if (this.props.onLoad) {
      this.props.onLoad(e);
    }
    this.setState({
      imageLoaded: true
    });
  }

  onLayout = (e) => {
    const { width, height } = e.nativeEvent.layout;
    if (this.state.width !== width || this.state.height !== height) {
      this.setState({
        width,
        height
      });
    }
  }

  getImageSize = (source) => {
    if (!source) {
      return;
    }

    if (source.uri) {
      Image.getSize(source.uri, (width, height) => {
        if (width && height) {
          if (this.state.pixels && this.state.pixels.width === width && this.state.pixels.height === height) {
              // no need to update state
          } else {
            this.setState({ pixels: { width, height } });
          }
        }
      },
      (error) => {
        invariant(false, `getImageSize...error=${JSON.stringify(error)}, source=${JSON.stringify(source)}`);
      });
    }
  }

  getViewTransformerInstance = () => this.viewTransformerRef

  sameSource(source, nextSource) {
    if (source === nextSource) {
      return true;
    }
    if (source && nextSource) {
      if (source.uri && nextSource.uri) {
        return source.uri === nextSource.uri;
      }
    }
    return false;
  }
}

TransformableImage.propTypes = {
  pixels: React.PropTypes.shape({
    width: React.PropTypes.number,
    height: React.PropTypes.number,
  }),

  enableTransform: React.PropTypes.bool,
  enableScale: React.PropTypes.bool,
  enableTranslate: React.PropTypes.bool,
  onTransformGestureReleased: React.PropTypes.func,
  onViewTransformed: React.PropTypes.func,
  resizeMode: Image.propTypes.resizeMode,
  onLoad: React.PropTypes.func,
  onLoadStart: React.PropTypes.func,
  source: Image.propTypes.source,
  style: View.propTypes.style
};

TransformableImage.defaultProps = {
  enableTransform: true,
  enableScale: true,
  enableTranslate: true
};
