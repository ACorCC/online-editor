import Editor from '@/editor'
import { EditorView } from 'prosemirror-view'
import { MenuBar, MenuItem } from '@/components/MenuBar'
import { CatalogBar, CatalogItem } from '@/components/CatalogBar'
import { CountBar } from '@/components/CountBar'

declare global {
  interface Window {
    editor: Editor
    view: EditorView
  }
  
  interface HTMLElementTagNameMap {
    'menu-bar': MenuBar
    'menu-item': MenuItem
    'catalog-bar': CatalogBar
    'catalog-item': CatalogItem
    'count-bar': CountBar
  }
}

export {}