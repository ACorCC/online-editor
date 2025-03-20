import { html, LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

@customElement('catalog-item')
export default class CatalogItem extends LitElement {
  static styles = [
    css`
      #wrapper {
        padding: 6px 8px;
        background-color: #272727;
        color: #fff;
        cursor: pointer;
        border-radius: 5px;
        border: 1px solid skyblue;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        
        &:hover {
          background-color:#666;
          color: #fff;
        }
        &.active {
          font-weight: 700;
          background-color: #666;
          color: #fff;
        }
        &.level-2 {
          padding-left: 28px;
        }
        &.level-3 {
          padding-left: 48px;
        }
        &.level-4 {
          padding-left: 68px;
        }
        &.level-5 {
          padding-left: 88px;
        }
        &.level-6 {
          padding-left: 108px;
        }
      }
    `
  ];

  @property({type: String})
  text: string = ''

  @property({type: Boolean})
  active: boolean = false

  @property({type: Number})
  level: number = 1

  @property({type: String})
  headingId: string = ''

  constructor() {
    super()
    this.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('clickCatalog', { detail: { id: this.headingId } }))
    })
  }

  render() {
    const classes = {
      active: this.active,
      'level-1': this.level === 1,
      'level-2': this.level === 2,
      'level-3': this.level === 3,
      'level-4': this.level === 4,
      'level-5': this.level === 5,
      'level-6': this.level === 6,
    }
    return html`
      <div id='wrapper' class=${classMap(classes)}>${this.text}</div>
    `;
  }
}
