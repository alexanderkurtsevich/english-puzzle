import CONSTANTS from './constants';
import './style/game-area.css';

export default class GameArea {
  constructor() {
    this.sentense = '';
    this.wordsArray = [];
    this.shuffledWordsArray = [];
    this.countOfWords = 0;

    this.isCorrectSentense = false;
    this.isAllWordsCorrect = false;

    this.gameRowNumber = 0;

    this.draggedFrom = null;
    this.draggingElement = null;

    this.elements = {
      main: null,
      rowsField: null,
      rows: [],
      blockRows: [],
      wordsTable: null,
      wordsElements: [],
      dropFields: [],
      pictureInfo: null,
      buttonsContainer: null,
      buttons: {
        checkButton: null,
        idkButton: null,
        continueButton: null,
      },
      currentGameRow: null,
    };

    this.checkButtonEvent = this.checkButtonEvent.bind(this);
    this.idkButtonEvent = this.idkButtonEvent.bind(this);
    this.rowsFieldEvent = this.rowsFieldEvent.bind(this);
    this.wordsTableEvent = this.wordsTableEvent.bind(this);
    this.dragStartEvent = this.dragStartEvent.bind(this);
    this.dragEndEvent = this.dragEndEvent.bind(this);
    this.dropEvent = this.dropEvent.bind(this);
  }

  createMainBlock() {
    this.elements.main = document.createElement('div');
    this.elements.main.classList.add('game__game-area', 'game-area');

    this.elements.rowsField = document.createElement('div');
    this.elements.rowsField.classList.add('game-area__rows-field');

    this.elements.pictureInfo = document.createElement('p');
    this.elements.pictureInfo.classList.add('game-area__picture-info');

    this.elements.wordsTable = document.createElement('div');
    this.elements.wordsTable.classList.add('game-area__words-table');

    this.elements.buttonsContainer = document.createElement('div');
    this.elements.buttonsContainer.classList.add('game-area__buttons-container');

    this.createRows();
    this.createButtons();

    this.elements.main.addEventListener('dragstart', this.dragStartEvent);
    this.elements.main.addEventListener('dragend', this.dragEndEvent);
    this.elements.main.addEventListener('dragenter', GameArea.dragEnterEvent);
    this.elements.main.addEventListener('dragleave', GameArea.dragLeaveEvent);
    this.elements.main.addEventListener('dragover', GameArea.dragOverEvent);
    this.elements.main.addEventListener('drop', this.dropEvent);
    this.elements.rowsField.addEventListener('click', this.rowsFieldEvent);
    this.elements.wordsTable.addEventListener('click', this.wordsTableEvent);
    this.elements.buttons.checkButton.addEventListener('click', this.checkButtonEvent);
    this.elements.buttons.idkButton.addEventListener('click', this.idkButtonEvent);

    this.elements.main.append(this.elements.rowsField);
    this.elements.rowsField.append(this.elements.pictureInfo);
    this.elements.main.append(this.elements.wordsTable);
    this.elements.main.append(this.elements.buttonsContainer);

    return this.elements.main;
  }

  createRows() {
    for (let i = 0; i < CONSTANTS.COUNT_OF_WORDS_IN_ONE_LEVEL; i += 1) {
      const GAME_ROW = document.createElement('div');
      GAME_ROW.classList.add('game-area__row');
      GAME_ROW.setAttribute('id', i);
      this.elements.rows.push(GAME_ROW);

      const BLOCK_ROW = document.createElement('div');
      BLOCK_ROW.classList.add('game-area__block-row');
      this.elements.blockRows.push(BLOCK_ROW);
      GAME_ROW.append(BLOCK_ROW);

      this.elements.rowsField.append(GAME_ROW);
    }
  }

  createButtons() {
    this.elements.buttons.checkButton = document.createElement('button');
    this.elements.buttons.checkButton.classList.add('game-area__check-button', 'game-area__button_hidden', 'game-area__button');
    this.elements.buttons.checkButton.innerHTML = CONSTANTS.BUTTONS_TEXT.GAME_AREA.CHECK_BUTTON;

    this.elements.buttons.idkButton = document.createElement('button');
    this.elements.buttons.idkButton.classList
      .add('game-area__idk-button', 'game-area__button');
    this.elements.buttons.idkButton.innerHTML = CONSTANTS.BUTTONS_TEXT.GAME_AREA.IDK_BUTTON;

    this.elements.buttons.continueButton = document.createElement('button');
    this.elements.buttons.continueButton.classList
      .add('game-area__continue-button', 'game-area__button', 'game-area__button_hidden');
    this.elements.buttons.continueButton.innerHTML = CONSTANTS.BUTTONS_TEXT.GAME_AREA.CONTINUE;

    this.elements.buttonsContainer.append(this.elements.buttons.idkButton);
    this.elements.buttonsContainer.append(this.elements.buttons.checkButton);
    this.elements.buttonsContainer.append(this.elements.buttons.continueButton);
  }

  createWordsElements() {
    this.elements.wordsElements = [];
    this.shuffledWordsArray.forEach((word) => {
      const WORD_ELEMENT = document.createElement('div');
      WORD_ELEMENT.classList.add('game-area__word-element');
      WORD_ELEMENT.setAttribute('draggable', 'true');
      WORD_ELEMENT.innerHTML = word;

      this.elements.wordsElements.push(WORD_ELEMENT);
      this.elements.wordsTable.append(WORD_ELEMENT);
    });
  }

  createDropFields() {
    this.elements.dropFields = [];
    this.elements.currentGameRow = document.getElementById(this.gameRowNumber);

    for (let i = 0; i < this.countOfWords; i += 1) {
      const DROP_FIELD = document.createElement('div');
      DROP_FIELD.classList.add('game-area__drop-field', 'game-area__drop-field_empty');
      this.elements.dropFields.push(DROP_FIELD);
      this.elements.currentGameRow.append(DROP_FIELD);
    }
  }

  wordsElementsToDefaultStyles() {
    this.elements.wordsElements.forEach((wordElement) => {
      wordElement.classList.remove('game-area__word-element_correct');
      wordElement.classList.remove('game-area__word-element_incorrect');
    });
  }

  setSentense(sentense) {
    this.sentense = sentense;
    this.wordsArray = this.sentense.split(' ');
    this.shuffledWordsArray = [...this.wordsArray].sort(() => Math.random() - 0.5);
    this.countOfWords = this.wordsArray.length;
  }

  rowsFieldEvent(event) {
    const WORD_ELEMENT = event.target.closest('.game-area__word-element');
    const DROP_FIELD = event.target.closest('.game-area__drop-field');

    if (WORD_ELEMENT) {
      this.elements.wordsTable.append(WORD_ELEMENT);
      DROP_FIELD.classList.add('game-area__drop-field_empty');
      DROP_FIELD.classList.remove('game-area__drop-field_hovered');
      this.showCheckButtonIfRowIsFull();
    }
  }

  wordsTableEvent(event) {
    const WORD_ELEMENT = event.target.closest('.game-area__word-element');
    const FIRST_EMPTY_DROP_FIELD = document.querySelector('.game-area__drop-field_empty');

    if (WORD_ELEMENT) {
      FIRST_EMPTY_DROP_FIELD.append(WORD_ELEMENT);
      FIRST_EMPTY_DROP_FIELD.classList.remove('game-area__drop-field_empty');
      this.showCheckButtonIfRowIsFull();
    }
  }

  dragStartEvent(event) {
    const WORD_ELEMENT = event.target.closest('.game-area__word-element');
    const DROP_FIELD = event.target.closest('.game-area__drop-field');
    const WORDS_TABLE = event.target.closest('.game-area__words-table');

    this.draggingElement = WORD_ELEMENT;
    this.draggedFrom = DROP_FIELD || WORDS_TABLE;

    setTimeout(() => {
      WORD_ELEMENT.classList.add('game-area__word-element_hidden');
    }, 0);
  }

  dragEndEvent() {
    this.draggingElement.classList.remove('game-area__word-element_hidden');
  }

  static dragEnterEvent(event) {
    const TARGET_DROP_FIELD = event.target.closest('.game-area__drop-field');
    if (TARGET_DROP_FIELD) {
      TARGET_DROP_FIELD.classList.add('game-area__drop-field_hovered');
    }
  }

  static dragLeaveEvent(event) {
    const TARGET_DROP_FIELD = event.target.closest('.game-area__drop-field');
    if (TARGET_DROP_FIELD) {
      TARGET_DROP_FIELD.classList.remove('game-area__drop-field_hovered');
    }
  }

  static dragOverEvent(event) {
    event.preventDefault();
  }

  dropEvent(event) {
    const TARGET_DROP_FIELD = event.target.closest('.game-area__drop-field');
    const IS_TARGET_DROP_FIELD_EMPTY = TARGET_DROP_FIELD
      && TARGET_DROP_FIELD.classList.contains('game-area__drop-field_empty');
    const WORDS_TABLE = event.target.closest('.game-area__words-table');

    if (TARGET_DROP_FIELD && !IS_TARGET_DROP_FIELD_EMPTY) {
      const WORD_ELEMENT_IN_TARGET_DROP_FIELD = TARGET_DROP_FIELD.firstElementChild;

      this.draggedFrom.append(WORD_ELEMENT_IN_TARGET_DROP_FIELD);
      TARGET_DROP_FIELD.append(this.draggingElement);
    } else if (TARGET_DROP_FIELD) {
      TARGET_DROP_FIELD.classList.remove('game-area__drop-field_empty');
      TARGET_DROP_FIELD.append(this.draggingElement);
      this.draggedFrom.classList.add('game-area__drop-field_empty');
    } else if (WORDS_TABLE) {
      WORDS_TABLE.append(this.draggingElement);
      this.draggedFrom.classList.add('game-area__drop-field_empty');
    }
    this.draggedFrom.classList.remove('game-area__drop-field_hovered');

    this.wordsElementsToDefaultStyles();
    this.showCheckButtonIfRowIsFull();
  }

  checkButtonEvent() {
    const WORDS_SEQUENCE = this.elements.currentGameRow.querySelectorAll('.game-area__word-element');
    let countOfCorrect = 0;

    WORDS_SEQUENCE.forEach((wordElement, index) => {
      const WORD = wordElement.innerHTML;

      if (WORD === this.wordsArray[index]) {
        wordElement.classList.add('game-area__word-element_correct');
        countOfCorrect += 1;
      } else {
        wordElement.classList.add('game-area__word-element_incorrect');
      }
    });

    if (countOfCorrect === this.countOfWords) {
      this.isCorrectSentense = true;
      this.elements.blockRows[this.gameRowNumber].classList.add('game-area__block-row_active');
      this.elements.buttons.checkButton.classList.add('game-area__button_hidden');
      this.elements.buttons.idkButton.classList.add('game-area__button_hidden');
      this.elements.buttons.continueButton.classList.remove('game-area__button_hidden');
    } else {
      this.elements.buttons.idkButton.classList.remove('game-area__button_hidden');
    }
  }

  idkButtonEvent() {
    this.isCorrectSentense = false;
    this.wordsElementsToDefaultStyles();

    this.elements.wordsElements.forEach((wordElement, index) => {
      const CORRECT_WORD = this.wordsArray[index];
      const TARGET_DROP_FIELD = this.elements.dropFields[index];

      TARGET_DROP_FIELD.append(wordElement);
      TARGET_DROP_FIELD.classList.remove('game-area__drop-field_empty');
      wordElement.classList.add('game-area__word-element_correct');
      wordElement.innerHTML = CORRECT_WORD;
    });

    this.elements.blockRows[this.gameRowNumber].classList.add('game-area__block-row_active');
    this.elements.buttons.idkButton.classList.add('game-area__button_hidden');
    this.elements.buttons.checkButton.classList.add('game-area__button_hidden');
    this.elements.buttons.continueButton.classList.remove('game-area__button_hidden');
  }

  showCheckButtonIfRowIsFull() {
    const IS_ROW_FULL = !this.elements.currentGameRow.querySelector('.game-area__drop-field_empty');

    if (IS_ROW_FULL) {
      this.elements.buttons.checkButton.classList.remove('game-area__button_hidden');
      this.elements.buttons.idkButton.classList.add('game-area__button_hidden');
    } else {
      this.elements.buttons.checkButton.classList.add('game-area__button_hidden');
      this.elements.buttons.idkButton.classList.remove('game-area__button_hidden');
    }
  }

  clearGameArea() {
    const ALL_DROP_FIELDS = this.elements.main.querySelectorAll('.game-area__drop-field');
    const ALL_WORDS_ELEMENTS = this.elements.main.querySelectorAll('.game-area__word-element');

    ALL_DROP_FIELDS.forEach((dropField) => {
      dropField.remove();
    });

    ALL_WORDS_ELEMENTS.forEach((wordElement) => {
      wordElement.remove();
    });

    this.elements.rows.forEach((row) => {
      row.classList.remove('game-area__row_complete');
    });
    this.elements.blockRows.forEach((blockRow) => {
      blockRow.classList.remove('game-area__block-row_active');
    });

    this.gameRowNumber = 0;
  }

  setPicture(picture) {
    this.elements.rowsField.style.backgroundImage = `url("${picture.imageSrc}")`;
    this.elements.pictureInfo.innerHTML = picture.info;
  }

  completeRow() {
    this.elements.currentGameRow.classList.add('game-area__row_complete');
    this.elements.dropFields.forEach((dropField) => {
      dropField.classList.add('game-area__drop-field_complete');
    });
    this.elements.wordsElements.forEach((wordElement) => {
      wordElement.classList.add('game-area__word-element_complete');
    });
  }

  showPicture() {
    const ALL_WORDS_ELEMENTS = this.elements.main.querySelectorAll('.game-area__word-element');

    ALL_WORDS_ELEMENTS.forEach((wordElement) => {
      wordElement.classList.add('game-area__word-element_hide');
    });

    this.elements.pictureInfo.classList.add('game-area__picture-info_visible');
  }
}
