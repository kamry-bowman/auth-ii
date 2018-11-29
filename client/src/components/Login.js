import React, { Component } from 'react'
import axios from 'axios';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    }
    this.attemptLogin = this.attemptLogin.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  updateInput = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  attemptLogin = () => {
    const { api } = this.props;
    const { username, password } = this.state;
    return new Promise((resolve, reject) => {
      axios
      .post(`${api}/login`, { username: username, password: password })
      .then((res) => {
        if (res.data) {
          resolve(window.localStorage.setItem('jwt', res.data));
        } else {
          reject('Could not log in');
        } 
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
    }); 
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const attemptAuthenticationLocal = this.props.attemptAuthentication;
    this
      .attemptLogin()
      .then((res) => {
        attemptAuthenticationLocal();
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }

  render() {
    return (
      <div>
        <h2>Login</h2>        
        <form onSubmit={ this.handleSubmit }>
          <label htmlFor="username">Username:</label>
          <input onChange={this.updateInput} type="text" name="username" id="username" />
          <label htmlFor="password">Password:</label>
          <input onChange={this.updateInput} type="text" name="password" id="password" />
          <input type="submit" />
        </form>
      </div>
    )
  }
}
