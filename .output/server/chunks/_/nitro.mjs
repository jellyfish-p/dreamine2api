import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import http from 'node:http';
import https from 'node:https';
import { EventEmitter } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import fs$2, { promises, existsSync } from 'node:fs';
import path$1, { resolve as resolve$1, dirname as dirname$1, join } from 'node:path';
import * as TOML from 'smol-toml';
import fs$1 from 'fs';
import { createRequire } from 'node:module';
import path from 'path';
import { fileURLToPath } from 'node:url';
import _$1 from 'lodash';
import assert from 'assert';
import _util from 'util';
import fs from 'fs-extra';
import { format } from 'date-fns';
import yaml from 'yaml';
import minimist from 'minimist';
import os from 'os';
import crypto, { randomUUID } from 'crypto';
import { Writable, Readable, PassThrough } from 'stream';
import mime from 'mime';
import axios from 'axios';
import CRC32 from 'crc-32';
import randomstring from 'randomstring';
import { CronJob } from 'cron';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { getIcons } from '@iconify/utils';
import { createHash } from 'node:crypto';
import { consola } from 'consola';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
const ENC_ENC_SLASH_RE = /%252f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return encode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F").replace(ENC_ENC_SLASH_RE, "%2F").replace(AMPERSAND_RE, "%26").replace(PLUS_RE, "%2B");
}
function decode(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const PROTOCOL_SCRIPT_RE = /^[\s\0]*(blob|data|javascript|vbscript):$/i;
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function isScriptProtocol(protocol) {
  return !!protocol && PROTOCOL_SCRIPT_RE.test(protocol);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
  }
  const [s0, ...s] = path.split("?");
  const cleanPath = s0.endsWith("/") ? s0.slice(0, -1) : s0;
  return (cleanPath || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
    if (!path) {
      return fragment;
    }
  }
  const [s0, ...s] = path.split("?");
  return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    const nextChar = input[_base.length];
    if (!nextChar || nextChar === "/" || nextChar === "?") {
      return input;
    }
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const nextChar = input[_base.length];
  if (nextChar && nextChar !== "/" && nextChar !== "?") {
    return input;
  }
  const trimmed = input.slice(_base.length).replace(/^\/+/, "");
  return "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery$1(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
function joinRelativeURL(..._input) {
  const JOIN_SEGMENT_SPLIT_RE = /\/(?!\/)/;
  const input = _input.filter(Boolean);
  const segments = [];
  let segmentsDepth = 0;
  for (const i of input) {
    if (!i || i === "/") {
      continue;
    }
    for (const [sindex, s] of i.split(JOIN_SEGMENT_SPLIT_RE).entries()) {
      if (!s || s === ".") {
        continue;
      }
      if (s === "..") {
        if (segments.length === 1 && hasProtocol(segments[0])) {
          continue;
        }
        segments.pop();
        segmentsDepth--;
        continue;
      }
      if (sindex === 1 && segments[segments.length - 1]?.endsWith(":/")) {
        segments[segments.length - 1] += "/" + s;
        continue;
      }
      segments.push(s);
      segmentsDepth++;
    }
  }
  let url = segments.join("/");
  if (segmentsDepth >= 0) {
    if (input[0]?.startsWith("/") && !url.startsWith("/")) {
      url = "/" + url;
    } else if (input[0]?.startsWith("./") && !url.startsWith("./")) {
      url = "./" + url;
    }
  } else {
    url = "../".repeat(-1 * segmentsDepth) + url;
  }
  if (input[input.length - 1]?.endsWith("/") && !url.endsWith("/")) {
    url += "/";
  }
  return url;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = { ...defaults };
  for (const key of Object.keys(baseObject)) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function o(n){throw new Error(`${n} is not implemented yet!`)}let i$1 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o("Readable.asyncIterator")}iterator(e){throw o("Readable.iterator")}map(e,t){throw o("Readable.map")}filter(e,t){throw o("Readable.filter")}forEach(e,t){throw o("Readable.forEach")}reduce(e,t,r){throw o("Readable.reduce")}find(e,t){throw o("Readable.find")}findIndex(e,t){throw o("Readable.findIndex")}some(e,t){throw o("Readable.some")}toArray(e){throw o("Readable.toArray")}every(e,t){throw o("Readable.every")}flatMap(e,t){throw o("Readable.flatMap")}drop(e,t){throw o("Readable.drop")}take(e,t){throw o("Readable.take")}asIndexedPairs(e){throw o("Readable.asIndexedPairs")}};let l$1 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;writableAborted=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u,s);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return Promise.resolve()}};const c$1=class c{allowHalfOpen=true;_destroy;constructor(e=new i$1,t=new l$1){Object.assign(this,e),Object.assign(this,t),this._destroy=m(e._destroy,t._destroy);}};function _(){return Object.assign(c$1.prototype,i$1.prototype),Object.assign(c$1.prototype,l$1.prototype),c$1}function m(...n){return function(...e){for(const t of n)t(...e);}}const g=_();class A extends g{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}}class y extends i$1{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p(this.headers)}get trailersDistinct(){return p(this.trailers)}}function p(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}class w extends l$1{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}}const E=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R(n={}){const e=new E,t=Array.isArray(n)||H(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H(n){return typeof n?.entries=="function"}function v(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const S=new Set([101,204,205,304]);async function b(n,e){const t=new y,r=new w(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(S.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function C(n,e,t={}){try{const r=await b(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:v(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}

function getQuery(event) {
  return getQuery$1(event.path || "");
}
function getRouterParams(event, opts = {}) {
  let params = event.context.params || {};
  if (opts.decode) {
    params = { ...params };
    for (const key in params) {
      params[key] = decode(params[key]);
    }
  }
  return params;
}
function getRouterParam(event, name, opts = {}) {
  const params = getRouterParams(event, opts);
  return params[name];
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const _header = event.node.req.headers["x-forwarded-host"];
    const xForwardedHost = (_header || "").split(",").shift()?.trim();
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}
function getRequestIP(event, opts = {}) {
  if (event.context.clientAddress) {
    return event.context.clientAddress;
  }
  if (opts.xForwardedFor) {
    const xForwardedFor = getRequestHeader(event, "x-forwarded-for")?.split(",").shift()?.trim();
    if (xForwardedFor) {
      return xForwardedFor;
    }
  }
  if (event.node.req.socket.remoteAddress) {
    return event.node.req.socket.remoteAddress;
  }
}

const RawBodySymbol = Symbol.for("h3RawBody");
const ParsedBodySymbol = Symbol.for("h3ParsedBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      if (_resolved instanceof FormData) {
        return new Response(_resolved).bytes().then((uint8arr) => Buffer.from(uint8arr));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !/\bchunked\b/i.test(
    String(event.node.req.headers["transfer-encoding"] ?? "")
  )) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
async function readBody(event, options = {}) {
  const request = event.node.req;
  if (hasProp(request, ParsedBodySymbol)) {
    return request[ParsedBodySymbol];
  }
  const contentType = request.headers["content-type"] || "";
  const body = await readRawBody(event);
  let parsed;
  if (contentType === "application/json") {
    parsed = _parseJSON(body, options.strict ?? true);
  } else if (contentType.startsWith("application/x-www-form-urlencoded")) {
    parsed = _parseURLEncodedBody(body);
  } else if (contentType.startsWith("text/")) {
    parsed = body;
  } else {
    parsed = _parseJSON(body, options.strict ?? false);
  }
  request[ParsedBodySymbol] = parsed;
  return parsed;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}
function _parseJSON(body = "", strict) {
  if (!body) {
    return void 0;
  }
  try {
    return destr(body, { strict });
  } catch {
    throw createError$1({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Invalid JSON body"
    });
  }
}
function _parseURLEncodedBody(body) {
  const form = new URLSearchParams(body);
  const parsedForm = /* @__PURE__ */ Object.create(null);
  for (const [key, value] of form.entries()) {
    if (hasProp(parsedForm, key)) {
      if (!Array.isArray(parsedForm[key])) {
        parsedForm[key] = [parsedForm[key]];
      }
      parsedForm[key].push(value);
    } else {
      parsedForm[key] = value;
    }
  }
  return parsedForm;
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders$1(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders$1;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => void 0);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    const entries = Array.isArray(input) ? input : typeof input.entries === "function" ? input.entries() : Object.entries(input);
    for (const [key, value] of entries) {
      if (value !== void 0) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _rawReqUrl = event.node.req.url || "/";
    const _reqPath = _decodePath(event._path || _rawReqUrl);
    event._path = _reqPath;
    const _needsRawUrl = _reqPath !== _rawReqUrl;
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _needsRawUrl ? layer.route.length > 1 ? _rawReqUrl.slice(layer.route.length) || "/" : _rawReqUrl : _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, void 0);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, void 0)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function _decodePath(url) {
  const qIndex = url.indexOf("?");
  const path = qIndex === -1 ? url : url.slice(0, qIndex);
  const query = qIndex === -1 ? "" : url.slice(qIndex);
  const decodedPath = path.includes("%25") ? decodePath(path.replace(/%25/g, "%2525")) : decodePath(path);
  return decodedPath + query;
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === void 0 && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s$1=globalThis.Headers,i=globalThis.AbortController,l=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  if (value instanceof FormData || value instanceof URLSearchParams) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (contentType === "text/event-stream") {
    return "stream";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
      if (!(context.options.headers instanceof Headers)) {
        context.options.headers = new Headers(
          context.options.headers || {}
          /* compat */
        );
      }
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        const contentType = context.options.headers.get("content-type");
        if (typeof context.options.body !== "string") {
          context.options.body = contentType === "application/x-www-form-urlencoded" ? new URLSearchParams(
            context.options.body
          ).toString() : JSON.stringify(context.options.body);
        }
        if (!contentType) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch$1 = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s$1;
const AbortController = globalThis.AbortController || i;
const ofetch = createFetch({ fetch: fetch$1, Headers: Headers$1, AbortController });
const $fetch$1 = ofetch;

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "has",
  "hasItem",
  "get",
  "getItem",
  "getItemRaw",
  "set",
  "setItem",
  "setItemRaw",
  "del",
  "remove",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  nsStorage.keys = nsStorage.getKeys;
  nsStorage.getItems = async (items, commonOptions) => {
    const prefixedItems = items.map(
      (item) => typeof item === "string" ? base + item : { ...item, key: base + item.key }
    );
    const results = await storage.getItems(prefixedItems, commonOptions);
    return results.map((entry) => ({
      key: entry.key.slice(base.length),
      value: entry.value
    }));
  };
  nsStorage.setItems = async (items, commonOptions) => {
    const prefixedItems = items.map((item) => ({
      key: base + item.key,
      value: item.value,
      options: item.options
    }));
    return storage.setItems(prefixedItems, commonOptions);
  };
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {

};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname$1(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname$1(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve$1(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

function serialize$1(o){return typeof o=="string"?`'${o}'`:new c().serialize(o)}const c=/*@__PURE__*/function(){class o{#t=new Map;compare(t,r){const e=typeof t,n=typeof r;return e==="string"&&n==="string"?t.localeCompare(r):e==="number"&&n==="number"?t-r:String.prototype.localeCompare.call(this.serialize(t,true),this.serialize(r,true))}serialize(t,r){if(t===null)return "null";switch(typeof t){case "string":return r?t:`'${t}'`;case "bigint":return `${t}n`;case "object":return this.$object(t);case "function":return this.$function(t)}return String(t)}serializeObject(t){const r=Object.prototype.toString.call(t);if(r!=="[object Object]")return this.serializeBuiltInType(r.length<10?`unknown:${r}`:r.slice(8,-1),t);const e=t.constructor,n=e===Object||e===void 0?"":e.name;if(n!==""&&globalThis[n]===e)return this.serializeBuiltInType(n,t);if(typeof t.toJSON=="function"){const i=t.toJSON();return n+(i!==null&&typeof i=="object"?this.$object(i):`(${this.serialize(i)})`)}return this.serializeObjectEntries(n,Object.entries(t))}serializeBuiltInType(t,r){const e=this["$"+t];if(e)return e.call(this,r);if(typeof r?.entries=="function")return this.serializeObjectEntries(t,r.entries());throw new Error(`Cannot serialize ${t}`)}serializeObjectEntries(t,r){const e=Array.from(r).sort((i,a)=>this.compare(i[0],a[0]));let n=`${t}{`;for(let i=0;i<e.length;i++){const[a,l]=e[i];n+=`${this.serialize(a,true)}:${this.serialize(l)}`,i<e.length-1&&(n+=",");}return n+"}"}$object(t){let r=this.#t.get(t);return r===void 0&&(this.#t.set(t,`#${this.#t.size}`),r=this.serializeObject(t),this.#t.set(t,r)),r}$function(t){const r=Function.prototype.toString.call(t);return r.slice(-15)==="[native code] }"?`${t.name||""}()[native]`:`${t.name}(${t.length})${r.replace(/\s*\n\s*/g,"")}`}$Array(t){let r="[";for(let e=0;e<t.length;e++)r+=this.serialize(t[e]),e<t.length-1&&(r+=",");return r+"]"}$Date(t){try{return `Date(${t.toISOString()})`}catch{return "Date(null)"}}$ArrayBuffer(t){return `ArrayBuffer[${new Uint8Array(t).join(",")}]`}$Set(t){return `Set${this.$Array(Array.from(t).sort((r,e)=>this.compare(r,e)))}`}$Map(t){return this.serializeObjectEntries("Map",t.entries())}}for(const s of ["Error","RegExp","URL"])o.prototype["$"+s]=function(t){return `${s}(${t})`};for(const s of ["Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array","Uint32Array","Float32Array","Float64Array"])o.prototype["$"+s]=function(t){return `${s}[${t.join(",")}]`};for(const s of ["BigInt64Array","BigUint64Array"])o.prototype["$"+s]=function(t){return `${s}[${t.join("n,")}${t.length>0?"n":""}]`};return o}();

function isEqual(object1, object2) {
  if (object1 === object2) {
    return true;
  }
  if (serialize$1(object1) === serialize$1(object2)) {
    return true;
  }
  return false;
}

const e=globalThis.process?.getBuiltinModule?.("crypto")?.hash,r="sha256",s="base64url";function digest(t){if(e)return e(r,t,s);const o=createHash(r).update(t);return globalThis.process?.versions?.webcontainer?o.digest().toString(s):o.digest(s)}

function hash$1(input) {
  return digest(serialize$1(input));
}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {
  "nuxt": {},
  "ui": {
    "colors": {
      "primary": "green",
      "secondary": "blue",
      "success": "green",
      "info": "blue",
      "warning": "yellow",
      "error": "red",
      "neutral": "slate"
    },
    "icons": {
      "arrowLeft": "i-lucide-arrow-left",
      "arrowRight": "i-lucide-arrow-right",
      "check": "i-lucide-check",
      "chevronDoubleLeft": "i-lucide-chevrons-left",
      "chevronDoubleRight": "i-lucide-chevrons-right",
      "chevronDown": "i-lucide-chevron-down",
      "chevronLeft": "i-lucide-chevron-left",
      "chevronRight": "i-lucide-chevron-right",
      "chevronUp": "i-lucide-chevron-up",
      "close": "i-lucide-x",
      "ellipsis": "i-lucide-ellipsis",
      "external": "i-lucide-arrow-up-right",
      "file": "i-lucide-file",
      "folder": "i-lucide-folder",
      "folderOpen": "i-lucide-folder-open",
      "loading": "i-lucide-loader-circle",
      "minus": "i-lucide-minus",
      "plus": "i-lucide-plus",
      "search": "i-lucide-search",
      "upload": "i-lucide-upload"
    }
  },
  "icon": {
    "provider": "iconify",
    "class": "",
    "aliases": {},
    "iconifyApiEndpoint": "https://api.iconify.design",
    "localApiEndpoint": "/api/_nuxt_icon",
    "fallbackToApi": true,
    "cssSelectorPrefix": "i-",
    "cssWherePseudo": true,
    "cssLayer": "components",
    "mode": "css",
    "attrs": {
      "aria-hidden": true
    },
    "collections": [
      "academicons",
      "akar-icons",
      "ant-design",
      "arcticons",
      "basil",
      "bi",
      "bitcoin-icons",
      "bpmn",
      "brandico",
      "bx",
      "bxl",
      "bxs",
      "bytesize",
      "carbon",
      "catppuccin",
      "cbi",
      "charm",
      "ci",
      "cib",
      "cif",
      "cil",
      "circle-flags",
      "circum",
      "clarity",
      "codicon",
      "covid",
      "cryptocurrency",
      "cryptocurrency-color",
      "dashicons",
      "devicon",
      "devicon-plain",
      "ei",
      "el",
      "emojione",
      "emojione-monotone",
      "emojione-v1",
      "entypo",
      "entypo-social",
      "eos-icons",
      "ep",
      "et",
      "eva",
      "f7",
      "fa",
      "fa-brands",
      "fa-regular",
      "fa-solid",
      "fa6-brands",
      "fa6-regular",
      "fa6-solid",
      "fad",
      "fe",
      "feather",
      "file-icons",
      "flag",
      "flagpack",
      "flat-color-icons",
      "flat-ui",
      "flowbite",
      "fluent",
      "fluent-emoji",
      "fluent-emoji-flat",
      "fluent-emoji-high-contrast",
      "fluent-mdl2",
      "fontelico",
      "fontisto",
      "formkit",
      "foundation",
      "fxemoji",
      "gala",
      "game-icons",
      "geo",
      "gg",
      "gis",
      "gravity-ui",
      "gridicons",
      "grommet-icons",
      "guidance",
      "healthicons",
      "heroicons",
      "heroicons-outline",
      "heroicons-solid",
      "hugeicons",
      "humbleicons",
      "ic",
      "icomoon-free",
      "icon-park",
      "icon-park-outline",
      "icon-park-solid",
      "icon-park-twotone",
      "iconamoon",
      "iconoir",
      "icons8",
      "il",
      "ion",
      "iwwa",
      "jam",
      "la",
      "lets-icons",
      "line-md",
      "logos",
      "ls",
      "lucide",
      "lucide-lab",
      "mage",
      "majesticons",
      "maki",
      "map",
      "marketeq",
      "material-symbols",
      "material-symbols-light",
      "mdi",
      "mdi-light",
      "medical-icon",
      "memory",
      "meteocons",
      "mi",
      "mingcute",
      "mono-icons",
      "mynaui",
      "nimbus",
      "nonicons",
      "noto",
      "noto-v1",
      "octicon",
      "oi",
      "ooui",
      "openmoji",
      "oui",
      "pajamas",
      "pepicons",
      "pepicons-pencil",
      "pepicons-pop",
      "pepicons-print",
      "ph",
      "pixelarticons",
      "prime",
      "ps",
      "quill",
      "radix-icons",
      "raphael",
      "ri",
      "rivet-icons",
      "si-glyph",
      "simple-icons",
      "simple-line-icons",
      "skill-icons",
      "solar",
      "streamline",
      "streamline-emojis",
      "subway",
      "svg-spinners",
      "system-uicons",
      "tabler",
      "tdesign",
      "teenyicons",
      "token",
      "token-branded",
      "topcoat",
      "twemoji",
      "typcn",
      "uil",
      "uim",
      "uis",
      "uit",
      "uiw",
      "unjs",
      "vaadin",
      "vs",
      "vscode-icons",
      "websymbol",
      "weui",
      "whh",
      "wi",
      "wpf",
      "zmdi",
      "zondicons"
    ],
    "fetchTimeout": 1500
  }
};



const appConfig = defuFn(inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function upperFirst(str) {
  return str ? str[0].toUpperCase() + str.slice(1) : "";
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "15517349-413c-4625-a04f-c3daa11fce53",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      },
      "/_fonts/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {
    "appName": "dreamine2api"
  },
  "appConfigPath": "config.toml",
  "icon": {
    "serverKnownCssClasses": []
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
const _sharedAppConfig = _deepFreeze(klona(appConfig));
function useAppConfig(event) {
  {
    return _sharedAppConfig;
  }
}
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());
function executeAsync(function_) {
  const restores = [];
  for (const leaveHandler of asyncHandlers) {
    const restore2 = leaveHandler();
    if (restore2) {
      restores.push(restore2);
    }
  }
  const restore = () => {
    for (const restore2 of restores) {
      restore2();
    }
  };
  let awaitable = function_();
  if (awaitable && typeof awaitable === "object" && "catch" in awaitable) {
    awaitable = awaitable.catch((error) => {
      restore();
      throw error;
    });
  }
  return [awaitable, restore];
}

function isPathInScope(pathname, base) {
  let canonical;
  try {
    const pre = pathname.replace(/%2f/gi, "/").replace(/%5c/gi, "\\");
    canonical = new URL(pre, "http://_").pathname;
  } catch {
    return false;
  }
  return !base || canonical === base || canonical.startsWith(base + "/");
}

const config$1 = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config$1.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError$1({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError$1({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function isJsonRequest(event) {
	
	if (hasReqHeader(event, "accept", "text/html")) {
		return false;
	}
	return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
	const value = getRequestHeader(event, name);
	return !!(value && typeof value === "string" && value.toLowerCase().includes(includes));
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
	if (event.handled || isJsonRequest(event)) {
		
		return;
	}
	
	const defaultRes = await defaultHandler(error, event, { json: true });
	
	const status = error.status || error.statusCode || 500;
	if (status === 404 && defaultRes.status === 302) {
		setResponseHeaders$1(event, defaultRes.headers);
		setResponseStatus(event, defaultRes.status, defaultRes.statusText);
		return send(event, JSON.stringify(defaultRes.body, null, 2));
	}
	const errorObject = defaultRes.body;
	
	const url = new URL(errorObject.url);
	errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
	
	errorObject.message = error.unhandled ? errorObject.message || "Server Error" : error.message || errorObject.message || "Server Error";
	
	errorObject.data ||= error.data;
	errorObject.statusText ||= error.statusText || error.statusMessage;
	delete defaultRes.headers["content-type"];
	delete defaultRes.headers["content-security-policy"];
	setResponseHeaders$1(event, defaultRes.headers);
	
	const reqHeaders = getRequestHeaders(event);
	
	const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"] || !!event.context.nuxt?.["~rendering-error"];
	if (!isRenderingError) {
		event.context.nuxt ||= {};
		event.context.nuxt["~rendering-error"] = true;
	}
	
	const res = isRenderingError ? null : await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject), {
		headers: {
			...reqHeaders,
			"x-nuxt-error": "true"
		},
		redirect: "manual"
	}).catch(() => null);
	if (event.handled) {
		return;
	}
	
	if (!res) {
		const { template } = await import('./error-500.mjs');
		setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
		return send(event, template(errorObject));
	}
	const html = await res.text();
	for (const [header, value] of res.headers.entries()) {
		if (header === "set-cookie") {
			appendResponseHeader(event, header, value);
			continue;
		}
		setResponseHeader(event, header, value);
	}
	setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
	return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders$1(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const script = "\"use strict\";(()=>{const t=window,e=document.documentElement,c=[\"dark\",\"light\"],n=getStorageValue(\"localStorage\",\"nuxt-color-mode\")||\"light\";let i=n===\"system\"?u():n;const r=e.getAttribute(\"data-color-mode-forced\");r&&(i=r),l(i),t[\"__NUXT_COLOR_MODE__\"]={preference:n,value:i,getColorScheme:u,addColorScheme:l,removeColorScheme:d};function l(o){const s=\"\"+o+\"\",a=\"\";e.classList?e.classList.add(s):e.className+=\" \"+s,a&&e.setAttribute(\"data-\"+a,o)}function d(o){const s=\"\"+o+\"\",a=\"\";e.classList?e.classList.remove(s):e.className=e.className.replace(new RegExp(s,\"g\"),\"\"),a&&e.removeAttribute(\"data-\"+a)}function f(o){return t.matchMedia(\"(prefers-color-scheme\"+o+\")\")}function u(){if(t.matchMedia&&f(\"\").media!==\"not all\"){for(const o of c)if(f(\":\"+o).matches)return o}return\"light\"}})();function getStorageValue(t,e){switch(t){case\"localStorage\":return window.localStorage.getItem(e);case\"sessionStorage\":return window.sessionStorage.getItem(e);case\"cookie\":return getCookie(e);default:return null}}function getCookie(t){const c=(\"; \"+window.document.cookie).split(\"; \"+t+\"=\");if(c.length===2)return c.pop()?.split(\";\").shift()}";

const _b9NnPMJR55LxyMsgOKeOTlYwg1z6m47FnZK5A28ZQw = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

function defineNitroPlugin(def) {
  return def;
}

var __defProp$9 = Object.defineProperty;
var __defNormalProp$9 = (obj, key, value) => key in obj ? __defProp$9(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$9 = (obj, key, value) => __defNormalProp$9(obj, typeof key !== "symbol" ? key + "" : key, value);
const cmdArgs = minimist(process.argv.slice(2));
const envVars = process.env;
class Environment {
  constructor(options = {}) {
    /** 命令行参数 */
    __publicField$9(this, "cmdArgs");
    /** 环境变量 */
    __publicField$9(this, "envVars");
    /** 环境名称 */
    __publicField$9(this, "env");
    /** 服务名称 */
    __publicField$9(this, "name");
    /** 服务地址 */
    __publicField$9(this, "host");
    /** 服务端口 */
    __publicField$9(this, "port");
    /** 包参数 */
    __publicField$9(this, "package");
    const { cmdArgs: cmdArgs2, envVars: envVars2, package: _package } = options;
    this.cmdArgs = cmdArgs2;
    this.envVars = envVars2;
    this.env = _$1.defaultTo(cmdArgs2.env || envVars2.SERVER_ENV, "dev");
    this.name = cmdArgs2.name || envVars2.SERVER_NAME || void 0;
    this.host = cmdArgs2.host || envVars2.SERVER_HOST || void 0;
    this.port = Number(cmdArgs2.port || envVars2.SERVER_PORT) ? Number(cmdArgs2.port || envVars2.SERVER_PORT) : void 0;
    this.package = _package;
  }
}
const environment = new Environment({
  cmdArgs,
  envVars,
  package: JSON.parse(fs.readFileSync(path.join(path.resolve(), "package.json")).toString())
});

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    crypto.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}

function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}

//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = 0;
  const b = new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || rng)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return unsafeStringify(b);
}

const HTTP_STATUS_CODES = {
  CONTINUE: 100,
  SWITCHING_PROTOCOLS: 101,
  PROCESSING: 102,
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NON_AUTHORITATIVE_INFO: 203,
  NO_CONTENT: 204,
  RESET_CONTENT: 205,
  PARTIAL_CONTENT: 206,
  MULTIPLE_STATUS: 207,
  MULTIPLE_CHOICES: 300,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  USE_PROXY: 305,
  UNUSED: 306,
  TEMPORARY_REDIRECT: 307,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NO_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  REQUEST_ENTITY_TOO_LARGE: 413,
  REQUEST_URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  REQUESTED_RANGE_NOT_SATISFIABLE: 416,
  EXPECTION_FAILED: 417,
  TOO_MANY_CONNECTIONS: 421,
  UNPROCESSABLE_ENTITY: 422,
  FAILED_DEPENDENCY: 424,
  UNORDERED_COLLECTION: 425,
  UPGRADE_REQUIRED: 426,
  RETRY_WITH: 449,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  BANDWIDTH_LIMIT_EXCEEDED: 509,
  NOT_EXTENDED: 510
};

const autoIdMap = /* @__PURE__ */ new Map();
const util = {
  is2DArrays(value) {
    return _$1.isArray(value) && (!value[0] || _$1.isArray(value[0]) && _$1.isArray(value[value.length - 1]));
  },
  uuid: (separator = true) => separator ? v1() : v1().replace(/\-/g, ""),
  autoId: (prefix = "") => {
    let index = autoIdMap.get(prefix);
    if (index > 999999) index = 0;
    autoIdMap.set(prefix, (index || 0) + 1);
    return `${prefix}${index || 1}`;
  },
  ignoreJSONParse(value) {
    const result = _$1.attempt(() => JSON.parse(value));
    if (_$1.isError(result)) return null;
    return result;
  },
  generateRandomString(options) {
    return randomstring.generate(options);
  },
  getResponseContentType(value) {
    return value.headers ? value.headers["content-type"] || value.headers["Content-Type"] : null;
  },
  mimeToExtension(value) {
    let extension = mime.getExtension(value);
    if (extension == "mpga") return "mp3";
    return extension;
  },
  extractURLExtension(value) {
    const extname = path.extname(new URL(value).pathname);
    return extname.substring(1).toLowerCase();
  },
  createCronJob(cronPatterns, callback) {
    if (!_$1.isFunction(callback))
      throw new Error("callback must be an Function");
    return new CronJob(
      cronPatterns,
      () => callback(),
      null,
      false,
      "America/New_York"
    );
  },
  getDateString(format$1 = "yyyy-MM-dd", date = /* @__PURE__ */ new Date()) {
    return format(date, format$1);
  },
  getIPAddressesByIPv4() {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    for (let name in interfaces) {
      const networks = interfaces[name];
      const results = networks.filter(
        (network) => network.family === "IPv4" && network.address !== "127.0.0.1" && !network.internal
      );
      if (results[0] && results[0].address) addresses.push(results[0].address);
    }
    return addresses;
  },
  getMACAddressesByIPv4() {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    for (let name in interfaces) {
      const networks = interfaces[name];
      const results = networks.filter(
        (network) => network.family === "IPv4" && network.address !== "127.0.0.1" && !network.internal
      );
      if (results[0] && results[0].mac) addresses.push(results[0].mac);
    }
    return addresses;
  },
  generateSSEData(event, data, retry) {
    return `event: ${event || "message"}
data: ${(data || "").replace(/\n/g, "\\n").replace(/\s/g, "\\s")}
retry: ${retry || 3e3}

`;
  },
  buildDataBASE64(type, ext, buffer) {
    return `data:${type}/${ext.replace("jpg", "jpeg")};base64,${buffer.toString(
      "base64"
    )}`;
  },
  isLinux() {
    return os.platform() !== "win32";
  },
  isIPAddress(value) {
    return _$1.isString(value) && (/^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/.test(
      value
    ) || /\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*/.test(
      value
    ));
  },
  isPort(value) {
    return _$1.isNumber(value) && value > 0 && value < 65536;
  },
  isReadStream(value) {
    return value && (value instanceof Readable || "readable" in value || value.readable);
  },
  isWriteStream(value) {
    return value && (value instanceof Writable || "writable" in value || value.writable);
  },
  isHttpStatusCode(value) {
    return _$1.isNumber(value) && Object.values(HTTP_STATUS_CODES).includes(value);
  },
  isURL(value) {
    return !_$1.isUndefined(value) && /^(http|https)/.test(value);
  },
  isSrc(value) {
    return !_$1.isUndefined(value) && /^\/.+\.[0-9a-zA-Z]+(\?.+)?$/.test(value);
  },
  isBASE64(value) {
    return !_$1.isUndefined(value) && /^[a-zA-Z0-9\/\+]+(=?)+$/.test(value);
  },
  isBASE64Data(value) {
    return /^data:/.test(value);
  },
  extractBASE64DataFormat(value) {
    const match = value.trim().match(/^data:(.+);base64,/);
    if (!match) return null;
    return match[1];
  },
  removeBASE64DataHeader(value) {
    return value.replace(/^data:(.+);base64,/, "");
  },
  isDataString(value) {
    return /^(base64|json):/.test(value);
  },
  isStringNumber(value) {
    return _$1.isFinite(Number(value));
  },
  isUnixTimestamp(value) {
    return /^[0-9]{10}$/.test(`${value}`);
  },
  isTimestamp(value) {
    return /^[0-9]{13}$/.test(`${value}`);
  },
  isEmail(value) {
    return /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(
      value
    );
  },
  isAsyncFunction(value) {
    return Object.prototype.toString.call(value) === "[object AsyncFunction]";
  },
  async isAPNG(filePath) {
    let head;
    const readStream = fs.createReadStream(filePath, { start: 37, end: 40 });
    const readPromise = new Promise((resolve, reject) => {
      readStream.once("end", resolve);
      readStream.once("error", reject);
    });
    readStream.once("data", (data) => head = data);
    await readPromise;
    return head.compare(Buffer.from([97, 99, 84, 76])) === 0;
  },
  unixTimestamp() {
    return parseInt(`${Date.now() / 1e3}`);
  },
  timestamp() {
    return Date.now();
  },
  urlJoin(...values) {
    let url = "";
    for (let i = 0; i < values.length; i++)
      url += `${i > 0 ? "/" : ""}${values[i].replace(/^\/*/, "").replace(/\/*$/, "")}`;
    return url;
  },
  millisecondsToHmss(milliseconds) {
    if (_$1.isString(milliseconds)) return milliseconds;
    milliseconds = parseInt(milliseconds);
    const sec = Math.floor(milliseconds / 1e3);
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec - hours * 3600) / 60);
    const seconds = sec - hours * 3600 - minutes * 60;
    const ms = milliseconds % 6e4 - seconds * 1e3;
    return `${hours > 9 ? hours : "0" + hours}:${minutes > 9 ? minutes : "0" + minutes}:${seconds > 9 ? seconds : "0" + seconds}.${ms}`;
  },
  millisecondsToTimeString(milliseconds) {
    if (milliseconds < 1e3) return `${milliseconds}ms`;
    if (milliseconds < 6e4)
      return `${parseFloat((milliseconds / 1e3).toFixed(2))}s`;
    return `${Math.floor(milliseconds / 1e3 / 60)}m${Math.floor(
      milliseconds / 1e3 % 60
    )}s`;
  },
  rgbToHex(r, g, b) {
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },
  hexToRgb(hex) {
    const value = parseInt(hex.replace(/^#/, ""), 16);
    return [value >> 16 & 255, value >> 8 & 255, value & 255];
  },
  md5(value) {
    return crypto.createHash("md5").update(value).digest("hex");
  },
  crc32(value) {
    return _$1.isBuffer(value) ? CRC32.buf(value) : CRC32.str(value);
  },
  arrayParse(value) {
    return _$1.isArray(value) ? value : [value];
  },
  booleanParse(value) {
    return value === "true" || value === true ? true : false;
  },
  encodeBASE64(value) {
    return Buffer.from(value).toString("base64");
  },
  decodeBASE64(value) {
    return Buffer.from(value, "base64").toString();
  },
  async fetchFileBASE64(url) {
    const result = await axios.get(url, {
      responseType: "arraybuffer"
    });
    return result.data.toString("base64");
  }
};

var __defProp$8 = Object.defineProperty;
var __defNormalProp$8 = (obj, key, value) => key in obj ? __defProp$8(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$8 = (obj, key, value) => __defNormalProp$8(obj, typeof key !== "symbol" ? key + "" : key, value);
const CONFIG_PATH$1 = path.join(path.resolve(), "configs/", environment.env, "/service.yml");
class ServiceConfig {
  constructor(options) {
    /** 服务名称 */
    __publicField$8(this, "name");
    /** @type {string} 服务绑定主机地址 */
    __publicField$8(this, "host");
    /** @type {number} 服务绑定端口 */
    __publicField$8(this, "port");
    /** @type {string} 服务路由前缀 */
    __publicField$8(this, "urlPrefix");
    /** @type {string} 服务绑定地址（外部访问地址） */
    __publicField$8(this, "bindAddress");
    const { name, host, port, urlPrefix, bindAddress } = options || {};
    this.name = _$1.defaultTo(name, "dreamina-free-api");
    this.host = _$1.defaultTo(host, "0.0.0.0");
    this.port = _$1.defaultTo(port, 5200);
    this.urlPrefix = _$1.defaultTo(urlPrefix, "");
    this.bindAddress = bindAddress;
  }
  get addressHost() {
    if (this.bindAddress) return this.bindAddress;
    const ipAddresses = util.getIPAddressesByIPv4();
    for (let ipAddress of ipAddresses) {
      if (ipAddress === this.host)
        return ipAddress;
    }
    return ipAddresses[0] || "127.0.0.1";
  }
  get address() {
    return `${this.addressHost}:${this.port}`;
  }
  get pageDirUrl() {
    return `http://127.0.0.1:${this.port}/page`;
  }
  get publicDirUrl() {
    return `http://127.0.0.1:${this.port}/public`;
  }
  static load() {
    const external = _$1.pickBy(environment, (v, k) => ["name", "host", "port"].includes(k) && !_$1.isUndefined(v));
    if (!fs.pathExistsSync(CONFIG_PATH$1)) return new ServiceConfig(external);
    const data = yaml.parse(fs.readFileSync(CONFIG_PATH$1).toString());
    return new ServiceConfig({ ...data, ...external });
  }
}
const serviceConfig = ServiceConfig.load();

var __defProp$7 = Object.defineProperty;
var __defNormalProp$7 = (obj, key, value) => key in obj ? __defProp$7(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$7 = (obj, key, value) => __defNormalProp$7(obj, typeof key !== "symbol" ? key + "" : key, value);
const CONFIG_PATH = path.join(path.resolve(), "configs/", environment.env, "/system.yml");
class SystemConfig {
  constructor(options) {
    /** 是否开启请求日志 */
    __publicField$7(this, "requestLog");
    /** 临时目录路径 */
    __publicField$7(this, "tmpDir");
    /** 日志目录路径 */
    __publicField$7(this, "logDir");
    /** 日志写入间隔（毫秒） */
    __publicField$7(this, "logWriteInterval");
    /** 日志文件有效期（毫秒） */
    __publicField$7(this, "logFileExpires");
    /** 公共目录路径 */
    __publicField$7(this, "publicDir");
    /** 临时文件有效期（毫秒） */
    __publicField$7(this, "tmpFileExpires");
    /** 请求体配置 */
    __publicField$7(this, "requestBody");
    /** 是否调试模式 */
    __publicField$7(this, "debug");
    const { requestLog, tmpDir, logDir, logWriteInterval, logFileExpires, publicDir, tmpFileExpires, requestBody, debug } = options || {};
    this.requestLog = _$1.defaultTo(requestLog, false);
    this.tmpDir = _$1.defaultTo(tmpDir, "./tmp");
    this.logDir = _$1.defaultTo(logDir, "./logs");
    this.logWriteInterval = _$1.defaultTo(logWriteInterval, 200);
    this.logFileExpires = _$1.defaultTo(logFileExpires, 262656e4);
    this.publicDir = _$1.defaultTo(publicDir, "./public");
    this.tmpFileExpires = _$1.defaultTo(tmpFileExpires, 864e5);
    this.requestBody = Object.assign(requestBody || {}, {
      enableTypes: ["form", "text", "xml"],
      // 移除 json，由自定义中间件处理
      encoding: "utf-8",
      formLimit: "100mb",
      jsonLimit: "100mb",
      textLimit: "100mb",
      xmlLimit: "100mb",
      formidable: {
        maxFileSize: "100mb"
      },
      multipart: true,
      parsedMethods: ["POST", "PUT", "PATCH"]
    });
    this.debug = _$1.defaultTo(debug, true);
  }
  get rootDirPath() {
    return path.resolve();
  }
  get tmpDirPath() {
    return path.resolve(this.tmpDir);
  }
  get logDirPath() {
    return path.resolve(this.logDir);
  }
  get publicDirPath() {
    return path.resolve(this.publicDir);
  }
  static load() {
    if (!fs.pathExistsSync(CONFIG_PATH)) return new SystemConfig();
    const data = yaml.parse(fs.readFileSync(CONFIG_PATH).toString());
    return new SystemConfig(data);
  }
}
const systemConfig = SystemConfig.load();

var __defProp$6 = Object.defineProperty;
var __defNormalProp$6 = (obj, key, value) => key in obj ? __defProp$6(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$6 = (obj, key, value) => __defNormalProp$6(obj, typeof key !== "symbol" ? key + "" : key, value);
class Config {
  constructor() {
    /** 服务配置 */
    __publicField$6(this, "service", serviceConfig);
    /** 系统配置 */
    __publicField$6(this, "system", systemConfig);
  }
}
const config = new Config();

var __defProp$5 = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$5 = (obj, key, value) => __defNormalProp$5(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _buffers, _LogText_instances, getStackTopCodeInfo_fn, _writer, _Logger_instances, colorize_fn;
const isVercelEnv = process.env.VERCEL;
class LogWriter {
  constructor() {
    __privateAdd(this, _buffers, []);
    !isVercelEnv && fs.ensureDirSync(config.system.logDirPath);
    !isVercelEnv && this.work();
  }
  push(content) {
    const buffer = Buffer.from(content);
    __privateGet(this, _buffers).push(buffer);
  }
  writeSync(buffer) {
    !isVercelEnv && fs.appendFileSync(path.join(config.system.logDirPath, `/${util.getDateString()}.log`), buffer);
  }
  async write(buffer) {
    !isVercelEnv && await fs.appendFile(path.join(config.system.logDirPath, `/${util.getDateString()}.log`), buffer);
  }
  flush() {
    if (!__privateGet(this, _buffers).length) return;
    !isVercelEnv && fs.appendFileSync(path.join(config.system.logDirPath, `/${util.getDateString()}.log`), Buffer.concat(__privateGet(this, _buffers)));
  }
  work() {
    if (!__privateGet(this, _buffers).length) return setTimeout(this.work.bind(this), config.system.logWriteInterval);
    const buffer = Buffer.concat(__privateGet(this, _buffers));
    __privateSet(this, _buffers, []);
    this.write(buffer).finally(() => setTimeout(this.work.bind(this), config.system.logWriteInterval)).catch((err) => console.error("Log write error:", err));
  }
}
_buffers = new WeakMap();
class LogText {
  constructor(level, ...params) {
    __privateAdd(this, _LogText_instances);
    /** @type {string} 日志级别 */
    __publicField$5(this, "level");
    /** @type {string} 日志文本 */
    __publicField$5(this, "text");
    /** @type {string} 日志来源 */
    __publicField$5(this, "source");
    /** @type {Date} 日志发生时间 */
    __publicField$5(this, "time", /* @__PURE__ */ new Date());
    this.level = level;
    this.text = _util.format.apply(null, params);
    this.source = __privateMethod(this, _LogText_instances, getStackTopCodeInfo_fn).call(this);
  }
  toString() {
    return `[${format(this.time, "yyyy-MM-dd HH:mm:ss.SSS")}][${this.level}][${this.source.name}<${this.source.codeLine},${this.source.codeColumn}>] ${this.text}`;
  }
}
_LogText_instances = new WeakSet();
getStackTopCodeInfo_fn = function() {
  const unknownInfo = { name: "unknown", codeLine: 0, codeColumn: 0 };
  const stackArray = new Error().stack.split("\n");
  const text = stackArray[4];
  if (!text)
    return unknownInfo;
  const match = text.match(/at (.+) \((.+)\)/) || text.match(/at (.+)/);
  if (!match || !_$1.isString(match[2] || match[1]))
    return unknownInfo;
  const temp = match[2] || match[1];
  const _match = temp.match(/([a-zA-Z0-9_\-\.]+)\:(\d+)\:(\d+)$/);
  if (!_match)
    return unknownInfo;
  const [, scriptPath, codeLine, codeColumn] = _match;
  return {
    name: scriptPath ? scriptPath.replace(/.js$/, "") : "unknown",
    path: scriptPath || null,
    codeLine: parseInt(codeLine || 0),
    codeColumn: parseInt(codeColumn || 0)
  };
};
const _Logger = class _Logger {
  constructor() {
    __privateAdd(this, _Logger_instances);
    /** @type {Object} 系统配置 */
    __publicField$5(this, "config", {});
    __privateAdd(this, _writer);
    __privateSet(this, _writer, new LogWriter());
  }
  header() {
    __privateGet(this, _writer).writeSync(Buffer.from(`

===================== LOG START ${format(/* @__PURE__ */ new Date(), "yyyy-MM-dd HH:mm:ss.SSS")} =====================

`));
  }
  footer() {
    __privateGet(this, _writer).flush();
    __privateGet(this, _writer).writeSync(Buffer.from(`

===================== LOG END ${format(/* @__PURE__ */ new Date(), "yyyy-MM-dd HH:mm:ss.SSS")} =====================

`));
  }
  success(...params) {
    const content = new LogText(_Logger.Level.Success, ...params).toString();
    console.info(__privateMethod(this, _Logger_instances, colorize_fn).call(this, content, _Logger.Level.Success));
    __privateGet(this, _writer).push(content + "\n");
  }
  info(...params) {
    const content = new LogText(_Logger.Level.Info, ...params).toString();
    console.info(__privateMethod(this, _Logger_instances, colorize_fn).call(this, content, _Logger.Level.Info));
    __privateGet(this, _writer).push(content + "\n");
  }
  log(...params) {
    const content = new LogText(_Logger.Level.Log, ...params).toString();
    console.log(__privateMethod(this, _Logger_instances, colorize_fn).call(this, content, _Logger.Level.Log));
    __privateGet(this, _writer).push(content + "\n");
  }
  debug(...params) {
    if (!config.system.debug) return;
    const content = new LogText(_Logger.Level.Debug, ...params).toString();
    console.debug(__privateMethod(this, _Logger_instances, colorize_fn).call(this, content, _Logger.Level.Debug));
    __privateGet(this, _writer).push(content + "\n");
  }
  warn(...params) {
    const content = new LogText(_Logger.Level.Warning, ...params).toString();
    console.warn(__privateMethod(this, _Logger_instances, colorize_fn).call(this, content, _Logger.Level.Warning));
    __privateGet(this, _writer).push(content + "\n");
  }
  error(...params) {
    const content = new LogText(_Logger.Level.Error, ...params).toString();
    console.error(__privateMethod(this, _Logger_instances, colorize_fn).call(this, content, _Logger.Level.Error));
    __privateGet(this, _writer).push(content + "\n");
  }
  fatal(...params) {
    const content = new LogText(_Logger.Level.Fatal, ...params).toString();
    console.error(__privateMethod(this, _Logger_instances, colorize_fn).call(this, content, _Logger.Level.Fatal));
    __privateGet(this, _writer).push(content + "\n");
  }
};
_writer = new WeakMap();
_Logger_instances = new WeakSet();
colorize_fn = function(content, level) {
  const color = _Logger.LevelColor[level];
  if (!color) return content;
  const colored = content[color];
  return _$1.isString(colored) ? colored : content;
};
/** @type {Object} 日志级别映射 */
__publicField$5(_Logger, "Level", {
  Success: "success",
  Info: "info",
  Log: "log",
  Debug: "debug",
  Warning: "warning",
  Error: "error",
  Fatal: "fatal"
});
/** @type {Object} 日志级别文本颜色 */
__publicField$5(_Logger, "LevelColor", {
  [_Logger.Level.Success]: "green",
  [_Logger.Level.Info]: "brightCyan",
  [_Logger.Level.Log]: "white",
  [_Logger.Level.Debug]: "white",
  [_Logger.Level.Warning]: "brightYellow",
  [_Logger.Level.Error]: "brightRed",
  [_Logger.Level.Fatal]: "red"
});
let Logger = _Logger;
const logger = new Logger();

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS pool_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL DEFAULT '',
  enabled INTEGER NOT NULL DEFAULT 1,
  proxy_url TEXT,
  last_total_credit INTEGER,
  last_gift_credit INTEGER,
  last_check_at INTEGER,
  last_success_at INTEGER,
  fail_count INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  email TEXT,
  password TEXT,
  user_id TEXT,
  user_name TEXT,
  store_country TEXT,
  account_type TEXT,
  last_account_info TEXT,
  vip_level TEXT,
  vip_expire_at TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pool_accounts_enabled ON pool_accounts(enabled);

CREATE TABLE IF NOT EXISTS api_calls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  path TEXT NOT NULL,
  method TEXT NOT NULL,
  model TEXT,
  account_id INTEGER,
  from_pool INTEGER NOT NULL DEFAULT 0,
  status_code INTEGER,
  duration_ms INTEGER,
  error TEXT,
  client_ip TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_api_calls_created ON api_calls(created_at);
`;
const MIGRATION_COLUMNS = [
  { column: "email", ddl: "TEXT" },
  { column: "password", ddl: "TEXT" },
  { column: "user_id", ddl: "TEXT" },
  { column: "user_name", ddl: "TEXT" },
  { column: "store_country", ddl: "TEXT" },
  { column: "account_type", ddl: "TEXT" },
  { column: "last_account_info", ddl: "TEXT" },
  { column: "vip_level", ddl: "TEXT" },
  { column: "vip_expire_at", ddl: "TEXT" }
];

const DB_PATH = process.env.DREAMINE_DB_PATH || path.resolve(process.cwd(), "data/dreamine2api.db");
const require$1 = createRequire(path.resolve(process.cwd(), "package.json"));
const BetterSqlite3 = require$1("better-sqlite3");
let db = null;
function getDb() {
  if (db) return db;
  fs$1.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  db = new BetterSqlite3(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(SCHEMA_SQL);
  migratePoolAccounts(db);
  return db;
}
function migratePoolAccounts(database) {
  const existing = database.prepare("PRAGMA table_info(pool_accounts)").all().map((r) => r.name);
  for (const { column, ddl } of MIGRATION_COLUMNS) {
    if (!existing.includes(column)) {
      database.exec(`ALTER TABLE pool_accounts ADD COLUMN ${column} ${ddl}`);
    }
  }
}
function dbPath() {
  return DB_PATH;
}

const DEFAULT_CONFIG = {
  server: { name: "dreamine2api", host: "0.0.0.0", port: 5200 },
  system: {
    request_log: true,
    tmp_dir: "./tmp",
    log_dir: "./logs",
    public_dir: "./public"
  },
  proxy: { global_proxy_url: "", credit_refresh_proxy_url: "" },
  pool: { api_key: "" },
  admin: { api_key: "", enabled: true },
  database: { path: "data/dreamine2api.db" }
};
function configFilePath() {
  return path$1.resolve(process.cwd(), "config.toml");
}
function readAppConfig() {
  const file = configFilePath();
  if (!fs$2.existsSync(file)) {
    writeAppConfig(DEFAULT_CONFIG);
    return structuredClone(DEFAULT_CONFIG);
  }
  const raw = TOML.parse(fs$2.readFileSync(file, "utf8"));
  return mergeConfig(DEFAULT_CONFIG, raw);
}
function writeAppConfig(config) {
  const file = configFilePath();
  const doc = {
    server: config.server,
    system: config.system,
    proxy: config.proxy,
    pool: config.pool,
    admin: config.admin,
    database: config.database
  };
  fs$2.writeFileSync(file, TOML.stringify(doc), "utf8");
}
function mergeConfig(base, patch) {
  return {
    server: { ...base.server, ...patch.server },
    system: { ...base.system, ...patch.system },
    proxy: { ...base.proxy, ...patch.proxy },
    pool: { ...base.pool, ...patch.pool },
    admin: { ...base.admin, ...patch.admin },
    database: { ...base.database, ...patch.database }
  };
}
function applyConfigToEnv(config) {
  if (config.database.path) {
    process.env.DREAMINE_DB_PATH = path$1.resolve(process.cwd(), config.database.path);
  }
  if (config.proxy.global_proxy_url) {
    process.env.DREAMINE_GLOBAL_PROXY = config.proxy.global_proxy_url;
  }
  if (config.proxy.credit_refresh_proxy_url) {
    process.env.DREAMINE_CREDIT_PROXY = config.proxy.credit_refresh_proxy_url;
  }
  if (config.pool.api_key) {
    process.env.DREAMINE_POOL_API_KEY = config.pool.api_key;
  }
}

const KEYS$1 = {
  GLOBAL_PROXY: "global_proxy_url",
  CREDIT_PROXY: "credit_refresh_proxy_url",
  POOL_API_KEY: "pool_api_key"
};
function now$2() {
  return Math.floor(Date.now() / 1e3);
}
function setSetting$1(key, value) {
  getDb().prepare(
    `INSERT INTO app_settings(key, value, updated_at) VALUES(?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
  ).run(key, value, now$2());
}
function syncTomlToSqlite(config) {
  setSetting$1(KEYS$1.GLOBAL_PROXY, config.proxy.global_proxy_url.trim());
  setSetting$1(KEYS$1.CREDIT_PROXY, config.proxy.credit_refresh_proxy_url.trim());
  setSetting$1(KEYS$1.POOL_API_KEY, config.pool.api_key.trim());
}

const _sB7_AI4branVlKVkYEayE1oTtt04JwjmMJThH_bfQs = defineNitroPlugin(() => {
  const config = readAppConfig();
  applyConfigToEnv(config);
  syncTomlToSqlite(config);
});

const plugins = [
  _b9NnPMJR55LxyMsgOKeOTlYwg1z6m47FnZK5A28ZQw,
_sB7_AI4branVlKVkYEayE1oTtt04JwjmMJThH_bfQs
];

const assets = {
  "/welcome.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"1492-8xYiZk2Wb+U7V1wIeTebGDSi0sU\"",
    "mtime": "2026-06-30T03:39:59.691Z",
    "size": 5266,
    "path": "../public/welcome.html"
  },
  "/_nuxt/-PIw8VXZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4ac-HbMStav+cb0uwnXYlH3M5nJGark\"",
    "mtime": "2026-06-30T05:36:43.018Z",
    "size": 1196,
    "path": "../public/_nuxt/-PIw8VXZ.js"
  },
  "/_nuxt/Bmp-pNer.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1ed-xYHbsPCJM7RJ8JQpZG8JR29ekrc\"",
    "mtime": "2026-06-30T05:36:43.021Z",
    "size": 493,
    "path": "../public/_nuxt/Bmp-pNer.js"
  },
  "/_nuxt/BRnPRxYr.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d2a-ORMRr8rymDmjj+TmrUkM6wwtVOE\"",
    "mtime": "2026-06-30T05:36:43.018Z",
    "size": 3370,
    "path": "../public/_nuxt/BRnPRxYr.js"
  },
  "/_nuxt/BEMUfxxm.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1d1f-SxerZeUEb+aVi5U+USFiaOBJhLQ\"",
    "mtime": "2026-06-30T05:36:43.021Z",
    "size": 7455,
    "path": "../public/_nuxt/BEMUfxxm.js"
  },
  "/_nuxt/BHGzJxe7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"52a-V2MdeSGwEMPjvkyUiPivtWGUb1g\"",
    "mtime": "2026-06-30T05:36:43.018Z",
    "size": 1322,
    "path": "../public/_nuxt/BHGzJxe7.js"
  },
  "/_nuxt/2SrF51mZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"22b1-suDBJTsXB9+CT6tl437tCodsfBM\"",
    "mtime": "2026-06-30T05:36:43.018Z",
    "size": 8881,
    "path": "../public/_nuxt/2SrF51mZ.js"
  },
  "/_nuxt/C7Y2qRlQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4de-JAyOHD0kTmTP0raQpGmHj2anT/U\"",
    "mtime": "2026-06-30T05:36:43.018Z",
    "size": 1246,
    "path": "../public/_nuxt/C7Y2qRlQ.js"
  },
  "/_nuxt/CEir_LND.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5f4-EGItbicRRW9IXkvFv9D+vfLXxHY\"",
    "mtime": "2026-06-30T05:36:43.018Z",
    "size": 1524,
    "path": "../public/_nuxt/CEir_LND.js"
  },
  "/_nuxt/D-QY9ib5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"441-/VKMJqiJ2QkLnEW0F0RLko4YxmU\"",
    "mtime": "2026-06-30T05:36:43.018Z",
    "size": 1089,
    "path": "../public/_nuxt/D-QY9ib5.js"
  },
  "/_nuxt/Dd9cw-Sh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"cc-Nv8RaBPLxuHRWhMBLKK78+t1q9w\"",
    "mtime": "2026-06-30T05:36:43.020Z",
    "size": 204,
    "path": "../public/_nuxt/Dd9cw-Sh.js"
  },
  "/_nuxt/DNunXYs-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e7c-B4LsAWDzx2G7VR7jdlfSaCwxIEY\"",
    "mtime": "2026-06-30T05:36:43.018Z",
    "size": 3708,
    "path": "../public/_nuxt/DNunXYs-.js"
  },
  "/_nuxt/CMft8zqu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"56793-3reV1VN3AhywiZbQ8ghqOE0y29o\"",
    "mtime": "2026-06-30T05:36:43.011Z",
    "size": 354195,
    "path": "../public/_nuxt/CMft8zqu.js"
  },
  "/_nuxt/DVW2sEzE.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"31c6-1WYlNxfE8uN54s0jutrF9wIKHzM\"",
    "mtime": "2026-06-30T05:36:43.018Z",
    "size": 12742,
    "path": "../public/_nuxt/DVW2sEzE.js"
  },
  "/_nuxt/error-404.DL_4WIao.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"dca-KnjyV0UbpsrliiJzZx69defY74k\"",
    "mtime": "2026-06-30T05:36:43.018Z",
    "size": 3530,
    "path": "../public/_nuxt/error-404.DL_4WIao.css"
  },
  "/_nuxt/error-500.I1Dtv2V5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"75a-vEGyJqldBVJrnMfcLsrGaHcxYl0\"",
    "mtime": "2026-06-30T05:36:43.018Z",
    "size": 1882,
    "path": "../public/_nuxt/error-500.I1Dtv2V5.css"
  },
  "/_nuxt/RHRTx55H.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"356-IgY939K4auxwjsSkAqeu3yxHVLA\"",
    "mtime": "2026-06-30T05:36:43.018Z",
    "size": 854,
    "path": "../public/_nuxt/RHRTx55H.js"
  },
  "/_nuxt/vhy09P4v.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"10390-LivdbjuyY87NKB9pzEtf8uA0Heo\"",
    "mtime": "2026-06-30T05:36:43.021Z",
    "size": 66448,
    "path": "../public/_nuxt/vhy09P4v.js"
  },
  "/_nuxt/Y0CQoMoZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"78c6-eUea3NdjKV2VEKvL5E3WTX+GEF4\"",
    "mtime": "2026-06-30T05:36:43.018Z",
    "size": 30918,
    "path": "../public/_nuxt/Y0CQoMoZ.js"
  },
  "/_nuxt/builds/latest.json": {
    "type": "application/json",
    "etag": "\"47-2jRy6/U5bw7zN/an1fv4WGrvMf4\"",
    "mtime": "2026-06-30T05:36:49.832Z",
    "size": 71,
    "path": "../public/_nuxt/builds/latest.json"
  },
  "/_nuxt/builds/meta/15517349-413c-4625-a04f-c3daa11fce53.json": {
    "type": "application/json",
    "etag": "\"58-45VxgIRLyxI1o0SErNFGoC2l6iQ\"",
    "mtime": "2026-06-30T05:36:49.833Z",
    "size": 88,
    "path": "../public/_nuxt/builds/meta/15517349-413c-4625-a04f-c3daa11fce53.json"
  }
};

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};
const basename = function(p, extension) {
  const segments = normalizeWindowsPath(p).split("/");
  let lastSegment = "";
  for (let i = segments.length - 1; i >= 0; i--) {
    const val = segments[i];
    if (val) {
      lastSegment = val;
      break;
    }
  }
  return extension && lastSegment.endsWith(extension) ? lastSegment.slice(0, -extension.length) : lastSegment;
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1},"/_fonts/":{"maxAge":31536000},"/_nuxt/":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _RG7aAL = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError$1({ statusCode: 404 });
    }
    return;
  }
  if (asset.encoding !== void 0) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

var __defProp$4 = Object.defineProperty;
var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$4 = (obj, key, value) => __defNormalProp$4(obj, typeof key !== "symbol" ? key + "" : key, value);
class Exception extends Error {
  /**
   * 构造异常
   * 
   * @param exception 异常
   * @param _errmsg 异常消息
   */
  constructor(exception, _errmsg) {
    assert(_$1.isArray(exception), "Exception must be Array");
    const [errcode, errmsg] = exception;
    assert(_$1.isFinite(errcode), "Exception errcode invalid");
    assert(_$1.isString(errmsg), "Exception errmsg invalid");
    super(_errmsg || errmsg);
    /** 错误码 */
    __publicField$4(this, "errcode");
    /** 错误消息 */
    __publicField$4(this, "errmsg");
    /** 数据 */
    __publicField$4(this, "data");
    /** HTTP状态码 */
    __publicField$4(this, "httpStatusCode");
    /** 历史ID */
    __publicField$4(this, "historyId");
    this.errcode = errcode;
    this.errmsg = _errmsg || errmsg;
  }
  compare(exception) {
    const [errcode] = exception;
    return this.errcode == errcode;
  }
  setHTTPStatusCode(value) {
    this.httpStatusCode = value;
    return this;
  }
  setData(value) {
    this.data = _$1.defaultTo(value, null);
    return this;
  }
}

class APIException extends Exception {
  /**
   * 构造异常
   * 
   * @param {[number, string]} exception 异常
   */
  constructor(exception, errmsg) {
    super(exception, errmsg);
  }
}

const EX$1 = {
  API_TEST: [-9999, "API\u5F02\u5E38\u9519\u8BEF"],
  API_REQUEST_PARAMS_INVALID: [-2e3, "\u8BF7\u6C42\u53C2\u6570\u975E\u6CD5"],
  API_REQUEST_FAILED: [-2001, "\u8BF7\u6C42\u5931\u8D25"],
  API_TOKEN_EXPIRES: [-2002, "Token\u5DF2\u5931\u6548"],
  API_FILE_URL_INVALID: [-2003, "\u8FDC\u7A0B\u6587\u4EF6URL\u975E\u6CD5"],
  API_FILE_EXECEEDS_SIZE: [-2004, "\u8FDC\u7A0B\u6587\u4EF6\u8D85\u51FA\u5927\u5C0F"],
  API_CHAT_STREAM_PUSHING: [-2005, "\u5DF2\u6709\u5BF9\u8BDD\u6D41\u6B63\u5728\u8F93\u51FA"],
  API_CONTENT_FILTERED: [-2006, "\u5185\u5BB9\u7531\u4E8E\u5408\u89C4\u95EE\u9898\u5DF2\u88AB\u963B\u6B62\u751F\u6210"],
  API_IMAGE_GENERATION_FAILED: [-2007, "\u56FE\u50CF\u751F\u6210\u5931\u8D25"],
  API_VIDEO_GENERATION_FAILED: [-2008, "\u89C6\u9891\u751F\u6210\u5931\u8D25"],
  API_IMAGE_GENERATION_INSUFFICIENT_POINTS: [-2009, "Dreamina\u79EF\u5206\u4E0D\u8DB3"]
};

var __defProp$3 = Object.defineProperty;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$3 = (obj, key, value) => __defNormalProp$3(obj, typeof key !== "symbol" ? key + "" : key, value);
class Request {
  constructor(ctx, options = {}) {
    /** 请求方法 */
    __publicField$3(this, "method");
    /** 请求URL */
    __publicField$3(this, "url");
    /** 请求路径 */
    __publicField$3(this, "path");
    /** 请求载荷类型 */
    __publicField$3(this, "type");
    /** 请求headers */
    __publicField$3(this, "headers");
    /** 请求原始查询字符串 */
    __publicField$3(this, "search");
    /** 请求查询参数 */
    __publicField$3(this, "query");
    /** 请求URL参数 */
    __publicField$3(this, "params");
    /** 请求载荷 */
    __publicField$3(this, "body");
    /** 上传的文件 */
    __publicField$3(this, "files");
    /** 客户端IP地址 */
    __publicField$3(this, "remoteIP");
    /** 请求接受时间戳（毫秒） */
    __publicField$3(this, "time");
    const { time } = options;
    this.method = ctx.request.method;
    this.url = ctx.request.url;
    this.path = ctx.request.path;
    this.type = ctx.request.type;
    this.headers = ctx.request.headers || {};
    this.search = ctx.request.search;
    this.query = ctx.query || {};
    this.params = ctx.params || {};
    this.body = ctx.request.body || {};
    this.files = ctx.request.files || {};
    this.remoteIP = this.headers["X-Real-IP"] || this.headers["x-real-ip"] || this.headers["X-Forwarded-For"] || this.headers["x-forwarded-for"] || ctx.ip || null;
    this.time = Number(_$1.defaultTo(time, util.timestamp()));
  }
  validate(key, fn, message) {
    try {
      const value = _$1.get(this, key);
      if (fn) {
        if (fn(value) === false)
          throw `[Mismatch] -> ${fn}`;
      } else if (_$1.isUndefined(value))
        throw "[Undefined]";
    } catch (err) {
      logger.warn(`Params ${key} invalid:`, err);
      throw new APIException(EX$1.API_REQUEST_PARAMS_INVALID, message || `Params ${key} invalid`);
    }
    return this;
  }
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
class Body {
  constructor(options = {}) {
    /** 状态码 */
    __publicField$2(this, "code");
    /** 状态消息 */
    __publicField$2(this, "message");
    /** 载荷 */
    __publicField$2(this, "data");
    /** HTTP状态码 */
    __publicField$2(this, "statusCode");
    const { code, message, data, statusCode } = options;
    this.code = Number(_$1.defaultTo(code, 0));
    this.message = _$1.defaultTo(message, "OK");
    this.data = _$1.defaultTo(data, null);
    this.statusCode = Number(_$1.defaultTo(statusCode, 200));
  }
  toObject() {
    return {
      code: this.code,
      message: this.message,
      data: this.data
    };
  }
  static isInstance(value) {
    return value instanceof Body;
  }
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
let Response$1 = class Response {
  constructor(body, options = {}) {
    /** 响应HTTP状态码 */
    __publicField$1(this, "statusCode");
    /** 响应内容类型 */
    __publicField$1(this, "type");
    /** 响应headers */
    __publicField$1(this, "headers");
    /** 重定向目标 */
    __publicField$1(this, "redirect");
    /** 响应载荷 */
    __publicField$1(this, "body");
    /** 响应载荷大小 */
    __publicField$1(this, "size");
    /** 响应时间戳 */
    __publicField$1(this, "time");
    const { statusCode, type, headers, redirect, size, time } = options;
    this.statusCode = Number(_$1.defaultTo(statusCode, Body.isInstance(body) ? body.statusCode : void 0));
    this.type = type;
    this.headers = headers;
    this.redirect = redirect;
    this.size = size;
    this.time = Number(_$1.defaultTo(time, util.timestamp()));
    this.body = body;
  }
  injectTo(ctx) {
    this.redirect && ctx.redirect(this.redirect);
    this.statusCode && (ctx.status = this.statusCode);
    this.type && (ctx.type = mime.getType(this.type) || this.type);
    const headers = this.headers || {};
    if (this.size && !headers["Content-Length"] && !headers["content-length"])
      headers["Content-Length"] = this.size;
    ctx.set(headers);
    if (Body.isInstance(this.body))
      ctx.body = this.body.toObject();
    else
      ctx.body = this.body;
  }
  static isInstance(value) {
    return value instanceof Response;
  }
};

const EX = {
  SYSTEM_ERROR: [-1e3, "\u7CFB\u7EDF\u5F02\u5E38"]};

class FailureBody extends Body {
  constructor(error, _data) {
    let errcode, errmsg, data = _data, httpStatusCode = HTTP_STATUS_CODES.OK;
    if (_$1.isString(error))
      error = new Exception(EX.SYSTEM_ERROR, error);
    if (error instanceof APIException || error instanceof Exception)
      ({ errcode, errmsg, data, httpStatusCode } = error);
    else if (_$1.isError(error))
      ({ errcode, errmsg, data, httpStatusCode } = new Exception(EX.SYSTEM_ERROR, error.message));
    super({
      code: errcode || -1,
      message: errmsg || "Internal error",
      data,
      statusCode: httpStatusCode
    });
  }
  static isInstance(value) {
    return value instanceof FailureBody;
  }
}

class DreaminaErrorHandler {
  /**
   * 处理Dreamina API响应错误
   */
  static handleApiResponse(response, options = {}) {
    const { ret, errmsg, historyId } = response;
    const { context = "Dreamina API\u8BF7\u6C42", operation = "\u64CD\u4F5C" } = options;
    logger.error(`${context}\u5931\u8D25: ret=${ret}, errmsg=${errmsg}${historyId ? `, historyId=${historyId}` : ""}`);
    switch (ret) {
      case "1015":
        throw new APIException(EX$1.API_TOKEN_EXPIRES, `[\u767B\u5F55\u5931\u6548]: ${errmsg}\u3002\u8BF7\u91CD\u65B0\u83B7\u53D6refresh_token\u5E76\u66F4\u65B0\u914D\u7F6E`);
      case "5000":
        throw new APIException(
          EX$1.API_IMAGE_GENERATION_INSUFFICIENT_POINTS,
          `[\u79EF\u5206\u4E0D\u8DB3]: ${errmsg}\u3002\u5EFA\u8BAE\uFF1A1)\u5C1D\u8BD5\u4F7F\u75281024x1024\u5206\u8FA8\u7387\uFF0C2)\u68C0\u67E5\u662F\u5426\u9700\u8981\u8D2D\u4E70\u79EF\u5206\uFF0C3)\u786E\u8BA4\u8D26\u6237\u72B6\u6001\u6B63\u5E38`
        );
      case "4001":
        throw new APIException(EX$1.API_CONTENT_FILTERED, `[\u5185\u5BB9\u8FDD\u89C4]: ${errmsg}`);
      case "4002":
        throw new APIException(EX$1.API_REQUEST_PARAMS_INVALID, `[\u53C2\u6570\u9519\u8BEF]: ${errmsg}`);
      case "5001":
        throw new APIException(EX$1.API_IMAGE_GENERATION_FAILED, `[\u751F\u6210\u5931\u8D25]: ${errmsg}`);
      case "5002":
        throw new APIException(EX$1.API_VIDEO_GENERATION_FAILED, `[\u89C6\u9891\u751F\u6210\u5931\u8D25]: ${errmsg}`);
      default:
        throw new APIException(EX$1.API_REQUEST_FAILED, `[${operation}\u5931\u8D25]: ${errmsg} (\u9519\u8BEF\u7801: ${ret})`);
    }
  }
  /**
   * 处理网络请求错误
   */
  static handleNetworkError(error, options = {}) {
    var _a, _b;
    const { context = "\u7F51\u7EDC\u8BF7\u6C42", retryCount = 0, maxRetries = 3 } = options;
    logger.error(`${context}\u7F51\u7EDC\u9519\u8BEF (\u5C1D\u8BD5 ${retryCount + 1}/${maxRetries + 1}): ${error.message}`);
    if (error.code === "ECONNABORTED") {
      throw new APIException(EX$1.API_REQUEST_FAILED, `[\u8BF7\u6C42\u8D85\u65F6]: ${context}\u8D85\u65F6\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5`);
    }
    if (error.code === "ENOTFOUND") {
      throw new APIException(EX$1.API_REQUEST_FAILED, `[\u7F51\u7EDC\u9519\u8BEF]: \u65E0\u6CD5\u8FDE\u63A5\u5230Dreamina\u670D\u52A1\u5668\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u8FDE\u63A5`);
    }
    if (((_a = error.response) == null ? void 0 : _a.status) >= 500) {
      throw new APIException(EX$1.API_REQUEST_FAILED, `[\u670D\u52A1\u5668\u9519\u8BEF]: Dreamina\u670D\u52A1\u5668\u6682\u65F6\u4E0D\u53EF\u7528 (${error.response.status})`);
    }
    if (((_b = error.response) == null ? void 0 : _b.status) === 429) {
      throw new APIException(EX$1.API_REQUEST_FAILED, `[\u8BF7\u6C42\u9891\u7387\u9650\u5236]: \u8BF7\u6C42\u8FC7\u4E8E\u9891\u7E41\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5`);
    }
    throw new APIException(EX$1.API_REQUEST_FAILED, `[${context}\u5931\u8D25]: ${error.message}`);
  }
  /**
   * 处理轮询超时错误
   */
  static handlePollingTimeout(pollCount, maxPollCount, elapsedTime, status, itemCount, historyId) {
    const message = `\u8F6E\u8BE2\u8D85\u65F6: \u5DF2\u8F6E\u8BE2 ${pollCount} \u6B21\uFF0C\u8017\u65F6 ${elapsedTime} \u79D2\uFF0C\u6700\u7EC8\u72B6\u6001: ${status}\uFF0C\u56FE\u7247\u6570\u91CF: ${itemCount}`;
    logger.warn(message + (historyId ? `\uFF0C\u5386\u53F2ID: ${historyId}` : ""));
    if (itemCount === 0) {
      throw new APIException(
        EX$1.API_IMAGE_GENERATION_FAILED,
        `\u751F\u6210\u8D85\u65F6\u4E14\u65E0\u7ED3\u679C\uFF0C\u72B6\u6001\u7801: ${status}${historyId ? `\uFF0C\u5386\u53F2ID: ${historyId}` : ""}`
      );
    }
    logger.info(`\u8F6E\u8BE2\u8D85\u65F6\u4F46\u5DF2\u83B7\u5F97 ${itemCount} \u5F20\u56FE\u7247\uFF0C\u5C06\u8FD4\u56DE\u73B0\u6709\u7ED3\u679C`);
  }
  /**
   * 处理生成失败错误
   */
  static handleGenerationFailure(status, failCode, historyId, type = "image") {
    const typeText = type === "image" ? "\u56FE\u50CF" : "\u89C6\u9891";
    const message = `${typeText}\u751F\u6210\u6700\u7EC8\u5931\u8D25: status=${status}, failCode=${failCode}${historyId ? `, historyId=${historyId}` : ""}`;
    logger.error(message);
    const exception = type === "image" ? EX$1.API_IMAGE_GENERATION_FAILED : EX$1.API_VIDEO_GENERATION_FAILED;
    throw new APIException(exception, `${typeText}\u751F\u6210\u5931\u8D25\uFF0C\u72B6\u6001\u7801: ${status}${failCode ? `\uFF0C\u9519\u8BEF\u7801: ${failCode}` : ""}`);
  }
  /**
   * 包装重试逻辑的错误处理
   */
  static async withRetry(operation, options = {}) {
    const {
      maxRetries = 3,
      retryDelay = 5e3,
      context = "\u64CD\u4F5C",
      operation: operationName = "\u8BF7\u6C42"
    } = options;
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (error instanceof APIException) {
          throw error;
        }
        if (attempt < maxRetries) {
          logger.warn(`${context}\u5931\u8D25 (\u5C1D\u8BD5 ${attempt + 1}/${maxRetries + 1}): ${error.message}`);
          logger.info(`${retryDelay / 1e3}\u79D2\u540E\u91CD\u8BD5...`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    }
    this.handleNetworkError(lastError, {
      context,
      retryCount: maxRetries,
      maxRetries,
      operation: operationName
    });
  }
}
const handlePollingTimeout = DreaminaErrorHandler.handlePollingTimeout;
const handleGenerationFailure = DreaminaErrorHandler.handleGenerationFailure;

const DEFAULT_ASSISTANT_ID = "513641";
const PLATFORM_CODE = "7";
const VERSION_CODE = "8.4.0";
const APP_SDK_VERSION = "48.0.0";
const WEB_VERSION = "7.5.0";
const DA_VERSION = "3.3.7";
const DRAFT_VERSION = "3.3.7";
const STATUS_CODE_MAP = {
  20: "PROCESSING",
  10: "SUCCESS",
  30: "FAILED",
  42: "POST_PROCESSING",
  45: "FINALIZING",
  50: "COMPLETED"
};
const RETRY_CONFIG = {
  MAX_RETRY_COUNT: 3,
  RETRY_DELAY: 5e3
};
const POLLING_CONFIG = {
  MAX_POLL_COUNT: 900,
  // 15分钟
  POLL_INTERVAL: 1e3,
  // 1秒
  STABLE_ROUNDS: 5,
  // 稳定轮次
  TIMEOUT_SECONDS: 900
  // 15分钟超时
};
const ASPECT_RATIOS = {
  "1:1": { width: 2048, height: 2048, ratio: 1 },
  "4:3": { width: 2304, height: 1728, ratio: 4 },
  "3:4": { width: 1728, height: 2304, ratio: 2 },
  "16:9": { width: 2560, height: 1440, ratio: 3 },
  "9:16": { width: 1440, height: 2560, ratio: 5 },
  "3:2": { width: 2496, height: 1664, ratio: 7 },
  "2:3": { width: 1664, height: 2496, ratio: 6 },
  "21:9": { width: 3024, height: 1296, ratio: 8 }
};

function normalizeProxyUrl(url) {
  if (!url) return void 0;
  const t = url.trim();
  return t.length > 0 ? t : void 0;
}
function buildProxyAgents(proxyUrl) {
  const url = normalizeProxyUrl(proxyUrl);
  if (!url) return void 0;
  if (url.startsWith("socks4://") || url.startsWith("socks5://") || url.startsWith("socks://")) {
    const agent2 = new SocksProxyAgent(url);
    return { httpAgent: agent2, httpsAgent: agent2 };
  }
  const agent = new HttpsProxyAgent(url);
  return { httpAgent: agent, httpsAgent: agent };
}
function withProxyConfig(config, proxyUrl) {
  const agents = buildProxyAgents(proxyUrl);
  if (!agents) return config;
  return { ...config, ...agents, proxy: false };
}

const KEYS = {
  GLOBAL_PROXY: "global_proxy_url",
  CREDIT_PROXY: "credit_refresh_proxy_url",
  POOL_API_KEY: "pool_api_key"
};
function now$1() {
  return Math.floor(Date.now() / 1e3);
}
function getSetting(key) {
  var _a;
  const row = getDb().prepare("SELECT value FROM app_settings WHERE key = ?").get(key);
  return (_a = row == null ? void 0 : row.value) != null ? _a : "";
}
function setSetting(key, value) {
  getDb().prepare(
    `INSERT INTO app_settings(key, value, updated_at) VALUES(?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
  ).run(key, value, now$1());
}
function getGlobalProxyUrl() {
  const v = getSetting(KEYS.GLOBAL_PROXY);
  return v || process.env.DREAMINE_GLOBAL_PROXY || void 0;
}
function getCreditRefreshProxyUrl() {
  const v = getSetting(KEYS.CREDIT_PROXY);
  return v || process.env.DREAMINE_CREDIT_PROXY || void 0;
}
function setGlobalProxyUrl(url) {
  setSetting(KEYS.GLOBAL_PROXY, url.trim());
}
function setCreditRefreshProxyUrl(url) {
  setSetting(KEYS.CREDIT_PROXY, url.trim());
}
function getPoolApiKey() {
  return getSetting(KEYS.POOL_API_KEY) || process.env.DREAMINE_POOL_API_KEY || "";
}
function setPoolApiKey(key) {
  setSetting(KEYS.POOL_API_KEY, key.trim());
}
function getProxySettings() {
  return {
    global_proxy_url: getGlobalProxyUrl() || "",
    credit_refresh_proxy_url: getCreditRefreshProxyUrl() || "",
    pool_api_key_set: !!getPoolApiKey(),
    db_path: process.env.DREAMINE_DB_PATH || ""
  };
}
function resolveApiProxy(accountProxy) {
  return (accountProxy == null ? void 0 : accountProxy.trim()) || getGlobalProxyUrl();
}
function resolveCreditProxy(accountProxy) {
  return getCreditRefreshProxyUrl() || (accountProxy == null ? void 0 : accountProxy.trim()) || getGlobalProxyUrl();
}

const DEVICE_ID = Math.floor(Math.random() * 1e18) + 7e18;
const USER_ID = util.uuid(false);
const API_BASE_URL = "https://dreamina-api.us.capcut.com";
const COMMERCE_API_URL = "https://commerce.us.capcut.com";
const SUBSCRIPTION_API_URL = "https://commerce-api-sg.capcut.com";
const FAKE_HEADERS = {
  "Accept": "application/json, text/plain, */*",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Accept-Language": "zh-CN,zh;q=0.9",
  "Cache-Control": "no-cache",
  "Content-Type": "application/json",
  "App-Sdk-Version": APP_SDK_VERSION,
  "Appid": DEFAULT_ASSISTANT_ID,
  "Appvr": VERSION_CODE,
  "Origin": "https://dreamina.capcut.com",
  "Pragma": "no-cache",
  "Priority": "u=1, i",
  "Referer": "https://dreamina.capcut.com/",
  "Pf": PLATFORM_CODE,
  "Lan": "en",
  "Loc": "US",
  "Store-Country-Code": "us",
  "Store-Country-Code-Src": "uid",
  "Sec-Ch-Ua": '"Not(A:Brand";v="8", "Chromium";v="144", "Microsoft Edge";v="144"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"macOS"',
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-site",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36"
};
async function acquireToken(refreshToken) {
  return refreshToken;
}
function generateCookie(refreshToken) {
  const timestamp = util.unixTimestamp();
  return [
    `store-idc=useast5`,
    `store-country-code=us`,
    `store-country-code-src=uid`,
    `cc-target-idc=useast5`,
    `sid_guard=${refreshToken}%7C${timestamp}%7C5184000%7CWed%2C+25-Mar-2026+12%3A16%3A01+GMT`,
    `uid_tt=${USER_ID}`,
    `uid_tt_ss=${USER_ID}`,
    `sid_tt=${refreshToken}`,
    `sessionid=${refreshToken}`,
    `sessionid_ss=${refreshToken}`
  ].join("; ");
}
async function getCredit(refreshToken, proxyOpts = {}) {
  try {
    const result = await requestCommerce("POST", "/commerce/v1/benefits/user_credit_history", refreshToken, {
      data: {
        count: 20,
        cursor: "0"
      }
    }, proxyOpts);
    if (!result || typeof result !== "object") {
      logger.warn(`\u79EF\u5206\u67E5\u8BE2\u8FD4\u56DE\u5F02\u5E38\u683C\u5F0F: ${typeof result}`);
      return { giftCredit: 999, purchaseCredit: 0, vipCredit: 0, totalCredit: 999 };
    }
    const totalCredit = result.total_credit || 0;
    logger.info(`
\u79EF\u5206\u4FE1\u606F: \u603B\u79EF\u5206: ${totalCredit}`);
    return {
      giftCredit: totalCredit,
      purchaseCredit: 0,
      vipCredit: 0,
      totalCredit
    };
  } catch (error) {
    logger.warn(`\u83B7\u53D6\u79EF\u5206\u5931\u8D25: ${error.message}\uFF0C\u8DF3\u8FC7\u79EF\u5206\u68C0\u67E5`);
    return { giftCredit: 999, purchaseCredit: 0, vipCredit: 0, totalCredit: 999 };
  }
}
async function receiveCredit(refreshToken) {
  logger.info("\u6D77\u5916\u7AD9\u6682\u4E0D\u652F\u6301\u81EA\u52A8\u6536\u53D6\u79EF\u5206\uFF0C\u8DF3\u8FC7");
  return 0;
}
async function requestCommerce(method, uri, refreshToken, options = {}, proxyOpts = {}) {
  const token = await acquireToken(refreshToken);
  const deviceTime = util.unixTimestamp();
  const sign = util.md5(
    `9e2c|${uri.slice(-7)}|${PLATFORM_CODE}|${VERSION_CODE}|${deviceTime}||11ac`
  );
  const fullUrl = `${COMMERCE_API_URL}${uri}`;
  const headers = {
    ...FAKE_HEADERS,
    Cookie: generateCookie(token),
    "Device-Time": deviceTime.toString(),
    "Sign": sign,
    "Sign-Ver": "1",
    "Tdid": "",
    ...options.headers || {}
  };
  logger.info(`\u53D1\u9001\u79EF\u5206\u8BF7\u6C42: ${method.toUpperCase()} ${fullUrl}`);
  const proxyUrl = resolveCreditProxy(proxyOpts.proxyUrl);
  try {
    const response = await axios.request(
      withProxyConfig(
        {
          method,
          url: fullUrl,
          headers,
          timeout: 3e4,
          validateStatus: () => true,
          ..._$1.omit(options, "headers")
        },
        proxyUrl
      )
    );
    if (response.status >= 400) {
      throw new Error(`HTTP\u9519\u8BEF: ${response.status}`);
    }
    const { ret, data } = response.data;
    if (ret === "0" || ret === 0) {
      return data;
    }
    throw new Error(`API\u9519\u8BEF: ${response.data.errmsg || "\u672A\u77E5\u9519\u8BEF"}`);
  } catch (error) {
    logger.error(`\u79EF\u5206API\u8BF7\u6C42\u5931\u8D25: ${error.message}`);
    throw error;
  }
}
async function request(method, uri, refreshToken, options = {}) {
  const { proxyUrl, ...axiosOpts } = options;
  const token = await acquireToken(refreshToken);
  const deviceTime = util.unixTimestamp();
  const sign = util.md5(
    `9e2c|${uri.slice(-7)}|${PLATFORM_CODE}|${VERSION_CODE}|${deviceTime}||11ac`
  );
  const fullUrl = `${API_BASE_URL}${uri}`;
  const requestParams = {
    aid: DEFAULT_ASSISTANT_ID,
    device_platform: "web",
    region: "US",
    da_version: DA_VERSION,
    os: "mac",
    web_component_open_flag: 1,
    web_version: WEB_VERSION,
    aigc_features: "app_lip_sync",
    ...axiosOpts.params || {}
  };
  const headers = {
    ...FAKE_HEADERS,
    Cookie: generateCookie(token),
    "Device-Time": deviceTime.toString(),
    "Did": DEVICE_ID.toString(),
    "Sign": sign,
    "Sign-Ver": "1",
    "Tdid": "",
    ...axiosOpts.headers || {}
  };
  logger.info(`\u53D1\u9001\u8BF7\u6C42: ${method.toUpperCase()} ${fullUrl}`);
  logger.info(`\u8BF7\u6C42\u53C2\u6570: ${JSON.stringify(requestParams)}`);
  logger.info(`\u8BF7\u6C42\u6570\u636E: ${JSON.stringify(axiosOpts.data || {})}`);
  let retries = 0;
  const maxRetries = RETRY_CONFIG.MAX_RETRY_COUNT;
  let lastError = null;
  while (retries <= maxRetries) {
    try {
      if (retries > 0) {
        logger.info(`\u7B2C ${retries} \u6B21\u91CD\u8BD5\u8BF7\u6C42: ${method.toUpperCase()} ${fullUrl}`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_CONFIG.RETRY_DELAY));
      }
      const response = await axios.request(
        withProxyConfig(
          {
            method,
            url: fullUrl,
            params: requestParams,
            headers,
            timeout: 45e3,
            validateStatus: () => true,
            ..._$1.omit(axiosOpts, "params", "headers")
          },
          resolveApiProxy(proxyUrl)
        )
      );
      logger.info(`\u54CD\u5E94\u72B6\u6001: ${response.status} ${response.statusText}`);
      if (axiosOpts.responseType == "stream") return response;
      const responseDataSummary = JSON.stringify(response.data).substring(0, 500) + (JSON.stringify(response.data).length > 500 ? "..." : "");
      logger.info(`\u54CD\u5E94\u6570\u636E\u6458\u8981: ${responseDataSummary}`);
      if (response.status >= 400) {
        logger.warn(`HTTP\u9519\u8BEF: ${response.status} ${response.statusText}`);
        if (retries < maxRetries) {
          retries++;
          continue;
        }
      }
      return checkResult(response);
    } catch (error) {
      lastError = error;
      logger.error(`\u8BF7\u6C42\u5931\u8D25 (\u5C1D\u8BD5 ${retries + 1}/${maxRetries + 1}): ${error.message}`);
      if ((error.code === "ECONNABORTED" || error.code === "ETIMEDOUT" || error.message.includes("timeout") || error.message.includes("network")) && retries < maxRetries) {
        retries++;
        continue;
      }
      break;
    }
  }
  if (lastError) {
    logger.error(`\u8BF7\u6C42\u5931\u8D25\uFF0C\u5DF2\u91CD\u8BD5 ${retries} \u6B21: ${lastError.message}`);
    if (lastError.response) {
      logger.error(`\u54CD\u5E94\u72B6\u6001: ${lastError.response.status}`);
      logger.error(`\u54CD\u5E94\u6570\u636E: ${JSON.stringify(lastError.response.data)}`);
    }
    throw lastError;
  } else {
    const error = new Error(`\u8BF7\u6C42\u5931\u8D25\uFF0C\u5DF2\u91CD\u8BD5 ${retries} \u6B21\uFF0C\u4F46\u6CA1\u6709\u5177\u4F53\u9519\u8BEF\u4FE1\u606F`);
    logger.error(error.message);
    throw error;
  }
}
function checkResult(result) {
  const { ret, errmsg, data } = result.data;
  if (!_$1.isFinite(Number(ret))) return result.data;
  if (ret === "0") return data;
  DreaminaErrorHandler.handleApiResponse(result.data, {
    context: "Dreamina API\u8BF7\u6C42",
    operation: "\u8BF7\u6C42"
  });
}
function tokenSplit(authorization) {
  return authorization.replace("Bearer ", "").split(",");
}
async function getTokenLiveStatus(refreshToken, proxyOpts = {}) {
  try {
    const info = await getAccountInfo(refreshToken, proxyOpts);
    return !!(info == null ? void 0 : info.user_id);
  } catch (err) {
    return false;
  }
}
async function getAccountInfo(refreshToken, proxyOpts = {}) {
  const result = await request(
    "POST",
    "/passport/account/info/v2",
    refreshToken,
    {
      params: {
        account_sdk_source: "web"
      },
      proxyUrl: proxyOpts.proxyUrl
    }
  );
  return result;
}
async function getSubscriptionInfo(refreshToken, proxyOpts = {}) {
  const token = await acquireToken(refreshToken);
  const deviceTime = util.unixTimestamp();
  const uri = "/commerce/v1/subscription/user_info";
  const sign = util.md5(
    `9e2c|${uri.slice(-7)}|${PLATFORM_CODE}|${VERSION_CODE}|${deviceTime}||11ac`
  );
  const fullUrl = `${SUBSCRIPTION_API_URL}${uri}`;
  const headers = {
    ...FAKE_HEADERS,
    Cookie: generateCookie(token),
    "Device-Time": deviceTime.toString(),
    "Sign": sign,
    "Sign-Ver": "1",
    "Tdid": "",
    "Appid": "348188",
    "Appvr": "12.4.0"
  };
  logger.info(`\u53D1\u9001\u8BA2\u9605\u67E5\u8BE2\u8BF7\u6C42: POST ${fullUrl}`);
  const proxyUrl = resolveCreditProxy(proxyOpts.proxyUrl);
  const response = await axios.request(
    withProxyConfig(
      {
        method: "POST",
        url: fullUrl,
        headers,
        data: { aid: "348188", scene: "vip" },
        timeout: 3e4,
        validateStatus: () => true
      },
      proxyUrl
    )
  );
  if (response.status >= 400) {
    throw new Error(`HTTP\u9519\u8BEF: ${response.status}`);
  }
  const { ret, data, errmsg } = response.data;
  if (ret === "0" || ret === 0) {
    return data;
  }
  throw new Error(`\u8BA2\u9605\u67E5\u8BE2\u5931\u8D25: ${errmsg || ret}`);
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class SmartPoller {
  constructor(options = {}) {
    __publicField(this, "pollCount", 0);
    __publicField(this, "startTime", Date.now());
    __publicField(this, "lastItemCount", 0);
    __publicField(this, "stableItemCountRounds", 0);
    __publicField(this, "options");
    var _a, _b, _c, _d, _e, _f;
    this.options = {
      maxPollCount: (_a = options.maxPollCount) != null ? _a : POLLING_CONFIG.MAX_POLL_COUNT,
      pollInterval: (_b = options.pollInterval) != null ? _b : POLLING_CONFIG.POLL_INTERVAL,
      stableRounds: (_c = options.stableRounds) != null ? _c : POLLING_CONFIG.STABLE_ROUNDS,
      timeoutSeconds: (_d = options.timeoutSeconds) != null ? _d : POLLING_CONFIG.TIMEOUT_SECONDS,
      expectedItemCount: (_e = options.expectedItemCount) != null ? _e : 4,
      type: (_f = options.type) != null ? _f : "image"
    };
  }
  /**
   * 获取状态名称
   */
  getStatusName(status) {
    return STATUS_CODE_MAP[status] || `UNKNOWN(${status})`;
  }
  /**
   * 根据状态码计算智能轮询间隔
   */
  getSmartInterval(status, itemCount) {
    const baseInterval = this.options.pollInterval;
    switch (status) {
      case 20:
        return baseInterval;
      case 42:
        return baseInterval * 1.2;
      case 45:
        return baseInterval * 1.5;
      case 50:
        return baseInterval * 0.5;
      case 10:
        return 0;
      case 30:
        return 0;
      default:
        return baseInterval;
    }
  }
  /**
   * 检查是否应该退出轮询
   */
  shouldExitPolling(pollingStatus) {
    const { status, itemCount } = pollingStatus;
    const elapsedTime = Math.round((Date.now() - this.startTime) / 1e3);
    if (itemCount === this.lastItemCount) {
      this.stableItemCountRounds++;
    } else {
      this.stableItemCountRounds = 0;
      this.lastItemCount = itemCount;
    }
    if (status === 10 || status === 50) {
      return { shouldExit: true, reason: "\u4EFB\u52A1\u6210\u529F\u5B8C\u6210" };
    }
    if (status === 30) {
      return { shouldExit: true, reason: "\u4EFB\u52A1\u5931\u8D25" };
    }
    if (itemCount >= this.options.expectedItemCount) {
      return { shouldExit: true, reason: `\u5DF2\u83B7\u5F97\u5B8C\u6574\u7ED3\u679C\u96C6(${itemCount}/${this.options.expectedItemCount})` };
    }
    if (this.stableItemCountRounds >= this.options.stableRounds && itemCount > 0) {
      return { shouldExit: true, reason: `\u7ED3\u679C\u6570\u91CF\u7A33\u5B9A(${this.stableItemCountRounds}\u8F6E)` };
    }
    if (this.pollCount >= this.options.maxPollCount) {
      return { shouldExit: true, reason: "\u8F6E\u8BE2\u6B21\u6570\u8D85\u9650" };
    }
    if (elapsedTime >= this.options.timeoutSeconds && itemCount > 0) {
      return { shouldExit: true, reason: "\u65F6\u95F4\u8D85\u9650\u4F46\u5DF2\u6709\u7ED3\u679C" };
    }
    return { shouldExit: false, reason: "" };
  }
  /**
   * 执行单次轮询检查
   */
  async poll(pollFunction, historyId) {
    logger.info(`\u5F00\u59CB\u667A\u80FD\u8F6E\u8BE2: historyId=${historyId || "N/A"}, \u6700\u5927\u8F6E\u8BE2\u6B21\u6570=${this.options.maxPollCount}, \u671F\u671B\u7ED3\u679C\u6570=${this.options.expectedItemCount}`);
    let lastData;
    let lastStatus = { status: 20, itemCount: 0 };
    while (true) {
      this.pollCount++;
      const elapsedTime = Math.round((Date.now() - this.startTime) / 1e3);
      try {
        const { status, data } = await pollFunction();
        lastStatus = status;
        lastData = data;
        logger.info(`\u8F6E\u8BE2 ${this.pollCount}/${this.options.maxPollCount}: status=${status.status}(${this.getStatusName(status.status)}), failCode=${status.failCode || "none"}, items=${status.itemCount}, elapsed=${elapsedTime}s, finish_time=${status.finishTime || 0}, stable=${this.stableItemCountRounds}/${this.options.stableRounds}`);
        if (status.itemCount > 0) {
          logger.info(`\u68C0\u6D4B\u5230${this.options.type === "image" ? "\u56FE\u7247" : "\u89C6\u9891"}\u751F\u6210: \u6570\u91CF=${status.itemCount}, \u72B6\u6001=${this.getStatusName(status.status)}`);
        }
        const { shouldExit, reason } = this.shouldExitPolling(status);
        if (shouldExit) {
          logger.info(`\u9000\u51FA\u8F6E\u8BE2: ${reason}, \u6700\u7EC8${this.options.type === "image" ? "\u56FE\u7247" : "\u89C6\u9891"}\u6570\u91CF=${status.itemCount}`);
          if (status.status === 30) {
            handleGenerationFailure(status.status, status.failCode, historyId, this.options.type);
          }
          if (reason === "\u8F6E\u8BE2\u6B21\u6570\u8D85\u9650" || reason === "\u65F6\u95F4\u8D85\u9650\u4F46\u5DF2\u6709\u7ED3\u679C") {
            handlePollingTimeout(
              this.pollCount,
              this.options.maxPollCount,
              elapsedTime,
              status.status,
              status.itemCount,
              historyId
            );
          }
          break;
        }
        if (![20, 42, 45, 10, 30, 50].includes(status.status)) {
          logger.warn(`\u68C0\u6D4B\u5230\u672A\u77E5\u72B6\u6001\u7801 ${status.status}(${this.getStatusName(status.status)})\uFF0C\u7EE7\u7EED\u8F6E\u8BE2\u7B49\u5F85\u751F\u6210...`);
        }
        if (this.pollCount % 30 === 0) {
          logger.info(`${this.options.type === "image" ? "\u56FE\u50CF" : "\u89C6\u9891"}\u751F\u6210\u8FDB\u5EA6: \u7B2C ${this.pollCount} \u6B21\u8F6E\u8BE2\uFF0C\u72B6\u6001: ${this.getStatusName(status.status)}\uFF0C\u5DF2\u7B49\u5F85 ${elapsedTime} \u79D2...`);
        }
        const nextInterval = this.getSmartInterval(status.status, status.itemCount);
        if (nextInterval > 0) {
          await new Promise((resolve) => setTimeout(resolve, nextInterval));
        }
      } catch (error) {
        logger.error(`\u8F6E\u8BE2\u8FC7\u7A0B\u4E2D\u53D1\u751F\u9519\u8BEF: ${error.message}`);
        throw error;
      }
    }
    const finalElapsedTime = Math.round((Date.now() - this.startTime) / 1e3);
    const result = {
      status: lastStatus.status,
      failCode: lastStatus.failCode,
      itemCount: lastStatus.itemCount,
      elapsedTime: finalElapsedTime,
      pollCount: this.pollCount,
      exitReason: this.shouldExitPolling(lastStatus).reason
    };
    logger.info(`${this.options.type === "image" ? "\u56FE\u50CF" : "\u89C6\u9891"}\u751F\u6210\u5B8C\u6210: \u6210\u529F\u751F\u6210 ${lastStatus.itemCount} \u4E2A\u7ED3\u679C\uFF0C\u603B\u8017\u65F6 ${finalElapsedTime} \u79D2\uFF0C\u6700\u7EC8\u72B6\u6001: ${this.getStatusName(lastStatus.status)}`);
    return { result, data: lastData };
  }
}

const MODEL_CATALOG = [
  { public_id: "gpt-image-2", model_req_key: "dreamina_lib_img_20260423", model_type: "image", model_name: "GPT Image 2" },
  { public_id: "seedream-5.0-lite", model_req_key: "high_aes_general_v50", model_type: "image", model_name: "Seedream 5.0 Lite" },
  { public_id: "seedream-4.7", model_req_key: "high_aes_general_v43", model_type: "image", model_name: "Seedream 4.7" },
  { public_id: "seedream-4.6", model_req_key: "high_aes_general_v42", model_type: "image", model_name: "Seedream 4.6" },
  { public_id: "seedream-4.5", model_req_key: "high_aes_general_v40l", model_type: "image", model_name: "Seedream 4.5" },
  { public_id: "seedream-4.1", model_req_key: "high_aes_general_v41", model_type: "image", model_name: "Seedream 4.1" },
  { public_id: "seedream-4.0", model_req_key: "high_aes_general_v40", model_type: "image", model_name: "Seedream 4.0" },
  { public_id: "nano-banana", model_req_key: "external_model_gemini_flash_image_v25", model_type: "image", model_name: "Nano Banana" },
  { public_id: "seedream-3.1", model_req_key: "high_aes_general_v30l_art:general_v3.0_18b", model_type: "image", model_name: "Seedream 3.1" },
  { public_id: "seedream-3.0", model_req_key: "high_aes_general_v30l:general_v3.0_18b", model_type: "image", model_name: "Seedream 3.0" },
  { public_id: "seedance-2.0-mini", model_req_key: "dreamina_seedance_40_mini", model_type: "video", model_name: "Seedance 2.0 Mini" },
  { public_id: "seedance-2.0-fast", model_req_key: "dreamina_seedance_40", model_type: "video", model_name: "Seedance 2.0 Fast" },
  { public_id: "seedance-2.0", model_req_key: "dreamina_seedance_40_pro", model_type: "video", model_name: "Seedance 2.0" },
  { public_id: "seedance-1.5-pro", model_req_key: "dreamina_ic_generate_video_model_vgfm_3.5_pro", model_type: "video", model_name: "Seedance 1.5 Pro" },
  { public_id: "seedance-1.0-fast", model_req_key: "dreamina_ic_generate_video_model_vgfm_3.0_fast", model_type: "video", model_name: "Seedance 1.0 Fast" },
  { public_id: "seedance-1.0", model_req_key: "dreamina_ic_generate_video_model_vgfm_3.0", model_type: "video", model_name: "Seedance 1.0" },
  { public_id: "seedance-1.0-pro", model_req_key: "dreamina_ic_generate_video_model_vgfm_3.0_pro", model_type: "video", model_name: "Seedance 1.0 Pro" },
  { public_id: "sora2", model_req_key: "dreamina_sora2_generate_video", model_type: "video", model_name: "Sora 2" },
  { public_id: "veo-3.1", model_req_key: "dreamina_veo3.1_generate_video", model_type: "video", model_name: "Veo 3.1" },
  { public_id: "veo-3", model_req_key: "dreamina_veo3_generate_video", model_type: "video", model_name: "Veo 3" }
];
const byPublic = new Map(MODEL_CATALOG.map((e) => [e.public_id, e]));
const byReqKey = new Map(MODEL_CATALOG.map((e) => [e.model_req_key, e]));
function resolveModelReqKey(model) {
  if (!model) return void 0;
  const t = model.trim();
  if (!t) return void 0;
  if (byPublic.has(t)) return byPublic.get(t).model_req_key;
  if (byReqKey.has(t)) return t;
  return t;
}

function createSignature$1(method, url, headers, accessKeyId, secretAccessKey, sessionToken, payload = "") {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname || "/";
  const search = urlObj.search;
  const timestamp = headers["x-amz-date"];
  const date = timestamp.substr(0, 8);
  const region = "us-east-1";
  const service = "imagex";
  const queryParams = [];
  const searchParams = new URLSearchParams(search);
  searchParams.forEach((value, key) => {
    queryParams.push([key, value]);
  });
  queryParams.sort(([a], [b]) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });
  const canonicalQueryString = queryParams.map(([key, value]) => `${key}=${value}`).join("&");
  const headersToSign = {
    "x-amz-date": timestamp
  };
  if (sessionToken) {
    headersToSign["x-amz-security-token"] = sessionToken;
  }
  let payloadHash = crypto.createHash("sha256").update("").digest("hex");
  if (method.toUpperCase() === "POST" && payload) {
    payloadHash = crypto.createHash("sha256").update(payload, "utf8").digest("hex");
    headersToSign["x-amz-content-sha256"] = payloadHash;
  }
  const signedHeaders = Object.keys(headersToSign).map((key) => key.toLowerCase()).sort().join(";");
  const canonicalHeaders = Object.keys(headersToSign).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())).map((key) => `${key.toLowerCase()}:${headersToSign[key].trim()}
`).join("");
  const canonicalRequest = [
    method.toUpperCase(),
    pathname,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join("\n");
  const credentialScope = `${date}/${region}/${service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    timestamp,
    credentialScope,
    crypto.createHash("sha256").update(canonicalRequest, "utf8").digest("hex")
  ].join("\n");
  const kDate = crypto.createHmac("sha256", `AWS4${secretAccessKey}`).update(date).digest();
  const kRegion = crypto.createHmac("sha256", kDate).update(region).digest();
  const kService = crypto.createHmac("sha256", kRegion).update(service).digest();
  const kSigning = crypto.createHmac("sha256", kService).update("aws4_request").digest();
  const signature = crypto.createHmac("sha256", kSigning).update(stringToSign).digest("hex");
  return `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
}

const DEFAULT_MODEL$1 = "seedream-4.5";
function getImageRatio(width, height) {
  const aspectRatio = width / height;
  if (Math.abs(aspectRatio - 1) < 0.1) return 1;
  if (Math.abs(aspectRatio - 4 / 3) < 0.1) return 4;
  if (Math.abs(aspectRatio - 3 / 4) < 0.1) return 2;
  if (Math.abs(aspectRatio - 16 / 9) < 0.1) return 3;
  if (Math.abs(aspectRatio - 9 / 16) < 0.1) return 5;
  if (Math.abs(aspectRatio - 3 / 2) < 0.1) return 7;
  if (Math.abs(aspectRatio - 2 / 3) < 0.1) return 6;
  if (Math.abs(aspectRatio - 21 / 9) < 0.1) return 8;
  return 1;
}
function getModel$1(model) {
  const resolved = resolveModelReqKey(model || DEFAULT_MODEL$1);
  return resolved || DEFAULT_MODEL$1;
}
function calculateCRC32$1(buffer) {
  const crcTable = [];
  for (let i = 0; i < 256; i++) {
    let crc2 = i;
    for (let j = 0; j < 8; j++) {
      crc2 = crc2 & 1 ? 3988292384 ^ crc2 >>> 1 : crc2 >>> 1;
    }
    crcTable[i] = crc2;
  }
  let crc = 0 ^ -1;
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
    crc = crc >>> 8 ^ crcTable[(crc ^ bytes[i]) & 255];
  }
  return ((crc ^ -1) >>> 0).toString(16).padStart(8, "0");
}
function getUploadFilename$1(imageUrl, contentType, prefix = "dreamina-image") {
  var _a;
  let extension = "";
  try {
    extension = util.extractURLExtension(imageUrl);
  } catch {
    extension = "";
  }
  if (!extension && contentType) {
    const normalizedContentType = (_a = contentType.split(";")[0]) == null ? void 0 : _a.trim();
    extension = normalizedContentType ? util.mimeToExtension(normalizedContentType) || "" : "";
  }
  extension = extension.replace(/[^a-z0-9]/gi, "").toLowerCase() || "bin";
  return `${prefix}.${extension}`;
}
async function uploadImageFromUrl(imageUrl, refreshToken) {
  var _a, _b, _c, _d, _e, _f;
  try {
    logger.info(`\u5F00\u59CB\u4E0A\u4F20\u56FE\u7247: ${imageUrl}`);
    const tokenResult = await request("post", "/mweb/v1/get_upload_token", refreshToken, {
      data: {
        scene: 2
        // AIGC 图片上传场景
      }
    });
    const { access_key_id, secret_access_key, session_token, service_id } = tokenResult;
    if (!access_key_id || !secret_access_key || !session_token) {
      throw new Error("\u83B7\u53D6\u4E0A\u4F20\u4EE4\u724C\u5931\u8D25");
    }
    const actualServiceId = service_id || "tb4s082cfz";
    logger.info(`\u83B7\u53D6\u4E0A\u4F20\u4EE4\u724C\u6210\u529F: service_id=${actualServiceId}`);
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`\u4E0B\u8F7D\u56FE\u7247\u5931\u8D25: ${imageResponse.status}`);
    }
    const imageBuffer = await imageResponse.arrayBuffer();
    const fileSize = imageBuffer.byteLength;
    const crc32 = calculateCRC32$1(imageBuffer);
    const uploadFilename = getUploadFilename$1(imageUrl, imageResponse.headers.get("content-type"));
    logger.info(`\u56FE\u7247\u4E0B\u8F7D\u5B8C\u6210: \u5927\u5C0F=${fileSize}\u5B57\u8282, CRC32=${crc32}`);
    const now = /* @__PURE__ */ new Date();
    const timestamp = now.toISOString().replace(/[:\-]/g, "").replace(/\.\d{3}Z$/, "Z");
    const randomStr = Math.random().toString(36).substring(2, 12);
    const applyUrl = `https://imagex.bytedanceapi.com/?Action=ApplyImageUpload&Version=2018-08-01&ServiceId=${actualServiceId}&FileSize=${fileSize}&s=${randomStr}`;
    logger.debug(`\u539F\u59CBURL: ${applyUrl}`);
    const requestHeaders = {
      "x-amz-date": timestamp,
      "x-amz-security-token": session_token
    };
    const authorization = createSignature$1("GET", applyUrl, requestHeaders, access_key_id, secret_access_key, session_token);
    logger.info(`AWS\u7B7E\u540D\u8C03\u8BD5\u4FE1\u606F:
      URL: ${applyUrl}
      AccessKeyId: ${access_key_id}
      SessionToken: ${session_token ? "\u5B58\u5728" : "\u4E0D\u5B58\u5728"}
      Timestamp: ${timestamp}
      Authorization: ${authorization}
    `);
    const applyResponse = await fetch(applyUrl, {
      method: "GET",
      headers: {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "authorization": authorization,
        "origin": "https://dreamina.capcut.com",
        "referer": "https://dreamina.capcut.com/ai-tool/generate",
        "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
        "x-amz-date": timestamp,
        "x-amz-security-token": session_token
      }
    });
    if (!applyResponse.ok) {
      const errorText = await applyResponse.text();
      throw new Error(`\u7533\u8BF7\u4E0A\u4F20\u6743\u9650\u5931\u8D25: ${applyResponse.status} - ${errorText}`);
    }
    const applyResult = await applyResponse.json();
    if ((_a = applyResult == null ? void 0 : applyResult.ResponseMetadata) == null ? void 0 : _a.Error) {
      throw new Error(`\u7533\u8BF7\u4E0A\u4F20\u6743\u9650\u5931\u8D25: ${JSON.stringify(applyResult.ResponseMetadata.Error)}`);
    }
    logger.info(`\u7533\u8BF7\u4E0A\u4F20\u6743\u9650\u6210\u529F`);
    const uploadAddress = (_b = applyResult == null ? void 0 : applyResult.Result) == null ? void 0 : _b.UploadAddress;
    if (!uploadAddress || !uploadAddress.StoreInfos || !uploadAddress.UploadHosts) {
      throw new Error(`\u83B7\u53D6\u4E0A\u4F20\u5730\u5740\u5931\u8D25: ${JSON.stringify(applyResult)}`);
    }
    const storeInfo = uploadAddress.StoreInfos[0];
    const uploadHost = uploadAddress.UploadHosts[0];
    const auth = storeInfo.Auth;
    const uploadUrl = `https://${uploadHost}/upload/v1/${storeInfo.StoreUri}`;
    const imageId = storeInfo.StoreUri.split("/").pop();
    logger.info(`\u51C6\u5907\u4E0A\u4F20\u56FE\u7247: imageId=${imageId}, uploadUrl=${uploadUrl}`);
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Authorization": auth,
        "Connection": "keep-alive",
        "Content-CRC32": crc32,
        "Content-Disposition": `attachment; filename="${uploadFilename}"`,
        "Content-Type": "application/octet-stream",
        "Origin": "https://dreamina.capcut.com",
        "Referer": "https://dreamina.capcut.com/ai-tool/generate",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
        "X-Storage-U": "704135154117550"
      },
      body: imageBuffer
    });
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`\u56FE\u7247\u4E0A\u4F20\u5931\u8D25: ${uploadResponse.status} - ${errorText}`);
    }
    logger.info(`\u56FE\u7247\u6587\u4EF6\u4E0A\u4F20\u6210\u529F`);
    const commitUrl = `https://imagex.bytedanceapi.com/?Action=CommitImageUpload&Version=2018-08-01&ServiceId=${actualServiceId}`;
    const commitTimestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:\-]/g, "").replace(/\.\d{3}Z$/, "Z");
    const commitPayload = JSON.stringify({
      SessionKey: uploadAddress.SessionKey,
      SuccessActionStatus: "200"
    });
    const payloadHash = crypto.createHash("sha256").update(commitPayload, "utf8").digest("hex");
    const commitRequestHeaders = {
      "x-amz-date": commitTimestamp,
      "x-amz-security-token": session_token,
      "x-amz-content-sha256": payloadHash
    };
    const commitAuthorization = createSignature$1("POST", commitUrl, commitRequestHeaders, access_key_id, secret_access_key, session_token, commitPayload);
    const commitResponse = await fetch(commitUrl, {
      method: "POST",
      headers: {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "authorization": commitAuthorization,
        "content-type": "application/json",
        "origin": "https://dreamina.capcut.com",
        "referer": "https://dreamina.capcut.com/ai-tool/generate",
        "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
        "x-amz-date": commitTimestamp,
        "x-amz-security-token": session_token,
        "x-amz-content-sha256": payloadHash
      },
      body: commitPayload
    });
    if (!commitResponse.ok) {
      const errorText = await commitResponse.text();
      throw new Error(`\u63D0\u4EA4\u4E0A\u4F20\u5931\u8D25: ${commitResponse.status} - ${errorText}`);
    }
    const commitResult = await commitResponse.json();
    if ((_c = commitResult == null ? void 0 : commitResult.ResponseMetadata) == null ? void 0 : _c.Error) {
      throw new Error(`\u63D0\u4EA4\u4E0A\u4F20\u5931\u8D25: ${JSON.stringify(commitResult.ResponseMetadata.Error)}`);
    }
    if (!((_d = commitResult == null ? void 0 : commitResult.Result) == null ? void 0 : _d.Results) || commitResult.Result.Results.length === 0) {
      throw new Error(`\u63D0\u4EA4\u4E0A\u4F20\u54CD\u5E94\u7F3A\u5C11\u7ED3\u679C: ${JSON.stringify(commitResult)}`);
    }
    const uploadResult = commitResult.Result.Results[0];
    if (uploadResult.UriStatus !== 2e3) {
      throw new Error(`\u56FE\u7247\u4E0A\u4F20\u72B6\u6001\u5F02\u5E38: UriStatus=${uploadResult.UriStatus}`);
    }
    const fullImageUri = uploadResult.Uri;
    const pluginResult = (_f = (_e = commitResult.Result) == null ? void 0 : _e.PluginResult) == null ? void 0 : _f[0];
    if (pluginResult) {
      logger.info(`\u56FE\u7247\u4E0A\u4F20\u6210\u529F\u8BE6\u60C5:`, {
        imageUri: pluginResult.ImageUri,
        sourceUri: pluginResult.SourceUri,
        size: `${pluginResult.ImageWidth}x${pluginResult.ImageHeight}`,
        format: pluginResult.ImageFormat,
        fileSize: pluginResult.ImageSize,
        md5: pluginResult.ImageMd5
      });
      if (pluginResult.ImageUri) {
        logger.info(`\u56FE\u7247\u4E0A\u4F20\u5B8C\u6210: ${pluginResult.ImageUri}`);
        return pluginResult.ImageUri;
      }
    }
    logger.info(`\u56FE\u7247\u4E0A\u4F20\u5B8C\u6210: ${fullImageUri}`);
    return fullImageUri;
  } catch (error) {
    logger.error(`\u56FE\u7247\u4E0A\u4F20\u5931\u8D25: ${error.message}`);
    throw error;
  }
}
async function generateImageComposition(_model, prompt, imageUrls, {
  width = 2560,
  height = 1440,
  sampleStrength = 0.5,
  negativePrompt = ""
}, refreshToken, proxyOpts = {}) {
  const model = getModel$1(_model);
  const imageCount = imageUrls.length;
  logger.info(`\u4F7F\u7528\u6A21\u578B: ${_model} \u6620\u5C04\u6A21\u578B: ${model} \u56FE\u751F\u56FE\u529F\u80FD ${imageCount}\u5F20\u56FE\u7247 ${width}x${height} \u7CBE\u7EC6\u5EA6: ${sampleStrength}`);
  try {
    const { totalCredit } = await getCredit(refreshToken, proxyOpts);
    if (totalCredit <= 0)
      await receiveCredit(refreshToken);
  } catch (creditError) {
    logger.warn(`\u83B7\u53D6\u79EF\u5206\u5931\u8D25\uFF0C\u7EE7\u7EED\u5C1D\u8BD5\u751F\u6210: ${creditError.message}`);
  }
  const uploadedImageIds = [];
  for (let i = 0; i < imageUrls.length; i++) {
    try {
      const imageId = await uploadImageFromUrl(imageUrls[i], refreshToken);
      uploadedImageIds.push(imageId);
      logger.info(`\u56FE\u7247 ${i + 1}/${imageCount} \u4E0A\u4F20\u6210\u529F: ${imageId}`);
    } catch (error) {
      logger.error(`\u56FE\u7247 ${i + 1}/${imageCount} \u4E0A\u4F20\u5931\u8D25: ${error.message}`);
      throw new APIException(EX$1.API_IMAGE_GENERATION_FAILED, `\u56FE\u7247\u4E0A\u4F20\u5931\u8D25: ${error.message}`);
    }
  }
  logger.info(`\u6240\u6709\u56FE\u7247\u4E0A\u4F20\u5B8C\u6210\uFF0C\u5F00\u59CB\u56FE\u751F\u56FE: ${uploadedImageIds.join(", ")}`);
  const componentId = util.uuid();
  const submitId = util.uuid();
  const { aigc_data } = await request(
    "post",
    "/mweb/v1/aigc_draft/generate",
    refreshToken,
    {
      proxyUrl: proxyOpts.proxyUrl,
      params: {
        babi_param: encodeURIComponent(
          JSON.stringify({
            scenario: "image_video_generation",
            feature_key: "aigc_to_image",
            feature_entrance: "to_image",
            feature_entrance_detail: "to_image-" + model
          })
        )
      },
      data: {
        extend: {
          root_model: model
        },
        submit_id: submitId,
        metrics_extra: JSON.stringify({
          promptSource: "custom",
          generateCount: 1,
          enterFrom: "click",
          generateId: submitId,
          isRegenerate: false
        }),
        draft_content: JSON.stringify({
          type: "draft",
          id: util.uuid(),
          min_version: "3.2.9",
          min_features: [],
          is_from_tsn: true,
          version: "3.2.9",
          main_component_id: componentId,
          component_list: [
            {
              type: "image_base_component",
              id: componentId,
              min_version: "3.0.2",
              aigc_mode: "workbench",
              metadata: {
                type: "",
                id: util.uuid(),
                created_platform: 3,
                created_platform_version: "",
                created_time_in_ms: Date.now().toString(),
                created_did: ""
              },
              generate_type: "blend",
              abilities: {
                type: "",
                id: util.uuid(),
                blend: {
                  type: "",
                  id: util.uuid(),
                  min_version: "3.2.9",
                  min_features: [],
                  core_param: {
                    type: "",
                    id: util.uuid(),
                    model,
                    prompt: `####${prompt}`,
                    sample_strength: sampleStrength,
                    image_ratio: getImageRatio(width, height),
                    large_image_info: {
                      type: "",
                      id: util.uuid(),
                      height,
                      width,
                      resolution_type: width >= 2048 || height >= 2048 ? "2k" : "1k"
                    },
                    intelligent_ratio: false
                  },
                  ability_list: uploadedImageIds.map((imageId) => ({
                    type: "",
                    id: util.uuid(),
                    name: "byte_edit",
                    image_uri_list: [imageId],
                    image_list: [{
                      type: "image",
                      id: util.uuid(),
                      source_from: "upload",
                      platform_type: 1,
                      name: "",
                      image_uri: imageId,
                      width: 0,
                      height: 0,
                      format: "",
                      uri: imageId
                    }],
                    strength: 0.5
                  })),
                  prompt_placeholder_info_list: uploadedImageIds.map((_2, index) => ({
                    type: "",
                    id: util.uuid(),
                    ability_index: index
                  })),
                  postedit_param: {
                    type: "",
                    id: util.uuid(),
                    generate_type: 0
                  }
                }
              }
            }
          ]
        }),
        http_common_info: {
          aid: Number(DEFAULT_ASSISTANT_ID)
        }
      }
    }
  );
  const historyId = aigc_data == null ? void 0 : aigc_data.history_record_id;
  if (!historyId)
    throw new APIException(EX$1.API_IMAGE_GENERATION_FAILED, "\u8BB0\u5F55ID\u4E0D\u5B58\u5728");
  logger.info(`\u56FE\u751F\u56FE\u4EFB\u52A1\u5DF2\u63D0\u4EA4\uFF0Chistory_id: ${historyId}\uFF0C\u7B49\u5F85\u751F\u6210\u5B8C\u6210...`);
  let status = 20, failCode, item_list = [];
  let pollCount = 0;
  const maxPollCount = 600;
  while (pollCount < maxPollCount) {
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    pollCount++;
    if (pollCount % 30 === 0) {
      logger.info(`\u56FE\u751F\u56FE\u8FDB\u5EA6: \u7B2C ${pollCount} \u6B21\u8F6E\u8BE2 (history_id: ${historyId})\uFF0C\u5F53\u524D\u72B6\u6001: ${status}\uFF0C\u5DF2\u751F\u6210: ${item_list.length} \u5F20\u56FE\u7247...`);
    }
    const result = await request("post", "/mweb/v1/get_history_by_ids", refreshToken, {
      data: {
        history_ids: [historyId]
      }
    });
    if (!result[historyId])
      throw new APIException(EX$1.API_IMAGE_GENERATION_FAILED, "\u8BB0\u5F55\u4E0D\u5B58\u5728");
    status = result[historyId].status;
    failCode = result[historyId].fail_code;
    item_list = result[historyId].item_list || [];
    if (status === 30) {
      logger.info(`\u56FE\u751F\u56FE\u5931\u8D25: status=${status}, failCode=${failCode || "none"}`);
      break;
    }
    if (item_list.length > 0) {
      logger.info(`\u56FE\u751F\u56FE\u5B8C\u6210: \u72B6\u6001=${status}, \u5DF2\u751F\u6210 ${item_list.length} \u5F20\u56FE\u7247`);
      break;
    }
    if (status === 10 && item_list.length === 0 && pollCount % 30 === 0) {
      logger.info(`\u56FE\u751F\u56FE\u72B6\u6001\u5DF2\u5B8C\u6210\u4F46\u65E0\u56FE\u7247\u751F\u6210: \u72B6\u6001=${status}, \u7EE7\u7EED\u7B49\u5F85...`);
    }
  }
  if (pollCount >= maxPollCount) {
    logger.warn(`\u56FE\u751F\u56FE\u8D85\u65F6: \u8F6E\u8BE2\u4E86 ${pollCount} \u6B21\uFF0C\u5F53\u524D\u72B6\u6001: ${status}\uFF0C\u5DF2\u751F\u6210\u56FE\u7247\u6570: ${item_list.length}`);
  }
  if (status === 30) {
    if (failCode === "2038")
      throw new APIException(EX$1.API_CONTENT_FILTERED);
    else
      throw new APIException(EX$1.API_IMAGE_GENERATION_FAILED, `\u56FE\u751F\u56FE\u5931\u8D25\uFF0C\u9519\u8BEF\u4EE3\u7801: ${failCode}`);
  }
  const resultImageUrls = item_list.map((item) => {
    var _a, _b, _c, _d;
    if (!((_c = (_b = (_a = item == null ? void 0 : item.image) == null ? void 0 : _a.large_images) == null ? void 0 : _b[0]) == null ? void 0 : _c.image_url))
      return ((_d = item == null ? void 0 : item.common_attr) == null ? void 0 : _d.cover_url) || null;
    return item.image.large_images[0].image_url;
  }).filter((url) => url !== null);
  logger.info(`\u56FE\u751F\u56FE\u7ED3\u679C: \u6210\u529F\u751F\u6210 ${resultImageUrls.length} \u5F20\u56FE\u7247`);
  return resultImageUrls;
}
async function generateImages(_model, prompt, {
  width = 2048,
  height = 2048,
  sampleStrength = 0.5,
  negativePrompt = ""
}, refreshToken, proxyOpts = {}) {
  const model = getModel$1(_model);
  logger.info(`\u4F7F\u7528\u6A21\u578B: ${_model} \u6620\u5C04\u6A21\u578B: ${model} ${width}x${height} \u7CBE\u7EC6\u5EA6: ${sampleStrength} (2K\u5206\u8FA8\u7387)`);
  try {
    const { totalCredit, giftCredit, purchaseCredit, vipCredit } = await getCredit(refreshToken, proxyOpts);
    logger.info(`\u5F53\u524D\u79EF\u5206\u72B6\u6001: \u603B\u8BA1=${totalCredit}, \u8D60\u9001=${giftCredit}, \u8D2D\u4E70=${purchaseCredit}, VIP=${vipCredit}`);
    if (totalCredit <= 0)
      await receiveCredit(refreshToken);
  } catch (creditError) {
    logger.warn(`\u83B7\u53D6\u79EF\u5206\u5931\u8D25\uFF0C\u7EE7\u7EED\u5C1D\u8BD5\u751F\u6210: ${creditError.message}`);
  }
  const componentId = util.uuid();
  const submitId = util.uuid();
  const resolutionType = width >= 2048 || height >= 2048 ? "2k" : "1k";
  const { aigc_data } = await request(
    "post",
    "/mweb/v1/aigc_draft/generate",
    refreshToken,
    {
      proxyUrl: proxyOpts.proxyUrl,
      data: {
        extend: {
          root_model: model
        },
        submit_id: submitId,
        metrics_extra: JSON.stringify({
          promptSource: "custom",
          generateCount: 1,
          enterFrom: "click",
          position: "page_bottom_box",
          sceneOptions: JSON.stringify([{
            type: "image",
            scene: "ImageBasicGenerate",
            modelReqKey: model,
            resolutionType,
            abilityList: [],
            benefitCount: 4,
            reportParams: {
              enterSource: "generate",
              vipSource: "generate",
              extraVipFunctionKey: `${model}-${resolutionType}`,
              useVipFunctionDetailsReporterHoc: true
            }
          }]),
          isBoxSelect: false,
          isCutout: false,
          generateId: submitId,
          isRegenerate: false
        }),
        draft_content: JSON.stringify({
          type: "draft",
          id: util.uuid(),
          min_version: "3.0.2",
          min_features: [],
          is_from_tsn: true,
          version: DRAFT_VERSION,
          main_component_id: componentId,
          component_list: [
            {
              type: "image_base_component",
              id: componentId,
              min_version: "3.0.2",
              aigc_mode: "workbench",
              metadata: {
                type: "",
                id: util.uuid(),
                created_platform: 3,
                created_platform_version: "",
                created_time_in_ms: Date.now().toString(),
                created_did: ""
              },
              generate_type: "generate",
              abilities: {
                type: "",
                id: util.uuid(),
                generate: {
                  type: "",
                  id: util.uuid(),
                  core_param: {
                    type: "",
                    id: util.uuid(),
                    model,
                    prompt,
                    negative_prompt: negativePrompt,
                    seed: Math.floor(Math.random() * 1e8) + 25e8,
                    sample_strength: sampleStrength,
                    image_ratio: getImageRatio(width, height),
                    large_image_info: {
                      type: "",
                      id: util.uuid(),
                      height,
                      width,
                      resolution_type: resolutionType
                    },
                    intelligent_ratio: false
                  }
                },
                gen_option: {
                  type: "",
                  id: util.uuid(),
                  generate_all: false
                }
              }
            }
          ]
        }),
        http_common_info: {
          aid: Number(DEFAULT_ASSISTANT_ID)
        }
      }
    }
  );
  const historyId = aigc_data.history_record_id;
  if (!historyId)
    throw new APIException(EX$1.API_IMAGE_GENERATION_FAILED, "\u8BB0\u5F55ID\u4E0D\u5B58\u5728");
  const maxPollCount = 900;
  const poller = new SmartPoller({
    maxPollCount,
    expectedItemCount: 4,
    type: "image"
  });
  const { result: pollingResult, data: finalTaskInfo } = await poller.poll(async () => {
    var _a;
    const response = await request("post", "/mweb/v1/get_history_by_ids", refreshToken, {
      proxyUrl: proxyOpts.proxyUrl,
      data: {
        history_ids: [historyId]
      }
    });
    if (!response[historyId]) {
      logger.error(`\u5386\u53F2\u8BB0\u5F55\u4E0D\u5B58\u5728: historyId=${historyId}`);
      throw new APIException(EX$1.API_IMAGE_GENERATION_FAILED, "\u8BB0\u5F55\u4E0D\u5B58\u5728");
    }
    const taskInfo = response[historyId];
    const currentStatus = taskInfo.status;
    const currentFailCode = taskInfo.fail_code;
    const currentItemList = taskInfo.item_list || [];
    const finishTime = ((_a = taskInfo.task) == null ? void 0 : _a.finish_time) || 0;
    return {
      status: {
        status: currentStatus,
        failCode: currentFailCode,
        itemCount: currentItemList.length,
        finishTime,
        historyId
      },
      data: taskInfo
    };
  }, historyId);
  const item_list = finalTaskInfo.item_list || [];
  const imageUrls = item_list.map((item, index) => {
    var _a, _b, _c, _d;
    let imageUrl = null;
    if ((_c = (_b = (_a = item == null ? void 0 : item.image) == null ? void 0 : _a.large_images) == null ? void 0 : _b[0]) == null ? void 0 : _c.image_url) {
      imageUrl = item.image.large_images[0].image_url;
      logger.debug(`\u56FE\u7247 ${index + 1}: \u4F7F\u7528 large_images URL`);
    } else if ((_d = item == null ? void 0 : item.common_attr) == null ? void 0 : _d.cover_url) {
      imageUrl = item.common_attr.cover_url;
      logger.debug(`\u56FE\u7247 ${index + 1}: \u4F7F\u7528 cover_url`);
    } else if (item == null ? void 0 : item.image_url) {
      imageUrl = item.image_url;
      logger.debug(`\u56FE\u7247 ${index + 1}: \u4F7F\u7528 image_url`);
    } else if (item == null ? void 0 : item.url) {
      imageUrl = item.url;
      logger.debug(`\u56FE\u7247 ${index + 1}: \u4F7F\u7528 url`);
    } else {
      logger.warn(`\u56FE\u7247 ${index + 1}: \u65E0\u6CD5\u63D0\u53D6URL\uFF0Citem\u7ED3\u6784: ${JSON.stringify(item, null, 2)}`);
    }
    return imageUrl;
  }).filter((url) => url !== null);
  logger.info(`\u56FE\u50CF\u751F\u6210\u5B8C\u6210: \u6210\u529F\u751F\u6210 ${imageUrls.length} \u5F20\u56FE\u7247\uFF0C\u603B\u8017\u65F6 ${pollingResult.elapsedTime} \u79D2\uFF0C\u6700\u7EC8\u72B6\u6001: ${pollingResult.status}`);
  if (imageUrls.length === 0) {
    logger.error(`\u56FE\u50CF\u751F\u6210\u5F02\u5E38: item_list\u6709 ${item_list.length} \u4E2A\u9879\u76EE\uFF0C\u4F46\u65E0\u6CD5\u63D0\u53D6\u4EFB\u4F55\u56FE\u7247URL`);
    logger.error(`\u5B8C\u6574\u7684item_list\u6570\u636E: ${JSON.stringify(item_list, null, 2)}`);
  }
  return imageUrls;
}
async function getHistoryBySubmitIds(submitIds, refreshToken) {
  logger.info(`\u901A\u8FC7submit_ids\u83B7\u53D6\u5386\u53F2\u8BB0\u5F55: ${submitIds.join(", ")}`);
  const result = await request("post", "/mweb/v1/get_history_by_ids", refreshToken, {
    data: {
      submit_ids: submitIds
    }
  });
  const histories = [];
  for (const submitId of submitIds) {
    const record = result[submitId];
    if (!record) {
      logger.warn(`submit_id ${submitId} \u7684\u8BB0\u5F55\u4E0D\u5B58\u5728`);
      continue;
    }
    const itemList = record.item_list || [];
    const images = itemList.map((item) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
      const largeImage = (_b = (_a = item == null ? void 0 : item.image) == null ? void 0 : _a.large_images) == null ? void 0 : _b[0];
      return {
        id: ((_c = item == null ? void 0 : item.common_attr) == null ? void 0 : _c.id) || "",
        imageUrl: (largeImage == null ? void 0 : largeImage.image_url) || ((_d = item == null ? void 0 : item.common_attr) == null ? void 0 : _d.cover_url) || "",
        width: (largeImage == null ? void 0 : largeImage.width) || ((_e = item == null ? void 0 : item.common_attr) == null ? void 0 : _e.cover_width) || 0,
        height: (largeImage == null ? void 0 : largeImage.height) || ((_f = item == null ? void 0 : item.common_attr) == null ? void 0 : _f.cover_height) || 0,
        format: (largeImage == null ? void 0 : largeImage.format) || ((_g = item == null ? void 0 : item.image) == null ? void 0 : _g.format) || "jpeg",
        coverUrlMap: ((_h = item == null ? void 0 : item.common_attr) == null ? void 0 : _h.cover_url_map) || {},
        description: ((_i = item == null ? void 0 : item.common_attr) == null ? void 0 : _i.description) || "",
        referencePrompt: ((_j = item == null ? void 0 : item.aigc_image_params) == null ? void 0 : _j.reference_prompt) || ""
      };
    });
    histories.push({
      submitId,
      status: record.status || 0,
      failCode: record.fail_code,
      failMsg: record.fail_msg,
      generateType: record.generate_type || 1,
      historyRecordId: record.history_record_id,
      finishTime: record.finish_time,
      totalImageCount: record.total_image_count || 0,
      finishedImageCount: record.finished_image_count || 0,
      images
    });
    logger.info(`submit_id ${submitId}: \u72B6\u6001=${record.status}, \u5DF2\u751F\u6210=${images.length}\u5F20\u56FE\u7247`);
  }
  return histories;
}

const PASSPORT_API_URL = "https://login-row.www.capcut.com";
const PASSPORT_HEADERS = {
  "Accept": "application/json, text/plain, */*",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Accept-Language": "zh-CN,zh;q=0.9",
  "Cache-Control": "no-cache",
  "Content-Type": "application/x-www-form-urlencoded",
  "App-Sdk-Version": APP_SDK_VERSION,
  "Appid": DEFAULT_ASSISTANT_ID,
  "Appvr": VERSION_CODE,
  "Origin": "https://dreamina.capcut.com",
  "Pragma": "no-cache",
  "Priority": "u=1, i",
  "Referer": "https://dreamina.capcut.com/",
  "Pf": PLATFORM_CODE,
  "Lan": "en",
  "Loc": "US",
  "Store-Country-Code": "us",
  "Store-Country-Code-Src": "uid",
  "Sec-Ch-Ua": '"Not(A:Brand";v="8", "Chromium";v="144", "Microsoft Edge";v="144"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"macOS"',
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-site",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36"
};
function mixEncode(text) {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    out += (text.charCodeAt(i) ^ 5).toString(16).padStart(2, "0");
  }
  return out;
}
async function loginWithEmail(email, password, proxyOpts = {}) {
  var _a, _b;
  const cleanEmail = email.trim();
  if (!cleanEmail) {
    throw new APIException(EX$1.API_REQUEST_PARAMS_INVALID, "\u90AE\u7BB1\u4E0D\u80FD\u4E3A\u7A7A");
  }
  if (!password) {
    throw new APIException(EX$1.API_REQUEST_PARAMS_INVALID, "\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A");
  }
  const encPassword = mixEncode(password);
  const encEmail = mixEncode(cleanEmail);
  const deviceTime = util.unixTimestamp();
  const uri = "/passport/web/email/login/";
  const sign = util.md5(
    `9e2c|${uri.slice(-7)}|${PLATFORM_CODE}|${VERSION_CODE}|${deviceTime}||11ac`
  );
  const fullUrl = `${PASSPORT_API_URL}${uri}`;
  const requestData = new URLSearchParams();
  requestData.append("mix_mode", "1");
  requestData.append("email", encEmail);
  requestData.append("password", encPassword);
  requestData.append("fixed_mix_mode", "1");
  requestData.append("account_sdk_source", "web");
  requestData.append("aid", String(DEFAULT_ASSISTANT_ID));
  const params = {
    aid: DEFAULT_ASSISTANT_ID,
    device_platform: "web",
    region: "US"
  };
  const headers = {
    ...PASSPORT_HEADERS,
    "Device-Time": deviceTime.toString(),
    "Sign": sign,
    "Sign-Ver": "1",
    "Tdid": ""
  };
  const axiosConfig = {
    method: "POST",
    url: fullUrl,
    params,
    headers,
    data: requestData,
    timeout: 45e3,
    validateStatus: () => true,
    maxRedirects: 0
  };
  logger.info(`\u5F00\u59CB\u90AE\u7BB1\u767B\u5F55: ${cleanEmail}`);
  const proxyUrl = resolveApiProxy(proxyOpts.proxyUrl);
  if (!proxyUrl) {
    logger.warn(
      `\u672A\u914D\u7F6E\u4EE3\u7406\uFF0C\u76F4\u8FDE login-row.www.capcut.com \u53EF\u80FD\u88AB\u7F51\u7EDC\u963B\u65AD(ECONNRESET)\u3002\u5EFA\u8BAE\u5728\u914D\u7F6E\u4E2D\u8BBE\u7F6E global_proxy_url`
    );
  }
  let response;
  const maxAttempts = 3;
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      response = await axios.request(withProxyConfig(axiosConfig, proxyUrl));
      break;
    } catch (e) {
      lastError = e;
      const code = (e == null ? void 0 : e.code) || "";
      logger.error(`\u767B\u5F55\u8BF7\u6C42\u5931\u8D25(\u7B2C ${attempt}/${maxAttempts} \u6B21): ${code} ${e.message}`);
      if (attempt < maxAttempts && (code === "ECONNRESET" || code === "ETIMEDOUT" || code === "ECONNABORTED" || code === "EAI_AGAIN")) {
        await new Promise((r) => setTimeout(r, 1500 * attempt));
        continue;
      }
      if (code === "ECONNRESET") {
        throw new APIException(
          EX$1.API_REQUEST_FAILED,
          `\u65E0\u6CD5\u8FDE\u63A5 login-row.www.capcut.com(TLS \u88AB\u91CD\u7F6E)\u3002\u8BE5\u57DF\u540D\u53EF\u80FD\u88AB\u672C\u673A\u7F51\u7EDC/\u4EE3\u7406\u963B\u65AD\uFF0C\u8BF7\u5728\u914D\u7F6E\u4E2D\u8BBE\u7F6E global_proxy_url \u6216\u5728\u4EE3\u7406\u89C4\u5219\u4E2D\u653E\u884C\u8BE5\u57DF\u540D`
        );
      }
      throw e;
    }
  }
  if (!response) {
    throw new APIException(
      EX$1.API_REQUEST_FAILED,
      `\u767B\u5F55\u8BF7\u6C42\u5931\u8D25: ${(lastError == null ? void 0 : lastError.message) || "\u672A\u77E5\u9519\u8BEF"}`
    );
  }
  logger.info(`\u767B\u5F55\u54CD\u5E94\u72B6\u6001: ${response.status}`);
  if (response.status >= 400) {
    throw new APIException(
      EX$1.API_REQUEST_FAILED,
      `\u767B\u5F55\u8BF7\u6C42\u5931\u8D25: HTTP ${response.status}`
    );
  }
  const body = response.data || {};
  const data = body.data || {};
  let sessionId = data.sessionid || data.session_id || data.access_token;
  if (!sessionId) {
    const setCookies = ((_a = response.headers) == null ? void 0 : _a["set-cookie"]) || [];
    for (const cookie of setCookies) {
      const match = cookie.match(/sessionid=([^;]+)/);
      if (match && match[1]) {
        sessionId = decodeURIComponent(match[1]);
        break;
      }
    }
  }
  if (!sessionId) {
    const msg = body.description || body.message || body.errmsg || "\u672A\u77E5\u9519\u8BEF";
    throw new APIException(
      EX$1.API_REQUEST_FAILED,
      `\u767B\u5F55\u5931\u8D25: ${msg}${body.error_code ? `(\u9519\u8BEF\u7801: ${body.error_code})` : ""}`
    );
  }
  logger.success(`\u90AE\u7BB1\u767B\u5F55\u6210\u529F: ${cleanEmail}, user_id=${(_b = data.user_id) != null ? _b : "\u672A\u77E5"}`);
  return {
    sessionId,
    userId: data.user_id != null ? String(data.user_id) : void 0,
    userInfo: data
  };
}

function now() {
  return Math.floor(Date.now() / 1e3);
}
function maskSession(s) {
  if (s.length <= 8) return "***";
  return `${s.slice(0, 4)}...${s.slice(-4)}`;
}
function listAccounts() {
  return getDb().prepare("SELECT * FROM pool_accounts ORDER BY id ASC").all();
}
function addAccount(sessionId, label = "", proxyUrl, extra) {
  var _a;
  const ts = now();
  getDb().prepare(
    `INSERT INTO pool_accounts(session_id, label, enabled, proxy_url, email, password, user_id, user_name, created_at, updated_at)
       VALUES(?, ?, 1, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    sessionId.trim(),
    label.trim(),
    (proxyUrl == null ? void 0 : proxyUrl.trim()) || null,
    ((_a = extra == null ? void 0 : extra.email) == null ? void 0 : _a.trim()) || null,
    (extra == null ? void 0 : extra.password) || null,
    (extra == null ? void 0 : extra.userId) || null,
    (extra == null ? void 0 : extra.userName) || null,
    ts,
    ts
  );
}
function updateAccount(id, patch) {
  var _a;
  const row = getAccountById(id);
  if (!row) throw new Error("account not found");
  getDb().prepare(
    `UPDATE pool_accounts SET
        session_id = ?,
        label = ?,
        enabled = ?,
        proxy_url = ?,
        email = ?,
        password = ?,
        user_id = ?,
        user_name = ?,
        updated_at = ?
       WHERE id = ?`
  ).run(
    ((_a = patch.session_id) == null ? void 0 : _a.trim()) || row.session_id,
    patch.label !== void 0 ? patch.label : row.label,
    patch.enabled !== void 0 ? patch.enabled ? 1 : 0 : row.enabled,
    patch.proxy_url !== void 0 ? patch.proxy_url : row.proxy_url,
    patch.email !== void 0 ? patch.email : row.email,
    patch.password !== void 0 ? patch.password : row.password,
    patch.user_id !== void 0 ? patch.user_id : row.user_id,
    patch.user_name !== void 0 ? patch.user_name : row.user_name,
    now(),
    id
  );
}
function deleteAccount(id) {
  getDb().prepare("DELETE FROM pool_accounts WHERE id = ?").run(id);
}
function getAccountById(id) {
  return getDb().prepare("SELECT * FROM pool_accounts WHERE id = ?").get(id);
}
function pickEnabledAccount() {
  const rows = getDb().prepare("SELECT * FROM pool_accounts WHERE enabled = 1 ORDER BY id ASC").all();
  if (rows.length === 0) return void 0;
  return _$1.sample(rows);
}
async function refreshAccountCredit(id) {
  const row = getAccountById(id);
  if (!row) throw new Error("account not found");
  const creditProxy = resolveCreditProxy(row.proxy_url);
  try {
    const live = await getTokenLiveStatus(row.session_id, { proxyUrl: creditProxy });
    const points = await getCredit(row.session_id, { proxyUrl: creditProxy });
    getDb().prepare(
      `UPDATE pool_accounts SET
          last_total_credit = ?,
          last_gift_credit = ?,
          last_check_at = ?,
          last_success_at = ?,
          fail_count = 0,
          last_error = NULL,
          updated_at = ?
         WHERE id = ?`
    ).run(points.totalCredit, points.giftCredit, now(), now(), now(), id);
    return { id, live, points, proxy: creditProxy || null };
  } catch (e) {
    getDb().prepare(
      `UPDATE pool_accounts SET last_check_at = ?, fail_count = fail_count + 1, last_error = ?, updated_at = ? WHERE id = ?`
    ).run(now(), (e == null ? void 0 : e.message) || String(e), now(), id);
    throw e;
  }
}
async function refreshSession(id) {
  var _a, _b;
  const row = getAccountById(id);
  if (!row) throw new Error("account not found");
  if (!row.email || !row.password) {
    throw new Error("\u8BE5\u8D26\u53F7\u672A\u5B58\u50A8\u90AE\u7BB1\u5BC6\u7801, \u65E0\u6CD5\u5237\u65B0 session (\u4EC5\u90AE\u7BB1\u767B\u5F55\u7684\u8D26\u53F7\u652F\u6301)");
  }
  const apiProxy = resolveApiProxy(row.proxy_url);
  const result = await loginWithEmail(row.email, row.password, { proxyUrl: apiProxy });
  getDb().prepare(
    `UPDATE pool_accounts SET
        session_id = ?,
        user_id = ?,
        user_name = ?,
        fail_count = 0,
        last_error = NULL,
        updated_at = ?
       WHERE id = ?`
  ).run(
    result.sessionId,
    result.userId || row.user_id,
    ((_a = result.userInfo) == null ? void 0 : _a.name) || row.user_name,
    now(),
    id
  );
  return {
    id,
    session_id: result.sessionId,
    user_id: result.userId || row.user_id,
    user_name: ((_b = result.userInfo) == null ? void 0 : _b.name) || row.user_name
  };
}
async function fetchAccountInfo(id) {
  var _a, _b;
  const row = getAccountById(id);
  if (!row) throw new Error("account not found");
  const apiProxy = resolveApiProxy(row.proxy_url);
  const info = await getAccountInfo(row.session_id, { proxyUrl: apiProxy });
  const userId = (info == null ? void 0 : info.user_id) != null ? String(info.user_id) : row.user_id;
  const userName = (info == null ? void 0 : info.name) || (info == null ? void 0 : info.screen_name) || row.user_name;
  const storeCountry = (info == null ? void 0 : info.store_country) || row.store_country;
  const accountType = (info == null ? void 0 : info.store_geo) || (info == null ? void 0 : info.store_vdc) || storeCountry || row.account_type;
  let vipLevel = row.vip_level;
  let vipExpireAt = row.vip_expire_at;
  let subSummary = "";
  try {
    const sub = await getSubscriptionInfo(row.session_id, { proxyUrl: apiProxy });
    vipLevel = (_a = extractVipLevel(sub)) != null ? _a : vipLevel;
    vipExpireAt = (_b = extractVipExpire(sub)) != null ? _b : vipExpireAt;
    subSummary = JSON.stringify(sub).slice(0, 4e3);
    logger.info(`\u8D26\u53F7 ${id} \u8BA2\u9605\u4FE1\u606F: vip=${vipLevel}, expire=${vipExpireAt}`);
  } catch (e) {
    logger.warn(`\u8D26\u53F7 ${id} \u8BA2\u9605\u67E5\u8BE2\u5931\u8D25: ${e == null ? void 0 : e.message}`);
  }
  const mergedInfo = subSummary ? JSON.stringify({ account: info, subscription: subSummary }).slice(0, 8e3) : JSON.stringify(info).slice(0, 8e3);
  getDb().prepare(
    `UPDATE pool_accounts SET
        user_id = ?,
        user_name = ?,
        store_country = ?,
        account_type = ?,
        last_account_info = ?,
        vip_level = ?,
        vip_expire_at = ?,
        last_check_at = ?,
        fail_count = 0,
        last_error = NULL,
        updated_at = ?
       WHERE id = ?`
  ).run(
    userId,
    userName,
    storeCountry,
    accountType,
    mergedInfo,
    vipLevel,
    vipExpireAt,
    now(),
    now(),
    id
  );
  return {
    id,
    user_id: userId,
    user_name: userName,
    store_country: storeCountry,
    account_type: accountType,
    vip_level: vipLevel,
    vip_expire_at: vipExpireAt,
    email: (info == null ? void 0 : info.email) || row.email,
    live: !!userId
  };
}
function extractVipLevel(sub) {
  var _a, _b, _c, _d;
  if (!sub || typeof sub !== "object") return null;
  const candidates = [
    sub.vip_level,
    sub.level,
    sub.vip_type,
    (_a = sub.subscription) == null ? void 0 : _a.level,
    (_b = sub.subscription) == null ? void 0 : _b.vip_level,
    (_c = sub.vip_info) == null ? void 0 : _c.level,
    (_d = sub.vip_info) == null ? void 0 : _d.vip_level
  ];
  for (const c of candidates) {
    if (c != null && c !== "" && c !== 0 && c !== "0") return String(c);
  }
  if (sub.vip_info || sub.subscription || sub.is_vip === 1 || sub.is_vip === true) {
    return "vip";
  }
  return null;
}
function extractVipExpire(sub) {
  var _a, _b, _c, _d;
  if (!sub || typeof sub !== "object") return null;
  const candidates = [
    sub.vip_expire_at,
    sub.expire_at,
    sub.expiry_time,
    sub.end_time,
    sub.expiration_time,
    (_a = sub.subscription) == null ? void 0 : _a.expire_at,
    (_b = sub.subscription) == null ? void 0 : _b.expiry_time,
    (_c = sub.vip_info) == null ? void 0 : _c.expire_at,
    (_d = sub.vip_info) == null ? void 0 : _d.expiry_time
  ];
  for (const c of candidates) {
    if (c == null || c === "" || c === 0) continue;
    if (typeof c === "number" && c > 1e9) {
      return new Date(c * 1e3).toISOString().replace("T", " ").slice(0, 19) + " UTC";
    }
    return String(c);
  }
  return null;
}
async function refreshAllCredits() {
  const accounts = listAccounts();
  const results = [];
  for (const a of accounts) {
    try {
      const r = await refreshAccountCredit(a.id);
      results.push({ id: a.id, ok: true, ...r });
    } catch (e) {
      results.push({ id: a.id, ok: false, error: (e == null ? void 0 : e.message) || String(e) });
    }
  }
  return results;
}
function toPublicAccount(row) {
  return {
    id: row.id,
    session_mask: maskSession(row.session_id),
    label: row.label,
    enabled: !!row.enabled,
    proxy_url: row.proxy_url,
    last_total_credit: row.last_total_credit,
    last_gift_credit: row.last_gift_credit,
    last_check_at: row.last_check_at,
    last_success_at: row.last_success_at,
    fail_count: row.fail_count,
    last_error: row.last_error,
    email: row.email,
    user_id: row.user_id,
    user_name: row.user_name,
    store_country: row.store_country,
    account_type: row.account_type,
    vip_level: row.vip_level,
    vip_expire_at: row.vip_expire_at,
    has_password: !!row.password,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}
function resolveFromPoolAccount(row) {
  return {
    sessionId: row.session_id,
    accountId: row.id,
    apiProxy: row.proxy_url || void 0,
    creditProxy: row.proxy_url || void 0,
    fromPool: true
  };
}

function stripBearer(auth) {
  if (!auth) return "";
  return auth.replace(/^Bearer\s+/i, "").trim();
}
function isPoolApiKey(auth) {
  const key = getPoolApiKey();
  if (!key) return false;
  return stripBearer(auth) === key;
}
function resolveSessions(authorization) {
  if (!authorization) return [];
  if (isPoolApiKey(authorization)) {
    const acc = pickEnabledAccount();
    if (!acc) return [];
    return [resolveFromPoolAccount(acc)];
  }
  const tokens = tokenSplit(authorization);
  return tokens.map((sessionId) => ({
    sessionId,
    fromPool: false
  }));
}
function pickOneSession(authorization) {
  return _$1.sample(resolveSessions(authorization));
}

function requireActiveSession(authorization) {
  const picked = pickOneSession(authorization);
  if (!picked) {
    throw new Error("\u672A\u63D0\u4F9B\u6709\u6548 Authorization\uFF0C\u6216\u53F7\u6C60\u4E3A\u7A7A\u3002\u4F7F\u7528 Bearer <sessionid> \u6216 Bearer <pool_api_key>");
  }
  return {
    sessionId: picked.sessionId,
    apiProxy: resolveApiProxy(picked.apiProxy),
    creditProxy: picked.creditProxy,
    fromPool: picked.fromPool,
    accountId: picked.accountId
  };
}

const OPENAI_SIZE_MAP = {
  "1024x1024": "1:1",
  "1792x1024": "16:9",
  "1024x1792": "9:16",
  "1536x1024": "3:2",
  "1024x1536": "2:3"
};
function resolutionFromGrok(res) {
  if (!res) return "720p";
  const v = res.toLowerCase();
  if (v === "4k" || v === "2160p") return "1080p";
  if (v === "1080p") return "1080p";
  return "720p";
}
function normalizeImageBody(body) {
  var _a;
  const prompt = String((_a = body.prompt) != null ? _a : "");
  if (!prompt && !body.image && !body.image_url) {
    throw new Error("prompt is required");
  }
  const model = resolveModelReqKey(body.model);
  let ratio = body.ratio;
  if (!ratio && typeof body.size === "string" && OPENAI_SIZE_MAP[body.size]) {
    ratio = OPENAI_SIZE_MAP[body.size];
  }
  if (!ratio && body.aspect_ratio) {
    ratio = String(body.aspect_ratio);
  }
  const imageUrls = [];
  if (typeof body.image === "string") imageUrls.push(body.image);
  if (typeof body.image_url === "string") imageUrls.push(body.image_url);
  if (body.image && typeof body.image === "object") {
    const img = body.image;
    if (img.url) imageUrls.push(img.url);
  }
  if (Array.isArray(body.images)) {
    for (const item of body.images) {
      if (typeof item === "string") imageUrls.push(item);
      else if (item && typeof item === "object" && item.url) {
        imageUrls.push(item.url);
      }
    }
  }
  return {
    model,
    prompt: prompt || "enhance",
    negativePrompt: body.negative_prompt || void 0,
    ratio,
    sampleStrength: _$1.isFinite(body.sample_strength) ? body.sample_strength : void 0,
    responseFormat: body.response_format || "url",
    imageUrls
  };
}
function normalizeVideoBody(body) {
  var _a;
  const prompt = String((_a = body.prompt) != null ? _a : "");
  if (!prompt) throw new Error("prompt is required");
  const model = resolveModelReqKey(body.model);
  let width = _$1.isFinite(body.width) ? Number(body.width) : 1024;
  let height = _$1.isFinite(body.height) ? Number(body.height) : 1024;
  let ratio = body.ratio;
  if (!ratio && body.aspect_ratio) ratio = String(body.aspect_ratio);
  if (ratio && ASPECT_RATIOS[ratio]) {
    width = ASPECT_RATIOS[ratio].width;
    height = ASPECT_RATIOS[ratio].height;
  }
  const resolution = resolutionFromGrok(
    typeof body.resolution === "string" ? body.resolution : void 0
  );
  const durationSec = _$1.isFinite(body.duration) ? Number(body.duration) : void 0;
  const filePaths = [];
  const openaiPaths = body.file_paths || body.filePaths;
  if (Array.isArray(openaiPaths)) filePaths.push(...openaiPaths.filter(Boolean));
  if (body.image && typeof body.image === "object") {
    const url = body.image.url;
    if (url) filePaths.unshift(url);
  }
  if (typeof body.image_url === "string") filePaths.unshift(body.image_url);
  if (typeof body.firstFrameRef === "string") filePaths.unshift(body.firstFrameRef);
  if (typeof body.endFrameRef === "string") filePaths.push(body.endFrameRef);
  const asyncMode = body.async === true || body.deferred === true;
  return {
    model,
    prompt,
    ratio,
    width,
    height,
    resolution: resolutionFromGrok(resolution),
    durationSec,
    filePaths,
    responseFormat: body.response_format || "url",
    asyncMode
  };
}
function grokVideoCreateResponse(requestId) {
  return { request_id: requestId, status: "pending" };
}
function grokVideoPollResponse(requestId, status, videoUrl, error) {
  if (status === "done" && videoUrl) {
    return { request_id: requestId, status: "done", video: { url: videoUrl } };
  }
  if (status === "failed" || status === "expired") {
    return { request_id: requestId, status, error: error || status };
  }
  return { request_id: requestId, status };
}

function parseRatio(ratio) {
  if (!ratio) {
    return { width: 2048, height: 2048 };
  }
  const ratioConfig = ASPECT_RATIOS[ratio];
  if (ratioConfig) {
    return {
      width: ratioConfig.width,
      height: ratioConfig.height
    };
  }
  const supportedRatios = Object.keys(ASPECT_RATIOS).join(", ");
  throw new Error(`\u4E0D\u652F\u6301\u7684\u6BD4\u4F8B "${ratio}"\u3002\u652F\u6301\u7684\u6BD4\u4F8B: ${supportedRatios}`);
}
const images = {
  prefix: "/v1/images",
  post: {
    "/generations": async (request) => {
      request.validate("headers.authorization", _$1.isString);
      const session = requireActiveSession(request.headers.authorization);
      const norm = normalizeImageBody(request.body);
      if (norm.imageUrls.length > 0) {
        throw new Error("\u56FE\u751F\u56FE\u8BF7\u4F7F\u7528 POST /v1/images/edits \u6216 /v1/images/compositions");
      }
      const ratioConfig = parseRatio(norm.ratio);
      const width = ratioConfig.width;
      const height = ratioConfig.height;
      const responseFormat = _$1.defaultTo(norm.responseFormat, "url");
      const imageUrls = await generateImages(norm.model, norm.prompt, {
        width,
        height,
        sampleStrength: norm.sampleStrength,
        negativePrompt: norm.negativePrompt
      }, session.sessionId, { proxyUrl: session.apiProxy });
      let data = [];
      if (responseFormat == "b64_json") {
        data = (await Promise.all(imageUrls.map((url) => util.fetchFileBASE64(url)))).map((b64) => ({ b64_json: b64 }));
      } else {
        data = imageUrls.map((url) => ({
          url
        }));
      }
      return {
        created: util.unixTimestamp(),
        data
      };
    },
    "/edits": async (request) => {
      request.validate("headers.authorization", _$1.isString);
      const session = requireActiveSession(request.headers.authorization);
      const norm = normalizeImageBody(request.body);
      if (norm.imageUrls.length === 0) {
        throw new Error("image edits \u9700\u8981 image / image_url \u6216 images \u53C2\u6570");
      }
      if (norm.imageUrls.length > 10) {
        throw new Error("\u6700\u591A\u652F\u630110\u5F20\u8F93\u5165\u56FE\u7247");
      }
      const ratioConfig = parseRatio(norm.ratio);
      const responseFormat = _$1.defaultTo(norm.responseFormat, "url");
      const resultUrls = await generateImageComposition(norm.model, norm.prompt, norm.imageUrls, {
        width: ratioConfig.width,
        height: ratioConfig.height,
        sampleStrength: norm.sampleStrength,
        negativePrompt: norm.negativePrompt
      }, session.sessionId, { proxyUrl: session.apiProxy });
      let data = [];
      if (responseFormat == "b64_json") {
        data = (await Promise.all(resultUrls.map((url) => util.fetchFileBASE64(url)))).map((b64) => ({ b64_json: b64 }));
      } else {
        data = resultUrls.map((url) => ({ url }));
      }
      return { created: util.unixTimestamp(), data };
    },
    // 新增图片合成路由
    "/compositions": async (request) => {
      const unsupportedParams = ["size", "width", "height"];
      const bodyKeys = Object.keys(request.body);
      const foundUnsupported = unsupportedParams.filter((param) => bodyKeys.includes(param));
      if (foundUnsupported.length > 0) {
        throw new Error(`\u4E0D\u652F\u6301\u7684\u53C2\u6570: ${foundUnsupported.join(", ")}\u3002\u8BF7\u524D\u5F80\u9879\u76EE\u6587\u6863\u9875\u9762\u67E5\u770B\u652F\u6301\u7684\u53C2\u6570\uFF0C\u5F53\u524D\u53EA\u652F\u6301ratio\u53C2\u6570\u63A7\u5236\u56FE\u50CF\u5C3A\u5BF8\u3002`);
      }
      request.validate("body.model", (v) => _$1.isUndefined(v) || _$1.isString(v)).validate("body.prompt", _$1.isString).validate("body.images", _$1.isArray).validate("body.negative_prompt", (v) => _$1.isUndefined(v) || _$1.isString(v)).validate("body.ratio", (v) => _$1.isUndefined(v) || _$1.isString(v)).validate("body.sample_strength", (v) => _$1.isUndefined(v) || _$1.isFinite(v)).validate("body.response_format", (v) => _$1.isUndefined(v) || _$1.isString(v)).validate("headers.authorization", _$1.isString);
      const session = requireActiveSession(request.headers.authorization);
      const { images } = request.body;
      if (!images || images.length === 0) {
        throw new Error("\u81F3\u5C11\u9700\u8981\u63D0\u4F9B1\u5F20\u8F93\u5165\u56FE\u7247");
      }
      if (images.length > 10) {
        throw new Error("\u6700\u591A\u652F\u630110\u5F20\u8F93\u5165\u56FE\u7247");
      }
      images.forEach((image, index) => {
        if (!_$1.isString(image) && !_$1.isObject(image)) {
          throw new Error(`\u56FE\u7247 ${index + 1} \u683C\u5F0F\u4E0D\u6B63\u786E\uFF1A\u5E94\u4E3AURL\u5B57\u7B26\u4E32\u6216\u5305\u542Burl\u5B57\u6BB5\u7684\u5BF9\u8C61`);
        }
        if (_$1.isObject(image) && !image.url) {
          throw new Error(`\u56FE\u7247 ${index + 1} \u7F3A\u5C11url\u5B57\u6BB5`);
        }
      });
      const {
        model,
        prompt,
        negative_prompt: negativePrompt,
        ratio,
        sample_strength: sampleStrength,
        response_format
      } = request.body;
      const ratioConfig = parseRatio(ratio);
      const width = ratioConfig.width;
      const height = ratioConfig.height;
      const imageUrls = images.map((img) => _$1.isString(img) ? img : img.url);
      const responseFormat = _$1.defaultTo(response_format, "url");
      const resultUrls = await generateImageComposition(model, prompt, imageUrls, {
        width,
        height,
        sampleStrength,
        negativePrompt
      }, session.sessionId, { proxyUrl: session.apiProxy });
      let data = [];
      if (responseFormat == "b64_json") {
        data = (await Promise.all(resultUrls.map((url) => util.fetchFileBASE64(url)))).map((b64) => ({ b64_json: b64 }));
      } else {
        data = resultUrls.map((url) => ({
          url
        }));
      }
      return {
        created: util.unixTimestamp(),
        data,
        input_images: imageUrls.length,
        composition_type: "multi_image_synthesis"
      };
    },
    // 获取图片生成历史（通过submit_ids）
    "/history": async (request) => {
      request.validate("body.submit_ids", _$1.isArray).validate("headers.authorization", _$1.isString);
      const { submit_ids } = request.body;
      if (!submit_ids || submit_ids.length === 0) {
        throw new Error("\u81F3\u5C11\u9700\u8981\u63D0\u4F9B1\u4E2Asubmit_id");
      }
      if (submit_ids.length > 20) {
        throw new Error("\u6700\u591A\u652F\u630120\u4E2Asubmit_id");
      }
      const session = requireActiveSession(request.headers.authorization);
      const histories = await getHistoryBySubmitIds(submit_ids, session.sessionId);
      return {
        created: util.unixTimestamp(),
        data: histories
      };
    }
  }
};

const DEFAULT_MODEL = "seedance-2.0";
function getModel(model) {
  const resolved = resolveModelReqKey(model || DEFAULT_MODEL);
  return resolved || "dreamina_seedance_40_pro";
}
function createSignature(method, url, headers, accessKeyId, secretAccessKey, sessionToken, payload = "") {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname || "/";
  const search = urlObj.search;
  const timestamp = headers["x-amz-date"];
  const date = timestamp.substr(0, 8);
  const region = "us-east-1";
  const service = "imagex";
  const queryParams = [];
  const searchParams = new URLSearchParams(search);
  searchParams.forEach((value, key) => {
    queryParams.push([key, value]);
  });
  queryParams.sort(([a], [b]) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });
  const canonicalQueryString = queryParams.map(([key, value]) => `${key}=${value}`).join("&");
  const headersToSign = {
    "x-amz-date": timestamp
  };
  if (sessionToken) {
    headersToSign["x-amz-security-token"] = sessionToken;
  }
  let payloadHash = crypto.createHash("sha256").update("").digest("hex");
  if (method.toUpperCase() === "POST" && payload) {
    payloadHash = crypto.createHash("sha256").update(payload, "utf8").digest("hex");
    headersToSign["x-amz-content-sha256"] = payloadHash;
  }
  const signedHeaders = Object.keys(headersToSign).map((key) => key.toLowerCase()).sort().join(";");
  const canonicalHeaders = Object.keys(headersToSign).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())).map((key) => `${key.toLowerCase()}:${headersToSign[key].trim()}
`).join("");
  const canonicalRequest = [
    method.toUpperCase(),
    pathname,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join("\n");
  const credentialScope = `${date}/${region}/${service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    timestamp,
    credentialScope,
    crypto.createHash("sha256").update(canonicalRequest, "utf8").digest("hex")
  ].join("\n");
  const kDate = crypto.createHmac("sha256", `AWS4${secretAccessKey}`).update(date).digest();
  const kRegion = crypto.createHmac("sha256", kDate).update(region).digest();
  const kService = crypto.createHmac("sha256", kRegion).update(service).digest();
  const kSigning = crypto.createHmac("sha256", kService).update("aws4_request").digest();
  const signature = crypto.createHmac("sha256", kSigning).update(stringToSign).digest("hex");
  return `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
}
function calculateCRC32(buffer) {
  const crcTable = [];
  for (let i = 0; i < 256; i++) {
    let crc2 = i;
    for (let j = 0; j < 8; j++) {
      crc2 = crc2 & 1 ? 3988292384 ^ crc2 >>> 1 : crc2 >>> 1;
    }
    crcTable[i] = crc2;
  }
  let crc = 0 ^ -1;
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
    crc = crc >>> 8 ^ crcTable[(crc ^ bytes[i]) & 255];
  }
  return ((crc ^ -1) >>> 0).toString(16).padStart(8, "0");
}
function getUploadFilename(imageUrl, contentType, prefix = "dreamina-video-frame") {
  var _a;
  let extension = "";
  try {
    extension = util.extractURLExtension(imageUrl);
  } catch {
    extension = "";
  }
  if (!extension && contentType) {
    const normalizedContentType = (_a = contentType.split(";")[0]) == null ? void 0 : _a.trim();
    extension = normalizedContentType ? util.mimeToExtension(normalizedContentType) || "" : "";
  }
  extension = extension.replace(/[^a-z0-9]/gi, "").toLowerCase() || "bin";
  return `${prefix}.${extension}`;
}
async function uploadImageForVideo(imageUrl, refreshToken) {
  var _a, _b, _c, _d, _e, _f;
  try {
    logger.info(`\u5F00\u59CB\u4E0A\u4F20\u89C6\u9891\u56FE\u7247: ${imageUrl}`);
    const tokenResult = await request("post", "/mweb/v1/get_upload_token", refreshToken, {
      data: {
        scene: 2
      }
    });
    const { access_key_id, secret_access_key, session_token, service_id } = tokenResult;
    if (!access_key_id || !secret_access_key || !session_token) {
      throw new Error("\u83B7\u53D6\u4E0A\u4F20\u4EE4\u724C\u5931\u8D25");
    }
    const actualServiceId = service_id || "tb4s082cfz";
    logger.info(`\u83B7\u53D6\u4E0A\u4F20\u4EE4\u724C\u6210\u529F: service_id=${actualServiceId}`);
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`\u4E0B\u8F7D\u56FE\u7247\u5931\u8D25: ${imageResponse.status}`);
    }
    const imageBuffer = await imageResponse.arrayBuffer();
    const fileSize = imageBuffer.byteLength;
    const crc32 = calculateCRC32(imageBuffer);
    const uploadFilename = getUploadFilename(imageUrl, imageResponse.headers.get("content-type"));
    logger.info(`\u56FE\u7247\u4E0B\u8F7D\u5B8C\u6210: \u5927\u5C0F=${fileSize}\u5B57\u8282, CRC32=${crc32}`);
    const now = /* @__PURE__ */ new Date();
    const timestamp = now.toISOString().replace(/[:\-]/g, "").replace(/\.\d{3}Z$/, "Z");
    const randomStr = Math.random().toString(36).substring(2, 12);
    const applyUrl = `https://imagex.bytedanceapi.com/?Action=ApplyImageUpload&Version=2018-08-01&ServiceId=${actualServiceId}&FileSize=${fileSize}&s=${randomStr}`;
    const requestHeaders = {
      "x-amz-date": timestamp,
      "x-amz-security-token": session_token
    };
    const authorization = createSignature("GET", applyUrl, requestHeaders, access_key_id, secret_access_key, session_token);
    logger.info(`\u7533\u8BF7\u4E0A\u4F20\u6743\u9650: ${applyUrl}`);
    const applyResponse = await fetch(applyUrl, {
      method: "GET",
      headers: {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "authorization": authorization,
        "origin": "https://dreamina.capcut.com",
        "referer": "https://dreamina.capcut.com/ai-tool/video/generate",
        "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
        "x-amz-date": timestamp,
        "x-amz-security-token": session_token
      }
    });
    if (!applyResponse.ok) {
      const errorText = await applyResponse.text();
      throw new Error(`\u7533\u8BF7\u4E0A\u4F20\u6743\u9650\u5931\u8D25: ${applyResponse.status} - ${errorText}`);
    }
    const applyResult = await applyResponse.json();
    if ((_a = applyResult == null ? void 0 : applyResult.ResponseMetadata) == null ? void 0 : _a.Error) {
      throw new Error(`\u7533\u8BF7\u4E0A\u4F20\u6743\u9650\u5931\u8D25: ${JSON.stringify(applyResult.ResponseMetadata.Error)}`);
    }
    logger.info(`\u7533\u8BF7\u4E0A\u4F20\u6743\u9650\u6210\u529F`);
    const uploadAddress = (_b = applyResult == null ? void 0 : applyResult.Result) == null ? void 0 : _b.UploadAddress;
    if (!uploadAddress || !uploadAddress.StoreInfos || !uploadAddress.UploadHosts) {
      throw new Error(`\u83B7\u53D6\u4E0A\u4F20\u5730\u5740\u5931\u8D25: ${JSON.stringify(applyResult)}`);
    }
    const storeInfo = uploadAddress.StoreInfos[0];
    const uploadHost = uploadAddress.UploadHosts[0];
    const auth = storeInfo.Auth;
    const uploadUrl = `https://${uploadHost}/upload/v1/${storeInfo.StoreUri}`;
    const imageId = storeInfo.StoreUri.split("/").pop();
    logger.info(`\u51C6\u5907\u4E0A\u4F20\u56FE\u7247: imageId=${imageId}, uploadUrl=${uploadUrl}`);
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Authorization": auth,
        "Connection": "keep-alive",
        "Content-CRC32": crc32,
        "Content-Disposition": `attachment; filename="${uploadFilename}"`,
        "Content-Type": "application/octet-stream",
        "Origin": "https://dreamina.capcut.com",
        "Referer": "https://dreamina.capcut.com/ai-tool/video/generate",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
        "X-Storage-U": "704135154117550"
      },
      body: imageBuffer
    });
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`\u56FE\u7247\u4E0A\u4F20\u5931\u8D25: ${uploadResponse.status} - ${errorText}`);
    }
    logger.info(`\u56FE\u7247\u6587\u4EF6\u4E0A\u4F20\u6210\u529F`);
    const commitUrl = `https://imagex.bytedanceapi.com/?Action=CommitImageUpload&Version=2018-08-01&ServiceId=${actualServiceId}`;
    const commitTimestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:\-]/g, "").replace(/\.\d{3}Z$/, "Z");
    const commitPayload = JSON.stringify({
      SessionKey: uploadAddress.SessionKey,
      SuccessActionStatus: "200"
    });
    const payloadHash = crypto.createHash("sha256").update(commitPayload, "utf8").digest("hex");
    const commitRequestHeaders = {
      "x-amz-date": commitTimestamp,
      "x-amz-security-token": session_token,
      "x-amz-content-sha256": payloadHash
    };
    const commitAuthorization = createSignature("POST", commitUrl, commitRequestHeaders, access_key_id, secret_access_key, session_token, commitPayload);
    const commitResponse = await fetch(commitUrl, {
      method: "POST",
      headers: {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "authorization": commitAuthorization,
        "content-type": "application/json",
        "origin": "https://dreamina.capcut.com",
        "referer": "https://dreamina.capcut.com/ai-tool/video/generate",
        "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
        "x-amz-date": commitTimestamp,
        "x-amz-security-token": session_token,
        "x-amz-content-sha256": payloadHash
      },
      body: commitPayload
    });
    if (!commitResponse.ok) {
      const errorText = await commitResponse.text();
      throw new Error(`\u63D0\u4EA4\u4E0A\u4F20\u5931\u8D25: ${commitResponse.status} - ${errorText}`);
    }
    const commitResult = await commitResponse.json();
    if ((_c = commitResult == null ? void 0 : commitResult.ResponseMetadata) == null ? void 0 : _c.Error) {
      throw new Error(`\u63D0\u4EA4\u4E0A\u4F20\u5931\u8D25: ${JSON.stringify(commitResult.ResponseMetadata.Error)}`);
    }
    if (!((_d = commitResult == null ? void 0 : commitResult.Result) == null ? void 0 : _d.Results) || commitResult.Result.Results.length === 0) {
      throw new Error(`\u63D0\u4EA4\u4E0A\u4F20\u54CD\u5E94\u7F3A\u5C11\u7ED3\u679C: ${JSON.stringify(commitResult)}`);
    }
    const uploadResult = commitResult.Result.Results[0];
    if (uploadResult.UriStatus !== 2e3) {
      throw new Error(`\u56FE\u7247\u4E0A\u4F20\u72B6\u6001\u5F02\u5E38: UriStatus=${uploadResult.UriStatus}`);
    }
    const fullImageUri = uploadResult.Uri;
    const pluginResult = (_f = (_e = commitResult.Result) == null ? void 0 : _e.PluginResult) == null ? void 0 : _f[0];
    if (pluginResult && pluginResult.ImageUri) {
      logger.info(`\u89C6\u9891\u56FE\u7247\u4E0A\u4F20\u5B8C\u6210: ${pluginResult.ImageUri}`);
      return pluginResult.ImageUri;
    }
    logger.info(`\u89C6\u9891\u56FE\u7247\u4E0A\u4F20\u5B8C\u6210: ${fullImageUri}`);
    return fullImageUri;
  } catch (error) {
    logger.error(`\u89C6\u9891\u56FE\u7247\u4E0A\u4F20\u5931\u8D25: ${error.message}`);
    throw error;
  }
}
async function generateVideo(_model, prompt, {
  width = 1024,
  height = 1024,
  resolution = "720p",
  filePaths = []
}, refreshToken, proxyOpts = {}) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
  const model = getModel(_model);
  logger.info(`\u4F7F\u7528\u6A21\u578B: ${_model} \u6620\u5C04\u6A21\u578B: ${model} ${width}x${height} \u5206\u8FA8\u7387: ${resolution}`);
  try {
    const { totalCredit } = await getCredit(refreshToken, proxyOpts);
    if (totalCredit <= 0)
      await receiveCredit(refreshToken);
  } catch (creditError) {
    logger.warn(`\u83B7\u53D6\u79EF\u5206\u5931\u8D25\uFF0C\u7EE7\u7EED\u5C1D\u8BD5\u751F\u6210: ${creditError.message}`);
  }
  let first_frame_image = void 0;
  let end_frame_image = void 0;
  if (filePaths && filePaths.length > 0) {
    let uploadIDs = [];
    logger.info(`\u5F00\u59CB\u4E0A\u4F20 ${filePaths.length} \u5F20\u56FE\u7247\u7528\u4E8E\u89C6\u9891\u751F\u6210`);
    for (let i = 0; i < filePaths.length; i++) {
      const filePath = filePaths[i];
      if (!filePath) {
        logger.warn(`\u7B2C ${i + 1} \u5F20\u56FE\u7247\u8DEF\u5F84\u4E3A\u7A7A\uFF0C\u8DF3\u8FC7`);
        continue;
      }
      try {
        logger.info(`\u5F00\u59CB\u4E0A\u4F20\u7B2C ${i + 1} \u5F20\u56FE\u7247: ${filePath}`);
        const imageUri = await uploadImageForVideo(filePath, refreshToken);
        if (imageUri) {
          uploadIDs.push(imageUri);
          logger.info(`\u7B2C ${i + 1} \u5F20\u56FE\u7247\u4E0A\u4F20\u6210\u529F: ${imageUri}`);
        } else {
          logger.error(`\u7B2C ${i + 1} \u5F20\u56FE\u7247\u4E0A\u4F20\u5931\u8D25: \u672A\u83B7\u53D6\u5230 image_uri`);
        }
      } catch (error) {
        logger.error(`\u7B2C ${i + 1} \u5F20\u56FE\u7247\u4E0A\u4F20\u5931\u8D25: ${error.message}`);
        if (i === 0) {
          logger.error(`\u9996\u5E27\u56FE\u7247\u4E0A\u4F20\u5931\u8D25\uFF0C\u505C\u6B62\u89C6\u9891\u751F\u6210\u4EE5\u907F\u514D\u6D6A\u8D39\u79EF\u5206`);
          throw new APIException(EX$1.API_REQUEST_FAILED, `\u9996\u5E27\u56FE\u7247\u4E0A\u4F20\u5931\u8D25: ${error.message}`);
        } else {
          logger.warn(`\u7B2C ${i + 1} \u5F20\u56FE\u7247\u4E0A\u4F20\u5931\u8D25\uFF0C\u5C06\u8DF3\u8FC7\u6B64\u56FE\u7247\u7EE7\u7EED\u5904\u7406`);
        }
      }
    }
    logger.info(`\u56FE\u7247\u4E0A\u4F20\u5B8C\u6210\uFF0C\u6210\u529F\u4E0A\u4F20 ${uploadIDs.length} \u5F20\u56FE\u7247`);
    if (uploadIDs.length === 0) {
      logger.error(`\u6240\u6709\u56FE\u7247\u4E0A\u4F20\u5931\u8D25\uFF0C\u505C\u6B62\u89C6\u9891\u751F\u6210\u4EE5\u907F\u514D\u6D6A\u8D39\u79EF\u5206`);
      throw new APIException(EX$1.API_REQUEST_FAILED, "\u6240\u6709\u56FE\u7247\u4E0A\u4F20\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u56FE\u7247URL\u662F\u5426\u6709\u6548");
    }
    if (uploadIDs[0]) {
      first_frame_image = {
        format: "",
        height,
        id: util.uuid(),
        image_uri: uploadIDs[0],
        name: "",
        platform_type: 1,
        source_from: "upload",
        type: "image",
        uri: uploadIDs[0],
        width
      };
      logger.info(`\u8BBE\u7F6E\u9996\u5E27\u56FE\u7247: ${uploadIDs[0]}`);
    }
    if (uploadIDs[1]) {
      end_frame_image = {
        format: "",
        height,
        id: util.uuid(),
        image_uri: uploadIDs[1],
        name: "",
        platform_type: 1,
        source_from: "upload",
        type: "image",
        uri: uploadIDs[1],
        width
      };
      logger.info(`\u8BBE\u7F6E\u5C3E\u5E27\u56FE\u7247: ${uploadIDs[1]}`);
    } else if (filePaths.length > 1) {
      logger.warn(`\u7B2C\u4E8C\u5F20\u56FE\u7247\u4E0A\u4F20\u5931\u8D25\u6216\u672A\u63D0\u4F9B\uFF0C\u5C06\u4EC5\u4F7F\u7528\u9996\u5E27\u56FE\u7247`);
    }
  } else {
    logger.info(`\u672A\u63D0\u4F9B\u56FE\u7247\u6587\u4EF6\uFF0C\u5C06\u8FDB\u884C\u7EAF\u6587\u672C\u89C6\u9891\u751F\u6210`);
  }
  const componentId = util.uuid();
  const metricsExtra = JSON.stringify({
    "enterFrom": "click",
    "isDefaultSeed": 1,
    "promptSource": "custom",
    "isRegenerate": false,
    "originSubmitId": util.uuid()
  });
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(width, height);
  const aspectRatio = `${width / divisor}:${height / divisor}`;
  const { aigc_data } = await request(
    "post",
    "/mweb/v1/aigc_draft/generate",
    refreshToken,
    {
      proxyUrl: proxyOpts.proxyUrl,
      params: {
        aigc_features: "app_lip_sync",
        web_version: "6.6.0",
        da_version: DRAFT_VERSION
      },
      data: {
        "extend": {
          "root_model": end_frame_image ? "dreamina_ic_generate_video_model_vgfm_3.0" : model,
          "m_video_commerce_info": {
            benefit_type: "basic_video_operation_vgfm_v_three",
            resource_id: "generate_video",
            resource_id_type: "str",
            resource_sub_type: "aigc"
          },
          "m_video_commerce_info_list": [{
            benefit_type: "basic_video_operation_vgfm_v_three",
            resource_id: "generate_video",
            resource_id_type: "str",
            resource_sub_type: "aigc"
          }]
        },
        "submit_id": util.uuid(),
        "metrics_extra": metricsExtra,
        "draft_content": JSON.stringify({
          "type": "draft",
          "id": util.uuid(),
          "min_version": "3.0.5",
          "is_from_tsn": true,
          "version": DRAFT_VERSION,
          "main_component_id": componentId,
          "component_list": [{
            "type": "video_base_component",
            "id": componentId,
            "min_version": "1.0.0",
            "metadata": {
              "type": "",
              "id": util.uuid(),
              "created_platform": 3,
              "created_platform_version": "",
              "created_time_in_ms": Date.now(),
              "created_did": ""
            },
            "generate_type": "gen_video",
            "aigc_mode": "workbench",
            "abilities": {
              "type": "",
              "id": util.uuid(),
              "gen_video": {
                "id": util.uuid(),
                "type": "",
                "text_to_video_params": {
                  "type": "",
                  "id": util.uuid(),
                  "model_req_key": model,
                  "priority": 0,
                  "seed": Math.floor(Math.random() * 1e8) + 25e8,
                  "video_aspect_ratio": aspectRatio,
                  "video_gen_inputs": [{
                    duration_ms: 5e3,
                    first_frame_image,
                    end_frame_image,
                    fps: 24,
                    id: util.uuid(),
                    min_version: "3.0.5",
                    prompt,
                    resolution,
                    type: "",
                    video_mode: 2
                  }]
                },
                "video_task_extra": metricsExtra
              }
            }
          }]
        }),
        http_common_info: {
          aid: Number(DEFAULT_ASSISTANT_ID)
        }
      }
    }
  );
  const historyId = aigc_data.history_record_id;
  if (!historyId)
    throw new APIException(EX$1.API_IMAGE_GENERATION_FAILED, "\u8BB0\u5F55ID\u4E0D\u5B58\u5728");
  let status = 20, failCode, item_list = [];
  let retryCount = 0;
  const maxRetries = 60;
  await new Promise((resolve) => setTimeout(resolve, 5e3));
  logger.info(`\u5F00\u59CB\u8F6E\u8BE2\u89C6\u9891\u751F\u6210\u7ED3\u679C\uFF0C\u5386\u53F2ID: ${historyId}\uFF0C\u6700\u5927\u91CD\u8BD5\u6B21\u6570: ${maxRetries}`);
  logger.info(`Dreamina\u5B98\u7F51API\u5730\u5740: https://dreamina.capcut.com/mweb/v1/get_history_by_ids`);
  logger.info(`\u89C6\u9891\u751F\u6210\u8BF7\u6C42\u5DF2\u53D1\u9001\uFF0C\u8BF7\u540C\u65F6\u5728Dreamina\u5B98\u7F51\u67E5\u770B: https://dreamina.capcut.com/ai-tool/video/generate`);
  while (status === 20 && retryCount < maxRetries) {
    try {
      const requestUrl = "/mweb/v1/get_history_by_ids";
      const requestData = {
        history_ids: [historyId]
      };
      let result;
      let useAlternativeApi = retryCount > 10 && retryCount % 2 === 0;
      if (useAlternativeApi) {
        logger.info(`\u5C1D\u8BD5\u5907\u7528API\u8BF7\u6C42\u65B9\u5F0F\uFF0CURL: ${requestUrl}, \u5386\u53F2ID: ${historyId}, \u91CD\u8BD5\u6B21\u6570: ${retryCount + 1}/${maxRetries}`);
        const alternativeRequestData = {
          history_record_ids: [historyId]
        };
        result = await request("post", "/mweb/v1/get_history_records", refreshToken, {
          data: alternativeRequestData
        });
        logger.info(`\u5907\u7528API\u54CD\u5E94: ${JSON.stringify(result)}`);
        const responseStr = JSON.stringify(result);
        const videoUrlMatch = responseStr.match(/https:\/\/v[0-9]+-artist\.vlabvod\.com\/[^"\s]+/);
        if (videoUrlMatch && videoUrlMatch[0]) {
          logger.info(`\u4ECE\u5907\u7528API\u54CD\u5E94\u4E2D\u76F4\u63A5\u63D0\u53D6\u5230\u89C6\u9891URL: ${videoUrlMatch[0]}`);
          return videoUrlMatch[0];
        }
      } else {
        logger.info(`\u53D1\u9001\u8BF7\u6C42\u83B7\u53D6\u89C6\u9891\u751F\u6210\u7ED3\u679C\uFF0CURL: ${requestUrl}, \u5386\u53F2ID: ${historyId}, \u91CD\u8BD5\u6B21\u6570: ${retryCount + 1}/${maxRetries}`);
        result = await request("post", requestUrl, refreshToken, {
          data: requestData
        });
        const responseStr = JSON.stringify(result);
        logger.info(`\u6807\u51C6API\u54CD\u5E94\u6458\u8981: ${responseStr.substring(0, 300)}...`);
        const videoUrlMatch = responseStr.match(/https:\/\/v[0-9]+-artist\.vlabvod\.com\/[^"\s]+/);
        if (videoUrlMatch && videoUrlMatch[0]) {
          logger.info(`\u4ECE\u6807\u51C6API\u54CD\u5E94\u4E2D\u76F4\u63A5\u63D0\u53D6\u5230\u89C6\u9891URL: ${videoUrlMatch[0]}`);
          return videoUrlMatch[0];
        }
      }
      let historyData;
      if (useAlternativeApi && result.history_records && result.history_records.length > 0) {
        historyData = result.history_records[0];
        logger.info(`\u4ECE\u5907\u7528API\u83B7\u53D6\u5230\u5386\u53F2\u8BB0\u5F55`);
      } else if (result.history_list && result.history_list.length > 0) {
        historyData = result.history_list[0];
        logger.info(`\u4ECE\u6807\u51C6API\u83B7\u53D6\u5230\u5386\u53F2\u8BB0\u5F55`);
      } else {
        logger.warn(`\u5386\u53F2\u8BB0\u5F55\u4E0D\u5B58\u5728\uFF0C\u91CD\u8BD5\u4E2D (${retryCount + 1}/${maxRetries})... \u5386\u53F2ID: ${historyId}`);
        logger.info(`\u8BF7\u540C\u65F6\u5728Dreamina\u5B98\u7F51\u68C0\u67E5\u89C6\u9891\u662F\u5426\u5DF2\u751F\u6210: https://dreamina.capcut.com/ai-tool/video/generate`);
        retryCount++;
        const waitTime = Math.min(2e3 * (retryCount + 1), 3e4);
        logger.info(`\u7B49\u5F85 ${waitTime}ms \u540E\u8FDB\u884C\u7B2C ${retryCount + 1} \u6B21\u91CD\u8BD5`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }
      logger.info(`\u83B7\u53D6\u5230\u5386\u53F2\u8BB0\u5F55\u7ED3\u679C: ${JSON.stringify(historyData)}`);
      status = historyData.status;
      failCode = historyData.fail_code;
      item_list = historyData.item_list || [];
      logger.info(`\u89C6\u9891\u751F\u6210\u72B6\u6001: ${status}, \u5931\u8D25\u4EE3\u7801: ${failCode || "\u65E0"}, \u9879\u76EE\u5217\u8868\u957F\u5EA6: ${item_list.length}`);
      let tempVideoUrl = (_d = (_c = (_b = (_a = item_list == null ? void 0 : item_list[0]) == null ? void 0 : _a.video) == null ? void 0 : _b.transcoded_video) == null ? void 0 : _c.origin) == null ? void 0 : _d.video_url;
      if (!tempVideoUrl) {
        tempVideoUrl = ((_f = (_e = item_list == null ? void 0 : item_list[0]) == null ? void 0 : _e.video) == null ? void 0 : _f.play_url) || ((_h = (_g = item_list == null ? void 0 : item_list[0]) == null ? void 0 : _g.video) == null ? void 0 : _h.download_url) || ((_j = (_i = item_list == null ? void 0 : item_list[0]) == null ? void 0 : _i.video) == null ? void 0 : _j.url);
      }
      if (tempVideoUrl) {
        logger.info(`\u68C0\u6D4B\u5230\u89C6\u9891URL: ${tempVideoUrl}`);
      }
      if (status === 30) {
        const error = failCode === "2038" ? new APIException(EX$1.API_CONTENT_FILTERED, "\u5185\u5BB9\u88AB\u8FC7\u6EE4") : new APIException(EX$1.API_IMAGE_GENERATION_FAILED, `\u751F\u6210\u5931\u8D25\uFF0C\u9519\u8BEF\u7801: ${failCode}`);
        error.historyId = historyId;
        throw error;
      }
      if (status === 20) {
        const waitTime = 2e3 * Math.min(retryCount + 1, 5);
        logger.info(`\u89C6\u9891\u751F\u6210\u4E2D\uFF0C\u72B6\u6001\u7801: ${status}\uFF0C\u7B49\u5F85 ${waitTime}ms \u540E\u7EE7\u7EED\u67E5\u8BE2`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    } catch (error) {
      logger.error(`\u8F6E\u8BE2\u89C6\u9891\u751F\u6210\u7ED3\u679C\u51FA\u9519: ${error.message}`);
      retryCount++;
      await new Promise((resolve) => setTimeout(resolve, 2e3 * (retryCount + 1)));
    }
  }
  if (retryCount >= maxRetries && status === 20) {
    logger.error(`\u89C6\u9891\u751F\u6210\u8D85\u65F6\uFF0C\u5DF2\u5C1D\u8BD5 ${retryCount} \u6B21\uFF0C\u603B\u8017\u65F6\u7EA6 ${Math.floor(retryCount * 2e3 / 1e3 / 60)} \u5206\u949F`);
    const error = new APIException(EX$1.API_IMAGE_GENERATION_FAILED, "\u83B7\u53D6\u89C6\u9891\u751F\u6210\u7ED3\u679C\u8D85\u65F6\uFF0C\u8BF7\u7A0D\u540E\u5728Dreamina\u5B98\u7F51\u67E5\u770B\u60A8\u7684\u89C6\u9891");
    error.historyId = historyId;
    throw error;
  }
  let videoUrl = (_n = (_m = (_l = (_k = item_list == null ? void 0 : item_list[0]) == null ? void 0 : _k.video) == null ? void 0 : _l.transcoded_video) == null ? void 0 : _m.origin) == null ? void 0 : _n.video_url;
  if (!videoUrl) {
    if ((_p = (_o = item_list == null ? void 0 : item_list[0]) == null ? void 0 : _o.video) == null ? void 0 : _p.play_url) {
      videoUrl = item_list[0].video.play_url;
      logger.info(`\u4ECEplay_url\u83B7\u53D6\u5230\u89C6\u9891URL: ${videoUrl}`);
    } else if ((_r = (_q = item_list == null ? void 0 : item_list[0]) == null ? void 0 : _q.video) == null ? void 0 : _r.download_url) {
      videoUrl = item_list[0].video.download_url;
      logger.info(`\u4ECEdownload_url\u83B7\u53D6\u5230\u89C6\u9891URL: ${videoUrl}`);
    } else if ((_t = (_s = item_list == null ? void 0 : item_list[0]) == null ? void 0 : _s.video) == null ? void 0 : _t.url) {
      videoUrl = item_list[0].video.url;
      logger.info(`\u4ECEurl\u83B7\u53D6\u5230\u89C6\u9891URL: ${videoUrl}`);
    } else {
      logger.error(`\u672A\u80FD\u83B7\u53D6\u89C6\u9891URL\uFF0Citem_list: ${JSON.stringify(item_list)}`);
      const error = new APIException(EX$1.API_IMAGE_GENERATION_FAILED, "\u672A\u80FD\u83B7\u53D6\u89C6\u9891URL\uFF0C\u8BF7\u7A0D\u540E\u5728Dreamina\u5B98\u7F51\u67E5\u770B");
      error.historyId = historyId;
      throw error;
    }
  }
  logger.info(`\u89C6\u9891\u751F\u6210\u6210\u529F\uFF0CURL: ${videoUrl}`);
  return videoUrl;
}

function parseModel(model) {
  var _a;
  const [_model, size] = model.split(":");
  const [_2, width, height] = (_a = /(\d+)[\W\w](\d+)/.exec(size || "")) != null ? _a : [];
  return {
    model: _model,
    width: size ? Math.ceil(parseInt(width) / 2) * 2 : 1024,
    height: size ? Math.ceil(parseInt(height) / 2) * 2 : 1024
  };
}
function isVideoModel(model) {
  return model.startsWith("dreamina-video");
}
async function createCompletion(messages, refreshToken, _model = DEFAULT_MODEL$1, retryCount = 0) {
  return (async () => {
    if (messages.length === 0)
      throw new APIException(EX$1.API_REQUEST_PARAMS_INVALID, "\u6D88\u606F\u4E0D\u80FD\u4E3A\u7A7A");
    const { model, width, height } = parseModel(_model);
    logger.info(messages);
    if (isVideoModel(_model)) {
      try {
        logger.info(`\u5F00\u59CB\u751F\u6210\u89C6\u9891\uFF0C\u6A21\u578B: ${_model}`);
        const videoUrl = await generateVideo(
          _model,
          messages[messages.length - 1].content,
          {
            width,
            height,
            resolution: "720p"
          },
          refreshToken
        );
        logger.info(`\u89C6\u9891\u751F\u6210\u6210\u529F\uFF0CURL: ${videoUrl}`);
        return {
          id: util.uuid(),
          model: _model,
          object: "chat.completion",
          choices: [
            {
              index: 0,
              message: {
                role: "assistant",
                content: `![video](${videoUrl})
`
              },
              finish_reason: "stop"
            }
          ],
          usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
          created: util.unixTimestamp()
        };
      } catch (error) {
        logger.error(`\u89C6\u9891\u751F\u6210\u5931\u8D25: ${error.message}`);
        if (error instanceof APIException) {
          throw error;
        }
        return {
          id: util.uuid(),
          model: _model,
          object: "chat.completion",
          choices: [
            {
              index: 0,
              message: {
                role: "assistant",
                content: `\u751F\u6210\u89C6\u9891\u5931\u8D25: ${error.message}

\u5982\u679C\u60A8\u5728Dreamina\u5B98\u7F51\u770B\u5230\u5DF2\u751F\u6210\u7684\u89C6\u9891\uFF0C\u53EF\u80FD\u662F\u83B7\u53D6\u7ED3\u679C\u65F6\u51FA\u73B0\u4E86\u95EE\u9898\uFF0C\u8BF7\u524D\u5F80Dreamina\u5B98\u7F51\u67E5\u770B\u3002`
              },
              finish_reason: "stop"
            }
          ],
          usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
          created: util.unixTimestamp()
        };
      }
    } else {
      const imageUrls = await generateImages(
        model,
        messages[messages.length - 1].content,
        {
          width,
          height
        },
        refreshToken
      );
      return {
        id: util.uuid(),
        model: _model || model,
        object: "chat.completion",
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: imageUrls.reduce(
                (acc, url, i) => acc + `![image_${i}](${url})
`,
                ""
              )
            },
            finish_reason: "stop"
          }
        ],
        usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
        created: util.unixTimestamp()
      };
    }
  })().catch((err) => {
    if (retryCount < RETRY_CONFIG.MAX_RETRY_COUNT) {
      logger.error(`Response error: ${err.stack}`);
      logger.warn(`Try again after ${RETRY_CONFIG.RETRY_DELAY / 1e3}s...`);
      return (async () => {
        await new Promise((resolve) => setTimeout(resolve, RETRY_CONFIG.RETRY_DELAY));
        return createCompletion(messages, refreshToken, _model, retryCount + 1);
      })();
    }
    throw err;
  });
}
async function createCompletionStream(messages, refreshToken, _model = DEFAULT_MODEL$1, retryCount = 0) {
  return (async () => {
    const { model, width, height } = parseModel(_model);
    logger.info(messages);
    const stream = new PassThrough();
    if (messages.length === 0) {
      logger.warn("\u6D88\u606F\u4E3A\u7A7A\uFF0C\u8FD4\u56DE\u7A7A\u6D41");
      stream.end("data: [DONE]\n\n");
      return stream;
    }
    if (isVideoModel(_model)) {
      stream.write(
        "data: " + JSON.stringify({
          id: util.uuid(),
          model: _model,
          object: "chat.completion.chunk",
          choices: [
            {
              index: 0,
              delta: { role: "assistant", content: "\u{1F3AC} Video generation in progress...\nThis may take 1-2 minutes, please wait" },
              finish_reason: null
            }
          ]
        }) + "\n\n"
      );
      logger.info(`\u5F00\u59CB\u751F\u6210\u89C6\u9891\uFF0C\u63D0\u793A\u8BCD: ${messages[messages.length - 1].content}`);
      const progressInterval = setInterval(() => {
        if (stream.destroyed) {
          clearInterval(progressInterval);
          return;
        }
        stream.write(
          "data: " + JSON.stringify({
            id: util.uuid(),
            model: _model,
            object: "chat.completion.chunk",
            choices: [
              {
                index: 0,
                delta: { role: "assistant", content: "." },
                finish_reason: null
              }
            ]
          }) + "\n\n"
        );
      }, 5e3);
      const timeoutId = setTimeout(() => {
        clearInterval(progressInterval);
        logger.warn(`\u89C6\u9891\u751F\u6210\u8D85\u65F6\uFF082\u5206\u949F\uFF09\uFF0C\u63D0\u793A\u7528\u6237\u524D\u5F80Dreamina\u5B98\u7F51\u67E5\u770B`);
        if (!stream.destroyed) {
          stream.write(
            "data: " + JSON.stringify({
              id: util.uuid(),
              model: _model,
              object: "chat.completion.chunk",
              choices: [
                {
                  index: 1,
                  delta: {
                    role: "assistant",
                    content: "\n\nVideo generation is taking longer than expected (2 minutes elapsed).\n\nPlease check Dreamina website for your video:\n1. Visit https://dreamina.capcut.com/ai-tool/video/generate\n2. Log in and check your creation history\n3. If the video is generated, you can download or share it directly"
                  },
                  finish_reason: "stop"
                }
              ]
            }) + "\n\n"
          );
        }
      }, 2 * 60 * 1e3);
      stream.on("close", () => {
        clearInterval(progressInterval);
        clearTimeout(timeoutId);
        logger.debug("\u89C6\u9891\u751F\u6210\u6D41\u5DF2\u5173\u95ED\uFF0C\u5B9A\u65F6\u5668\u5DF2\u6E05\u7406");
      });
      logger.info(`\u5F00\u59CB\u751F\u6210\u89C6\u9891\uFF0C\u6A21\u578B: ${_model}, \u63D0\u793A\u8BCD: ${messages[messages.length - 1].content.substring(0, 50)}...`);
      stream.write(
        "data: " + JSON.stringify({
          id: util.uuid(),
          model: _model,
          object: "chat.completion.chunk",
          choices: [
            {
              index: 0,
              delta: {
                role: "assistant",
                content: "\n\n\u{1F3AC} Video generation started, this may take a few minutes..."
              },
              finish_reason: null
            }
          ]
        }) + "\n\n"
      );
      generateVideo(
        _model,
        messages[messages.length - 1].content,
        { width, height, resolution: "720p" },
        refreshToken
      ).then((videoUrl) => {
        clearInterval(progressInterval);
        clearTimeout(timeoutId);
        logger.info(`\u89C6\u9891\u751F\u6210\u6210\u529F\uFF0CURL: ${videoUrl}`);
        if (!stream.destroyed && stream.writable) {
          stream.write(
            "data: " + JSON.stringify({
              id: util.uuid(),
              model: _model,
              object: "chat.completion.chunk",
              choices: [
                {
                  index: 1,
                  delta: {
                    role: "assistant",
                    content: `

\u2705 Video generation complete!

![video](${videoUrl})

You can:
1. View the video above
2. Download or share using: ${videoUrl}`
                  },
                  finish_reason: null
                }
              ]
            }) + "\n\n"
          );
          stream.write(
            "data: " + JSON.stringify({
              id: util.uuid(),
              model: _model,
              object: "chat.completion.chunk",
              choices: [
                {
                  index: 2,
                  delta: {
                    role: "assistant",
                    content: ""
                  },
                  finish_reason: "stop"
                }
              ]
            }) + "\n\n"
          );
          stream.end("data: [DONE]\n\n");
        } else {
          logger.debug("\u89C6\u9891\u751F\u6210\u5B8C\u6210\uFF0C\u4F46\u6D41\u5DF2\u5173\u95ED\uFF0C\u8DF3\u8FC7\u5199\u5165");
        }
      }).catch((err) => {
        clearInterval(progressInterval);
        clearTimeout(timeoutId);
        logger.error(`\u89C6\u9891\u751F\u6210\u5931\u8D25: ${err.message}`);
        logger.error(`\u9519\u8BEF\u8BE6\u60C5: ${JSON.stringify(err)}`);
        let errorMessage = `\u26A0\uFE0F Video generation encountered an issue: ${err.message}`;
        if (err.message.includes("\u5386\u53F2\u8BB0\u5F55\u4E0D\u5B58\u5728")) {
          errorMessage += "\n\nPossible causes:\n1. Request was sent but API couldn't retrieve history\n2. Video generation service temporarily unavailable\n\nPlease check Dreamina website: https://dreamina.capcut.com/ai-tool/video/generate";
        } else if (err.message.includes("\u83B7\u53D6\u89C6\u9891\u751F\u6210\u7ED3\u679C\u8D85\u65F6")) {
          errorMessage += "\n\nVideo generation may still be in progress but timeout exceeded.\n\nPlease check Dreamina website: https://dreamina.capcut.com/ai-tool/video/generate";
        } else {
          errorMessage += "\n\nPlease check Dreamina website for your creation history: https://dreamina.capcut.com/ai-tool/video/generate";
        }
        if (err.historyId) {
          errorMessage += `

History ID: ${err.historyId}`;
        }
        if (!stream.destroyed && stream.writable) {
          stream.write(
            "data: " + JSON.stringify({
              id: util.uuid(),
              model: _model,
              object: "chat.completion.chunk",
              choices: [
                {
                  index: 1,
                  delta: {
                    role: "assistant",
                    content: `

${errorMessage}`
                  },
                  finish_reason: "stop"
                }
              ]
            }) + "\n\n"
          );
          stream.end("data: [DONE]\n\n");
        } else {
          logger.debug("\u89C6\u9891\u751F\u6210\u5931\u8D25\uFF0C\u4F46\u6D41\u5DF2\u5173\u95ED\uFF0C\u8DF3\u8FC7\u9519\u8BEF\u4FE1\u606F\u5199\u5165");
        }
      });
    } else {
      stream.write(
        "data: " + JSON.stringify({
          id: util.uuid(),
          model: _model || model,
          object: "chat.completion.chunk",
          choices: [
            {
              index: 0,
              delta: { role: "assistant", content: "\u{1F3A8} Image generation in progress..." },
              finish_reason: null
            }
          ]
        }) + "\n\n"
      );
      generateImages(
        model,
        messages[messages.length - 1].content,
        { width, height },
        refreshToken
      ).then((imageUrls) => {
        if (!stream.destroyed && stream.writable) {
          for (let i = 0; i < imageUrls.length; i++) {
            const url = imageUrls[i];
            stream.write(
              "data: " + JSON.stringify({
                id: util.uuid(),
                model: _model || model,
                object: "chat.completion.chunk",
                choices: [
                  {
                    index: i + 1,
                    delta: {
                      role: "assistant",
                      content: `![image_${i}](${url})
`
                    },
                    finish_reason: i < imageUrls.length - 1 ? null : "stop"
                  }
                ]
              }) + "\n\n"
            );
          }
          stream.write(
            "data: " + JSON.stringify({
              id: util.uuid(),
              model: _model || model,
              object: "chat.completion.chunk",
              choices: [
                {
                  index: imageUrls.length + 1,
                  delta: {
                    role: "assistant",
                    content: "Image generation complete!"
                  },
                  finish_reason: "stop"
                }
              ]
            }) + "\n\n"
          );
          stream.end("data: [DONE]\n\n");
        } else {
          logger.debug("\u56FE\u50CF\u751F\u6210\u5B8C\u6210\uFF0C\u4F46\u6D41\u5DF2\u5173\u95ED\uFF0C\u8DF3\u8FC7\u5199\u5165");
        }
      }).catch((err) => {
        if (!stream.destroyed && stream.writable) {
          stream.write(
            "data: " + JSON.stringify({
              id: util.uuid(),
              model: _model || model,
              object: "chat.completion.chunk",
              choices: [
                {
                  index: 1,
                  delta: {
                    role: "assistant",
                    content: `Image generation failed: ${err.message}`
                  },
                  finish_reason: "stop"
                }
              ]
            }) + "\n\n"
          );
          stream.end("data: [DONE]\n\n");
        } else {
          logger.debug("\u56FE\u50CF\u751F\u6210\u5931\u8D25\uFF0C\u4F46\u6D41\u5DF2\u5173\u95ED\uFF0C\u8DF3\u8FC7\u9519\u8BEF\u4FE1\u606F\u5199\u5165");
        }
      });
    }
    return stream;
  })().catch((err) => {
    if (retryCount < RETRY_CONFIG.MAX_RETRY_COUNT) {
      logger.error(`Response error: ${err.stack}`);
      logger.warn(`Try again after ${RETRY_CONFIG.RETRY_DELAY / 1e3}s...`);
      return (async () => {
        await new Promise((resolve) => setTimeout(resolve, RETRY_CONFIG.RETRY_DELAY));
        return createCompletionStream(
          messages,
          refreshToken,
          _model,
          retryCount + 1
        );
      })();
    }
    throw err;
  });
}

const chat = {
  prefix: "/v1/chat",
  post: {
    "/completions": async (request) => {
      request.validate("body.model", (v) => _$1.isUndefined(v) || _$1.isString(v)).validate("body.messages", _$1.isArray).validate("headers.authorization", _$1.isString);
      const session = requireActiveSession(request.headers.authorization);
      const { model, messages, stream } = request.body;
      if (stream) {
        const stream2 = await createCompletionStream(messages, session.sessionId, model);
        return new Response$1(stream2, {
          type: "text/event-stream"
        });
      } else
        return await createCompletion(messages, session.sessionId, model);
    }
  }
};

const ping = {
  prefix: "/ping",
  get: {
    "": async () => "pong"
  }
};

const token = {
  prefix: "/token",
  post: {
    "/check": async (request) => {
      request.validate("body.token", _$1.isString);
      const live = await getTokenLiveStatus(request.body.token);
      return {
        live
      };
    },
    "/points": async (request) => {
      request.validate("headers.authorization", _$1.isString);
      const sessions = resolveSessions(request.headers.authorization);
      const points = await Promise.all(sessions.map(async (s) => {
        return {
          token: s.sessionId.length > 8 ? `${s.sessionId.slice(0, 4)}...${s.sessionId.slice(-4)}` : "***",
          from_pool: s.fromPool,
          points: await getCredit(s.sessionId, { proxyUrl: resolveCreditProxy(s.creditProxy) })
        };
      }));
      return points;
    }
  }
};

const SCRAPED_PATH = path.resolve(process.cwd(), "data/dreamina-models-scraped.json");
let cache = null;
const CACHE_TTL_MS = 10 * 60 * 1e3;
function loadScraped() {
  try {
    if (!fs$1.existsSync(SCRAPED_PATH)) return null;
    return JSON.parse(fs$1.readFileSync(SCRAPED_PATH, "utf8"));
  } catch {
    return null;
  }
}
function fromScraped(file) {
  const image = (file.image_models || []).map((m) => ({
    id: m.model_req_key,
    object: "model",
    owned_by: "dreamina.capcut.com",
    model_type: "image",
    model_req_key: m.model_req_key,
    model_name: m.model_name,
    model_tip: m.model_tip,
    feats: m.feats,
    resolution_map: m.resolution_map,
    source: "ssr"
  }));
  const video = (file.video_models || []).map((m) => ({
    id: m.model_req_key,
    object: "model",
    owned_by: "dreamina.capcut.com",
    model_type: "video",
    model_req_key: m.model_req_key,
    model_name: m.model_name,
    model_tip: m.model_tip,
    options: m.options,
    source: "ssr"
  }));
  return [...image, ...video];
}
function mergeByReqKey(...lists) {
  const map = /* @__PURE__ */ new Map();
  for (const list of lists) {
    for (const item of list) {
      const prev = map.get(item.model_req_key);
      map.set(item.model_req_key, {
        ...prev,
        ...item,
        source: prev ? "merged" : item.source
      });
    }
  }
  return [...map.values()].sort((a, b) => a.id.localeCompare(b.id));
}
async function listModels(authorization) {
  if (cache && cache.expiresAt > Date.now()) {
    return {
      object: "list",
      data: cache.data,
      meta: { source: "cache", scraped_path: SCRAPED_PATH }
    };
  }
  const scraped = loadScraped();
  const scrapedModels = scraped ? fromScraped(scraped) : [];
  let apiModels = [];
  const data = mergeByReqKey(scrapedModels, apiModels);
  cache = { expiresAt: Date.now() + CACHE_TTL_MS, data };
  const source = apiModels.length > 0 && scrapedModels.length > 0 ? "ssr+api" : apiModels.length > 0 ? "api" : "ssr";
  return {
    object: "list",
    data,
    meta: { source, scraped_path: SCRAPED_PATH }
  };
}

const models = {
  prefix: "/v1",
  get: {
    "/models": async (request) => {
      return listModels();
    }
  }
};

const jobs = /* @__PURE__ */ new Map();
const TTL_MS = 24 * 60 * 60 * 1e3;
function createVideoJob() {
  const id = randomUUID();
  jobs.set(id, {
    id,
    status: "pending",
    createdAt: Date.now()
  });
  return id;
}
function setVideoJobProcessing(id) {
  const j = jobs.get(id);
  if (j) j.status = "processing";
}
function completeVideoJob(id, videoUrl) {
  var _a, _b;
  jobs.set(id, {
    id,
    status: "done",
    videoUrl,
    createdAt: (_b = (_a = jobs.get(id)) == null ? void 0 : _a.createdAt) != null ? _b : Date.now()
  });
}
function failVideoJob(id, error) {
  var _a;
  const j = jobs.get(id);
  jobs.set(id, {
    id,
    status: "failed",
    error,
    createdAt: (_a = j == null ? void 0 : j.createdAt) != null ? _a : Date.now()
  });
}
function getVideoJob(id) {
  const j = jobs.get(id);
  if (!j) return void 0;
  if (Date.now() - j.createdAt > TTL_MS) {
    jobs.set(id, { ...j, status: "expired" });
    return jobs.get(id);
  }
  return j;
}

async function runVideoGeneration(sessionId, norm, apiProxy) {
  return generateVideo(
    norm.model || DEFAULT_MODEL,
    norm.prompt,
    {
      width: norm.width,
      height: norm.height,
      resolution: norm.resolution,
      filePaths: norm.filePaths
    },
    sessionId,
    { proxyUrl: apiProxy }
  );
}
const videos = {
  prefix: "/v1/videos",
  post: {
    "/generations": async (request) => {
      request.validate("headers.authorization", _$1.isString);
      const session = requireActiveSession(request.headers.authorization);
      const norm = normalizeVideoBody(request.body);
      if (norm.asyncMode) {
        const requestId = createVideoJob();
        setVideoJobProcessing(requestId);
        runVideoGeneration(session.sessionId, norm, session.apiProxy).then((url) => completeVideoJob(requestId, url)).catch((err) => failVideoJob(requestId, (err == null ? void 0 : err.message) || String(err)));
        return grokVideoCreateResponse(requestId);
      }
      const videoUrl = await runVideoGeneration(session.sessionId, norm, session.apiProxy);
      if (norm.responseFormat === "b64_json") {
        const videoBase64 = await util.fetchFileBASE64(videoUrl);
        return {
          created: util.unixTimestamp(),
          data: [{
            b64_json: videoBase64,
            revised_prompt: norm.prompt
          }]
        };
      }
      return {
        created: util.unixTimestamp(),
        data: [{
          url: videoUrl,
          revised_prompt: norm.prompt
        }]
      };
    }
  },
  get: {
    "/:request_id": async (request) => {
      var _a;
      const requestId = (_a = request.params) == null ? void 0 : _a.request_id;
      if (!requestId) throw new Error("request_id required");
      const job = getVideoJob(requestId);
      if (!job) throw new Error("unknown request_id");
      return grokVideoPollResponse(
        job.id,
        job.status,
        job.videoUrl,
        job.error
      );
    }
  }
};

function assertPoolAdmin(request) {
  var _a;
  const key = getPoolApiKey();
  if (!key) throw new Error("\u672A\u914D\u7F6E pool_api_key\uFF0C\u8BF7\u8BBE\u7F6E\u73AF\u5883\u53D8\u91CF DREAMINE_POOL_API_KEY \u6216 POST /pool/settings");
  const auth = (((_a = request.headers) == null ? void 0 : _a.authorization) || "").replace(/^Bearer\s+/i, "").trim();
  if (auth !== key) throw new Error("pool admin unauthorized");
}
const pool = {
  prefix: "/pool",
  get: {
    "/settings": async (request) => {
      assertPoolAdmin(request);
      return { ...getProxySettings(), db_path: dbPath() };
    },
    "/accounts": async (request) => {
      assertPoolAdmin(request);
      return { data: listAccounts().map(toPublicAccount) };
    }
  },
  post: {
    "/settings": async (request) => {
      assertPoolAdmin(request);
      const { global_proxy_url, credit_refresh_proxy_url, pool_api_key } = request.body || {};
      if (_$1.isString(global_proxy_url)) setGlobalProxyUrl(global_proxy_url);
      if (_$1.isString(credit_refresh_proxy_url)) setCreditRefreshProxyUrl(credit_refresh_proxy_url);
      if (_$1.isString(pool_api_key)) setPoolApiKey(pool_api_key);
      return getProxySettings();
    },
    "/accounts": async (request) => {
      assertPoolAdmin(request);
      request.validate("body.session_id", _$1.isString);
      const { session_id, label, proxy_url } = request.body;
      addAccount(session_id, label, proxy_url);
      return { ok: true };
    },
    "/accounts/update": async (request) => {
      assertPoolAdmin(request);
      request.validate("body.id", _$1.isFinite);
      const { id, label, enabled, proxy_url, session_id } = request.body;
      updateAccount(Number(id), { label, enabled, proxy_url, session_id });
      return { ok: true };
    },
    "/accounts/delete": async (request) => {
      assertPoolAdmin(request);
      request.validate("body.id", _$1.isFinite);
      deleteAccount(Number(request.body.id));
      return { ok: true };
    },
    "/accounts/refresh-credit": async (request) => {
      var _a;
      assertPoolAdmin(request);
      if (((_a = request.body) == null ? void 0 : _a.id) !== void 0) {
        request.validate("body.id", _$1.isFinite);
        return refreshAccountCredit(Number(request.body.id));
      }
      return { results: await refreshAllCredits() };
    }
  }
};

const routes = [
  {
    get: {
      "/": async () => {
        const content = await fs.readFile("public/welcome.html");
        return new Response$1(content, {
          type: "html",
          headers: {
            Expires: "-1"
          }
        });
      }
    }
  },
  images,
  chat,
  ping,
  token,
  models,
  videos,
  pool
];

const INSERT_SQL = `INSERT INTO api_calls(
  path, method, model, account_id, from_pool, status_code, duration_ms, error, client_ip, created_at
) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
function logApiCall(input) {
  var _a, _b, _c, _d, _e, _f;
  const ts = Math.floor(Date.now() / 1e3);
  getDb().prepare(INSERT_SQL).run(
    input.path,
    input.method,
    (_a = input.model) != null ? _a : null,
    (_b = input.accountId) != null ? _b : null,
    input.fromPool ? 1 : 0,
    (_c = input.statusCode) != null ? _c : null,
    (_d = input.durationMs) != null ? _d : null,
    (_e = input.error) != null ? _e : null,
    (_f = input.clientIp) != null ? _f : null,
    ts
  );
}
function listApiCalls(limit = 100, offset = 0) {
  return getDb().prepare(
    `SELECT id, path, method, model, account_id, from_pool, status_code, duration_ms, error, client_ip, created_at
       FROM api_calls ORDER BY id DESC LIMIT ? OFFSET ?`
  ).all(limit, offset);
}
function countApiCalls() {
  const row = getDb().prepare("SELECT COUNT(*) AS c FROM api_calls").get();
  return row.c;
}
function apiCallStats(sinceTs) {
  return getDb().prepare(
    `SELECT
         COUNT(*) AS total,
         SUM(CASE WHEN status_code >= 400 OR error IS NOT NULL THEN 1 ELSE 0 END) AS errors,
         AVG(duration_ms) AS avg_ms
       FROM api_calls WHERE created_at >= ?`
  ).get(sinceTs);
}

function buildCtx(event) {
  var _a, _b, _c;
  const url = getRequestURL(event);
  const method = event.method;
  const headers = getRequestHeaders(event);
  return {
    request: {
      method,
      url: url.pathname + url.search,
      path: url.pathname,
      type: headers["content-type"] || "",
      headers,
      search: url.search,
      body: (_a = event.context.legacyBody) != null ? _a : {},
      files: (_b = event.context.legacyFiles) != null ? _b : {}
    },
    query: getQuery(event),
    params: (_c = event.context.legacyParams) != null ? _c : {},
    ip: getRequestIP(event, { xForwardedFor: true }),
    status: 200,
    type: "application/json",
    set: (h) => {
      for (const [k, v] of Object.entries(h)) setResponseHeader(event, k, String(v));
    },
    redirect: (target) => {
      event.context.legacyRedirect = target;
    },
    body: void 0
  };
}
function findHandler(tables, method, pathname) {
  const m = method.toLowerCase();
  for (const table of tables) {
    const prefix = table.prefix || "";
    const bucket = table[m];
    if (!bucket || typeof bucket !== "object") continue;
    for (const [pattern, handler] of Object.entries(bucket)) {
      const full = `${prefix}${pattern}`;
      const paramNames = [];
      const re = new RegExp(
        `^${full.replace(/:[^/]+/g, (seg) => {
          paramNames.push(seg.slice(1));
          return "([^/]+)";
        })}$`
      );
      const match = pathname.match(re);
      if (match && typeof handler === "function") {
        const params = {};
        paramNames.forEach((name, i) => {
          var _a;
          params[name] = (_a = match[i + 1]) != null ? _a : "";
        });
        return { handler, params };
      }
    }
  }
  return null;
}
function serializeBody(body) {
  if (Body.isInstance(body)) return body.toObject();
  return body;
}
function isReadableStream(body) {
  return !!body && typeof body === "object" && typeof body.pipe === "function";
}
function setResponseHeaders(event, headers) {
  if (!headers) return;
  for (const [key, value] of Object.entries(headers)) {
    if (value === void 0) continue;
    setResponseHeader(event, key, Array.isArray(value) ? value.map(String) : String(value));
  }
}
async function sendPayload(event, payload) {
  if (payload === void 0) {
    await send(event, "");
    return;
  }
  if (isReadableStream(payload)) {
    await sendStream(event, payload);
    return;
  }
  if (typeof payload === "string" || payload instanceof Uint8Array) {
    await send(event, payload);
    return;
  }
  if (payload instanceof ArrayBuffer) {
    await send(event, Buffer.from(payload));
    return;
  }
  await send(event, JSON.stringify(payload), "application/json");
}
async function dispatchLegacyApi(event) {
  const url = getRequestURL(event);
  const pathname = url.pathname;
  if (pathname.startsWith("/api/admin") || pathname.startsWith("/admin")) {
    return false;
  }
  const found = findHandler(routes, event.method, pathname);
  if (!found) return false;
  const started = Date.now();
  const ctx = buildCtx(event);
  ctx.params = found.params;
  const request = new Request(ctx);
  try {
    let result = await found.handler(request);
    if (!Response$1.isInstance(result)) {
      result = new Response$1(result);
    }
    const res = result;
    const redirect = event.context.legacyRedirect;
    if (redirect) {
      await sendRedirect(event, redirect, res.statusCode || 302);
      logApiCall({
        path: pathname,
        method: event.method,
        statusCode: res.statusCode || 302,
        durationMs: Date.now() - started,
        clientIp: request.remoteIP || void 0
      });
      return true;
    }
    if (res.statusCode) setResponseStatus(event, res.statusCode);
    setResponseHeaders(event, res.headers);
    if (res.type) setResponseHeader(event, "content-type", res.type);
    const payload = serializeBody(res.body);
    logApiCall({
      path: pathname,
      method: event.method,
      statusCode: res.statusCode || 200,
      durationMs: Date.now() - started,
      clientIp: request.remoteIP || void 0
    });
    await sendPayload(event, payload);
    return true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const failure = new Response$1(new FailureBody(err instanceof Error ? err : new Error(message)));
    logApiCall({
      path: pathname,
      method: event.method,
      statusCode: failure.statusCode || 500,
      durationMs: Date.now() - started,
      error: message,
      clientIp: request.remoteIP || void 0
    });
    setResponseStatus(event, failure.statusCode || 500);
    await sendPayload(event, serializeBody(failure.body));
    return true;
  }
}

const LEGACY_PREFIXES = ["/v1", "/pool"];
const _m9Ov2Y = defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;
  if (path === "/" && event.method === "GET") {
    return;
  }
  if (!LEGACY_PREFIXES.some((p) => path.startsWith(p))) {
    return;
  }
  if (["POST", "PUT", "PATCH"].includes(event.method)) {
    try {
      const body = await readBody(event);
      event.context.legacyBody = body != null ? body : {};
    } catch {
      event.context.legacyBody = {};
    }
  }
  const handled = await dispatchLegacyApi(event);
  if (handled) {
    return;
  }
});

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders$1(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

function baseURL() {
	
	return useRuntimeConfig().app.baseURL;
}
function buildAssetsDir() {
	
	return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
	return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
	
	const app = useRuntimeConfig().app;
	const publicBase = app.cdnURL || app.baseURL;
	return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

function getBearer(event) {
  const auth = getRequestHeader(event, "authorization") || "";
  return auth.replace(/^Bearer\s+/i, "").trim();
}
function assertAdmin(event) {
  const cfg = readAppConfig();
  if (!cfg.admin.enabled) {
    throw createError$1({ statusCode: 403, message: "admin panel disabled" });
  }
  const key = cfg.admin.api_key.trim();
  if (!key) {
    throw createError$1({
      statusCode: 503,
      message: "\u672A\u914D\u7F6E admin.api_key\uFF08config.toml\uFF09"
    });
  }
  const token = getBearer(event);
  if (token !== key) {
    throw createError$1({ statusCode: 401, message: "unauthorized" });
  }
}

createRequire(globalThis._importMeta_.url);

const collections = {
};

const DEFAULT_ENDPOINT = "https://api.iconify.design";
const _uoEltu = defineCachedEventHandler(async (event) => {
  const url = getRequestURL(event);
  if (!url)
    return createError$1({ status: 400, message: "Invalid icon request" });
  const options = useAppConfig().icon;
  const collectionName = event.context.params?.collection?.replace(/\.json$/, "");
  const collection = collectionName ? await collections[collectionName]?.() : null;
  const apiEndPoint = options.iconifyApiEndpoint || DEFAULT_ENDPOINT;
  const icons = url.searchParams.get("icons")?.split(",");
  if (collection) {
    if (icons?.length) {
      const data = getIcons(
        collection,
        icons
      );
      consola.debug(`[Icon] serving ${(icons || []).map((i) => "`" + collectionName + ":" + i + "`").join(",")} from bundled collection`);
      return data;
    }
  }
  if (options.fallbackToApi === true || options.fallbackToApi === "server-only") {
    const apiUrl = new URL("./" + basename(url.pathname) + url.search, apiEndPoint);
    consola.debug(`[Icon] fetching ${(icons || []).map((i) => "`" + collectionName + ":" + i + "`").join(",")} from iconify api`);
    if (apiUrl.host !== new URL(apiEndPoint).host) {
      return createError$1({ status: 400, message: "Invalid icon request" });
    }
    try {
      const data = await $fetch(apiUrl.href);
      return data;
    } catch (e) {
      consola.error(e);
      if (e.status === 404)
        return createError$1({ status: 404 });
      else
        return createError$1({ status: 500, message: "Failed to fetch fallback icon" });
    }
  }
  return createError$1({ status: 404 });
}, {
  group: "nuxt",
  name: "icon",
  getKey(event) {
    const collection = event.context.params?.collection?.replace(/\.json$/, "") || "unknown";
    const icons = String(getQuery(event).icons || "");
    return `${collection}_${icons.split(",")[0]}_${icons.length}_${hash$1(icons)}`;
  },
  swr: true,
  maxAge: 60 * 60 * 24 * 7
  // 1 week
});

const _SxA8c9 = defineEventHandler(() => {});

const _lazy_cA_g3W = () => import('../routes/api/admin/accounts.get.mjs');
const _lazy_u7nxPa = () => import('../routes/api/admin/accounts.post.mjs');
const _lazy_wSJIic = () => import('../routes/api/admin/accounts/_id_.delete.mjs');
const _lazy_y06UIK = () => import('../routes/api/admin/accounts/_id_.patch.mjs');
const _lazy_GL0aY5 = () => import('../routes/api/admin/accounts/_id/info.post.mjs');
const _lazy_7YCcx0 = () => import('../routes/api/admin/accounts/_id/refresh-session.post.mjs');
const _lazy_07NugC = () => import('../routes/api/admin/accounts/login.post.mjs');
const _lazy_CwIRZq = () => import('../routes/api/admin/accounts/refresh.post.mjs');
const _lazy_eDZQDH = () => import('../routes/api/admin/calls.get.mjs');
const _lazy_fLRlS6 = () => import('../routes/api/admin/config.get.mjs');
const _lazy_Nxwc_F = () => import('../routes/api/admin/config.put.mjs');
const _lazy_nSWJCJ = () => import('../routes/renderer.mjs').then(function (n) { return n.r; });

const handlers = [
  { route: '', handler: _RG7aAL, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _m9Ov2Y, lazy: false, middleware: true, method: undefined },
  { route: '/api/admin/accounts', handler: _lazy_cA_g3W, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/accounts', handler: _lazy_u7nxPa, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/accounts/:id', handler: _lazy_wSJIic, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/accounts/:id', handler: _lazy_y06UIK, lazy: true, middleware: false, method: "patch" },
  { route: '/api/admin/accounts/:id/info', handler: _lazy_GL0aY5, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/accounts/:id/refresh-session', handler: _lazy_7YCcx0, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/accounts/login', handler: _lazy_07NugC, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/accounts/refresh', handler: _lazy_CwIRZq, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/calls', handler: _lazy_eDZQDH, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/config', handler: _lazy_fLRlS6, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/config', handler: _lazy_Nxwc_F, lazy: true, middleware: false, method: "put" },
  { route: '/__nuxt_error', handler: _lazy_nSWJCJ, lazy: true, middleware: false, method: undefined },
  { route: '/api/_nuxt_icon/:collection', handler: _uoEltu, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_nSWJCJ, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => b(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return C(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp = createNitroApp();
function useNitroApp() {
  return nitroApp;
}
runNitroPlugins(nitroApp);

const debug = (...args) => {
};
function GracefulShutdown(server, opts) {
  opts = opts || {};
  const options = Object.assign(
    {
      signals: "SIGINT SIGTERM",
      timeout: 3e4,
      development: false,
      forceExit: true,
      onShutdown: (signal) => Promise.resolve(signal),
      preShutdown: (signal) => Promise.resolve(signal)
    },
    opts
  );
  let isShuttingDown = false;
  const connections = {};
  let connectionCounter = 0;
  const secureConnections = {};
  let secureConnectionCounter = 0;
  let failed = false;
  let finalRun = false;
  function onceFactory() {
    let called = false;
    return (emitter, events, callback) => {
      function call() {
        if (!called) {
          called = true;
          return Reflect.apply(callback, this, arguments);
        }
      }
      for (const e of events) {
        emitter.on(e, call);
      }
    };
  }
  const signals = options.signals.split(" ").map((s) => s.trim()).filter((s) => s.length > 0);
  const once = onceFactory();
  once(process, signals, (signal) => {
    debug("received shut down signal", signal);
    shutdown(signal).then(() => {
      if (options.forceExit) {
        process.exit(failed ? 1 : 0);
      }
    }).catch((error) => {
      debug("server shut down error occurred", error);
      process.exit(1);
    });
  });
  function isFunction(functionToCheck) {
    const getType = Object.prototype.toString.call(functionToCheck);
    return /^\[object\s([A-Za-z]+)?Function]$/.test(getType);
  }
  function destroy(socket, force = false) {
    if (socket._isIdle && isShuttingDown || force) {
      socket.destroy();
      if (socket.server instanceof http.Server) {
        delete connections[socket._connectionId];
      } else {
        delete secureConnections[socket._connectionId];
      }
    }
  }
  function destroyAllConnections(force = false) {
    debug("Destroy Connections : " + (force ? "forced close" : "close"));
    let counter = 0;
    let secureCounter = 0;
    for (const key of Object.keys(connections)) {
      const socket = connections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        counter++;
        destroy(socket);
      }
    }
    debug("Connections destroyed : " + counter);
    debug("Connection Counter    : " + connectionCounter);
    for (const key of Object.keys(secureConnections)) {
      const socket = secureConnections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        secureCounter++;
        destroy(socket);
      }
    }
    debug("Secure Connections destroyed : " + secureCounter);
    debug("Secure Connection Counter    : " + secureConnectionCounter);
  }
  server.on("request", (req, res) => {
    req.socket._isIdle = false;
    if (isShuttingDown && !res.headersSent) {
      res.setHeader("connection", "close");
    }
    res.on("finish", () => {
      req.socket._isIdle = true;
      destroy(req.socket);
    });
  });
  server.on("connection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = connectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      connections[id] = socket;
      socket.once("close", () => {
        delete connections[socket._connectionId];
      });
    }
  });
  server.on("secureConnection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = secureConnectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      secureConnections[id] = socket;
      socket.once("close", () => {
        delete secureConnections[socket._connectionId];
      });
    }
  });
  process.on("close", () => {
    debug("closed");
  });
  function shutdown(sig) {
    function cleanupHttp() {
      destroyAllConnections();
      debug("Close http server");
      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        });
      });
    }
    debug("shutdown signal - " + sig);
    if (options.development) {
      debug("DEV-Mode - immediate forceful shutdown");
      return process.exit(0);
    }
    function finalHandler() {
      if (!finalRun) {
        finalRun = true;
        if (options.finally && isFunction(options.finally)) {
          debug("executing finally()");
          options.finally();
        }
      }
      return Promise.resolve();
    }
    function waitForReadyToShutDown(totalNumInterval) {
      debug(`waitForReadyToShutDown... ${totalNumInterval}`);
      if (totalNumInterval === 0) {
        debug(
          `Could not close connections in time (${options.timeout}ms), will forcefully shut down`
        );
        return Promise.resolve(true);
      }
      const allConnectionsClosed = Object.keys(connections).length === 0 && Object.keys(secureConnections).length === 0;
      if (allConnectionsClosed) {
        debug("All connections closed. Continue to shutting down");
        return Promise.resolve(false);
      }
      debug("Schedule the next waitForReadyToShutdown");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(waitForReadyToShutDown(totalNumInterval - 1));
        }, 250);
      });
    }
    if (isShuttingDown) {
      return Promise.resolve();
    }
    debug("shutting down");
    return options.preShutdown(sig).then(() => {
      isShuttingDown = true;
      cleanupHttp();
    }).then(() => {
      const pollIterations = options.timeout ? Math.round(options.timeout / 250) : 0;
      return waitForReadyToShutDown(pollIterations);
    }).then((force) => {
      debug("Do onShutdown now");
      if (force) {
        destroyAllConnections(force);
      }
      return options.onShutdown(sig);
    }).then(finalHandler).catch((error) => {
      const errString = typeof error === "string" ? error : JSON.stringify(error);
      debug(errString);
      failed = true;
      throw errString;
    });
  }
  function shutdownManual() {
    return shutdown("manual");
  }
  return shutdownManual;
}

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT || "", 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  GracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((error) => {
          console.error(error);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

export { $fetch$1 as $, mergeConfig as A, writeAppConfig as B, applyConfigToEnv as C, syncTomlToSqlite as D, buildAssetsURL as E, publicAssetsURL as F, encodePath as G, defineRenderHandler as H, getRouteRules as I, getResponseStatusText as J, getResponseStatus as K, serialize$1 as L, defu as M, klona as N, hasProtocol as O, isScriptProtocol as P, joinURL as Q, parseQuery as R, defuFn as S, withQuery as T, sanitizeStatusCode as U, parseURL as V, decodePath as W, isEqual as X, getContext as Y, withTrailingSlash as Z, withoutTrailingSlash as _, trapUnhandledNodeErrors as a, baseURL as a0, createHooks as a1, executeAsync as a2, upperFirst as a3, useNitroApp as b, defineEventHandler as c, destr as d, assertAdmin as e, toPublicAccount as f, createError$1 as g, addAccount as h, getRouterParam as i, deleteAccount as j, updateAccount as k, listAccounts as l, fetchAccountInfo as m, refreshSession as n, loginWithEmail as o, refreshAccountCredit as p, refreshAllCredits as q, readBody as r, setupGracefulShutdown as s, toNodeListener as t, useRuntimeConfig as u, getQuery as v, listApiCalls as w, apiCallStats as x, countApiCalls as y, readAppConfig as z };
//# sourceMappingURL=nitro.mjs.map
