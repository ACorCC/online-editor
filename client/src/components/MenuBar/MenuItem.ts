import { html, LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

@customElement('menu-item')
export default class MenuItem extends LitElement {
  static styles = [
    css`
      #wrapper {
        padding: 6px 8px;
        background-color: #272727;
        color: #fff;
        cursor: pointer;
        border-radius: 5px;
        border: 1px solid skyblue;
        &:hover {
          background-color: #666;
        }
        &.active {
          font-weight: 700;
          color: #fff;
          background-color:#666666;
        }
        &.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        &.hidden {
          display: none;
        }
      }
    `
  ];

  @property({type: String})
  title: string = ''

  @property({type: Boolean})
  active: boolean = false

  @property({type: Boolean})
  disabled: boolean = false

  @property({type: Boolean})
  hidden: boolean = false

  constructor() {
    super()
    this.addEventListener('click', () => {
      // this.dispatchEvent(new CustomEvent('customClick'));
    })
  }

  render() {
    const classes = {
      active: this.active,
      disabled: this.disabled,
      hidden: this.hidden,
    }
    return html`
      <div id='wrapper' class=${classMap(classes)}>${this.title}</div>
    `;
  }
}
