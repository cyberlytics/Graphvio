# SWT Projekt Modularbeit

# Anwendungen
#### Frontend
- http://localhost:3000/

#### Backend
- https://localhost:44357/swagger/index.html

#### Database
User/Password: dba

Virtuoso
- http://localhost:8890/
Virtuoso Conductor
- http://localhost:8890/conductor/
SPARQL Endpoint
- http://localhost:8890/sparql/

#### Wie teste ich, ob die Daten in der Datenbank vorhanden sind?
1. Aufruf des SPARQL Endpoints (http://localhost:8890/sparql/)
2.
```
prefix movie: <http://localhost:8890/schemas/movies/>

SELECT *
FROM <http://localhost:8890/movies#>
WHERE
{
  ?id movie:title ?title
}
```

#### Suche nach einem bestimmten Film:
prefix movie: <http://localhost:8890/schemas/movies/>

SELECT ?id ?title
FROM <http://localhost:8890/movies#>
WHERE
{
  ?id movie:title ?title
  FILTER regex(str(?id), "(netflix|hulu)")
  FILTER regex(str(?title), "shark", "i").
}
LIMIT 100

#### SPARQL REGEX
https://en.wikibooks.org/wiki/SPARQL/Expressions_and_Functions#REGEX

#### Kaggle
- https://www.kaggle.com/shivamb/netflix-shows
- https://www.kaggle.com/shivamb/amazon-prime-movies-and-tv-shows
- https://www.kaggle.com/shivamb/disney-movies-and-tv-shows
- https://www.kaggle.com/shivamb/hulu-movies-and-tv-shows

# Architektur
...

# Zeitschätzung
...

## Vorraussetzungen

Docker

- https://www.docker.com/products/docker-desktop

(Beispielsweise) Visual Studio 2019 + DotNet 5.0, Community Edition reicht.

## Start der Anwendung

Nach dem Start von Docker kann mithilfe des folgenden Befehls innerhalb des Verzeichnisses /src/ das System gestartet werden. Der initiale Start benötigt mit erstmaligen Download der Images einige Zeit (ca. 3 Minuten oder deutlich mehr, abhängig von der Performance des Systems), da viele Pakete erst heruntergeladen und automatisch konfiguriert werden müssen.

Zum Start des Systems im Verzeichnis der 'docker-compose.yml' auszuführen:

```
docker-compose down && docker-compose build && docker-compose up
```

## Komponenten

Die Konfiguration der einzelnen Komponenten und der dazugehörigen Docker Images ist in der Datei **docker-compose.yml** möglich.
Das System ist in mehrere Komponenten aufgeteilt. Dabei wurden einige Docker Images erweitert und befinden sich im Ordner **/images** :

### Extern:

Gitignore:

...