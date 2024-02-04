  import { html, LitElement, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('catalog-bar')
export default class CatalogBar extends LitElement {
  static styles = [
    css`
      #catalog-bar {
        box-sizing: border-box;
        width: 380px;
        margin-left: 20px;
        height: calc(100vh - 30px);
        padding: 10px;
        background-color: #fff;
        border: 1px solid #252525;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        gap: 5px;
        overflow-y: auto;
        overflow-x: hidden;
        position: absolute;
        left: 0;
      }
      #catalog-bar-title {
        font-size: 24px;
        font-weight: 700;
        margin: 20px 0;
        text-align: center;
      }
      #empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
        p {
          margin: 0;
          color: grey;
        }
      }
    `
  ];

  constructor() {
    super()
  }

  render() {
    return html`
      <div id='catalog-bar'>
        <div id='catalog-bar-title'>Catalog</div>
        <slot>
          <div id='empty'>
            <p>在文中使用heading，即可生成目录</p>
          </div>
        </slot>
      </div>
    `;
  }
}
