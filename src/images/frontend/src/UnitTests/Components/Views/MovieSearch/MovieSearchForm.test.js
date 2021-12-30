import MovieSearchForm from "components/Views/MovieSearch/MovieSearchForm";
import TextBox from 'components/Base/TextBox';
import ExpandableMovieList from 'components/Views/Base/ExpandableMovieList';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure,shallow } from 'enzyme';

const Constants = require("Constants");

configure({ adapter: new Adapter() });

beforeEach(() => {
  Constants.BACKEND_URL = "node-backend";

});

it("searchFunction Querrys the Backend Correctly", async () => {
    const wrapper = shallow(<MovieSearchForm/>);
    const instance = wrapper.instance();
    instance.textBox = new TextBox({value: "Matrix"});
    instance.list = new ExpandableMovieList({items: []});
    await instance.searchFunction();
    expect(instance.movies.length).toBeGreaterThan(0);
  });

// it("searchFunction Updates the Movie List Correctly", async () => {
//     const wrapper = shallow(<MovieSearchForm/>);
//     const instance = wrapper.instance();
//     instance.textBox = new TextBox({value: "Matrix"});
//     instance.list = new ExpandableMovieList({items: []});
//     await instance.searchFunction();
//     expect(instance.list.state.items.length).toBeGreaterThan(0);
//   });