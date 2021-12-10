import React from "react";
import "./App.css";
import SearchForm from "./components/SearchForm";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropdown from "./components/Base/Dropdown";


class App extends React.Component {
  constructor()
  {
    super();
    this.backendUrl = process.env.BACKEND_SERVER;
    this.form = React.createRef();
    this.state = {
      modeObj: [
        { id: 0, title: "Movie Search", selected: true, key: 'modeObj', color:"primary" },
        { id: 1, title: "Person Search", selected: false, key: 'modeObj', color:"secondary" }
      ],
      selectedSearch : 0,
      colorscheme : "primary"
    };
  }

  resetThenSet = (id, key) => {
    const temp = [...this.state[key]];

    temp.forEach((item) => item.selected = false);
    temp[id].selected = true;
    this.setState({
      [key]: temp,
      selectedSearch: id,
      colorscheme: temp[id].color
    });
  };

  render() {
    let content = (
      <div className="App-content">
        <div className="App-header">
          <Dropdown
            title={this.state.modeObj[0].title}
            color={this.state.colorscheme}
            listElements={this.state.modeObj}
            resetThenSet={this.resetThenSet}
          ></Dropdown>
          <div>Graphvio</div>
          <div>Version: 1.0</div>
        </div>
        <div className="App-body">
          <SearchForm color={this.state.colorscheme} />
          {this.state.selectedSearch === 0 ? <div className={'background-blue'}>movie search</div>: null}
          {this.state.selectedSearch === 1 ? <div className={'background-gray'}>person search</div>: null}
        </div>
      </div>
    );
    return content;
  }
}
export default App;
