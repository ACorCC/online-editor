import { MarkType, NodeType, Schema } from "prosemirror-model";
import { EditorState, TextSelection, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view"

function getMarkType(markType: MarkType | string, schema: Schema) {
  return typeof markType === 'string' ? schema.marks[markType] : markType;
}

// 判断当前 selection 是否是 文本选区，prosemirror 中除了文本选区，还有 Node 选区 NodeSelection，即当前选中的是某个 Node 节点而不是文本
function isTextSelection(selection: unknown): selection is TextSelection {
  return selection instanceof TextSelection;
}

/**
 * 选区内所有的内容都被设置了 mark，就是 active
 * 
 * @param state 
 * @param markType 
 */
export function isMarkActive(state: EditorState, markType: MarkType | string) {
  const { schema, selection, tr } = state;

  // 暂时规定：如果不是文本选区，就不能设置 mark
  if (!isTextSelection(selection)) {
    return false;
  }

  const { $from, $to, empty } = selection;
  
  const realMarkType = getMarkType(markType, schema);

  let isActive = true;

  // 增加 光标情况下，判断当前是否处于 markType 下
  if (empty) {
    if (!realMarkType.isInSet(tr.storedMarks || $from.marks())) {
      isActive = false;
    }
  } else {
    tr.doc.nodesBetween($from.pos, $to.pos, (node) => {
      if (!isActive) return false;
      // 这里之所以是 node.isInline，mark 都是设置在行内内容上的
      if (node.isInline) {
        // markType.isInset(marks[]) 可以判断当前 marks 中是否包含当前 markType 类型的 mark
        const mark = realMarkType.isInSet(node.marks)
        if (!mark) {
          // 如果 有任意一个 不包含，则设置 active 为 false，即当前可以设置 mark
          isActive = false;
        }
      }
    })
  }

  return isActive;
}

export function runMarkItem(state: EditorState, dispatch: (tr: Transaction) => void, view: EditorView, markType: MarkType) {
  const { selection, schema, tr } = state
  const { $from, $to, empty } = selection
  const mark = schema.mark(markType)
  // 光标状态，如果 storedMarks 里没有 当前 mark，就把当前 mark 加进去
  if (empty) {
    if (markType.isInSet(tr.storedMarks || $from.marks())) {
      tr.removeStoredMark(mark)
    } else {
      tr.addStoredMark(mark)
    }
  } else {
    const isActive = isMarkActive(state, markType)
    isActive ? tr.removeMark($from.pos, $to.pos, mark) : tr.addMark($from.pos, $to.pos, mark)
  }
  dispatch(tr)
  view.focus()
}

export function runColorMarkItem(state: EditorState, dispatch: (tr: Transaction) => void, view: EditorView, markType: MarkType, color: string) {
  const { selection, tr } = state
  const { $from, $to, empty } = selection
  const mark = markType.create({ color })
  // 光标状态，如果 storedMarks 里没有 当前 mark，就把当前 mark 加进去
  if (empty) {
    if (markType.isInSet(tr.storedMarks || $from.marks())) {
      tr.removeStoredMark(mark)
    } else {
      tr.addStoredMark(mark)
    }
  } else {
    const isActive = isColorMarkActive(state, color)
    isActive ? tr.removeMark($from.pos, $to.pos, mark) : tr.addMark($from.pos, $to.pos, mark)
  }
  dispatch(tr)
  view.focus()
}

export function isColorMarkActive(state: EditorState, color: string): boolean {
  const selection = state.selection;
  const tr = state.tr
  const { from, to, empty, $from } = selection;
  let isAllColor = true
  if (empty) {
    const colorMark = $from.marks().find(mark => mark.type.name === "color") || tr.storedMarks?.find(mark => mark.type.name === "color")
    if (!colorMark) {
      isAllColor = color === 'black' ? true : false
    } else {
      isAllColor = colorMark.attrs.color === color ? true : false
    }
    return isAllColor
  }
  for (let pos = from + 1; pos <= to; pos++) {
    if (!isAllColor) {
      return false
    }
    const resolvePos = state.doc.resolve(pos)
    const colorMark = resolvePos.marks().find(mark => mark.type.name === "color")
    if (!colorMark) {
      isAllColor = color === 'black' ? true : false
    } else {
      isAllColor = colorMark.attrs.color === color ? true : false
    }
  }
  return isAllColor
}

export function clearDoc() {
  return function (state: EditorState, dispatch: (tr: Transaction) => void, view: EditorView) {
    const { tr, doc, schema } = state
    const titleNode = doc.nodeAt(0)
    if (!titleNode) {
      return
    }
    const titleNodeSize = titleNode.nodeSize
    tr.replaceWith(titleNodeSize, state.doc.content.size, schema.nodes.paragraph.create())
    tr.replaceWith(1, titleNodeSize - 1, schema.nodes.paragraph.create())
    const selection = TextSelection.create(tr.doc, 2);
    tr.setSelection(selection)
    dispatch(tr)
    view.focus()
  }
}

export function insertParagraph(number: number) {
  return function (state: EditorState, dispatch: (tr: Transaction) => void, view: EditorView) {
    const { tr, doc, schema } = state
    const titleNode = doc.nodeAt(0)
    if (!titleNode) {
      return
    }
    const titleNodeSize = titleNode.nodeSize
    let i = number
    while(i-- > 0) {
      const content = `这是第${i}个段落`
      const paragraph = schema.node(schema.nodes.paragraph, {}, schema.text(content))
      tr.insert(titleNodeSize, paragraph)
    }
    dispatch(tr)
    view.focus()
  }
}

export function insertHeading(number: number) {
  return function (state: EditorState, dispatch: (tr: Transaction) => void, view: EditorView) {
    const { tr, doc, schema } = state
    const titleNode = doc.nodeAt(0)
    if (!titleNode) {
      return
    }
    const titleNodeSize = titleNode.nodeSize
    let i = number
    while(i-- > 0) {
      const level = i % 6 + 1
      let text = ''
      switch(level) {
        case 1:
          text = '一'
          break
        case 2:
          text = '二'
          break
        case 3:
          text = '三'
          break
        case 4:
          text = '四'
          break
        case 5:
          text = '五'
          break
        default:
          text = '六'
          break
      }
      const content = `这是${text}级标题`
      const heading = schema.node(schema.nodes.heading, { level }, schema.text(content))
      tr.insert(titleNodeSize, heading)
    }
    dispatch(tr)
    view.focus()
  }
}

export function insertLongDoc() {
  return function (state: EditorState, dispatch: (tr: Transaction) => void, view: EditorView) {
    const { tr, doc, schema } = state
    const titleNode = doc.nodeAt(0)
    if (!titleNode) {
      return
    }
    const titleNodeSize = titleNode.nodeSize
    let i = 500
    while(i > 0) {
      let headingCount = Math.ceil(Math.random() * 4)
      let paragraphCount = Math.ceil(Math.random() * 30)
      i -= paragraphCount
      i -= headingCount
      while(paragraphCount-- > 0) {
        const content = `这是第${paragraphCount + 1}个段落`
        const paragraph = schema.node(schema.nodes.paragraph, {}, schema.text(content))
        tr.insert(titleNodeSize, paragraph)
      }
      while(headingCount-- > 0) {
        const level = headingCount % 6 + 1
        let text = ''
        switch(level) {
          case 1:
            text = '一'
            break
          case 2:
            text = '二'
            break
          case 3:
            text = '三'
            break
          case 4:
            text = '四'
            break
          case 5:
            text = '五'
            break
          default:
            text = '六'
            break
        }
        const content = `这是${text}级标题`
        const heading = schema.node(schema.nodes.heading, { level }, schema.text(content))
        tr.insert(titleNodeSize, heading)
      }
    }
    dispatch(tr)
    view.focus()
  }
}

export function isBlockTypeActive(state: EditorState, nodeType: NodeType, attrs: any = {}): boolean {
  const { selection } = state
  const { $from } = selection
  return $from.parent.type === nodeType && (attrs.level ?  $from.parent.attrs.level === attrs.level : true)
}