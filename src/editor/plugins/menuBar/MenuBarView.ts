import { EditorState, PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { MenuBar, MenuItem } from '@/components/MenuBar';
import MenuItemView from './MenuItemView'

export default class MenuBarView implements PluginView {
  editorView: EditorView
  menuItems: MenuItemView[]
  dom: MenuBar
  itemDoms: MenuItem[]

  constructor(editorView: EditorView, menuItems: MenuItemView[]) {
    this.editorView = editorView;
    this.menuItems = menuItems;
    this.dom = document.createElement('menu-bar')
    this.itemDoms = []

    this.menuItems.forEach(item => {
      const itemDom = item.render(this.editorView)
      this.itemDoms.push(itemDom)
      this.dom.append(itemDom)
    })

    // 将菜单栏添加到编辑器的根 DOM 元素中
    editorView.dom.parentNode?.insertBefore(this.dom, editorView.dom)
  }

  update(view: EditorView, prevState: EditorState) {
    // 在编辑器状态更新时的处理逻辑
    // 可以在这里更新菜单项的状态
    this.menuItems.forEach(item => {
      item.update(view, prevState)
    })
  }

  destroy() {
    // 销毁插件视图
    this.dom.remove()
  }
}