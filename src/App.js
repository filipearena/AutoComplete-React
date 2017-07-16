import React from 'react';
import { FormControl } from 'react-bootstrap';
import $ from 'jquery';
import './App.css';

class App extends React.Component {
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

    componentWillMount() {
        this.getCountrieList();
    }

    getCountrieList() {
        return $.getJSON('https://restcountries.eu/rest/v2/all')
            .then((data) => {
                this.setState({
                    requestFinished: true,
                    options: data
                });
            });
    }

    generateOptions = (event) => {
        let res = this.state.options.filter(function (item) {
            return item.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1
        });
        this.setState({
            optionWasSelected: false,
            inputText: event.target.value,
            filteredOptions: res.splice(0, 8)
        });
    };

    selectOptionFromList(selectedOption) {
        this.setState({
            inputText: selectedOption,
            filteredOptions: [],
            optionWasSelected: true
        });
    }

    render() {
        let optionsList, loader;
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
