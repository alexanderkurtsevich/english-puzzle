import CONSTANTS from './constants';
import listenIconImage from './assets/listen-icon.svg';
import './style/results.css';

export default class Results {
  constructor() {
    this.resultsArray = [];
    this.isShown = false;

    this.elements = {
      main: null,
      heading: null,
      picture: null,
      pictureInfo: null,
      sentensesContainer: null,
      incorrectSentenses: null,
      incorrectSentensesHeading: null,
      incorrectSentensesCount: null,
      incorrectSentensesHeadingText: null,
      correctSentenses: null,
      correctSentensesHeading: null,
      correctSentensesCount: null,
      correctSentensesHeadingText: null,

      buttonsContainer: null,

      buttons: {
        toStatistics: null,
        results: null,
      },
    };
  }

  showResults() {
    this.isShown = true;

    this.elements.main = document.createElement('div');
    this.elements.main.classList.add('results__main');

    this.elements.sentensesContainer = document.createElement('div');
    this.elements.sentensesContainer.classList.add('results__sentenses-container');

    this.elements.heading = document.createElement('div');
    this.elements.heading.classList.add('results__heading');

    this.elements.picture = document.createElement('img');
    this.elements.picture.classList.add('results__picture');
    this.elements.picture.setAttribute('src', this.pictureInfo.imageSrc);

    this.elements.pictureInfo = document.createElement('p');
    this.elements.pictureInfo.classList.add('results__picture-info');
    this.elements.pictureInfo.innerHTML = this.pictureInfo.info;

    this.elements.correctSentenses = document.createElement('div');
    this.elements.correctSentenses.classList.add('results__correct-sentenses');

    this.elements.incorrectSentenses = document.createElement('div');
    this.elements.incorrectSentenses.classList.add('results__incorrect-sentenses');

    this.elements.correctSentensesHeading = document.createElement('div');
    this.elements.correctSentensesHeading.classList.add('correct-sentenses__heading', 'sentenses__heading');

    this.elements.correctSentensesCount = document.createElement('p');
    this.elements.correctSentensesCount.classList.add('correct-sentenses__count', 'sentenses__count');

    this.elements.correctSentensesHeadingText = document.createElement('p');
    this.elements.correctSentensesHeadingText.classList.add('correct-sentenses__heading-text', 'sentenses__heading-text');
    this.elements.correctSentensesHeadingText.innerHTML = CONSTANTS.ELEMENTS_TEXT.CORRECT_HEADING;

    this.elements.incorrectSentensesHeading = document.createElement('div');
    this.elements.incorrectSentensesHeading.classList.add('incorrect-sentenses__heading', 'sentenses__heading');

    this.elements.incorrectSentensesCount = document.createElement('p');
    this.elements.incorrectSentensesCount.classList.add('incorrect-sentenses__count', 'sentenses__count');

    this.elements.incorrectSentensesHeadingText = document.createElement('p');
    this.elements.incorrectSentensesHeadingText.classList.add('incorrect-sentenses__heading-text', 'sentenses__heading-text');
    this.elements.incorrectSentensesHeadingText.innerHTML = CONSTANTS.ELEMENTS_TEXT.INCORR_HEADING;

    this.elements.main.append(this.elements.heading);
    this.elements.heading.append(this.elements.picture);
    this.elements.heading.append(this.elements.pictureInfo);
    this.elements.main.append(this.elements.sentensesContainer);
    this.elements.sentensesContainer.append(this.elements.incorrectSentenses);
    this.elements.incorrectSentenses.append(this.elements.incorrectSentensesHeading);
    this.elements.incorrectSentensesHeading.append(this.elements.incorrectSentensesHeadingText);
    this.elements.incorrectSentensesHeading.append(this.elements.incorrectSentensesCount);
    this.elements.correctSentenses.append(this.elements.correctSentensesHeading);
    this.elements.correctSentensesHeading.append(this.elements.correctSentensesHeadingText);
    this.elements.correctSentensesHeading.append(this.elements.correctSentensesCount);
    this.elements.sentensesContainer.append(this.elements.correctSentenses);
    this.createSentencesInfo();
    this.createButtons();

    this.elements.sentensesContainer.addEventListener('click', Results.listenImageClickHandler);

    document.body.append(this.elements.main);
  }

  hideResults() {
    this.isShown = false;
    this.elements.main.remove();
  }

  createButtons() {
    this.elements.buttonsContainer = document.createElement('div');
    this.elements.buttonsContainer.classList.add('results__buttons-container');

    this.elements.main.append(this.elements.buttonsContainer);
  }

  createResultsButton() {
    this.elements.buttons.results = document.createElement('button');
    this.elements.buttons.results.classList.add('results__results-button', 'results__button', 'results__button_hidden');
    this.elements.buttons.results.innerHTML = CONSTANTS.BUTTONS_TEXT.RESULTS.RESULTS;

    this.elements.buttons.results.addEventListener('click', this.resultsButtonClickHandler);

    return this.elements.buttons.results;
  }

  createSentencesInfo() {
    let countOfCorrect = 0;
    let countOfIncorrect = 0;
    this.resultsArray.forEach((result) => {
      const SENTENSE_ROW = document.createElement('div');
      SENTENSE_ROW.classList.add('results__sentense-row');

      const SENTENSE_TEXT = document.createElement('p');
      SENTENSE_TEXT.classList.add('results__sentense-text');
      SENTENSE_TEXT.innerHTML = result.sentense;

      const SENTENSE_AUDIO = new Audio(result.sentenseAudioUrl);
      SENTENSE_AUDIO.classList.add('results__audio');

      const SENTENSE_AUDIO_IMAGE = new Image(15, 15);
      SENTENSE_AUDIO_IMAGE.src = listenIconImage;
      SENTENSE_AUDIO_IMAGE.classList.add('results__sentense-audio-image');

      SENTENSE_ROW.append(SENTENSE_AUDIO_IMAGE);
      SENTENSE_ROW.append(SENTENSE_AUDIO);
      SENTENSE_ROW.append(SENTENSE_TEXT);

      if (result.isCorrect) {
        this.elements.correctSentenses.append(SENTENSE_ROW);
        countOfCorrect += 1;
      } else {
        this.elements.incorrectSentenses.append(SENTENSE_ROW);
        countOfIncorrect += 1;
      }
    });
    this.elements.correctSentensesCount.innerHTML = countOfCorrect;
    this.elements.incorrectSentensesCount.innerHTML = countOfIncorrect;
  }

  static listenImageClickHandler(event) {
    const LISTEN_IMAGE = event.target.closest('.results__sentense-audio-image');

    if (LISTEN_IMAGE) {
      const SENTENSE_AUDIO = LISTEN_IMAGE.parentNode.querySelector('audio');
      SENTENSE_AUDIO.play();
    }
  }

  setResults(results) {
    this.resultsArray = results;
  }

  setPicture(picture) {
    this.pictureInfo = picture;
  }
}
