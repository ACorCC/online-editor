import { PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { CatalogBar, CatalogItem } from '@/components/CatalogBar'

export default class CatalogBarView implements PluginView {
  editorView: EditorView
  dom: CatalogBar
  itemDoms: CatalogItem[]
  headingInfo: {id: string, text: string, level: number}[]
  viewDomRect: {left: number, top: number} = {left: 0, top: 0}

  constructor(editorView: EditorView) {
    this.editorView = editorView;
    this.dom = document.createElement('catalog-bar')
    this.headingInfo = this.createHeadingInfo()
    this.itemDoms = this.createItemDoms()
    this.dom.append(...this.itemDoms)
    this.bindEvents()

    editorView.dom.parentNode?.insertBefore(this.dom, editorView.dom.parentNode.firstChild)
  }

  get topCoords() {
    const pmDom = document.querySelector('.ProseMirror')
    if (pmDom) {
      const pmRect = pmDom.getBoundingClientRect()
      this.viewDomRect = {
        left: pmRect.left + parseInt(window.getComputedStyle(pmDom).paddingLeft) + Math.ceil(Number(getComputedStyle(pmDom).borderLeft.split('px')[0])),
        top: pmRect.top + 10
      }
    }
    return this.viewDomRect
  }

  update() {
    const newHeadingInfo = this.createHeadingInfo()
    // TODO: DiffUpdate
    if (this.hasChanged(newHeadingInfo)) {
      this.headingInfo = newHeadingInfo
      this.itemDoms.forEach(dom => dom.remove())
      this.itemDoms = this.createItemDoms()
      this.dom.append(...this.itemDoms)
    }
    this.activateItem()
  }

  destroy() {
    // 销毁插件视图
    this.dom.remove()
    window.removeEventListener('clickCatalog', this.scrollToHeading)
    this.editorView.dom.removeEventListener('scroll', this.handleScroll.bind(this))
  }

  bindEvents() {
    window.addEventListener('clickCatalog', this.scrollToHeading)
    this.editorView.dom.addEventListener('scroll', this.handleScroll.bind(this))
  }

  createHeadingInfo() {
    const headingInfo: typeof this.headingInfo = []
    this.editorView.state.doc.descendants((node) => {
      if (node.type.name === 'heading') {
        if (node.attrs.id && node.textContent.length > 0) {
          headingInfo.push({
            id: node.attrs.id,
            text: node.textContent,
            level: node.attrs.level
          })
        }
        return false
      }
      return true
    })
    return headingInfo
  }

  createItemDoms() {
    const itemDoms: CatalogItem[] = []
    this.headingInfo.forEach(item => {
      const dom = document.createElement('catalog-item')
      dom.headingId = item.id
      dom.text = item.text
      dom.level = item.level
      itemDoms.push(dom)
    })
    return itemDoms
  }

  hasChanged(newHeadingInfo: typeof this.headingInfo): boolean {
    if(newHeadingInfo.length !== this.headingInfo.length) {
      return true
    }
    for(let i = 0; i < this.headingInfo.length; i++) {
      const {id, text} = this.headingInfo[i]
      const { id: newId, text: newText} = newHeadingInfo[i]
      if (id !== newId || text !== newText) {
        return true
      }
    }
    return false
  }

  scrollToHeading(event: any) {
    const container = document.querySelector('.ProseMirror') as HTMLElement
    const heading = document.getElementById(event.detail.id)
    if (!container || !heading) {
      return
    }
    container.scrollTop = heading.offsetTop - container.offsetTop - Number(getComputedStyle(heading).marginTop.split('px')[0])
  }

  activateItem() {
    const posInfo = this.editorView.posAtCoords(this.topCoords)
    if (posInfo) {
      const pos = posInfo.pos + 1
      let activeId: string | null = null
      this.editorView.state.doc.nodesBetween(0, pos, (node) => {
        if (node.type.name === 'heading') {
          activeId = node.attrs.id
          return false
        }
        return true
      })
      if (!activeId) {
        this.editorView.state.doc.nodesBetween(pos, this.editorView.state.doc.content.size, (node) => {
          if (node.type.name === 'heading') {
            activeId = activeId || node.attrs.id
            return false
          }
          return true
        })
      }
      if (activeId) {
        this.itemDoms.map(item => item.active = false)
        const activeItem = this.itemDoms.find(item => item.headingId === activeId)
        activeItem && (activeItem.active = true)
      }
    }
  }

  handleScroll() {
    this.activateItem()
  }
}

