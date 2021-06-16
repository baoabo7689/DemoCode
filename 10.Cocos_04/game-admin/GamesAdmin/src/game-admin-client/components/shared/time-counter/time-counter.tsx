import React from "react";
import styles from "./time-counter.module.scss";
import { GameState } from "../common/GameState";

type timeCounterProps = {
  remainingTime: number;
  gameState: number;
  hhmmssFormat?: boolean;
};

export default class TimeCounter extends React.Component<timeCounterProps, { currentTime: number; gameState: number }> {
  constructor(props) {
    super(props);

    this.state = {
      currentTime: props.remainingTime,
      gameState: props.gameState,
    };
  }

  interval: any;

  componentDidMount() {
    this.interval = setInterval(() => {
      if (this.state.currentTime > 0) {
        this.setState({
          currentTime: this.state.currentTime - 1,
        });
      }
    }, 1000);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.gameState != state.gameState) {
      return {
        currentTime: props.remainingTime,
        gameState: props.gameState,
      };
    }

    return null;
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  getFormatedNumber(number: number) {
    return number >= 10 ? number : "0" + number;
  }

  renderFullTime(currentTime: number) {
    const second = currentTime % 60;
    const minute = ((currentTime % 3600) - second) / 60;
    const hour = Math.floor(currentTime / 3600);

    return `${this.getFormatedNumber(hour)}:${this.getFormatedNumber(minute)}:${this.getFormatedNumber(second)}`;
  }

  renderTimeCounter() {
    const { currentTime, gameState } = this.state;
    const { hhmmssFormat } = this.props;

    if (hhmmssFormat) {
      return this.renderFullTime(currentTime);
    }

    return (
      <div className={styles.timeCounter}>
        <span className={`${currentTime > 5 || gameState != GameState.running ? "" : styles.warning}`}>
          {this.getFormatedNumber(currentTime)}
        </span>
      </div>
    );
  }

  render() {
    return this.renderTimeCounter();
  }
}
