import React, { Component, PropTypes } from "react";

class Webcam extends Component {
  static propTypes = {
    audio: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    captureFormat: PropTypes.oneOf(["image/png", "image/jpeg", "image/webp"]),
    onSuccess: PropTypes.func,
    onFailure: PropTypes.func
  };

  static defaultProps = {
    audio: true,
    video: true,
    width: 640,
    height: 480,
    clockwiseRotations: 0,
    zoom: 1,
    focusX: 0.5,
    focusY: 0.5,
    captureFormat: "image/png",
    onSuccess: () => {},
    onFailure: error => {
      console.error("An error occured while requesting user media");
      throw error;
    }
  };

  static _mediaStream = null;
  static _captureCanvas = null;

  //---------------------------------------------------------------------------
  // Initialization
  //---------------------------------------------------------------------------

  constructor(props) {
    super(props);

    this.state = {
      hasUserMedia: false,
      userMediaRequested: false
    };
  }

  //---------------------------------------------------------------------------
  // Lifecycle methods
  //---------------------------------------------------------------------------

  componentDidMount() {
    if (!this._hasGetUserMedia()) {
      return false;
    }

    const { hasUserMedia, userMediaRequested } = this.state;
    if (!hasUserMedia && !userMediaRequested) {
      this._requestUserMedia();
    }
  }

  componentWillUnmount() {
    this._mediaStream &&
      this._mediaStream.getTracks().forEach(track => track.stop());
  }

  //---------------------------------------------------------------------------
  // External methods
  //---------------------------------------------------------------------------

  _hasGetUserMedia() {
    return !!(navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);
  }

  _requestUserMedia() {
    navigator.getUserMedia = navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    const constraints = {
      video: this.props.video,
      audio: this.props.audio
    };

    navigator.getUserMedia(
      constraints,
      stream => {
        const video = this._video;

        if (window.URL) {
          video.src = window.URL.createObjectURL(stream);
        } else {
          video.src = stream;
        }

        this._mediaStream = stream;

        this.setState({
          hasUserMedia: true,
          userMediaRequested: true
        });

        this.props.onSuccess();
      },
      error => {
        this.props.onFailure(error);
      }
    );
  }

  _getCanvas() {
    this._captureCanvas = document.createElement("canvas");
    this._captureCanvas.width = this.props.width;
    this._captureCanvas.height = this.props.height;

    return this._captureCanvas;
  }

  //---------------------------------------------------------------------------
  // External methods
  //---------------------------------------------------------------------------

  captureCanvas() {
    const { hasUserMedia, userMediaRequested } = this.state;
    const {
      width,
      height,
      zoom,
      focusX,
      focusY,
      clockwiseRotations
    } = this.props;

    if (hasUserMedia && userMediaRequested) {
      const canvas = this._getCanvas();
      const ctx = canvas.getContext("2d");

      if (clockwiseRotations % 4 === 0) {
      } else if (clockwiseRotations % 4 === 1) {
        canvas.width = height;
        canvas.height = width;
        ctx.translate(canvas.width, 0);
        ctx.rotate(Math.PI / 2.0);
      } else if (clockwiseRotations % 4 === 2) {
        ctx.translate(canvas.width, canvas.height);
        ctx.rotate(Math.PI);
      } else if (clockwiseRotations % 4 === 3) {
        canvas.width = height;
        canvas.height = width;
        ctx.translate(0, canvas.height);
        ctx.rotate(3 * Math.PI / 2.0);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        this._video,
        width / 2.0 - focusX * width * zoom,
        height / 2.0 - focusY * height * zoom,
        width * zoom,
        height * zoom
      );

      return canvas;
    }
  }

  captureScreenshot() {
    const { captureFormat } = this.props;
    const canvas = this.captureCanvas();
    if (canvas) {
      return canvas.toDataURL(captureFormat);
    }
  }

  //---------------------------------------------------------------------------
  // Render
  //---------------------------------------------------------------------------

  render() {
    const { width, height, zoom, focusX, focusY, ...props } = this.props;
    const wrapperStyle = {
      width,
      height,
      overflow: "hidden",
      position: "relative"
    };
    const videoStyle = {
      left: width / 2.0 - focusX * width * zoom,
      top: height / 2.0 - focusY * height * zoom,
      position: "absolute"
    };

    return (
      <div style={wrapperStyle} {...props}>
        <video
          style={videoStyle}
          width={width * zoom}
          height={height * zoom}
          ref={component => this._video = component}
          autoPlay
        />
      </div>
    );
  }
}

export default Webcam;
