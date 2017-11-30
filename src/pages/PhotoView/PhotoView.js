import React, { PropTypes } from 'react';
import { View, Animated, Image, TouchableHighlight } from 'react-native';
import _get from 'lodash/get';
import PhotoViewOverlay from './PhotoViewOverlay';

import styles from './PhotoView.style';

const MIN_ASPECT_RATIO = 0.3;

export default class PhotoView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      imageLoadingError: false,
      imageMeta: {
        height: 100,
      },
      openPreview: false,
      layoutOpacity: new Animated.Value(1),
    };
  }

  render() {
    const { enablePreview, borderRadius } = this.props;
    const imageResizeStyle = { height: _get(this.state, 'imageMeta.height', 0), borderRadius };
    if (!enablePreview) {
      return (
        <View onLayout={this.onViewLayout}>
          <Animated.View style={[styles.imageContainer, { opacity: this.state.layoutOpacity }]}>
            {this.renderImage(this.getImageSource(), imageResizeStyle)}
          </Animated.View>
        </View>
      );
    }

    return (
      <View onLayout={this.onViewLayout} ref={(imageContainerRef) => (this.imageContainerRef = imageContainerRef)}>
				{this.renderOverlay()}
        <Animated.View style={[styles.imageContainer, { opacity: this.state.layoutOpacity }]}>
          <TouchableHighlight underlayColor={'transparent'} onPress={this.onImagePressed} title={'image'}>
						{this.renderImage(this.getImageSource(), imageResizeStyle)}
          </TouchableHighlight>
        </Animated.View>
      </View>
    );
  }

  renderImage = (source, imageResizeStyle) => (
    <Image
      key="source"
      source={source}
      style={imageResizeStyle}
      resizeMode="cover"
      resizeMethod="auto"
      onError={this.onImageError}
    />
  )

  renderOverlay = () => {
    const { renderPreviewHeader, swipeToDismiss, backgroundColor, enablePreviewAnimation } = this.props;
    const { openPreview, imageMeta } = this.state;

    const source = this.getImageSource();

    return (
      <PhotoViewOverlay
        enableAnimation={enablePreviewAnimation}
        source={source}
        renderHeader={renderPreviewHeader}
        swipeToDismiss={swipeToDismiss}
        backgroundColor={backgroundColor}
        openPreview={openPreview}
        imageMetaInitial={imageMeta}
        onClose={this.onClose}
      />
    );
  };

  onImageError = () => {
    this.setState({
      imageLoadingError: true
    });
  };

  onImagePressed = () => {
    if (this.state.imageLoadingError) {
      return;
    }

    if (!this.imageContainerRef) {
      return;
    }

    this.imageContainerRef.measureInWindow((x, y, width, height) => {
      this.state.layoutOpacity.setValue(0);
      this.setState({
        openPreview: true,
        imageMeta: { height, width, x, y }
      });
    });
  };

  onClose = () => {
    this.state.layoutOpacity.setValue(1);
    this.setState({ openPreview: false }, this.props.onClose);
  };

  onViewLayout = (event) => {
    const aspectRatio = this.props.aspectRatio < MIN_ASPECT_RATIO ? MIN_ASPECT_RATIO : this.props.aspectRatio;
    const layout = event.nativeEvent.layout;
    const measuredHeight = layout.width / aspectRatio;
    const currentHeight = layout.height;

    if (measuredHeight === currentHeight) {
      return;
    }

    this.setState({
      imageMeta: {
        height: measuredHeight,
        width: layout.width,
        x: layout.x,
        y: layout.y,
      }
    });
  }

  getImageSource = () => {
    const { mediaList } = this.props;
    const imageDetails = _get(mediaList, '[0]', {});

    const source = _get(imageDetails, 'previewImageUrl') || _get(imageDetails, 'source') || _get(imageDetails, 'thumbnailUrl');
    if (typeof source === 'number') {
      return source;
    }

    return { uri: source };
  }
}

PhotoView.propTypes = {
  mediaList: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf(['PHOTO', 'GIF']),
    caption: PropTypes.string,
    description: PropTypes.string,
    picture: PropTypes.string,
    source: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
  enablePreview: PropTypes.bool,
  aspectRatio: PropTypes.number,
  renderPreviewHeader: PropTypes.func,
  swipeToDismiss: PropTypes.bool,
  backgroundColor: PropTypes.string,
  enablePreviewAnimation: PropTypes.bool,
  onClose: PropTypes.func,
  borderRadius: PropTypes.number,
};

PhotoView.defaultProps = {
  enablePreview: false,
  aspectRatio: 2,
  enablePreviewAnimation: false,
  borderRadius: 0,
};
