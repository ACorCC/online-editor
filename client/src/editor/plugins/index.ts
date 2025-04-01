import { Plugin } from "prosemirror-state";
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from "prosemirror-commands";
import { history } from "prosemirror-history";
import inputRulesPlugin from "./inputRules";
import createMenuBarPlugin from "./menuBar";
import addHeadingId from './addHeadingId'
import createCatalog from "./catalog";
import createCount from "./count";
import { collab } from "prosemirror-collab";
import { getUserId } from "@/user";

const createPlugins = (): Plugin[] => [
  keymap(baseKeymap),
  history(),
  inputRulesPlugin,
  createMenuBarPlugin(),
  addHeadingId,
  createCatalog(),
  createCount(),
  // @ts-ignore
  collab({ version: window.initialVersion, clientID: getUserId() })
]

export default createPlugins