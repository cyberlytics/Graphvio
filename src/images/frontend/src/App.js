import React from 'react';
import './App.css';
import Button from './components/Button'
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
    
    const func = () => {
      console.log('click')
    }

    let content = (
      <div className="App">
        <header className="App-header"> 
          <Button color='green' text='hallo' onClick={func}/>
        </header>
      </div>
    );

    return content;
  }
}

export default App;