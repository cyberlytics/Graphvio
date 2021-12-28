const imdbRouterTests = require('../routes/imdb').tests

const url = require('url');
const axios = require('axios');

// http://localhost:5000/imdb/search-imdbdata?title=The%20Matrix&type=Movie
describe('SearchImdbdata Test', function () {
  test('Suche nach Filminformationen', async () => { 
    // Arrange
    const req = { url: '?title=The%20Matrix&type=Movie' };
    const res = { 
      object: '',
      json: function(input) { this.object = input } 
    };
    
    // Act
    await imdbRouterTests.searchImdbdata(req, res);

    // Assert
    expect(res.object.imDb).toEqual("8.7");
    expect(res.object.image).toEqual("https://imdb-api.com/images/original/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_Ratio0.7273_AL_.jpg");
  });

  test('Suche nach nicht vorhandenem Film', async () => { 
    // Arrange
    const req = { url: '?title=rawrxdlol42' };
    const res = { 
      object: '',
      json: function(input) { this.object = input } 
    };
    
    // Act
    await imdbRouterTests.searchImdbdata(req, res);

    // Assert
    expect(res.object.results.length).toEqual(0);    
    expect(res.object.errorMessage).toEqual("Movie not found");
  });

  test('Suche nach falschem Typ eines vorhandenen Filmes', async () => { 
    // Arrange
    const req = { url: '?title=Christoph%20Neuberger&type=Movie' };
    const res = { 
      object: '',
      json: function(input) { this.object = input } 
    };
    
    // Act
    await imdbRouterTests.searchImdbdata(req, res);

    // Assert
    expect(res.object.results).toEqual([]);    
    expect(res.object.errorMessage).toEqual("Movie not found");
  });

  test('Suche nach einem Film, zudem keine benötigten Filminformationen existieren', async () => { 
    // Arrange
    const req = { url: '?title=Hund (2022)&type=Movie' };
    const res = { 
      object: '',
      json: function(input) { this.object = input } 
    };
    
    // Act
    await imdbRouterTests.searchImdbdata(req, res);

    // Assert
    expect(res.object["imDb"]).toEqual("");
    expect(res.object.image).toEqual("https://imdb-api.com/images/original/nopicture.jpg");
  });

  test('Suche ohne essentiellem Parameter title', async () => { 
    // Arrange
    const req = { url: '?Hund&type=Movie' };
    const res = { 
      object: '',
      json: function(input) { this.object = input } 
    };
    
    // Act
    await imdbRouterTests.searchImdbdata(req, res);

    // Assert
    expect(res.object).toMatchObject({})
  });

test('Suche nach einer Tv Serie', async () => { 
    // Arrange
    const req = { url: '?title=Alpha%20Forum&type=Tv%20Show' };
    const res = { 
      object: '',
      json: function(input) { this.object = input } 
    };
    
    // Act
    await imdbRouterTests.searchImdbdata(req, res);

    // Assert
    expect(res.object.type).toEqual("TVSeries");
  });
})