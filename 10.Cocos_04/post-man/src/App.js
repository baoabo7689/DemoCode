import React from 'react';
import './App.scss';
import socketIOClient from 'socket.io-client';
import appConfigs from './configs';

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      methodName: 'bet',
      requestData: `{\r  "key": "value" \r}`,
      responseData: 'Result',
    };
  }

  changeMethod(e) {
    this.setState({ methodName: e.target.value });
  }

  changeRequestData(e) {
    this.setState({ methodName: e.target.value });
  }

  sendRequest() {
    const socket = socketIOClient(
      appConfigs.userServices,
      appConfigs.socketOptions
    );

    socket.emit('signin', {
      username: 'admin_1',
      ss: 'l6q6opiOm6wVU7qOhhwknF8PNGnl39Ce_admin_1',
    });

    socket.on('signedIn', () => {
      const data = {
        amount: 10,
        betChoice: 'fish',
        freeBet: false,
        // roundId: 7,
      };

      // socket.emit(this.state.methodName, this.state.requestData);
      socket.emit(this.state.methodName, data);
      socket.emit('getGameConfigs');
      socket.emit('inGame');

      socket.emit('getStatistics', {});
    });

    socket.on('BauCua', (data) => {
      console.log(data);

      if (!!data.endBet) {
        this.displayResult(data);
      }
    });

    socket.on('Roulette', (data) => {
      console.log(data);
    });
  }

  displayResult(data) {
    var text = Object.keys(data)
      .map((k) => `\r  "${k}": "${data[k]}",`)
      .join(',');
    this.setState({ responseData: `{${text}\r}` });
  }

  displayResultObject(data) {
    var result = JSON.parse(data);
    var text = Object.keys(result)
      .map((k) => `\r  "${k}": "${result[k]}",`)
      .join(',');
    this.setState({ responseData: `{${text}\r}` });
  }

  render() {
    return (
      <div>
        <div className='group'>
          <label>Method </label>
          <input
            className='label'
            type='text'
            value={this.state.methodName}
            onChange={(e) => this.changeMethod(e)}
          ></input>
          <button onClick={() => this.sendRequest()}>Send</button>
        </div>
        <div className='group'>
          <textarea
            className='request-data'
            onChange={(e) => this.changeRequestData(e)}
            value={this.state.requestData}
          ></textarea>
        </div>
        <div className='group'>
          <textarea
            className='response-data'
            disabled='disabled'
            value={this.state.responseData}
          ></textarea>
        </div>
      </div>
    );
  }
}

export default App;
