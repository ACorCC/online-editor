import { inputRules, wrappingInputRule } from 'prosemirror-inputrules';
import schema from '../schema';

const inputRulesPlugin = inputRules({
  rules: [
    wrappingInputRule(/^\s*([-+*])\s$/, schema.nodes.bulletList),
    wrappingInputRule(/^\s*([0-9]+)\.\s$/, schema.nodes.orderedList),
    wrappingInputRule(/^\s*#\s$/, schema.nodes.heading, { level: 1 }),
    wrappingInputRule(/^\s*##\s$/, schema.nodes.heading, { level: 2 }),
    wrappingInputRule(/^\s*###\s$/, schema.nodes.heading, { level: 3 }),
    // ... 其他输入规则
  ],
});

export default inputRulesPlugin