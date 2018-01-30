import React from 'react';
import Counter from './Counter.jsx';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Admin comming...</h1>
        <Counter />
      </div>
    );
  }
}
