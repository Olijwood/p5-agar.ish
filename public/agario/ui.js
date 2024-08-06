const makeStartButton = () => {
    // Create a container for the button
    buttonContainer = createDiv();
    buttonContainer.id('button-container');
    buttonContainer.style('position', 'absolute');
    buttonContainer.style('top', '50%');
    buttonContainer.style('left', '50%');
    buttonContainer.style('transform', 'translate(-50%, -50%)');

    // Create the start game button
    startGameButton = createButton('Start Game');
    startGameButton.id('start-game');
    startGameButton.parent(buttonContainer); // Attach button to container

    return startGameButton;
};