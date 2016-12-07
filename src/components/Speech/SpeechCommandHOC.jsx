import * as React from 'react';
import annyang from 'annyang';


const SpeechCommandRegistry = {
    commands: {},

    didStart: function() {
        console.trace("SpeechCommandRegistry.didStart", arguments);
        // this.setState({off: false, started: true, listening: false, processing: false, error: false, success: false, nomatch: false})
    },

    didSoundStart: function() {
        console.trace("SpeechCommandRegistry.didSoundStart", arguments);
        // this.setState({started: true, listening: true, processing: true, error: false, success: false, nomatch: false});
    },

    didResult: function() {
        console.trace("SpeechCommandRegistry.didResult", arguments);
        // this.setState({listening: false, processing: true, error: false, success: false, nomatch: false});
    },

    didError: function() {
        console.trace("SpeechCommandRegistry.didError", arguments);
        // this.setState({listening: false, processing: false, error: true, success: false, nomatch: false})
    },

    didResultMatch: function(userSaid, commandText, phrases) {
        console.trace("SpeechCommandRegistry.didResultMatch", arguments);
        this.commands[commandText].call(null, userSaid, commandText, phrases);
    },

    didResultNoMatch: function() {
        console.trace("SpeechCommandRegistry.didResultNoMatch", arguments);
        // console.log("No match");
        // this.setState({listening: false, processing: false, error: false, sucess: false, nomatch: true})
    },

    registerSpeechCommand: function(commandStr, component) {
        window.clearTimeout(this.registerDelay);
        this.commands[commandStr] = component.onSpeechCommand.bind(component);
        this.registerDelay = window.setTimeout(() => {
            // Add our commands to annyang
            console.log("Registrerer kommandoer", this.commands);
            annyang.addCommands(this.commands);
        }, 200);
    },

    unregisterSpeechCommand: function(commandStr) {
        window.clearTimeout(this.unregisterDelay);
        delete this.commands[commandStr];
        this.toBeRemoved = this.toBeRemoved || [];
        this.toBeRemoved.push(commandStr);
        console.log("Avregistrerer kommando", commandStr);
        this.unregisterDelay = window.setTimeout(() => {
            console.log("Avregistrerer kommandoer");
            annyang.removeCommands(this.toBeRemoved);
            this.toBeRemoved = [];
        }, 200);
    },

    init: function() {
        annyang.addCallback("start", this.didStart.bind(this));
        annyang.addCallback("soundstart", this.didSoundStart.bind(this));
        annyang.addCallback("result", this.didResult.bind(this));
        annyang.addCallback("error", this.didError.bind(this));
        annyang.addCallback("resultMatch", this.didResultMatch.bind(this));
        annyang.addCallback("resultNoMatch", this.didResultNoMatch.bind(this));

// Start listening.
        annyang.start();

    }
};

SpeechCommandRegistry.init();


export default function SpeechCommandReceiver(ComponentClass, commandStr) {

    ComponentClass.contextTypes = Object.assign({}, ComponentClass.contextTypes, {registerSpeechCommand: React.PropTypes.func});

    let speechCommandHOCClass = class SpeechCommandHOC extends React.Component {

        constructor() {
            super();
            this.state = {}
        }

        /* Mounting */
        componentWillMount() {
        }

        componentDidMount() {
            let commandStr = commandStr || this.wrapped.getSpeechCommandStr();
            SpeechCommandRegistry.registerSpeechCommand(commandStr, this.wrapped);
        }

        componentWillUnmount() {
            let commandStr = commandStr || this.wrapped.getSpeechCommandStr();
            SpeechCommandRegistry.unregisterSpeechCommand(commandStr, this.wrapped);
        }

        /* Updating */
        componentWillReceiveProps(nextProps) {
        }

        componentWillUpdate(nextProps, nextState) {
        }

        componentDidUpdate(prevProps, prevState) {
        }

        render() {
            return (
                <ComponentClass {...this.props} ref={wrapped => this.wrapped = wrapped}>
                    {this.props.children}
                </ComponentClass>
            );
        }

    };
    return speechCommandHOCClass
};