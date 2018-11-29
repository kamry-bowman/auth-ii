import React, { Component } from 'react'
import axios from 'axios';

export default class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    }
    this.api = this.props.api;
    this.getUsers = this.getUsers.bind(this);
  }
  
  componentDidMount() {
    this.getUsers();
  }

  getUsers() {
    const jwt = window.localStorage.getItem('jwt');
    axios
      .get(`${this.api}/restricted/users`, { headers: { authentication: jwt }, }, { withCredentials: true })
      .then(({ data: users }) => {
        this.setState({ users });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return this.props.children(this.state.users)
  } 
}
