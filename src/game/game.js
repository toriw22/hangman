import React, { Component } from 'react';
import './game.css';
import { Button, Card } from '@material-ui/core';

class Game extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chosenWord: '',
            incorrectLetters: [],
            remainingChances: 10,
            remainingLetters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            possibleWords: ['dog', 'cat', 'horse'],
            isLoading: true
        }
    }

    selectWord = () => {
        const possibleNums = this.state.possibleWords.length
        let randomNum = Math.floor(Math.random() * possibleNums)
        this.setState({
            chosenWord: this.state.possibleWords[randomNum],
        }, () => this.splitRemainingLetters())
    }

    splitRemainingLetters = () => {
        let remainingLetters = this.state.remainingLetters;
        remainingLetters = remainingLetters.split('');
        this.setState({ 
            remainingLetters: remainingLetters, 
            isLoading: false 
        }, this.updateWordView());
    }

    componentDidMount = () => {
        this.selectWord()
    }

    chooseLetter = (event) => {
        const value = event.currentTarget.value;
        let remainingLetters = this.state.remainingLetters;
        let remainingChances = this.state.remainingChances;
        let incorrectLetters = this.state.incorrectLetters;
        let letterIndex = remainingLetters.indexOf(value);
        const letterIncluded = this.state.chosenWord.toUpperCase().includes(value)
        console.log('letterIncluded', letterIncluded)
        remainingLetters.splice(letterIndex, 1);
        if (letterIncluded === false) {
            incorrectLetters.push(value);            
        }
        remainingChances = remainingChances - 1;
        if (remainingChances === 0) {
            alert("You Lost!")
            window.location.reload();
        }
        this.setState({
            isLoading: true,
            remainingLetters: remainingLetters,
            incorrectLetters: incorrectLetters,
            remainingChances: remainingChances,
            chosenLetter: value
        }, () => this.updateWordView())
    }

    createAllDashWord = (word) => {
        let wordView = []
        word.map((letter) => {
            wordView.push('-')
            return wordView
        })
        this.setState({
            chosenWordView: wordView
        })
    }

    replaceDashWithLetter = (word, chosenLetter) => {
        let chosenWordView = this.state.chosenWordView
        const letterIndex = word.indexOf(chosenLetter)
        chosenWordView.splice(letterIndex, 1, chosenLetter);
        this.setState({
            chosenWordView: chosenWordView,
            isLoading: false 
        })
    }

    updateWordView = () => {
        console.log(this.state)
        let chosenLetter = this.state.chosenLetter;
        let word = this.state.chosenWord.toUpperCase();
        word = word.split('');
        if (!this.state.chosenLetter) {
            this.createAllDashWord(word)
        } else if (word.includes(chosenLetter)) {
            this.replaceDashWithLetter(word, chosenLetter)
        } else {
            this.setState({ isLoading: false })
        }
    }

    render() {
        return (
            <div className="game-container">
                <Card className="game-stats">
                    <div className="chosen-word-container">
                        Chosen Word: {this.state.chosenWordView && !this.state.isLoading && this.state.chosenWordView.map((letter, i) => {
                            return (
                                <span className="chosen-word-letters" key={'chosenWord' + i} >{letter}</span> 
                            )
                        })}
                    </div>
                    <div className="incorrect-letters-container">
                        Incorrectly Chosen Letters: {this.state.incorrectLetters.length > 0 && !this.state.isLoading && this.state.incorrectLetters.map(letter => {
                            return (
                                <span className="incorrect-letter" key={'incorrect' + letter} > {letter} </span> 
                            )
                        })}
                    </div>
                    <div className="remaining-chances-container">
                        # of Chances Remaining: {this.state.remainingChances}
                    </div>
                    <div className="remaining-letters-container">
                        Letters Remaining: 
                        {this.state.remainingLetters && !this.state.isLoading && this.state.remainingLetters.map(letter => {
                            return (
                                <Button className="letter-button" variant="outlined" color="primary" value={letter} key={letter} onClick={this.chooseLetter}>{letter}</Button> 
                            )
                        })}
                    </div>
                </Card>
            </div>
        );
    }
}

export default Game;
