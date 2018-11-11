import React, { Component } from 'react';

import api from '../services/api';
import like from '../like.svg';
import './Tweet.css';



export default class Pru extends Component {

  handleLike = async () => {
    const { _id } = this.props.pru;

    await api.post(`likes/${_id}`);
  }

  render() {
    const { pru } = this.props;
    return (
      <li className="tweet">
        <strong>{pru.author}</strong>
        <p>{pru.content}</p>
        <button type="button" onClick={this.handleLike}>
          <img src={like} alt="Like" />
          {pru.likes}
        </button>
      </li>
    );
  }
}