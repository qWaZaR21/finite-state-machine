class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.config = config;
        this.state = this.config.initial;
        this.journalStates = [];  
        this.replacedStates = [];  
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (this.config.states[state] === undefined) {
            throw new Error("state isn't exist");
        } else { 
            this.replacedStates.pop();
            this.journalStates.push(this.state);
            this.state = state;
        }
    }
    

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if (event in this.config.states[this.state].transitions) {
            this.journalStates.push(this.state);
            this.replacedStates.pop();
            this.state = this.config.states[this.state].transitions[event];
        } else {
            throw new Error("state isn't exist");
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.state = this.config.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let result = [];
        if (event) {
            for (let state in this.config.states) { 
                if (event in this.config.states[state].transitions) {
                    result.push(state);
                }
            }
            return result;
        }
        for (let state in this.config.states) {
            result.push(state);
        }
        return result;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.journalStates.length) {
            this.replacedStates.push(this.state);
            this.state = this.journalStates.pop();
            return true;
        }
        return false;

    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.replacedStates.length) {
            this.journalStates.push(this.state);
            this.state = this.replacedStates.pop();
            return true;
        }
        return false;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.journalStates = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
