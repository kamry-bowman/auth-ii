import React, { Component } from 'react';
import Authorization from './components/Authorization';
import Logout from './components/Logout'
import UserList from './components/UserList';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Authorization>
          <Logout />
          <UserList>
             { users => (
               <React.Fragment>
                <h2>User List</h2>
                <ol>
                  { users.map(user => (<li key={ user.id }>{ user.username }</li>)) }
                </ol>
              </React.Fragment>
              )
             }
          </UserList>
        </Authorization>
      </div>
    );
  }
}

export default App;
