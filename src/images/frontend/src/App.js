import React from "react";
import "./App.css";
import MovieSearchForm from "./components/Views/MovieSearch/MovieSearchForm";
import PersonSearchForm from "./components/Views/PersonSearch/PersonSearchForm";
import MovieCompareSelect from "./components/Views/MovieCompare/MovieCompareSelect";
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
        { id: 1, title: "Person Search", selected: false, key: 'modeObj', color:"secondary" },
        { id: 2, title: "Movie Compare", selected: false, key: 'modeObj', color:"success" }
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


  renderAppBody(selectedSearchType){

    if(selectedSearchType === 0){
      return <MovieSearchForm color={this.state.colorscheme} />
    }
    else if(selectedSearchType === 1){
      return <PersonSearchForm color={this.state.colorscheme} />
    }
    else{
      return <MovieCompareSelect color={this.state.colorscheme} />
    }
  }

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
          {this.renderAppBody(this.state.selectedSearch)}
        </div>
      </div>
    );
    return content;
  }
}
export default App;
