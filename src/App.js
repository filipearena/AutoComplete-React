import React from 'react';
import { FormControl } from 'react-bootstrap';
import $ from 'jquery';
import './App.css';

class App extends React.Component {
    //constructor that sets the initial states of some variables
    constructor() {
        super();
        this.state = {
            inputText: "",
            filteredOptions: [],
            requestFinished: false,
            options: []
        };
        this.componentWillMount = this.componentWillMount.bind(this)
    }

    //lifecycle method to be called on init
    componentWillMount() {
        this.getCountrieList();
    }

    //Function called on willMount method to get the list of countries
    getCountrieList() {
        //http GET method requesting data from a server
        return $.getJSON('https://restcountries.eu/rest/v2/all')
            .then((data) => {
                this.setState({
                    requestFinished: true,
                    options: data
                });
            });
    }

    //Function responsible for generation the autocomplete options given a certain input
    generateOptions = (event) => {
        //res receives the filtered results
        let res = this.state.options.filter(function (item) {
            return item.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1
        });
        //after the options are generated, a few states must be updated
        this.setState({
            optionWasSelected: false,
            inputText: event.target.value,
            filteredOptions: res.splice(0, 8)
        });
    };

    //Function responsible for making the input value being set with the same value as the option selected
    selectOptionFromList(selectedOption) {
        this.setState({
            inputText: selectedOption,
            filteredOptions: [],
            optionWasSelected: true
        });
    }

    //Function responsible for rendering the html using JSX with a little logic behind it
    render() {
        let optionsList, loader;

        //Logic behind the value of the optionsList variable, that gathers the list of all results
        if (this.state.filteredOptions.length > 0 && this.state.inputText.length > 0) {
            optionsList = <ul
                className="options-list">
                {this.state.filteredOptions.map(item =><li onClick={this.selectOptionFromList.bind(this, item.name)}
                                                           key={item.numericCode}>{item.name}</li>)}
            </ul>
        }
        else if (!this.state.optionWasSelected && this.state.inputText.length > 0){
            optionsList = <span className="no-results">Sorry, no countries matched your search. Please try again.</span>
        }
        else {
            optionsList = undefined
        }

        //Logic behind the value of the requestFinished variable, that controls the displaying of the loading screen
        if (!this.state.requestFinished) {
            loader = <div className="overlay">
                <div id="loading"></div>
            </div>
        }
        else {
            loader = undefined
        }

        return <div>
            <h1 className="title">Countries Search (with React)</h1>

            <div>
                {loader}
                <div className="search-container">
                    <FormControl value={this.state.inputText} onChange={this.generateOptions}/>
                    {optionsList}
                </div>
            </div>
        </div>
    }
}

export default App;
