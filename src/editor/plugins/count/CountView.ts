import { CountBar } from '@/components/CountBar';
import { PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

export default class CountView implements PluginView {
  editorView: EditorView
  dom: CountBar

  constructor(editorView: EditorView) {
    this.editorView = editorView;
    this.dom = document.createElement('count-bar')
    editorView.dom.parentNode?.insertBefore(this.dom, null)
    this.calculateCount()
  }

  update() {
    this.calculateCount()
  }

  destroy() {
    // 销毁插件视图
    this.dom.remove()
  }

  calculateCount() {
    const doc = this.editorView.state.doc
    this.dom.characters = doc.textContent.length

    const total = {
      cn: 0, // 中文字数
      en: 0, // 英文字数
    }
    // 获取中文字数
    let tmp: any = doc.textContent.match(/\p{sc=Han}/gu);
    if (tmp) {
        total.cn = tmp.length
    }
    tmp = doc.textContent.replace(/[^\w-]/g, ' ')
    if (tmp) {
      tmp = tmp.split(/\s+/)
    tmp = tmp.filter((w: any) => {
        return ['', '-', '_'].indexOf(w.trim()) === -1
    })
    }
    total.en = tmp.length
    this.dom.word = total.cn + total.en
  }
}

