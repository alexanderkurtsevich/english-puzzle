import CONSTANTS from './constants';
import Tips from './tips';
import './style/game.css';
import GameArea from './GameArea';
import Results from './results';
import ChangeDifficult from './ChangeDifficult';
import GameMenu from './GameMenu';
import PICTURES from './pictures';
import StartScreen from './StartScreen';

export default class Game {
  constructor() {
    this.tips = new Tips();
    this.gameArea = new GameArea();
    this.results = new Results();
    this.changeDifficult = new ChangeDifficult();
    this.gameMenu = new GameMenu();
    this.startScreen = new StartScreen();

    this.settings = {
      currentSublevel: 0,
      currentLevel: 0,
      currentGroup: 0,
    };

    this.resultsArray = [];
    this.stats = {};

    this.changeDifficultEvent = this.changeDifficultEvent.bind(this);
    this.continueButtonEvent = this.continueButtonEvent.bind(this);
    this.resultsButtonClickHandler = this.resultsButtonClickHandler.bind(this);
  }

  init() {
    document.body.append(this.startScreen.create());
    document.body.append(this.gameMenu.create());
    this.gameMenu.elementsWrap.append(this.changeDifficult.create());
    this.gameMenu.elementsWrap.append(this.tips.createIconsBlock());
    document.body.append(this.tips.createMainBlock());
    document.body.append(this.gameArea.createMainBlock());
    this.gameArea.elements.buttonsContainer.append(this.results.createResultsButton());

    this.refreshLevel();

    this.changeDifficult.elements.main.addEventListener('change', this.changeDifficultEvent);
    this.gameArea.elements.buttons.continueButton.addEventListener('click', this.continueButtonEvent);
    this.results.elements.buttons.results.addEventListener('click', this.resultsButtonClickHandler);
  }

  async getWordsInfo() {
    const GROUP = this.settings.currentGroup;
    const PAGE = this.settings.currentLevel;
    const URL = `https://afternoon-falls-25894.herokuapp.com/words?page=${PAGE}&group=${GROUP}&wordsPerExampleSentenceLTE=10`;
    const RESPONSE = await fetch(URL);
    const DATA = await RESPONSE.json();
    this.levelData = DATA;
    this.refreshSettingsForCurrentLevel();
    return this.levelData;
  }

  getPicture() {
    const RANDOM_PICTURE_NUMBER = Math.floor(Math.random() * CONSTANTS.COUNT_OF_PICTURES);
    this.pictureInfo = PICTURES[RANDOM_PICTURE_NUMBER];
    return this.pictureInfo;
  }

  refreshSettingsForCurrentLevel() {
    this.wordData = this.levelData[this.settings.currentSublevel];
    this.word = this.wordData.word;
    this.sentense = this.wordData.textExample;
    this.translate = this.wordData.textExampleTranslate;
    this.sentenseAudioUrl = `https://raw.githubusercontent.com/alexanderkurtsevich/rslang-data/master/${this.wordData.audioExample}`;
  }

  async refreshLevel() {
    this.settings.currentSublevel = 0;
    this.resultsArray = [];
    await this.getWordsInfo();

    this.results.elements.buttons.results.classList.add('results__button_hidden');
    this.gameArea.elements.pictureInfo.classList.remove('game-area__picture-info_visible');
    this.gameArea.clearGameArea();
    this.getPicture();
    this.gameArea.setPicture(this.pictureInfo);
    this.results.setPicture(this.pictureInfo);
    this.refreshComponents();
  }

  refreshComponents() {
    this.gameArea.setSentense(this.sentense);
    this.gameArea.createWordsElements();
    this.gameArea.createDropFields();
    this.tips.setTranslate(this.translate);
    this.tips.setSentenseAudio(this.sentenseAudioUrl);
    this.tips.autoPlayAudio();
    this.gameArea.elements.buttons.checkButton.classList.add('game-area__button_hidden');
    this.gameArea.elements.buttons.idkButton.classList.remove('game-area__button_hidden');
    this.gameArea.elements.buttons.continueButton.classList.add('game-area__button_hidden');
  }

  sentenseToResultsArray() {
    const SENTENSE_RESULT = {
      level: this.settings.currentLevel + 1,
      sublevel: this.settings.currentSublevel + 1,
      word: this.word,
      sentense: this.sentense,
      sentenseAudioUrl: this.sentenseAudioUrl,
      isCorrect: this.gameArea.isCorrectSentense,
    };
    this.resultsArray.push(SENTENSE_RESULT);
  }

  changeDifficultEvent() {
    this.settings.currentGroup = this.changeDifficult.elements.groupChange.value - 1;
    this.settings.currentLevel = this.changeDifficult.elements.levelChange.value - 1;
    this.refreshLevel();
  }

  continueButtonEvent() {
    if (this.settings.currentSublevel < 9) {
      this.gameArea.completeRow();
      this.settings.currentSublevel += 1;
      this.gameArea.gameRowNumber += 1;
      this.sentenseToResultsArray();
      this.refreshSettingsForCurrentLevel();
      this.refreshComponents();
    } else if (this.settings.currentSublevel === 9) {
      this.gameArea.completeRow();
      this.settings.currentSublevel += 1;
      this.gameArea.showPicture();
      this.sentenseToResultsArray();
      this.results.setResults(this.resultsArray);
      this.results.elements.buttons.results.classList.remove('results__button_hidden');
    } else {
      if (this.results.isShown) {
        this.gameArea.elements.buttonsContainer
          .prepend(this.gameArea.elements.buttons.continueButton);
        this.results.hideResults();
      }
      this.settings.currentLevel += 1;
      this.refreshLevel();
      this.results.elements.buttons.results.classList.add('results__button_hidden');
      this.gameArea.elements.buttons.continueButton.classList.add('game-area__button_hidden');
      this.gameArea.elements.pictureInfo.classList.remove('game-area__picture-info_visible');
    }
  }

  resultsButtonClickHandler() {
    this.results.showResults();
    this.results.elements.buttonsContainer.prepend(this.gameArea.elements.buttons.continueButton);
  }
}
