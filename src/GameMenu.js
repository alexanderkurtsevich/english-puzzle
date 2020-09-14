import './style/menu.css';

export default class GameMenu {
  constructor() {
    this.main = null;
    this.elementsWrap = null;
  }

  create() {
    this.main = document.createElement('header');
    this.main.classList.add('menu');

    this.elementsWrap = document.createElement('div');
    this.elementsWrap.classList.add('menu__elements-wrap');

    this.main.append(this.elementsWrap);
    return this.main;
  }
}
