// Using ES6 strict mode (not 100% needed, but ensures that the compiled JS is in strict mode)
'use strict';

// NPM dependencies
import * as blessed from 'blessed';
// Local dependencies
import Editor from '../Editor';
import TextEngine from './TextEngine';
// Used for debugging
import * as fs from 'fs';


// This file contains one of the blessed components for constructing the UI in an effort to
// keep this project modular

// Create the textArea textbox, where the text being edited will be displayed

export default class TextArea {

    private editorInstance: Editor;

    textArea: blessed.Widgets.BoxElement;
    // Text Engine class to help with managing the text being displayed
    textEngine: TextEngine;

    // Used to store the vertical offset from the first line
    verticalScrollOffset: number = 0;

    constructor(editorInstance: Editor) {
        this.editorInstance = editorInstance;
        this.textEngine = new TextEngine(this.editorInstance);

        // Create the textArea blessed box (declared as any due to some typings being incorrect)
        this.textArea = blessed.box(<any>{
            // Parent option for the component, controls how the element interacts with others
            parent: this.editorInstance.screen,

            // Component relative position options

            // The top of this element should be the parent width plus 1
            top: 1,
            left: 0,
            right: 0,
            bottom: 0,


            // Component size options

            // Keep the width of this element to 100% of the screen (+1 for scroll bar)
            width: '100%+1',
            // Height should be the entire screen minus 1 because of the statusBar
            // (not doing this would hide part of the text entry window)
            height: '100%-1',


            // Key related options

            // Allow input of the element
            input: true,
            // Dissallow default key mappings
            keys: false,
            // Set the element to support all key inputs
            keyable: true,


            // Content control options

            // Don't capture SGR blessed escape codes, that could cause issues
            tags: false,
            // Don't shrink the text box if the window resizes
            shrink: false,
            wrap: true,
            visible: true,


            // Alignment options

            // Left align the text for this element
            align: 'left',


            // Scrolling options

            // Allow the element to be scrollable
            scrollable: true,
            // Always allow the element to be scrollable, even if the content is shorter
            // than the height of the windows
            alwaysScroll: true,
            // Scrollbar styles, using extended characters here to 
            // represent the scroll location character
            scrollbar: {
                ch: '█',
                track: {
                    bg: 'black',
                    ch: '░'
                },
            },
            // Limit the maximum content to 16,000 lines (at least initially)
            baseLimit: 16000,


            // Border options

            border: {
                type: 'line'
            },


            // Styling options

            // This style matches the DOS edit theme
            style: {
                fg: 'bold',
                bg: 'blue',
                border: {
                    fg: 'light-grey',
                },
                label: {
                    fg: 'black',
                    bg: 'light-grey'
                }
            },

            // Content/label options

            // The label is a string that sits on the top left corner of the element,
            // this is similar to a title windows
            label: this.editorInstance.getRelativePath(),

            content: this.editorInstance.getContent()
        });

        this.enableKeyListeners();
    }

    enableKeyListeners() {
        // Quit on Control-W
        // TODO: This should be aware of whether or not the editor has a file that isn't saved/etc.
        this.textArea.key(['C-w'], () => {
            return process.exit(0);
        });

        this.textArea.key('left', () => {

        });

        this.textArea.key('right', () => {
            this.textEngine.scrollRight();
        });

        this.textArea.key('up', () => {
            this.textEngine.scrollUp();
        });

        this.textArea.key('down', () => {
            this.textEngine.scrollDown();
        });

        this.textArea.key('C-s', () => {
            fs.writeFileSync('./test.txt', this.editorInstance.textArea.textArea.getLine(this.verticalScrollOffset))
        });

        this.textArea.key(['M-f'], () => {
            if (this.editorInstance.fileMenu.fileMenu.hidden) {
                this.editorInstance.fileMenu.fileMenu.show();
                this.editorInstance.fileMenu.fileMenu.focus();
            } else {
                this.editorInstance.fileMenu.fileMenu.hide();
                this.textArea.focus();
            }
            this.editorInstance.screen.render();
        });
    }

    // Basic function to get the scrolling cursor offset (used frequently for each key)
    calculateScrollingOffset() {
        return this.verticalScrollOffset;
    }
}