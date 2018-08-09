import React, { Component } from 'react'
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 8000;

export default class Authorization extends Component {
  constructor(props) {
    super(props);
    this.api = `http://${host}/${port}/api`;
    this.state = {
      authorized: false,
    }
  }

  attemptAuthentication() {
    axios.get()
  
  }

  componentDidMount() {
    attemptAuthentication();
  }
  
  render() {
    return (
      <div>
        
      </div>
    )
  }
}
