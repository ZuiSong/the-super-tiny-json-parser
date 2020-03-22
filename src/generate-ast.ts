import { Token } from "./token";
import { Pair } from "./pair";
import { JsonNode } from "./json-node";
import { TokenType } from "./token-type";
import { JsonNodeType } from "./json-node-type";
import { required } from "./required";

export function generateAst(tokens: Token[]) {
  function getNode(idx: number): Pair<number, JsonNode> {
    if (tokens[idx].type === TokenType.逗号) {
      idx++;
    }

    let t = tokens[idx];
    if (t.type === TokenType.大括号 && t.value === "{") {
      idx++; // 跳过大括号节点

      let node = {} as JsonNode;
      node.type = JsonNodeType.JSON_OBJ;
      node.value = new Map<string, JsonNode>();
      // 大括号处理
      // 保存存有名字token
      while (tokens[idx].type !== TokenType.大括号 && tokens[idx].value !== "}") {
        let nameToken = tokens[idx];
        required(
          nameToken,
          it => it.type === TokenType.名字 || it.type === TokenType.字符串,
          "大括号后面只能跟名字或字符串"
        );
        required(tokens[idx + 1], it => it.type === TokenType.冒号, "只能是冒号");
        // 通过递归获取子节点
        const p = getNode(idx + 2);
        node.value.set(nameToken.value, p.second);
        idx = p.first;
        if (tokens[idx].type === TokenType.逗号) {
          idx++;
        }

        required(idx, it => it < tokens.length);
      }
      idx++; // 跳过结尾的反大括号
      return { first: idx, second: node };
    }

    if (t.type === TokenType.方括号 && t.value == "[") {
      idx++;
      let node = {} as JsonNode;
      node.type = JsonNodeType.JSON_ARRAY;
      node.value = new Array<JsonNode>();

      while (tokens[idx].type !== TokenType.方括号 && tokens[idx].value !== "]") {
        const p = getNode(idx);
        node.value.push(p.second);

        idx = p.first;
        if (tokens[idx].type === TokenType.逗号) {
          idx++;
        }
      }
      idx++;
      return { first: idx, second: node };
    }

    if (t.type === TokenType.数字) {
      const node = {} as JsonNode;
      node.type = JsonNodeType.NUMBER;
      node.value = Number(t.value);
      return { first: idx + 1, second: node };
    }

    if (t.type === TokenType.字符串) {
      const node = {} as JsonNode;
      node.type = JsonNodeType.STRING;
      node.value = t.value;
      return { first: idx + 1, second: node };
    }

    throw new Error(JSON.stringify(t));
  }

  const res = getNode(0);
  required(res.first, it => it === tokens.length, "必须直接到结尾");
  res.second.type = JsonNodeType.ROOT_NODE;

  return res.second;
}