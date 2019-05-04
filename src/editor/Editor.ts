// Using ES6 strict mode (not 100% needed, but ensures that the compiled JS is in strict mode)
'use strict';

// NPM dependencies
import * as blessed from 'blessed';
// Node dependencies
import * as fs from 'fs';
import * as path from 'path';
// Local dependencies
import { readFile } from '../readFile';
import TextArea from './ui-components/TextArea';

// TODO: should I support a private state model?? That seems like the best idea

/* 
Okay, so the ideas I have for this are a bit different from before

I think the textarea needs to be a really large window hidden behind some borders
This should allow for moving the window left/right/up/down without needing to do
any weird text stuff

This is a huge thing to try and figure out though
*/

export default class Editor {

    // Create the blessed program object to associate with the blessed screen for the editor class
    program = blessed.program();

    // These are the cursor options for blessed. Declared as any since blessed's typings 
    // aren't correct (Most of the time these cursor options DO NOT WORK)
    private cursorOptions: any = {
        artificial: true,
        shape: 'line',
        blink: true,
        color: null
    };

    // Blessed's screen element for setting basic options about how the terminal should operate
    screen = blessed.screen({
        smartCSR: true,
        // Autopad screen elements unless no padding it explicitly required
        autoPadding: true,
        // Associate the generated program to the screen
        program: this.program,
        // Used, but often doesn't work in windows
        cursor: this.cursorOptions
    });

    // State object for keeping things somewhat managed
    private state: any;

    // Screen elements
    textArea: TextArea;

    /** Creates an instance of Editor.
     * @param {string} [filePath]
     * @memberof Editor
     */
    constructor(filePath?: string) {
        // Set up the state object
        this.state = {
            currentPath: '',
            resolvedFilePath: '',
            relativePath: filePath,
            fileName: '',
            editingState: {
                // Some state things will go here eventually
            },
            content: ''
        };

        // Without a file path, no text needs to be loaded
        if (!filePath) {
            this.startEditorBlank();
        } else {
            // Set the relative path state for the editor
            this.state.relativePath = filePath;
            // Set the current path state to the directory that the editor was started from
            this.state.currentPath = __dirname;
            // Get the FULL path to the current file and set the path to the editor's state
            let resolvedPath = path.resolve(this.state.currentPath, this.state.relativePath);
            this.state.resolvedFilePath = resolvedPath;
            // Get the file's name on its own and set the fileName editor state variable
            let fileName = path.basename(this.state.resolvedFilePath);
            this.state.fileName = fileName;
            this.startEditor();
        }
    }

    private startEditorBlank() {

    }


    private startEditor() {
        let contents = readFile(this.state.relativePath);

        let parsedContent: string;
        // Try to read the passed content buffer 
        try {
            parsedContent = contents.toString();
            this.state.content = parsedContent;
        }
        // Else, print an error that the file cannot be opened
        catch (err) {
            console.log(`\nCould not convert buffer to string: ${err}`);
            return process.exit(0);
        }

        // Set the title of the terminal window (if any title bar exists)
        this.screen.title = `Teddi - ${this.state.resolvedFilePath}`;

        // Call the initializeScreen function to finish setting up the editor
        this.initializeScreen();
    }

    private initializeScreen() {
        // Initialize all classes needed to construct the base UI
        this.textArea = new TextArea(this);

        // Append each UI element to the blessed screen
        this.screen.append(this.textArea.textArea);
        // this.screen.append(this.statusBar.statusBar);

        // Reset the cursor position before rendering the UI
        this.screen.program.getCursor((err, data) => {
            this.screen.program.cursorUp(this.screen.height);
            this.screen.program.cursorBackward(this.screen.width);
            // Put the cursor at line 1, column 1 of the editing window, including the UI
            this.screen.program.cursorForward(1);
            this.screen.program.cursorDown(2);
        });

        // Render the screen so all changes are ensured to show up
        this.screen.render();
        // Focus the textArea to start out
        this.textArea.textArea.focus();
    }

    getContent() {
        return this.state.content;
    }

    getRelativePath() {
        return this.state.relativePath
    }

    getPreferences() {

    }
}