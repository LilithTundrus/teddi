// Using ES6 strict mode (not 100% needed, but ensures that the compiled JS is in strict mode)
'use strict';

// NPM dependencies
import * as blessed from 'blessed';
// Local dependencies
import Editor from '../Editor';

// This file will hold methods for the FILE menubar item

export default class FileMenu {

    private editorInstance: Editor;

    fileMenu: blessed.Widgets.BoxElement;

    menuList: any;

    constructor(editorInstance: Editor) {

        this.editorInstance = editorInstance;
        // Create the fileMenuBox
        this.fileMenu = blessed.box({
            parent: this.editorInstance.screen,
            // Top of this element should be 1 below the top of the screen
            top: 1,
            // Left start of this element should be 1 to the left of the screen for padding/looks
            left: 1,
            // Fixed width because the box's contents will be static
            width: 15,
            // Fixed height because the box's contents will be static
            height: 7,
            style: {
                fg: 'black',
                bg: 'lightgrey',
                border: {
                    fg: 'black',
                    bg: 'lightgrey'
                }
            },
            shadow: true
        });


        this.menuList = blessed.list(<any>{
            // Borders to match how DOS Edit has borders for its menus
            border: 'line',
            padding: 'none',
            // The parent of the titlebar should be the generated fileMenu
            parent: this.fileMenu,
            // Width and height should be the same as the parent
            width: this.fileMenu.width,
            height: this.fileMenu.height,
            // Use the default keys for the belssed fileMenu
            keys: true,
            style: {
                border: {
                    fg: 'black',
                    bg: 'lightgrey'
                },
                // Style of the currently selected list item
                selected: {
                    fg: 'lightgrey',
                    bg: 'black'
                },
                // Style of any other listItem
                item: {
                    fg: 'black',
                    bg: 'lightgrey'
                }
            }
        });

        // Set the items for the menu list
        this.menuList.setItems(['New', 'Open...', 'Save', 'Save As...', 'Exit']);

        // Append each UI subcomponent to the fileMenu box
        this.fileMenu.append(this.menuList);

        this.fileMenu.on('focus', () => {
            this.editorInstance.screen.render();
            // Focus the first element that makes the most sense (the file select)
            this.menuList.focus();
        });

        this.menuList.key(['escape'], () => {
            // This is temporary, it needs to focus the last focused element before the menu
            this.editorInstance.textArea.textArea.focus();
        });

        this.menuList.on('select', (item) => {
            // The text parse is item.content

            // TODO: This needs to make sure the file is properly saved before exiting
            if (item.content == 'Exit') return process.exit();
        });
    }

    // This function is called on the 'New' menu option
    newFile() {

    }

    // This function is called on the 'Open' menu option
    openFile() {

    }

        // This function is called on the 'Save' menu option
    saveFile() {

    }
}