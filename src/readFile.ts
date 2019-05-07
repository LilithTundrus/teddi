// Using ES6 strict mode (not 100% needed, but ensures that the compiled JS is in strict mode)
'use strict';

// Node dependencies
import * as fs from 'fs';

export function readFile(path: string): Buffer {

    // First, make sure the path exists
    if (!fs.existsSync(path)) {
        console.log(`\nFile ${path} does not exist.`);
        return;
    }

    // Variable to hold the contents of the file being read and used throughout the classs
    let contents: Buffer;

    // Try and read the file
    try {
        contents = fs.readFileSync(path);
        return contents;
    }
    // Else, print an error that the file cannot be opened after starting the editor
    catch (err) {
        console.log(`\nCould not read file ${path}: ${err}`);
        return;
    }
}