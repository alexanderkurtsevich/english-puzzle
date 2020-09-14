import CONSTANTS from './constants';
import './style/change-difficult.css';

export default class ChangeDifficult {
  constructor() {
    this.elements = {
      main: null,
      groupText: null,
      levelText: null,
      groupChange: null,
      levelChange: null,
    };

    this.changeGroupHandler = this.changeGroupHandler.bind(this);
  }

  create() {
    this.elements.main = document.createElement('div');
    this.elements.main.classList.add('change-diff__main');

    this.elements.groupText = document.createElement('p');
    this.elements.groupText.classList.add('change-diff__text');
    this.elements.groupText.innerHTML = CONSTANTS.ELEMENTS_TEXT.CHANGE_GROUP;
    this.elements.main.append(this.elements.groupText);

    this.elements.groupChange = document.createElement('select');
    this.elements.groupChange.classList.add('change-diff__group');
    this.elements.main.append(this.elements.groupChange);
    this.elements.groupChange.addEventListener('change', this.changeGroupHandler);

    this.elements.levelText = document.createElement('p');
    this.elements.levelText.classList.add('change-diff__text');
    this.elements.levelText.innerHTML = CONSTANTS.ELEMENTS_TEXT.CHANGE_LEVEL;
    this.elements.main.append(this.elements.levelText);

    this.elements.levelChange = document.createElement('select');
    this.elements.levelChange.classList.add('change-diff__level');
    this.elements.main.append(this.elements.levelChange);

    for (let i = 1; i <= CONSTANTS.COUNT_OF_GROUPS; i += 1) {
      const groupNumber = document.createElement('option');
      groupNumber.innerHTML = i;
      this.elements.groupChange.append(groupNumber);
    }
    for (let i = 1; i <= CONSTANTS.COUNTS_WORDS_IN_GROUP[0]; i += 1) {
      const levelNumber = document.createElement('option');
      levelNumber.innerHTML = i;
      this.elements.levelChange.append(levelNumber);
    }

    return this.elements.main;
  }

  changeGroupHandler() {
    const LEVELS = this.elements.levelChange.querySelectorAll('option');
    LEVELS.forEach((level) => {
      level.remove();
    });
    for (let i = 1; i <= CONSTANTS.COUNTS_WORDS_IN_GROUP[this.elements.groupChange.value - 1];
      i += 1) {
      const levelNumber = document.createElement('option');
      levelNumber.innerHTML = i;
      this.elements.levelChange.append(levelNumber);
    }
  }
}
