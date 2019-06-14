// Using ES6 strict mode (not 100% needed, but ensures that the compiled JS is in strict mode)
'use strict';

// NPM dependencies
import * as blessed from 'blessed';
// Local dependencies
import Editor from '../Editor';
// Used for debugging
import * as fs from 'fs';

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

    // TODO: The offset seems to be getting off by one???
    // It seems to only be when scrolling all the way back up, and for now the actual offset seems
    // fine

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

                // Check if the text is larger than the screen (and therefore wrapped to the next line)
                if (currentLineLength > this.editorInstance.textArea.textArea.width) {
                    // Get the number to scroll the cursor down by with Math.ceil rounding up to the next integer
                    let scrollAmount = Math.ceil(currentLineLength / this.editorInstance.textArea.textArea.width);
                    this.editorInstance.program.cursorDown(scrollAmount);
                    this.editorInstance.textArea.verticalScrollOffset++;
                } else {
                    // Else, just scroll the cursor down by the default 1
                    this.editorInstance.program.cursorDown(1);
                    this.editorInstance.textArea.verticalScrollOffset++;
                }
                this.editorInstance.screen.render();
            } else if (cursor.y == this.editorInstance.screen.height - 1 && this.editorInstance.textArea.textArea.getScrollPerc() !== 100) {
                let currentLineOffset = this.editorInstance.textArea.calculateScrollingOffset();
                let currentLineText = this.editorInstance.textArea.textArea.getLine(currentLineOffset);

                let currentLineLength = currentLineText.length;

                // Check if the text is larger than the screen (and therefore wrapped to the next line)
                if (currentLineLength > this.editorInstance.textArea.textArea.width) {
                    // Get the number to scroll the cursor down by with Math.ceil rounding up to the next integer
                    let scrollAmount = Math.ceil(currentLineLength / this.editorInstance.textArea.textArea.width);
                    this.editorInstance.textArea.textArea.scroll(scrollAmount);
                    this.editorInstance.textArea.verticalScrollOffset++;
                    this.editorInstance.screen.render();
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
            this.editorInstance.statusBar.update(`${this.editorInstance.textArea.verticalScrollOffset}`);
        });
    }

    scrollUp() {
        // Get the cursor's current position on the screen
        this.editorInstance.program.getCursor((err, cursor) => {
            // If the cursor is within the screen bounds (minus the textarea borders)
            if (cursor.y > 3) {
                // Variable to get the current offset number for the line the cursor is on,
                // including the scrolling position of the textArea
                let currentLineOffset = this.editorInstance.textArea.calculateScrollingOffset();

                // Get the line of text that the cursor is  on minus the borders of the screen
                let previousLineText = this.editorInstance.textArea.textArea.getLine(currentLineOffset - 1);
                let previousLineLength = previousLineText.length;

                // Check if the text is larger than the screen (and therefore wrapped to the next line)
                if (previousLineLength > this.editorInstance.textArea.textArea.width) {
                    // Get the number to scroll the cursor down by with Math.ceil rounding up to the next integer
                    let scrollAmount = Math.ceil(previousLineLength / this.editorInstance.textArea.textArea.width);
                    this.editorInstance.program.cursorUp(scrollAmount);
                    this.editorInstance.textArea.verticalScrollOffset--;
                } else {
                    // Else, just scroll the cursor down by the default 1
                    this.editorInstance.program.cursorUp(1);
                    this.editorInstance.textArea.verticalScrollOffset--;
                }
                this.editorInstance.screen.render();

            } else if (cursor.y == 3 && this.editorInstance.textArea.textArea.getScrollPerc() > 0) {
                let currentLineOffset = this.editorInstance.textArea.calculateScrollingOffset();
                let currentLineText = this.editorInstance.textArea.textArea.getLine(currentLineOffset - 1);

                let currentLineLength = currentLineText.length;

                // Check if the text is larger than the screen (and therefore wrapped to the next line)
                if (currentLineLength > this.editorInstance.textArea.textArea.width) {
                    // Get the number to scroll the cursor down by with Math.ceil rounding up to the next integer
                    let scrollAmount = Math.ceil(currentLineLength / this.editorInstance.textArea.textArea.width);
                    this.editorInstance.textArea.textArea.scroll(-scrollAmount);
                    this.editorInstance.textArea.verticalScrollOffset--;
                    this.editorInstance.screen.render();
                } else {
                    // Else, just scroll the cursor down by the default 1
                    this.editorInstance.textArea.textArea.scroll(-1);
                    this.editorInstance.textArea.verticalScrollOffset--;
                }
                this.editorInstance.program.cursorPos(2, cursor.x - 1);
                // Render the cursor change
                this.editorInstance.screen.render();
            }
        });
        this.editorInstance.statusBar.update(`${this.editorInstance.textArea.verticalScrollOffset}`);
    }

    scrollLeft() {

    }

    scrollRight() {
        this.editorInstance.program.getCursor((err, cursor) => {
            let currentLineOffset = this.editorInstance.textArea.calculateScrollingOffset();

            let currentLineText = this.editorInstance.textArea.textArea.getLine(currentLineOffset);

            // Possible conditions:
            // Cursor is at the start of the line
            // Cursor is in the middle of the line
            // Cursor is at the end of the line
            // Cursor is at the end of the screen width but NOT the current line

            if (cursor.x < this.editorInstance.textArea.textArea.width && currentLineText.length < this.editorInstance.textArea.textArea.width) {
                // Check if the cursor is at the end of the line
                if (cursor.x - 1 <= currentLineText.length) {
                    this.editorInstance.program.cursorForward();
                } else {
                    // This needs to check if the cursor is at the last line of the editor and if so, scroll down by one

                    // Adjust the vertical offset and put the cursor down by one
                    this.editorInstance.program.cursorPos(cursor.y, 1);
                    this.editorInstance.textArea.verticalScrollOffset++;
                }
            } else {

            }
            // Render the cursor change
            this.editorInstance.screen.render();
        });
    }
}