import { EditorState, PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { MenuItemSpec } from './type';
import { MenuItem } from '@/components/MenuBar';


export default class MenuItemView implements PluginView {
  private menuItem: MenuItemSpec
  private dom!: MenuItem

  constructor(menuItem: MenuItemSpec) {
    this.menuItem = menuItem;
  }

  render(view: EditorView): MenuItem {
    this.dom = document.createElement('menu-item')
    this.dom.title = this.menuItem.title
    this.dom.addEventListener('click', () => {
      this.menuItem.run(view.state, view.dispatch, view)
    })
    return this.dom
  }

  update(view: EditorView, _prevState: EditorState) {
    // 在编辑器状态更新时的处理逻辑
    // 可以在这里更新菜单项的状态
    const {select, enable, active} = this.menuItem
    // 根据当前编辑器状态更新菜单项的状态
    select && (this.dom.hidden = !select(view.state))
    enable && (this.dom.disabled = !enable(view.state))
    active && (this.dom.active = active(view.state))
  }

  destroy() {
    // 销毁插件视图
    this.dom.remove()
  }
}
