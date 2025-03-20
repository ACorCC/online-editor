import { html, LitElement, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import './MenuItem'

@customElement('menu-bar')
export default class MenuBar extends LitElement {
  static styles = [
    css`
      #menuBar {
        padding: 10px;
        background-color: #272727;
        border: 1px solid #fff;
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        border-radius: 10px;
        margin-bottom: 20px;
      }
    `
  ];

  constructor() {
    super()
  }

  render() {
    return html`
      <div id='menuBar'><slot></slot></div>
    `;
  }
}
