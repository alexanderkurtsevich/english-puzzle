import CONSTANTS from './constants';
import './style/start-screen.css';

export default class StartScreen {
  constructor() {
    this.elements = {
      main: null,
      window: null,
      heading: null,
      text: null,
      button: null,
    };

    this.buttonClickHandler = this.buttonClickHandler.bind(this);
  }

  create() {
    this.elements.main = document.createElement('div');
    this.elements.main.classList.add('start-screen__main');

    this.elements.window = document.createElement('div');
    this.elements.window.classList.add('start-screen__window');

    this.elements.heading = document.createElement('h1');
    this.elements.heading.classList.add('start-screen__heading');
    this.elements.heading.innerHTML = CONSTANTS.ELEMENTS_TEXT.START_SCREEN.HEADING;

    this.elements.text = document.createElement('p');
    this.elements.text.classList.add('start-screen__text');
    this.elements.text.innerHTML = CONSTANTS.ELEMENTS_TEXT.START_SCREEN.TEXT;

    this.elements.button = document.createElement('button');
    this.elements.button.classList.add('start-screen__button');
    this.elements.button.innerHTML = CONSTANTS.ELEMENTS_TEXT.START_SCREEN.BUTTON;
    this.elements.button.addEventListener('click', this.buttonClickHandler);

    this.elements.main.append(this.elements.window);
    this.elements.window.append(this.elements.heading);
    this.elements.window.append(this.elements.text);
    this.elements.window.append(this.elements.button);

    return this.elements.main;
  }

  buttonClickHandler() {
    this.elements.main.remove();
  }
}
