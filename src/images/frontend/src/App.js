import React from "react";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import MovieSearchForm from "./components/Views/MovieSearch/MovieSearchForm";
import MovieCompareSelect from "./components/Views/MovieCompare/MovieCompareSelect";
import MovieRecommendForm from "./components/Views/MovieRecommend/MovieRecommendForm";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Views/Header/Header";
import AboutUs from "./components/Views/AboutUs/AboutUs";
import Index from "./components/Views/Index/Index";
import CastList from "components/Views/CastList/CastList"

class App extends React.Component {
  constructor()
  {
    super();
    this.backendUrl = process.env.BACKEND_SERVER;
    this.form = React.createRef();
    this.state = {
    };
  }

  render() {
    return (
      <div className="App-content">
        <Header />
        <div className = "App-body">
        <BrowserRouter>
          <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/CastList" element={<CastList />} />
              <Route path="/MovieSearchForm" element={<MovieSearchForm />} />
              <Route path="/MovieCompareSelect" element={<MovieCompareSelect />} />
              <Route path="/MovieRecommendForm" element={<MovieRecommendForm />} />
              <Route path="/about-us" element={<AboutUs />} />
          </Routes>
        </BrowserRouter>
        </div>
      </div>
      
    );
  }
}
export default App;

