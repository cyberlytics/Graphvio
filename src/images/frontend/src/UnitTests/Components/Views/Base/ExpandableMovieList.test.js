import {ExpandableMovieList, MovieListItem} from 'components/Views/Base/ExpandableMovieList';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure,shallow,mount } from 'enzyme';

const Constants = require("Constants");
const testData = '[{"title":"The Matrix","provider":"netflix","metadata":{"image":"asd","imdb":"-","cast":"Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving, Gloria Foster, Joe Pantoliano, Marcus Chong, Julian Arahanga, Matt Doran, Belinda McClory","country":"United States","date_added":"November 1, 2019","description":"A computer hacker learns that what most people perceive as reality is actually a simulation created by machines, and joins a rebellion to break free.","director":"Lilly Wachowski, Lana Wachowski","duration":"136 min","release_year":"1999","type":"Movie","rating":"R","genre":"Action & Adventure, Sci-Fi & Fantasy"}}]'
const testJson = JSON.parse(testData);
configure({ adapter: new Adapter() });

beforeEach(() => {
  Constants.BACKEND_URL = "node-backend";
});

it("ExpandableMovieList should render with no Items", async () => {
    const wrapper = shallow(<ExpandableMovieList items={[]}/>);
    wrapper.instance();
  });

it("ExpandableMovieList should UpdateItems", async () => {
    const wrapper = shallow(<ExpandableMovieList items={[]}/>);
    const instance = wrapper.instance();

    instance.updateItems(testJson);
    expect(instance.state.items.length).toBeGreaterThan(0);
});


it("ExpandableMovieList should Update Expanded Item", async () => {
    const wrapper = shallow(<ExpandableMovieList items={[]}/>);
    const instance = wrapper.instance();

    instance.updateItems(testJson);
    const itemwrapper =  shallow(<MovieListItem movieData={testJson[0]}/>);
    const iteminstance = itemwrapper.instance();
    instance.renderedItemsRef = [iteminstance]
    await instance.handleItemOnOpen(0);
    expect(iteminstance.state.movieData.metadata.imdb).not.toBe("-");
});


