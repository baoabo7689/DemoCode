import React from "react";
import "./App.scss";
import socketIOClient from "socket.io-client";
import appConfigs from "./configs";
import customParser from "socket.io-msgpack-parser";

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      methodName: "bet",
      requestData: `{\r  "key": "value" \r}`,
      responseData: "Result",
      socket: null,
    };
  }

  changeMethod(e) {
    this.setState({ methodName: e.target.value });
  }

  changeRequestData(e) {
    this.setState({ methodName: e.target.value });
  }

  sendRequest() {
    //this.postRequest();

    const socket = socketIOClient("http://localhost:8003/user/taixiu", {
      transports: ["websocket"],
      upgrade: false,
      path: "",
      forceNew: false,
      //   parser: customParser,
      auth: {
        username: "admin_1",
        ss: "l6q6opiOm6wVU7qOhhwknF8PNGnl39Ce_admin_1",
      },
    });

    socket.on("connect", () => {
      console.log(`connection 1`);
    });

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    socket.on("message", (message) => {
      console.log(message);
    });

    socket.on("Hilo", (message) => {
      console.log(message);
    });

    socket.on("disconnect", (reason) => {
      console.log("disconnect " + reason);
    });

    //  socket.emit("signin", {
    // username: "admin_1",
    //  ss: "l6q6opiOm6wVU7qOhhwknF8PNGnl39Ce_admin_1",
    // });

    socket.on("signedIn", () => {
      //  socket.emit("collect");
      socket.emit("inGame", {
        username: "admin_1",
        ss: "l6q6opiOm6wVU7qOhhwknF8PNGnl39Ce_admin_1",
      });

      // socket.emit("bet", { amount: 10 });

      setTimeout(() => {
        // socket.emit("deal", { amount: 10, betChoice: "h" });
      }, 2000);
      //socket.emit("getHistory", { page: 1 });
      setTimeout(() => {
        //socket.emit("getHistory", { page: 1 });
      }, 10000);
    });

    this.setState({ socket });
  }

  inGame() {
    this.state.socket.emit("inGame");
  }

  postRequest() {
    const http = new XMLHttpRequest();
    const url = "http://localhost:5001/api/set-result";
    http.open("POST", url);
    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    http.send(JSON.stringify({ roundId: 10, result: { rank: 5, suit: 2 } }));

    http.onreadystatechange = (e) => {
      console.log(http.responseText);
    };
  }

  displayResult(data) {
    var text = Object.keys(data)
      .map((k) => `\r  "${k}": "${data[k]}",`)
      .join(",");
    this.setState({ responseData: `{${text}\r}` });
  }

  displayResultObject(data) {
    var result = JSON.parse(data);
    var text = Object.keys(result)
      .map((k) => `\r  "${k}": "${result[k]}",`)
      .join(",");
    this.setState({ responseData: `{${text}\r}` });
  }

  render() {
    return (
      <div>
        <div className="group">
          <label>Method </label>
          <input
            className="label"
            type="text"
            value={this.state.methodName}
            onChange={(e) => this.changeMethod(e)}
          ></input>
          <button onClick={() => this.sendRequest()}>Send</button>
          <button onClick={() => this.inGame()}>inGame</button>
        </div>
        <div className="group">
          <textarea
            className="request-data"
            onChange={(e) => this.changeRequestData(e)}
            value={this.state.requestData}
          ></textarea>
        </div>
        <div className="group">
          <textarea
            className="response-data"
            disabled="disabled"
            value={this.state.responseData}
          ></textarea>
        </div>
      </div>
    );
  }
}

export default App;
