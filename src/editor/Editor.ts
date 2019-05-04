// Using ES6 strict mode (not 100% needed, but ensures that the compiled JS is in strict mode)
'use strict';

// NPM dependencies
import * as blessed from 'blessed';
// Node dependencies
import * as fs from 'fs';
import * as path from 'path';
// Local dependencies
import { readFile } from '../readFile';

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

            }
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

    startEditorBlank() {

    }


    startEditor() {
        let contents = readFile(this.state.relativePath);

        let parsedContent: string;
        // Try to read the passed content buffer 
        try {
            parsedContent = contents.toString();
        }
        // Else, print an error that the file cannot be opened
        catch (err) {
            console.log(`\nCould not convert buffer to string: ${err}`);
            return process.exit(0);
        }

        // Set the title of the terminal window (if any title bar exists)
        this.screen.title = `Teddi - ${this.state.resolvedFilePath}`;
    }
}