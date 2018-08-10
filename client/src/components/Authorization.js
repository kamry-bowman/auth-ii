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
      authenticated: false,
    }
    this.attemptAuthentication = this.attemptAuthentication.bind(this);
    this.revokeAuthentication = this.revokeAuthentication.bind(this);
  }

  attemptAuthentication() {
    const authentication = window.localStorage.getItem('jwt');
    if (authentication) {
      axios
        .get(`${this.api}/restricted/authenticate`, { headers: { authentication } })
        .then((res) => {
            this.setState({ authenticated: true });
        })
        .catch((err) => {
          console.log(err);
        });
    } 
  }

  revokeAuthentication() {
    this.setState({
      authenticated: false,
    });
  }

  componentDidMount() {
    this.attemptAuthentication();
  }
  
  render() {
    const { authenticated } = this.state;
    const { revokeAuthentication, api } = this;
    const authenticationProps = { revokeAuthentication, api };
  return authenticated  
  ? React.Children.map(this.props.children, child => React.cloneElement(child, authenticationProps)) 
  : (<Login attemptAuthentication={this.attemptAuthentication} api={ this.api } />);
  }
}
