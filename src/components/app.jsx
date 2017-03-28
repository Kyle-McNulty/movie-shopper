import React from "react";

import "../css/main.css";

import {Link, IndexLink} from "react-router";

//import just the Redux store from our ./shared-state.js module
import {store} from "./shared-state.js";

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = store.getState();
    }

    componentDidMount() {
        //just like over in favorite-list.jsx, subscribe to the store
        //and update our state whenever the store's state changes
        this.unsub = store.subscribe(() => this.setState(store.getState()));
    }

    componentWillUnmount() {
        //unsubscribe from the store
        this.unsub();
}

    render() {
        return (
            <div>
                <nav>
                    <ul>
                        <li>
                            <IndexLink to="/" activeClassName="active">
                                Products
                            </IndexLink>
                        </li>
                        <li>
                            <Link to="/cart" activeClassName="active">
                                Cart ({this.state.items.length})
                            </Link>
                        </li>
                    </ul>
                </nav>
                <main>
                    {this.props.children}
                </main>
            </div>
        );
    }
}