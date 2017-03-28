"use strict";
import React from "react";

import "whatwg-fetch";

import Movie from "./movie.jsx";
import SearchForm from "./search-form.jsx";
import Genres from "./genres.jsx";
import {Cell, Content, Layout, Drawer, Grid, Card, CardActions, Button} from 'react-mdl';
import {store, addCart} from './shared-state.js';

const APIKEY = "d1a83a2857a3716dc49c5bd433701cf4";
const BASE_URL = "https://api.themoviedb.org/3"
const DISCOVER_API = BASE_URL + "/discover/movie?api_key=" + APIKEY;

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {lastID: 0};
    }

    // handles the case where the user searches for a movie
    handleSearch(query, page=1) {
        fetch("https://api.themoviedb.org/3/search/movie?api_key="+APIKEY+"&language=en-US&query=" + query + "&page=" + page)
            .then(response => response.json())
            .then(data => this.setState({
                movies: data,
                query: query,
                page: page
            }));
    }

    // retrieves the appropriate info from the api when a user clicks on a genre
    handleGenre(query, page=1) {
        fetch(DISCOVER_API + "&with_genres=" + query + "&page=" + page)
            .then(response => response.json())
            .then(data => this.setState({
                movies: data, 
                query: query,
                page: page
            }));
    }

    handlePaging(next) { //next is boolean checking if they want next or previous
        var newPageNum;
        if(next) {
            newPageNum = this.state.movies.page + 1;
        } else {
            newPageNum = this.state.movies.page - 1;
        }
        if(newPageNum >= 1 && newPageNum <= this.state.movies.total_pages) {
            if(this.state.query == "") { // for the case no genre is used
                fetch(DISCOVER_API + "&page=" + newPageNum)
                    .then(response => response.json())
                    .then(data => this.setState({
                        movies: data,
                        page: newPageNum
                    }))
            } else { // in the case the user is looking at a specific genre
            fetch(DISCOVER_API + '&with_genres=' + this.state.query + '&page=' + newPageNum) 
                .then(response => response.json())
                .then(data => this.setState({
                    movies: data,
                    page: newPageNum,
                    query: this.state.query
                }))
            }
        }
    }

    componentDidMount() { // fetches the initial set of data from the api
        fetch(DISCOVER_API)
            .then(response => response.json())
            .then(data => this.setState({
                movies: data,
                page: 1,    
                query: ""
            }));
    }

    render() {
        var page;
        var movies;
        if(this.state.movies) { // if there are movies, create an array of all the movies to be rendered
            page = (<p className="page">{this.state.movies.page} of {this.state.movies.total_pages}</p>)

            movies = this.state.movies.results.map(m => 
                <Cell col={6} key={m.id}>
                    <Card shadow={0} style={{width: '320px', height: '320px', margin: 'auto'}}>
                        <Movie key={m.id} movie={m}/>
                        <CardActions border>
                            <Button colored onClick={() => store.dispatch(addCart(m, "blu-ray"))}>
                                Buy on Blu-ray
                            </Button>
                            <Button colored onClick={() => store.dispatch(addCart(m, "dvd"))}> 
                                Buy on DVD 
                            </Button>
                        </CardActions>                     
                    </Card>
                </Cell>
                );
        }
        return ( // returns the movie browsing page
            <div className="container">
                <h1>Movie Shopper</h1>
                <div style={{height: '600px', position: 'relative'}}>
                    <Layout fixedDrawer>
                        <Drawer title="Genres">
                            <Genres genreClick = {query => this.handleGenre(query)}/>
                        </Drawer>
                        <Content>
                            <SearchForm onSearch={query => this.handleSearch(query)} placeholder="search" />
                            <span>
                                <button 
                                    className="btn btn-default" 
                                    onClick={() => this.handlePaging(true)}
                                    >Next
                                </button>
                                {page}
                                <button 
                                    className="btn btn-default" 
                                    onClick={() => this.handlePaging(false)}
                                    >Previous
                                </button>
                            </span>
                            <Grid className="demo-grid-2">
                                {movies}
                            </Grid>
                        </Content>                
                    </Layout>
                </div>
            </div>
        );
    }
}
