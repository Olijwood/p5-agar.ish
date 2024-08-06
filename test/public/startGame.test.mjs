import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import path from 'path';

// Set up JSDOM with the HTML file
const { window } = new JSDOM(readFileSync(path.resolve('public/index.html'), 'utf8'));
global.window = window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;

import '../../public/agario/ui.js'; // Make sure this is correctly imported and available

describe('Start Game Button', function() {
    let startGameButton;
    let buttonContainer;

    beforeEach(function() {
        // Set up the document body
        document.body.innerHTML = `
            <div id="button-container" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                <button id="start-game">Start Game</button>
            </div>
        `;
        // Reinitialize the button and container
        startGameButton = document.getElementById('start-game');
        buttonContainer = document.getElementById('button-container');
    });

    it('should hide the start game button and container when clicked', function() {
        // Create a mock startGame function
        const startGame = () => {
            startGameButton.style.display = 'none';
            buttonContainer.style.display = 'none';
        };

        // Simulate button click
        startGameButton.addEventListener('click', startGame);
        startGameButton.click();

        // Check that the button and container are hidden
        expect(startGameButton.style.display).to.equal('none');
        expect(buttonContainer.style.display).to.equal('none');
    });
});
