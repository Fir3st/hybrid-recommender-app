# Predictory - app

> Simple real world platform for watching movies with built-in recommender

## Installation

To install dependencies, run command

``` bash
$ yarn (or npm install)
```

### Configuration

This project uses package [config](https://www.npmjs.com/package/config) for project configuration.
Default configuration is showed in file `config/default.json`.
To change configuration, create file `config/local-development.json` and edit variables to your values.
More information about config package is [here](http://lorenwest.github.io/node-config/).

### Database setup

This project uses MySQL database and MongoDB (on Recommender API).
If you want to use PostgresSQL, change `mysql2` dependency in `package.json` to `pg`.
Also change `dialect` in database config.

``` bash
"dbConfig": {
    "dialect": "postgres",
    "host": "localhost",
    "port": 3306,
    "name": "recommender",
    "user": "root",
    "password": "",
    "synchronize": false
}
```

### Movies APIs

For downloading data about movies, the project uses [OMDb API](http://www.omdbapi.com/) and [TMDb API](https://www.themoviedb.org/).
Register for these two services and paste your API keys to you config file.

``` bash
{
    "omdbApiKey": "###key###",
    "tmdbApiKey": "###key###"
}
```

### Data

This project uses [movielens development dataset](https://grouplens.org/datasets/movielens/latest/) (9/2018).
If you want to download latest version of this dataset, run command

``` bash
yarn data:prepare
```

### Database preparation

``` bash
yarn db:prepare
```

### Database population

``` bash
yarn db:populate
```
This command will take some time. Also, you need to be registered at least on OMDb API which is used to download data about movies.

### Training recommender API

If you want to use recommender abilities, you need to download and install [API](https://github.com/predictory/predictory-api) first.
With recommender API downloaded and running, run command

``` bash
yarn recommender:train
```
to call and train API (it will take some time).

## Running recommender

## Server

### Development

``` bash
yarn server:dev
```

### Production

``` bash
yarn server:start
```

## Client

### Development

``` bash
yarn client:dev
```

### Production

``` bash
yarn client:build
yarn client:start
```
