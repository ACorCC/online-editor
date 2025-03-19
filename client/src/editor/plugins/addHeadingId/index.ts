import { Plugin } from "prosemirror-state";

function generateUniqueId() {
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var randomString = '';
  
  for (var i = 0; i < 6; i++) {
    var randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  
  return randomString;
}

// 创建一个插件，用于在标题上添加唯一的 ID
const addHeadingId = new Plugin({
  appendTransaction(_transactions, _oldState, newState) {
    let tr = newState.tr;

    // 遍历所有标题节点
    newState.doc.descendants((node, pos) => {
      if (node.type.name === 'heading') {
        if (!node.attrs.id) {
          const uniqueId = generateUniqueId();
          tr = tr.setNodeMarkup(pos, null, { ...node.attrs, id: uniqueId })
        }
        return false
      }
      return true
    })

    // 如果有更新，则返回包含更新的事务
    return tr.docChanged ? tr : null
  },
})


export default addHeadingId