import React from "react";
import ReactDOM from "react-dom";

import Webcam from "./webcam";

class Examples extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mounted: true,
      zoomLevel: 1.0,
      focusX: 0.5,
      focusY: 0.5,
      screenshot: null
    };
  }

  takeScreenshot() {
    this.setState({
      screenshot: this.refs.webcam.captureScreenshot()
    });
  }

  toggleMount() {
    this.setState({ mounted: false });
  }

  decZoom() {
    this.setState({ zoomLevel: Math.max(1.0, this.state.zoomLevel - 0.2) });
  }

  incZoom() {
    this.setState({ zoomLevel: this.state.zoomLevel + 0.2 });
  }

  up() {
    this.setState({ focusY: Math.max(0.0, this.state.focusY - 0.1) });
  }

  down() {
    this.setState({ focusY: Math.min(1.0, this.state.focusY + 0.1) });
  }

  left() {
    this.setState({ focusX: Math.max(0.0, this.state.focusX - 0.1) });
  }

  right() {
    this.setState({ focusX: Math.min(1.0, this.state.focusX + 0.1) });
  }

  render() {
    const webcam = this.state.mounted
      ? <Webcam
          ref="webcam"
          zoom={this.state.zoomLevel}
          focusX={this.state.focusX}
          focusY={this.state.focusY}
          clockwiseRotations={0}
          audio={false}
        />
      : null;

    const btnLabel = this.state.mounted ? "Unmount Webcam" : "Mount Webcam";
    const containerStyle = { position: "relative" };
    return (
      <div>
        <button onClick={this.toggleMount.bind(this)}>{btnLabel}</button>
        <div style={containerStyle}>
          {webcam}
          <button onClick={this.decZoom.bind(this)}>-</button>
          <button onClick={this.incZoom.bind(this)}>+</button>
          <button onClick={this.up.bind(this)}>up</button>
          <button onClick={this.down.bind(this)}>down</button>
          <button onClick={this.left.bind(this)}>left</button>
          <button onClick={this.right.bind(this)}>right</button>
          <button onClick={this.takeScreenshot.bind(this)}>
            Take Screenshot
          </button>
          <br />
          <img ref="capture" src={this.state.screenshot} />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Examples />, document.getElementById("examples"));
