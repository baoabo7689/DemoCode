import React from "react";
import BigSmallBase from "../big-small-base/big-small-base";

type BigSmallProps = {
  onMessage: Function;
  sendMessage: Function;
  isProduction: boolean;
};

export default class BigSmallTurbo extends React.Component<BigSmallProps, { data: object }> {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  render() {
    return (
      <BigSmallBase
        type="taixiu"
        turbo={true}
        onMessage={this.props.onMessage}
        sendMessage={this.props.sendMessage}
        isProduction={this.props.isProduction}
      />
    );
  }
}
