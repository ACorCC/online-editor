import { EditorView } from "prosemirror-view"
import { EditorState, Transaction } from "prosemirror-state"

export interface MenuItemSpec {
  /// The function to execute when the menu item is activated.
  run: (state: EditorState, dispatch: (tr: Transaction) => void, view: EditorView) => void

  /// Optional function that is used to determine whether the item is
  /// appropriate at the moment. Deselected items will be hidden.
  select?: (state: EditorState) => boolean

  /// Function that is used to determine if the item is enabled. If
  /// given and returning false, the item will be given a disabled
  /// styling.
  enable?: (state: EditorState) => boolean

  /// A predicate function to determine whether the item is 'active' (for
  /// example, the item for toggling the strong mark might be active then
  /// the cursor is in strong text).
  active?: (state: EditorState) => boolean

  /// A function that renders the item.
  render?: (view: EditorView) => HTMLElement

  /// Defines DOM title text for the item.
  title: string

  /// Optionally adds a CSS class to the item's DOM representation.
  class?: string

  /// Optionally adds a string of inline CSS to the item's DOM
  /// representation.
  css?: string
}