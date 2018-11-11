import React, { Component } from 'react';
import api from '../services/api';
import socket from 'socket.io-client';

import pruLogo from '../twitter.svg';
import './Timeline.css';

import Pru from '../components/Pru';

export default class Timeline extends Component {
  state = {
    prus: [],
    newPru: ''
  };

  async componentDidMount() {
    this.subscribeToEvents();

    const response = await api.get('prus');

    this.setState({ prus: response.data });
  }

  subscribeToEvents = () => {
    const io = socket('http://localhost:3000');

    io.on('pru', data => { 
      this.setState({ prus: [data, ...this.state.prus] });
    })

    io.on('like', data => { 
      this.setState({ 
        prus: this.state.prus.map(
          pru => (pru._id === data._id ? data : pru)
        )
      });
    });
  };

  handleNewPru = async (e) => {
    if(e.keyCode !== 13) return;

    const content = this.state.newPru;
    const author = localStorage.getItem('@GoPru:username');

    await api.post('prus', { content, author });

    this.setState({ newPru: '' });
  }

  handleInputChange = (e) => {
    this.setState({ newPru: e.target.value });
  }
  
  render() {
    return (
      <div className="timeline-wrapper">
        <img height={24} src={pruLogo} alt="GoPru" />

        <form>
          <textarea 
            value={this.state.newPru} 
            onChange={this.handleInputChange} 
            onKeyDown={this.handleNewPru}
            placeholder="O que você está pensando? Pru"
          />
        </form>

        <ul className="tweet-list">
          { this.state.prus.map(pru => (
            <Pru key={pru._id} pru={pru} />
          )) }
        </ul>

      </div>
    );
  }
}