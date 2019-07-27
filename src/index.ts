#!/usr/bin/env node
// The above line tells OS that this is NOT a shell script, and needs a specific interpreter

// Using ES6 strict mode (not 100% needed, but ensures that the compiled JS is in strict mode)
'use strict';

// Local dependencies
import Editor from './editor/Editor';


// Main entry point for the editor, check for an argument, 
// if no arg then launch a blank editor

if (process.argv[2]) {
    // Perform the operations to attempt to read/open a file
    const editor = new Editor(process.argv[2]);
    console.log(`\nLoading file: ${process.argv[2]}...`);
} else {
    // Launch the edtior in an empty mode and in the unsaved state
    const editor = new Editor();
    console.log('\nLoading Teddi...');
}