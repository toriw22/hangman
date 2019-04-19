import React, { Component } from 'react';
import './game.css';
import { Button, Card } from '@material-ui/core';

class Game extends Component {

    // basic constructor to set state of letter pool and possible words
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
    
    // when the component mounts, a function is triggered to select a word
    componentDidMount = () => {
        this.selectWord()
    }

    // selects a random word from the array of possible words
    selectWord = () => {
        const possibleNums = this.state.possibleWords.length        
        // triggers a random number to be generated from 0 - # of possible words
        let randomNum = Math.floor(Math.random() * possibleNums)
        // sets the chosen word to equal the word indexed in the array of possible words
        this.setState({
            chosenWord: this.state.possibleWords[randomNum].toUpperCase().split(''),
        // triggers function that converts the alphabet string into an array
        }, () => this.splitRemainingLetters())
    }

    // splits the remainingLetters string into an array
    // 'cause ain't nobody got time for that
    splitRemainingLetters = () => {
        let remainingLetters = this.state.remainingLetters;
        remainingLetters = remainingLetters.split('');
        this.setState({ 
            remainingLetters: remainingLetters, 
            isLoading: false 
        // triggers function that replaces letters with dashes
        }, this.createAllDashWord());
    }

    // replaces the chosen word's letters with dashes 
    createAllDashWord = () => {
        const word = this.state.chosenWord;
        let wordView = []
        // for each item that exists in the chosenWord array, 
        //      a '-' is pushed into the wordView array
        word.map(() => {
            wordView.push('-')
            return wordView
        })
        this.setState({
            chosenWordView: wordView
        })
    }

    chooseLetter = (event) => {
        const value = event.currentTarget.value;
        this.setState({
            isLoading: true,
            remainingChances: this.updateRemainingChances(),
            chosenLetter: value
        }, () => this.updateWordView())
    }

    updateRemainingChances = () => {
        let remainingChances = this.state.remainingChances;
        remainingChances = remainingChances - 1;
        if (remainingChances === 0) {
            this.restartGame('You Lost!')
        }
        return remainingChances;
    }

    updateWordView = () => {
        let chosenLetter = this.state.chosenLetter;
        let word = this.state.chosenWord;
        if (word.includes(chosenLetter)) {
            this.replaceDashWithLetter(word, chosenLetter)
        } else {
            this.updateIncorrectLetters(chosenLetter)
        }
    }

    replaceDashWithLetter = (word, chosenLetter) => {
        let chosenWordView = this.state.chosenWordView;
        const letterIndex = word.indexOf(chosenLetter);
        chosenWordView.splice(letterIndex, 1, chosenLetter);
        this.setState({
            chosenWordView: chosenWordView
        }, () => {
            if (!chosenWordView.includes('-')) {
                this.restartGame('Congratulations! You Won! The word is ' + this.state.chosenWord.join(''))
            } else {
                this.updateRemainingLetters()
            }
        })
    }

    updateIncorrectLetters = (chosenLetter) => {
        let incorrectLetters = this.state.incorrectLetters;
        incorrectLetters.push(chosenLetter);         
        this.setState({
            incorrectLetters: incorrectLetters
        }, () => this.updateRemainingLetters())
    }
    
    updateRemainingLetters = () => {
        let remainingLetters = this.state.remainingLetters;
        let chosenLetter = this.state.chosenLetter;
        let letterIndex = remainingLetters.indexOf(chosenLetter);
        remainingLetters.splice(letterIndex, 1);
        this.setState({
            remainingLetters: remainingLetters,
            isLoading: false
        })
    }

    restartGame = (message) => {
        alert(message)
        window.location.reload();
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
