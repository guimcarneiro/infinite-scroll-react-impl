import React from 'react';

import UsersList from './components/github-users-list/UsersList';

import './App.css';

function App() {
  return (
    <div className="App">
      <h1>React Infinite Scroll Implementation</h1>
      <h4>Find your Github Followers, type your username:</h4>
      <UsersList />
    </div>
  );
}

export default App;
