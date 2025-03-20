import { html, LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('count-bar')
export default class CountBar extends LitElement {
  static styles = [
    css`
      #count-bar {
        box-sizing: border-box;
        height: 40px;
        border: 1px solid #fff;
        border-radius: 10px;
        margin-top: 15px;
        display: flex;
        align-items: center;
        padding: 0 20px;
        
      }
    `
  ];

  @property({type: Number})
  characters: number = 0

  @property({type: Number})
  word: number = 0

  constructor() {
    super()
  }

  render() {
    return html`
      <div id='count-bar'>
        <p>字数：${this.word}&nbsp;&nbsp;字符数：${this.characters}</p>
      </div>
    `;
  }
}
