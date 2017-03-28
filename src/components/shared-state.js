import {createStore} from "redux";

"use strict";
//action names
const ADD_CART_ACTION = "addcart";
const REMOVE_CART_ACTION = "removecart";
const QUANTITY = "quantity";

//default state for our redux store
//just a simple object with one property named `favorites`,
//which is set to an empty array.
const DEFAULT_STATE = {items: []};

//local storage key: this is passed to localStorage.getItem()
//and localStorage.setItem() to get/set the contents of the store.
//for more information on local storage, see 
//https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
const LS_KEY = "redux-store";

/**
 * reducer() is the reducer function for our redux store.
 * See above for a general description of reducer functions.
 * All reducers have the signature: (state, action) => state
 * @param {Object} state current state in the redux store
 * @param {Object} action action that was dispatched
 * @returns {Object} the new state
 */
function reducer(state, action) {
    //switch is like if/elseif/elseif/elseif/.../else
    //just more compact
    switch(action.type) {
        case ADD_CART_ACTION:
            //if the item already exists in the cart
            //array, just increase the quantity
            var itemEdit = state.items.find(item => item.id === action.item.id);
            if (itemEdit) {
                itemEdit.quantity += 1;
                return state;
            } 
            var newState = Object.assign({}, state);
            // update the price of the object based off of the type of formatting
            if(action.item.format == "blu-ray") {
                action.item.price = 19.95;
            } else {
                action.item.price = 14.95;
            }
            // add the action item to the items array
            newState.items = newState.items.concat(action.item);
            return newState;            
            //the above lines could be shortened to a single line like this:
            //return Object.assign({}, state, {favorites: state.favorites.concat(action.item)});
        case REMOVE_CART_ACTION:
            //if the quantity is 0, remove it entirely
            return Object.assign({}, state, {items: state.items.filter(item => item.id != action.id)});
            //return Object.assign({}, state, {items: state.items.filter(item => item.id != action.id)});
        case QUANTITY:
            var itemEdit = state.items.find(item => item.id === action.id);
            if(action.method == "increment") {
                itemEdit.quantity += 1;
            } else {
                itemEdit.quantity -= 1;
                if(itemEdit.quantity < 1) {
                    return Object.assign({}, state, {items: state.items.filter(item => item.id != action.id)});
                }
            }
            return state;
            
        default:
            //if we don't recognize the action, return the state
            //that was passed in to us; redux requires this
            return state;
    }
}

/**
 * addCart() returns a new add cart action
 * @param {Object} item the object to add to the cart
 * @param {string} string representing the format of the movie 
 * @returns {Object} an add cart action
 */
export function addCart(item, format) {
    return {
        type: ADD_CART_ACTION,
        item: {
            movie: item,
            format: format,
            id: item.id + format,
            quantity: 1
        }
    }
}

/**
 * removeFavorite() returns a new remove cart action
 * @param {number|string} id the unique id of the item to remove
 * @returns {Object} a remove cart action 
 */
export function removeCart(id) {
    return {
        type: REMOVE_CART_ACTION,
        id: id
    }
}

// returns a new quantity action
// increases or decreases based on button pressed
export function quantity(id, type) {
    return {
        type: QUANTITY,
        id: id,
        method: type
    }
}

//load any previously-saved state from local storage and
//parse it as JSON. Since local storage can only save strings
//we need to encode/decode the state as a JSON string
//if we get `undefined` from localStorage.getItem(), JSON.parse()
//will also return `undefined` (with no error).  
var savedState = JSON.parse(localStorage.getItem(LS_KEY));

//create the Redux store, passing a reference to our reducer function
//and the initial state (either the previously-saved state, or the 
//DEFAULT_STATE if nothing has been saved yet)
export var store = createStore(reducer, savedState || DEFAULT_STATE);

//subscribe to the store: i.e., as the store to call a function
//whenever the data in the store changes. Our function will save
//the new state to local storage, so that we can reload it again
//when the user refreshes the page, or comes back to it later.
store.subscribe(() => localStorage.setItem(LS_KEY, JSON.stringify(store.getState())));