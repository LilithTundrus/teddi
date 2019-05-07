// Using ES6 strict mode (not 100% needed, but ensures that the compiled JS is in strict mode)
'use strict';

// NPM dependencies
import * as blessed from 'blessed';
// Local dependencies
import Editor from '../Editor';

// This file will hold methods for handling text operations within the 
// TextArea class

export default class TextEngine {

    editorInstance: Editor

    constructor(editorInstance) {
        this.editorInstance = editorInstance;
    }

    // Internal Methods

    // Get the current text that's viewable one the screen
    private getScreenText

    // External Methods

    addCharacterToLine(lineNumber, insertPosition) {

    }

    scrollDown() {
        // Get the cursor's current position on the screen
        this.editorInstance.program.getCursor((err, cursor) => {
            // If the cursor is within the screen bounds (minus the textarea borders)
            if (cursor.y < this.editorInstance.screen.height - 1) {
                // Variable to get the current offset number for the line the cursor is on,
                // including the scrolling position of the textArea
                let currentLineOffset = this.editorInstance.textArea.calculateScrollingOffset();

                // Get the line of text that the cursor is  on minus the borders of the screen
                let currentLineText = this.editorInstance.textArea.textArea.getLine(currentLineOffset);
                let currentLineLength = currentLineText.length;

                // Check if the text is larger than the screen (and therefore wrapped to the nedt line)
                if (currentLineLength > this.editorInstance.textArea.textArea.width) {
                    // Get the number to scroll the cursor down by with Math.ceil rounding up to the next integer
                    let scrollAmount = Math.ceil(currentLineLength / this.editorInstance.textArea.textArea.width);
                    this.editorInstance.program.cursorDown(scrollAmount);
                    this.editorInstance.textArea.verticalScrollOffset = this.editorInstance.textArea.verticalScrollOffset + scrollAmount;
                } else {
                    // Else, just scroll the cursor down by the default 1
                    this.editorInstance.program.cursorDown(1);
                    this.editorInstance.textArea.verticalScrollOffset++;
                }
                this.editorInstance.screen.render();
            } else if (cursor.y == this.editorInstance.screen.height - 1) {

                let currentLineOffset = this.editorInstance.textArea.calculateScrollingOffset();
                let nextLineText = this.editorInstance.textArea.textArea.getLine(currentLineOffset + 1);

                let nextLineLength = nextLineText.length;

                // Check if the text is larger than the screen (and therefore wrapped to the nedt line)
                if (nextLineLength > this.editorInstance.textArea.textArea.width) {
                    // Get the number to scroll the cursor down by with Math.ceil rounding up to the next integer
                    let scrollAmount = Math.ceil(nextLineLength / this.editorInstance.textArea.textArea.width);
                    this.editorInstance.textArea.textArea.scroll(scrollAmount);
                    this.editorInstance.textArea.verticalScrollOffset = this.editorInstance.textArea.verticalScrollOffset + scrollAmount;
                } else {
                    // Else, just scroll the cursor down by the default 1
                    this.editorInstance.textArea.textArea.scroll(1);
                    this.editorInstance.textArea.verticalScrollOffset++;
                }

                let relativeBottomHeight = this.editorInstance.screen.height - 2;
                this.editorInstance.program.cursorPos(relativeBottomHeight, cursor.x - 1);
                // Render the cursor change
                this.editorInstance.screen.render();
            }
        })
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