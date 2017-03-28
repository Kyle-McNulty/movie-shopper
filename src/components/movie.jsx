"use strict";
import React from "react";
import {Card, CardTitle, CardText, CardActions, Button, Grid, Cell} from "react-mdl";

export default class extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        var specific = this.props.movie.backdrop_path;
        var url;
        if(specific) {
            url = "http://image.tmdb.org/t/p/w300" + specific;
        } else {
            url = "http://www.publicdomainpictures.net/pictures/40000/velka/question-mark.jpg"; //sets url to a question mark if poster cannot be found
        }
        var text = this.props.movie.overview;
       if(this.props.movie.overview) { // if the movie summary is too long, shorten it to the first 50 characters
            if(text.length > 50) {
                text = text.substring(0,50) + "...";
            }
       }
        return (
                <div className="movie">
                    <CardTitle expand style={{color: '#fff', background: 'url('+ url + ') center / cover '}}>{this.props.movie.title}</CardTitle>
                    <CardText className="cardText">
                        {text}
                    </CardText>
                </div>
                
        );
    }
}