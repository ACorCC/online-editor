import { Schema } from "prosemirror-model";
import doc from "./node/doc";
import title from "./node/title";
import heading from "./node/heading";
import text from "./node/text";
import paragraph from "./node/paragraph";
import blockquote from "./node/blockquote";
import bulletList from "./node/bulletList";
import codeBlock from "./node/codeBlock";
import image from "./node/image";
import link from "./node/link";
import listItem from "./node/listItem";
import orderedList from "./node/orderedList";
import bold from "./mark/bold";
import code from "./mark/code";
import italic from "./mark/italic";
import strike from "./mark/strike";
import color from "./mark/color";

const schema = new Schema({
  nodes: {
    doc,
    title,
    text,
    paragraph,
    heading,
    codeBlock,
    bulletList,
    orderedList,
    listItem,
    blockquote,
    image,
    link,
  },
  marks: {
    bold,
    code,
    italic,
    strike,
    color,
  }
})

export default schema