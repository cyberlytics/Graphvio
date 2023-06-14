import MovieSearchForm from "components/Views/MovieSearch/MovieSearchForm";
import TextBox from 'components/Base/TextBox';
import ExpandableMovieList from 'components/Views/Base/ExpandableMovieList';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure,shallow,mount } from 'enzyme';

const Constants = require("Constants");

configure({ adapter: new Adapter() });

beforeEach(() => {
  Constants.BACKEND_URL = "node-backend";
});

it("searchFunction should querry the Backend correctly", async () => {
    const wrapper = shallow(<MovieSearchForm/>);
    const instance = wrapper.instance();
    instance.textBox = new TextBox({value: "Matrix"});
    instance.list = new ExpandableMovieList({items: []});
    await instance.searchFunction();
    expect(instance.movies.length).toBeGreaterThan(0);
  });

it("searchFunction should update the MovieList correctly", async () => {
    const wrapper = mount(<MovieSearchForm/>);
    const instance = wrapper.instance();
    instance.textBox = new TextBox({value: "Matrix"});
    const listwrapper = shallow(<ExpandableMovieList items={[]}/>);
    instance.list =  listwrapper.instance();
    await instance.searchFunction();
    expect(instance.list.state.items.length).toBeGreaterThan(0);
  });