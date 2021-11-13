import React from 'react';
import './App.css';

class App extends React.Component {
    constructor(props) {
      super(props);

      this.backendUrl = process.env.BACKEND_SERVER

      this.form = React.createRef();
  }

  render() {
    let content = (
      <div className="App">
        <header className="App-header">
          {/* See: https://giphy.com/gifs/3d-animation-dota-2-bluespace-eHKM1zH4JBMk */}
          <img src="https://media.giphy.com/media/eHKM1zH4JBMk/giphy.gif" alt="logo" />
        </header>
      </div>
    );

    return content;
  }
}

export default App;
