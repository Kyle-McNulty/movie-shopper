"use strict";
import React from "react";
import {store, removeCart, addCart, quantity}  from "./shared-state.js";
import numeral from "numeral";
import Movie from "./movie.jsx";
import {Cell, Content, Layout, Drawer, Grid, Card, CardActions, Button} from 'react-mdl';

export default class extends React.Component {
    constructor(props) {
        super(props);

        //initialize our state to be the current state
        //of the Redux store
        this.state = store.getState();
    }

    componentDidMount() {
        //subscribe to the store: i.e., ask the store to call a function
        //whenever the data in the store changes. When that occurs, use 
        //this.setState() to reset our state, which will trigger a re-render
        this.unsub = store.subscribe(() => this.setState(store.getState()));
    }

    /**
     * componentWillUnmount() is called just before this component is
     * removed ("unmounted") from the page. When react-router switches
     * from this component to the users list component, this component
     * is unmounted and removed from the page. When that happens we need
     * to unsubscribe from the redux store, so that we don't try to 
     * call .setState() while the component is unmounted. 
     */
    componentWillUnmount() {
        //Use the unsubscribe function that was returned from store.subscribe()
        //which we saved as our `unsub` class property.
        this.unsub();
    }

    render() {
        var cartMovies;
        if (this.state.items) {
            var totalPrice = 0;
            this.state.items.forEach(item => { // calculates the total price from the movies in the cart
                totalPrice += item.price * item.quantity;
            })
            totalPrice = numeral(totalPrice).format('$0,0.00');
            cartMovies = this.state.items.map(cartItem =>   //go through the items in the cart and add them to the page with relevant information
            <div key = {cartItem.id}>
                <Cell col={6}>
                    <Card shadow={0} style={{width: '320px', height: '320px', margin: 'auto'}}>
                        <Movie movie={cartItem.movie}/>                   
                    </Card>
                    <CardActions border>
                        <Button colored onClick={() => store.dispatch(removeCart(cartItem.id))}>
                            Remove
                        </Button>
                    </CardActions>
                </Cell>
                <Cell col={8}>
                    Format: {cartItem.format}
                </Cell>
                <Cell col={10}> 
                    <Button raised colored onClick={() => store.dispatch(quantity(cartItem.id, "decrement"))}>
                        -
                    </Button>
                    Quantity: {cartItem.quantity}
                    <Button raised colored onClick={() => store.dispatch(quantity(cartItem.id, "increment"))}>
                        +
                    </Button>
                </Cell>
                <Cell col={4}>
                    Price: {numeral(cartItem.price).format('$0,0.00')}
                </Cell>
            </div> 
            );
        }
        //return the contents of the cart
        return (
            <div className="container">
                <h1>Cart View</h1>
                <Grid className="demo-grid-ruler">
                    {cartMovies}
                </Grid>
                <h2>Total price: {totalPrice}</h2>
            </div>
        );
    }
}