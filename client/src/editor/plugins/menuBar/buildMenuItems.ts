import MenuItemView from './MenuItemView'
import { isMarkActive, isColorMarkActive, runMarkItem, runColorMarkItem, clearDoc, insertParagraph, insertHeading, insertLongDoc, isBlockTypeActive } from "./utils"
import { setBlockType, wrapIn } from 'prosemirror-commands';
import { MenuItemSpec } from './type';
import { NodeType, Attrs, MarkType, Schema } from "prosemirror-model"
import { undo, redo } from "prosemirror-history";
import { wrapInList } from "prosemirror-schema-list"

/// Build a menu item for changing the type of the textblock around the
/// selection to the given type. Provides `run`, `active`, and `select`
/// properties. Others must be given in `options`. `options.attrs` may
/// be an object to provide the attributes for the textblock node.
function blockTypeItem(nodeType: NodeType, options: Partial<MenuItemSpec> & {attrs?: Attrs | null, title: string}): MenuItemView {
  const command = setBlockType(nodeType, options.attrs)
  let passedOptions: MenuItemSpec = {
    run: command,
    enable(state) { return isBlockTypeActive(state, nodeType, options.attrs) || command(state) },
    active(state) { return isBlockTypeActive(state, nodeType, options.attrs) },
    ...options
  }
  return new MenuItemView(passedOptions)
}

function WrapListItem(nodeType: NodeType, options: Partial<MenuItemSpec> & {attrs?: Attrs | null, title: string}): MenuItemView {
  const command = wrapInList(nodeType, options.attrs)
  let passedOptions: MenuItemSpec = {
    run: command,
    enable(state) { return command(state) },
    ...options
  }
  return new MenuItemView(passedOptions)
}

function WrapItem(nodeType: NodeType, options: Partial<MenuItemSpec> & {attrs?: Attrs | null, title: string}): MenuItemView {
  const command = wrapIn(nodeType, options.attrs)
  let passedOptions: MenuItemSpec = {
    run: command,
    enable(state) { return command(state) },
    ...options
  }
  return new MenuItemView(passedOptions)
}

function markItem(markType: MarkType, options: Partial<MenuItemSpec> & {title: string}): MenuItemView {
  const passedOptions: MenuItemSpec = {
    run: (state, dispatch, view) => runMarkItem(state, dispatch, view, markType),
    active: (state) => isMarkActive(state, markType),
    ...options
  }
  return new MenuItemView(passedOptions)
}

function colorMarkItem(markType: MarkType, color: string): MenuItemView {
  const passedOptions: MenuItemSpec = {
    title: color,
    run: (state, dispatch, view) => runColorMarkItem(state, dispatch, view, markType, color.toLowerCase()),
    active: (state) => isColorMarkActive(state, color.toLowerCase()),
  }
  return new MenuItemView(passedOptions)
}

const buildMenuItems = (schema: Schema): MenuItemView[] => {
  // 编辑器常见功能
  const menuItems: MenuItemView[] = [
    markItem(schema.marks.bold, {title: 'Bold'}),
    markItem(schema.marks.italic, {title: 'Italic'}),
    markItem(schema.marks.code, {title: 'Code'}),
    markItem(schema.marks.strike, {title: 'Strike'}),
    colorMarkItem(schema.marks.color, 'Red'),
    colorMarkItem(schema.marks.color, 'Black'),
    blockTypeItem(schema.nodes.paragraph, {title: 'Paragraph'}),
    blockTypeItem(schema.nodes.heading, {title: 'H1', attrs: {level: 1}}),
    blockTypeItem(schema.nodes.heading, {title: 'H2', attrs: {level: 2}}),
    blockTypeItem(schema.nodes.heading, {title: 'H3', attrs: {level: 3}}),
    blockTypeItem(schema.nodes.heading, {title: 'H4', attrs: {level: 4}}),
    blockTypeItem(schema.nodes.heading, {title: 'H5', attrs: {level: 5}}),
    blockTypeItem(schema.nodes.heading, {title: 'H6', attrs: {level: 6}}),
    blockTypeItem(schema.nodes.codeBlock, {title: 'CodeBlock'}),
    WrapListItem(schema.nodes.bulletList, {title: 'BulletList'}),
    WrapListItem(schema.nodes.orderedList, {title: 'OrderedList'}),
    WrapItem(schema.nodes.blockquote, {title: 'Blockquote'}),
    new MenuItemView({
      title: 'Undo',
      run: undo
    }),
    new MenuItemView({
      title: 'Redo',
      run: redo
    }),
  ]
  // 为了开发方便的功能
  menuItems.push(
    new MenuItemView({
      title: '清空',
      run: clearDoc()
    }),
    new MenuItemView({
      title: '插入一些paragraph',
      run: insertParagraph(10)
    }),
    new MenuItemView({
      title: '插入一些heading',
      run: insertHeading(10)
    }),
    new MenuItemView({
      title: '插入较长文档',
      run: insertLongDoc()
    }),
    new MenuItemView({
      title: '插入很卡的超长文档（小霸王电脑不要点这个）',
      run: insertParagraph(10000)
    }),
  )
  return menuItems
}

export default buildMenuItems