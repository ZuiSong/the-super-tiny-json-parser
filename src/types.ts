export enum TokenType {
  BIG = '大括号',
  SQUARE = '方括号',
  COLON = '冒号',
  COMMA = '逗号',
  IDENTIFY = '标识符',
  NUMBER = '数字',
  BOOLEAN = '布尔',
  STRING = '字符串',
}

export enum JsonNodeType {
  JSON_OBJECT = '1',
  JSON_ARRAY = '2',
  NUMBER = '4',
  STRING = '8',
  BOOLEAN = '16',
}

export type Token = {
  type: TokenType
  value: string
}

// 工具方法 校验用
export function required<T>(t: T, fn: (t: T) => boolean, message = ''): T {
  if (!fn(t)) {
    throw new Error(message)
  }
  return t
}

export type Pair<V1, V2> = {
  first: V1
  second: V2
}

export type JsonNodeValue =
  | string
  | number
  | boolean
  | Map<string, JsonNode>
  | Array<JsonNode>
  | { [key: string]: JsonNode }

export type JsonNode = {
  type: JsonNodeType
  value: JsonNodeValue
}

export type GenerateResult =
  | string
  | number
  | boolean
  | { [key: string]: GenerateResult }
  | Array<GenerateResult>
  | Map<string, GenerateResult>
