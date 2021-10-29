# SWT Projekt Modularbeit

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