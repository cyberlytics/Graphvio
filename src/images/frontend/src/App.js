import React from 'react';
import './App.css';
import SearchForm from './components/SearchForm';

import Textbox from './components/SearchForm'
class App extends React.Component {
    constructor(props) {
      super(props);
      this.backendUrl = process.env.BACKEND_SERVER

      this.form = React.createRef();

  }

render() {
    let a = 0
    let b = 3
    let c = a + b
    
        let content = (
      <div className="App">
        <header className="App-header"> 
          <SearchForm/>
        </header>
      </div>
    );

    return content;
  }
}

export default App;