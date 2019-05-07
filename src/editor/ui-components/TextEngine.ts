// Using ES6 strict mode (not 100% needed, but ensures that the compiled JS is in strict mode)
'use strict';

// NPM dependencies
import * as blessed from 'blessed';

// This file will hold methods for handling text operations within the 
// TextArea class

export default class TextEngine {

    textArea: blessed.Widgets.BoxElement;

    constructor(textArea) {
        this.textArea = textArea;
    }

    // Internal Methods

    // Get the current text that's viewable one the screen
    private getScreenText

    // External Methods

    addCharacterToLine(lineNumber, insertPosition) {

    }

    scrollDown() {

    }

    scrollUp() {

    }


    // *** These would be if left/right scrolling was a thing (for now it isn't) ***

    // scrollTextDown(amount: number) {

    // }

    // scrollTextUp(amount: number) {

    // }

    // scrollTextLeft(amount: number) {

    // }

    // scrollTextRight(amount: number) {

    // }

    // resetTextScrollHorizontal() {

    // }
}