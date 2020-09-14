import './style/tips.css';
import listenIconImage from './assets/listen-icon.svg';
import showTranslateIconImage from './assets/show-translate-icon.svg';
import silencedListenIconImage from './assets/silenced-listen-icon.svg';

export default class Tips {
  constructor() {
    this.state = {
      listen: {
        isActive: false,
      },
      autoPlay: {
        isActive: false,
      },
      showTranslate: {
        isActive: false,
      },
    };

    this.elements = {
      iconsBlock: null,
      listenIcon: null,
      autoPlayIcon: null,
      showTranslateIcon: null,

      mainBlock: null,
      listenElement: null,
      showTranslateElement: null,
    };

    this.translate = '';

    this.IconsBlockClickHandler = this.IconsBlockClickHandler.bind(this);
    this.listenElementClickHandler = this.listenElementClickHandler.bind(this);
    this.playingAudioHandler = this.playingAudioHandler.bind(this);
    this.endedAudioHandler = this.endedAudioHandler.bind(this);
  }

  createIconsBlock() {
    this.elements.iconsBlock = document.createElement('div');
    this.elements.iconsBlock.classList.add('tips-icons');

    this.createListenIcon();
    this.createAutoPlayIcon();
    this.createShowTranslateIcon();

    this.elements.iconsBlock.addEventListener('click', this.IconsBlockClickHandler);

    return this.elements.iconsBlock;
  }

  createListenIcon() {
    this.elements.listenIcon = document.createElement('div');
    this.elements.listenIcon.classList.add('tips-icons__listen', 'tip-icon');
    this.elements.listenIcon.setAttribute('data-tip', 'listen');
    if (!this.state.listen.isActive) {
      this.elements.listenIcon.classList.add('tip-icon_disabled');
    }

    this.listenIconImage = new Image(20, 20);
    this.listenIconImage.src = listenIconImage;
    this.listenIconImage.classList.add('tips-icon__listen-icon-image');

    const SILENCED_LISTEN_ICON_IMAGE = new Image(20, 20);
    SILENCED_LISTEN_ICON_IMAGE.src = silencedListenIconImage;
    SILENCED_LISTEN_ICON_IMAGE.classList.add('tips-icon__listen-icon-image_silenced');

    this.elements.listenIcon.append(SILENCED_LISTEN_ICON_IMAGE);
    this.elements.listenIcon.append(this.listenIconImage);
    this.elements.iconsBlock.append(this.elements.listenIcon);
  }

  createAutoPlayIcon() {
    this.elements.autoPlayIcon = document.createElement('div');
    this.elements.autoPlayIcon.classList.add('tips-icons__auto-play', 'tip-icon');
    this.elements.autoPlayIcon.setAttribute('data-tip', 'autoPlay');
    if (!this.state.autoPlay.isActive) {
      this.elements.autoPlayIcon.classList.add('tip-icon_disabled');
    }

    const AUTOPLAY_TEXT = document.createElement('p');
    AUTOPLAY_TEXT.innerHTML = 'auto';
    const AUTOPLAY_IMAGE = new Image(12, 12);
    AUTOPLAY_IMAGE.src = listenIconImage;

    this.elements.autoPlayIcon.append(AUTOPLAY_TEXT);
    this.elements.autoPlayIcon.append(AUTOPLAY_IMAGE);
    this.elements.iconsBlock.append(this.elements.autoPlayIcon);
  }

  createShowTranslateIcon() {
    this.elements.showTranslateIcon = document.createElement('div');
    this.elements.showTranslateIcon.classList.add('tips-icons__show-sentense', 'tip-icon');
    this.elements.showTranslateIcon.setAttribute('data-tip', 'showTranslate');
    if (!this.state.showTranslate.isActive) {
      this.elements.showTranslateIcon.classList.add('tip-icon_disabled');
    }
    const SHOW_SENTENSE_ICON_IMAGE = new Image(20, 20);
    SHOW_SENTENSE_ICON_IMAGE.src = showTranslateIconImage;

    this.elements.showTranslateIcon.append(SHOW_SENTENSE_ICON_IMAGE);
    this.elements.iconsBlock.append(this.elements.showTranslateIcon);
  }

  createMainBlock() {
    this.elements.mainBlock = document.createElement('div');
    this.elements.mainBlock.classList.add('tips');

    this.createShowTranslateElement();
    this.createListenElement();

    return this.elements.mainBlock;
  }

  createListenElement() {
    this.elements.listenElement = document.createElement('div');
    this.elements.listenElement.classList.add('tips__listen');
    this.elements.listenElement.setAttribute('data-tip', 'listen');
    if (!this.state.listen.isActive) {
      this.elements.listenElement.classList.add('tip_disabled');
    }
    const LISTEN_IMAGE = new Image(25, 25);
    LISTEN_IMAGE.src = listenIconImage;
    this.elements.listenElement.append(LISTEN_IMAGE);
    this.elements.listenElement.addEventListener('click', this.listenElementClickHandler);
    this.elements.mainBlock.append(this.elements.listenElement);
  }

  createShowTranslateElement() {
    this.elements.showTranslateElement = document.createElement('p');
    this.elements.showTranslateElement.classList.add('tips__show-translate');
    this.elements.showTranslateElement.setAttribute('data-tip', 'showTranslate');
    if (!this.state.showTranslate.isActive) {
      this.elements.showTranslateElement.classList.add('tip_disabled');
    }

    this.elements.mainBlock.append(this.elements.showTranslateElement);
  }

  changeSentenseText(sentenseText) {
    this.elements.showTranslateElement.innerHTML = sentenseText;
  }

  setSentenseAudio(sentenseAudio) {
    this.sentenseAudio = sentenseAudio;
  }

  playSentenseAudio() {
    const SENTENSE_AUDIO = new Audio(this.sentenseAudio);
    SENTENSE_AUDIO.addEventListener('playing', this.playingAudioHandler);
    SENTENSE_AUDIO.addEventListener('ended', this.endedAudioHandler);
    SENTENSE_AUDIO.play();
  }

  playingAudioHandler() {
    this.listenIconImage.classList.add('tips-icon__listen-icon-image_active');
  }

  endedAudioHandler() {
    this.listenIconImage.classList.remove('tips-icon__listen-icon-image_active');
  }

  setTranslate(translate) {
    this.translate = translate;
    this.elements.showTranslateElement.innerHTML = this.translate;
  }

  IconsBlockClickHandler(event) {
    const TARGET_ICON = event.target.closest('.tip-icon');

    if (TARGET_ICON) {
      const TIP_NAME = TARGET_ICON.getAttribute('data-tip');
      const TIP_ELEMENT = this.elements.mainBlock.querySelector(`[data-tip="${TIP_NAME}"]`);
      const TIP_AUTOPLAY_ELEMENT = TARGET_ICON.classList.contains('tips-icons__auto-play');

      TARGET_ICON.classList.toggle('tip-icon_disabled');
      this.state[TIP_NAME].isActive = this.state[TIP_NAME].isActive === false;
      if (!TIP_AUTOPLAY_ELEMENT) {
        TIP_ELEMENT.classList.toggle('tip_disabled');
      }
    }
  }

  listenElementClickHandler() {
    this.playSentenseAudio();
  }

  autoPlayAudio() {
    if (this.state.autoPlay.isActive) {
      this.playSentenseAudio();
    }
  }
}
