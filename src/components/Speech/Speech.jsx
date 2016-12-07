import * as React from 'react';
import './Speech.scss';
import annyang from 'annyang';
import classNames from 'classnames';

export default class Speech extends React.Component {


    constructor() {
        super();
        this.state = {
            started: false,
            off: true
        }
    }

    componentDidMount() {
        console.trace("Speech.componentDidMount", arguments);
        var commands = {
            'hello': function() { alert('Hello world!'); },
            'navigation radio :frequency': (frequency) => { alert('Navigation Radio ' + frequency)},
            'transponder :frequency': (frequency) => { alert('Transponder ' + frequency)},
            'transponder': () => { alert('Transponder ')}
        };

        // Add our commands to annyang
        annyang.addCommands(commands);

        annyang.addCallback("start", this.didStart.bind(this));
        annyang.addCallback("soundstart", this.didSoundStart.bind(this));
        annyang.addCallback("result", this.didResult.bind(this));
        annyang.addCallback("error", this.didError.bind(this));
        annyang.addCallback("resultMatch", this.didResultMatch.bind(this));
        annyang.addCallback("resultNoMatch", this.didResultNoMatch.bind(this));

        // Start listening.
        annyang.start();
    }

    componentWillUnmount() {
        console.trace("Speech.componentWillUnmount", arguments);
        annyang.stop();
    }

    didStart() {
        this.setState({off: false, started: true, listening: false, processing: false, error: false, success: false, nomatch: false})
    }

    didSoundStart() {
        this.setState({started: true, listening: true, processing: true, error: false, success: false, nomatch: false});
    }

    didResult() {
        this.setState({listening: false, processing: true, error: false, success: false, nomatch: false});
    }

    didError() {
        this.setState({listening: false, processing: false, error: true, success: false, nomatch: false})
    }

    didResultMatch() {
        this.setState({listening: false, processing: false, error: false, sucsess: true, nomatch: false})
    }

    didResultNoMatch() {
        console.log("No match");
        this.setState({listening: false, processing: false, error: false, sucess: false, nomatch: true})
    }

    onClick() {
        let input = window.prompt("Input");
        annyang.trigger(input);
    }

    render() {
        return (
            <audio-input-indicator onClick={this.onClick.bind(this)}
                class={classNames(this.state)}
            ><icon>🎙</icon></audio-input-indicator>
        );
    }

}