"use strict";
import React from "react";
import * as ReactMDL from 'react-mdl';
import { IconButton, Menu, MenuItem, Drawer, Navigation, Layout, Content } from 'react-mdl';

export default class extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {}
    }

    genres(query) { // checks if the genre has been clicked on and then calls the method in the products class
        if (this.props.genreClick) {
            this.props.genreClick(query);
        }
    }

    componentDidMount() { // fetches the list of genres from the api
        fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=d1a83a2857a3716dc49c5bd433701cf4&language=en-US")
            .then(response => response.json())
            .then(data => this.setState({
                genres: data
            }));
    }

    render() { // returns the list of genres to the page
        var genres;
        if(this.state.genres){
            genres = this.state.genres.genres.map(genre =>  {
                var query = genre.id;
                return <span onClick={event => this.genres(query)} key={genre.id}>{genre.name}</span>;
            })
        }
        return (                 
            <Navigation>
                {genres}
            </Navigation>                   
        );
    }
}