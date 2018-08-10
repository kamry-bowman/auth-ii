import React, { Component } from 'react'
import axios from 'axios';
import dotenv from 'dotenv';
import Login from './Login';

dotenv.config();
const host = process.env.HOST || 'localhost';
const port = process.env.SERVERPORT || 8000;

export default class Authorization extends Component {
  constructor(props) {
    super(props);
    this.api = `http://${host}:${port}/api`;
    this.state = {
      authorized: false,
    }
    this.attemptAuthentication = this.attemptAuthentication.bind(this);
  }

  attemptAuthentication() {
    const authentication = window.localStorage.getItem('jwt');
    if (authentication) {
      axios
        .get(`${this.api}/restricted/authenticate`, { headers: { authentication } })
        .then((res) => {
            this.setState({ authorized: true });
        })
        .catch((err) => {
          console.log(err);
        });
    } 
  }

  componentDidMount() {
    this.attemptAuthentication();
  }
  
  render() {
    const { authorized } = this.state;
  return authorized  
  ? React.Children.map(this.props.children, child => React.cloneElement(child, {api: this.api})) 
  : (<Login attemptAuthentication={this.attemptAuthentication} api={ this.api } />);
  }
}
