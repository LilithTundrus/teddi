// Using ES6 strict mode (not 100% needed, but ensures that the compiled JS is in strict mode)
'use strict';

// NPM dependencies
import * as blessed from 'blessed';
// Local dependencies
import Editor from '../Editor';

// This file will hold methods for the Menubar actions within the Editor


export default class MenuBar {

    menuBar: blessed.Widgets.BoxElement;

    private editorInstance: Editor;


    constructor(editorInstance: Editor) {
        // Create the menu strip box
        this.menuBar = blessed.box({
            // The top should be the top of the screen
            top: 'top',
            // Always 100% of the screen width since it's a menu strip
            width: '100%',
            // Single height, since it's just a menu strip
            height: 1,
            // Allow for color tags (blessed UI mechanic)
            tags: true,
            // Pad the text for the menubar by 1 on each left/right
            padding: {
                left: 1,
                right: 1
            },
            // Style to match the DOS edit theme
            style: {
                fg: 'black',
                bg: 'light-grey',
            },
            // Formatted for the sake of clarity (red on the alt + key activator for the menu)
            content: `{red-fg}F{/red-fg}ile {red-fg}E{/red-fg}dit {red-fg}V{/red-fg}iew {red-fg}F{/red-fg}ind {red-fg}O{/red-fg}ptions`
        });
    }
}