import React from 'react';
import Counter from './Counter.jsx';
import Login from './Login.jsx';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Login />
        <Counter />
      </div>
    );
  }
}
