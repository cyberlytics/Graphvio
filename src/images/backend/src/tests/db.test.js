const dbRouterTests = require('../routes/db').tests

describe('SearchMovies Test', function () {
  test('Anzahl der Resultergebnisse', async () => { 
    // Arrange
    const req = { url: '?title=Matrix&limit=20' };
    const res = { 
      object: '',
      json: function(input) { this.object = input } 
    };
    
    // Act
    await dbRouterTests.searchMovies(req, res);

    // Assert
    expect(res.object.length).toEqual(4);
  });

  test('Anzahl der Resultergebnisse Limitierung 2', async () => { 
    // Arrange
    const req = { url: '?title=Matrix&limit=2' };
    const res = { 
      object: '',
      json: function(input) { this.object = input } 
    };
    
    // Act
    await dbRouterTests.searchMovies(req, res);

    // Assert
    expect(res.object.length).toEqual(2);
  });

  test('Resultergebnisse Felder', async () => { 
    // Arrange
    const req = { url: '?title=Shark&limit=1' };
    const res = { 
      object: '',
      json: function(input) { this.object = input } 
    };
    
    // Act
    await dbRouterTests.searchMovies(req, res);

    // Assert
    expect(res.object[0].title).toEqual("The Last Sharknado: It's About Time");
    expect(res.object[0].provider).toEqual("amazon_prime");
    expect(res.object[0].metadata.cast).toEqual("Tara Reid, Ian Ziering, Cassie Scerbo, Vivica A. Fox, Judah Friedlander");
    expect(res.object[0].metadata.country).toEqual("United States");
    expect(res.object[0].metadata.date_added).toEqual(undefined);
    expect(res.object[0].metadata.description).toEqual("Determined to bring his family back to life, Gil sends his father Fin back in time to stop the Sharknados from starting. Along the way, he fights dinosaurs, knights, cowboys, and a robot version of his wife. This time - it's not how to stop the Sharknados, but when.");
    expect(res.object[0].metadata.director).toEqual("Anthony C. Ferrante");
    expect(res.object[0].metadata.duration).toEqual("89 min");
    expect(res.object[0].metadata.release_year).toEqual("2018");
    expect(res.object[0].metadata.type).toEqual("Movie");
    expect(res.object[0].metadata.rating).toEqual("13+");
    expect(res.object[0].metadata.genre).toEqual("Action, Science Fiction");
  });

  test('Test einer Suche mit nicht unterstütztem Provider', async () => { 
    // Arrange
    const req = { url: '?title=Matrix&limit=2&provider=RakutenTV' };
    const res = { 
      object: '',
      json: function(input) { this.object = input } 
    };
    
    // Act
    await dbRouterTests.searchMovies(req, res);

    // Assert
    expect(res.object).toEqual([]);
  });

  test('Test einer Suche mit spezifischem Provider', async () => { 
    // Arrange
    const req = { url: '?title=Matrix&limit=20&provider=hulu' };
    const res = { 
      object: '',
      json: function(input) { this.object = input } 
    };
    
    // Act
    await dbRouterTests.searchMovies(req, res);

    // Assert
    expect(res.object.length).toEqual(1);
    expect(res.object[0].provider).toEqual("hulu");
  });

  test('Test einer Suche mit spezifischem Provider', async () => { 
    // Arrange
    const req = { url: '?title=ajskdlfjöalsdjfk' };
    const res = { 
      object: '',
      json: function(input) { this.object = input } 
    };
    
    // Act
    await dbRouterTests.searchMovies(req, res);

    // Assert
    expect(res.object.length).toEqual(0);
  });
})

describe('SearchPersons Test', function () {
  // Timeout für DBpedia höher, da die Anfragen durchaus mal länger brauchen können
  jest.setTimeout(60000)

  test('Suche mit Filmtitel und spezifischem Jahr', async () => { 
    // Arrange
    const req = { url: '?title=Always&year=2011' };
    const res = { 
      object: '',
      json: function(input) { this.object = input } 
    };

    const req2 = { url: '?title=Always&year=1989&limit=50' };
    const res2 = { 
      object: '',
      json: function(input) { this.object = input } 
    };
    
    // Act
    await dbRouterTests.searchPersons(req, res);
    await dbRouterTests.searchPersons(req2, res2);

    // Assert
    expect(res.object.response.film).toEqual("http://dbpedia.org/resource/Always_(2011_film)");
    expect(res.object.response.persons.length).toEqual(6);

    expect(res2.object.response.film).toEqual("http://dbpedia.org/resource/Always_(1989_film)");
    expect(res2.object.response.persons.length).toEqual(11);
  });

  test('Suche mit Filmtitel ohne Jahr', async () => { 
    // Arrange
    const req = { url: '?title=Lucifer&limit=50' };
    const res = { 
      object: '',
      json: function(input) { this.object = input } 
    };
    
    // Act
    await dbRouterTests.searchPersons(req, res);

    // Assert
    expect(res.object.response.film).toEqual("http://dbpedia.org/resource/Lucifer_(TV_series)");
    expect(res.object.response.persons.length).toEqual(17);
  });

  test('Suche nach Personeninformationen', async () => { 
    // Arrange
    const req = { url: '?title=Lucifer&limit=3' };
    const res = { 
      object: '',
      json: function(input) { this.object = input } 
    };
    
    // Act
    await dbRouterTests.searchPersons(req, res);

    console.log(res.object.reponse)
    // Assert
    expect(res.object.response.persons[0].name).toEqual("Lesley-Ann Brandt");
    expect(res.object.response.persons[0].birthPlace).toEqual("South Africa");
    expect(res.object.response.persons[0].birthDate).toEqual( "1981-12-02");
    expect(res.object.response.persons[0].role).toEqual("starring");
    expect(res.object.response.persons[0].advanced.birthPlaceEntities).toEqual("http://dbpedia.org/resource/South_Africa");
    expect(res.object.response.persons[0].advanced.person_entity).toEqual( "http://dbpedia.org/resource/Lesley-Ann_Brandt");
  });

  test('Suche nach nicht vorhandenem Film', async () => { 
    // Arrange
    const req = { url: '?title=ThisisnotaMovie&limit=50' };
    const res = { 
      object: '',
      json: function(input) { this.object = input } 
    };
    
    // Act
    await dbRouterTests.searchPersons(req, res);

    // Assert
    expect(res.object.response.film).toEqual("");
    expect(res.object.response.persons.length).toEqual(0);
  });

  test('Suche nach nicht vorhandenem Film', async () => { 
    // Arrange
    const req = { url: '?title=ThisisnotaMovie&limit=50' };
    const res = { 
      object: '',
      json: function(input) { this.object = input } 
    };
    
    // Act
    await dbRouterTests.searchPersons(req, res);

    // Assert
    expect(res.object.response.film).toEqual("");
    expect(res.object.response.persons.length).toEqual(0);
  });
})

describe('CompareMovies Test', function () {
  test('', async () => { 
    // Arrange
    const req = { url: '?title=the%20matrix&title=knock%20knock' };
    const res = { 
      object: '',
      json: function(input) { this.object = input } 
    };
    
    // Act
    await dbRouterTests.compareMovies(req, res);

    // Assert
    expect(res.object.cast).toEqual({ 'Keanu Reeves': [ 'The Matrix', 'Knock Knock' ] });
    expect(res.object.country).toEqual({ 'United States': [ 'The Matrix', 'Knock Knock' ] });
    expect(res.object.director).toEqual({});
    expect(res.object.genre).toEqual({});
  });
})

describe('CompareMoviedata Test', function () {
  test('Leere Eingabe', async () => { 
    // Arrange
    const movie_data = [];
    
    // Act
    res = dbRouterTests.compareMoviedata(movie_data);

    // Assert
    expect(res.cast).toEqual({});
    expect(res.country).toEqual({});
    expect(res.director).toEqual({});
    expect(res.genre).toEqual({});
  });

  test('Komplett unterschiedliche Eingabe', async () => { 
    // Arrange
    const movie_data = [
      {
        title: "Title A",
        metadata: {      
          cast: 'Cast A 1, Cast A 2',
          country: 'Country A',
          director: 'Director A',
          genre: 'Genre A'
        }
      },
      {
        title: "Title B",
        metadata: {      
          cast: 'Cast B 1, Cast B 2',
          country: 'Country B',
          director: 'Director B',
          genre: 'Genre B'
        }
      }
    ]
    
    // Act
    res = dbRouterTests.compareMoviedata(movie_data);

    // Assert
    expect(res.cast).toEqual({});
    expect(res.country).toEqual({});
    expect(res.director).toEqual({});
    expect(res.genre).toEqual({});
  });

  test('Komplett gleiche Eingabe', async () => { 
    // Arrange
    const movie_data = [
      {
        title: "Title 1",
        metadata: {      
          cast: 'Cast 1, Cast 2',
          country: 'Country 1',
          director: 'Director 1',
          genre: 'Genre 1'
        }
      },
      {
        title: "Title 2",
        metadata: {      
          cast: 'Cast 1, Cast 2',
          country: 'Country 1',
          director: 'Director 1',
          genre: 'Genre 1'
        }
      }
    ]
    
    // Act
    res = dbRouterTests.compareMoviedata(movie_data);

    // Assert
    expect(res.cast).toEqual({ 'Cast 1': [ 'Title 1', 'Title 2' ], 'Cast 2': [ 'Title 1', 'Title 2' ] });
    expect(res.country).toEqual({ 'Country 1': [ 'Title 1', 'Title 2' ] });
    expect(res.director).toEqual({ 'Director 1': [ 'Title 1', 'Title 2' ] });
    expect(res.genre).toEqual({ 'Genre 1': [ 'Title 1', 'Title 2' ] });
  });

  test('Nur Cast 1 gleich', async () => { 
    // Arrange
    const movie_data = [
      {
        title: "Title 1",
        metadata: {      
          cast: 'Cast 1, Cast 2',
          country: 'Country 1',
          director: 'Director 1',
          genre: 'Genre 1'
        }
      },
      {
        title: "Title 2",
        metadata: {      
          cast: 'Cast 1, Cast 3',
          country: 'Country 2',
          director: 'Director 2',
          genre: 'Genre 2'
        }
      }
    ]
    
    // Act
    res = dbRouterTests.compareMoviedata(movie_data);

    // Assert
    expect(res.cast).toEqual({ 'Cast 1': [ 'Title 1', 'Title 2' ] });
    expect(res.country).toEqual({});
    expect(res.director).toEqual({});
    expect(res.genre).toEqual({});
  });

  test('3 Datensets - Cast 1 Matched alle, Cast 3 Matched Title 2 und 3', async () => { 
    // Arrange
    const movie_data = [
      {
        title: "Title 1",
        metadata: {      
          cast: 'Cast 1, Cast 2',
          country: 'Country 1',
          director: 'Director 1',
          genre: 'Genre 1'
        }
      },
      {
        title: "Title 2",
        metadata: {      
          cast: 'Cast 1, Cast 3',
          country: 'Country 2',
          director: 'Director 2',
          genre: 'Genre 2'
        }
      },
      {
        title: "Title 3",
        metadata: {      
          cast: 'Cast 1, Cast 3',
          country: 'Country 3',
          director: 'Director 3',
          genre: 'Genre 3'
        }
      }
    ]
    
    // Act
    res = dbRouterTests.compareMoviedata(movie_data);
    console.log(res);

    // Assert
    expect(res.cast).toEqual({ 'Cast 1': [ 'Title 1', 'Title 2', "Title 3" ], 'Cast 3': [ 'Title 2', 'Title 3'] });
    expect(res.country).toEqual({});
    expect(res.director).toEqual({});
    expect(res.genre).toEqual({});
  });

  test('Fehlender Cast bei Title 1', async () => { 
    // Arrange
    const movie_data = [
      {
        title: "Title 1",
        metadata: {      
          country: 'Country 1',
          director: 'Director 1',
          genre: 'Genre 1'
        }
      },
      {
        title: "Title 2",
        metadata: {      
          cast: 'Cast 1, Cast 3',
          country: 'Country 2',
          director: 'Director 2',
          genre: 'Genre 2'
        }
      }
    ]
    
    // Act
    res = dbRouterTests.compareMoviedata(movie_data);

    // Assert
    expect(res.cast).toEqual({});
    expect(res.country).toEqual({});
    expect(res.director).toEqual({});
    expect(res.genre).toEqual({});
  });
})

describe('GetSimilarMovies Test', function () {
  test('Filmeingabe mit Matches', async () => { 
    // Arrange
    const req = { url: '?title=Marvel%20Studios%27%20Avengers:%20Infinity%20War&title=Marvel%20Studios%27%20Avengers:%20Age%20of%20Ultron&title=Marvel%20Studios%27%20Thor&title=Marvel%20Studios%27%20Captain%20America:%20the%20first%20avenger' };
    const res = { 
      object: '',
      json: function(input) { this.object = input } 
    };
    
    // Act
    await dbRouterTests.searchSimilarMovies(req, res);

    // Assert
    expect(res.object.length).toEqual(10);
  });

  test('Filmeingabe ohne Matches', async () => { 
    // Arrange
    const req = { url: '?title=Marvel%20Studios%27%20Avengers:%20Infinity%20War&title=lover' };
    const res = { 
      object: '',
      json: function(input) { this.object = input } 
    };
    
    // Act
    await dbRouterTests.searchSimilarMovies(req, res);

    // Assert
    expect(res.object).toMatchObject({})
  });
})