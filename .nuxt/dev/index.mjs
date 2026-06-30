import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import os, { tmpdir } from 'node:os';
import { Server } from 'node:http';
import path, { resolve, dirname, join } from 'node:path';
import crypto$1, { randomUUID } from 'node:crypto';
import { parentPort, threadId } from 'node:worker_threads';
import { defineEventHandler, handleCacheHeaders, splitCookiesString, createEvent, fetchWithEvent, isEvent, eventHandler, setHeaders, createError, sendRedirect, proxyRequest, getRequestHeader, setResponseHeaders as setResponseHeaders$1, setResponseStatus, send, getRequestHeaders, setResponseHeader, appendResponseHeader, getRequestURL, getResponseHeader, removeResponseHeader, getRequestIP, getQuery as getQuery$1, sendStream, readBody, getResponseStatus, createApp, createRouter as createRouter$1, toNodeListener, lazyEventHandler, getRouterParam, getResponseStatusText } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/h3/dist/index.mjs';
import { escapeHtml } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/@vue/shared/dist/shared.cjs.js';
import viteNodeEntry_mjs from 'file://H:/Documents/GitHub/dreamine2api/node_modules/@nuxt/vite-builder/dist/vite-node-entry.mjs';
import { viteNodeFetch } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/@nuxt/vite-builder/dist/vite-node.mjs';
import { createRenderer, getRequestDependencies, getPreloadLinks, getPrefetchLinks } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, withTrailingSlash, decodePath, withLeadingSlash, withoutTrailingSlash, joinRelativeURL, encodePath } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/ufo/dist/index.mjs';
import { renderToString } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/vue/server-renderer/index.mjs';
import { klona } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/klona/dist/index.mjs';
import defu, { defuFn } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/defu/dist/defu.mjs';
import destr, { destr as destr$1 } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/destr/dist/index.mjs';
import { snakeCase } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/scule/dist/index.mjs';
import { createHead as createHead$1, propsToString, renderSSRHead } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/unhead/dist/server.mjs';
import { stringify, uneval } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/devalue/index.js';
import { isVNode, isRef, toValue } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/vue/index.mjs';
import { DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/unhead/dist/plugins.mjs';
import { createHooks } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/hookable/dist/index.mjs';
import { createFetch, Headers as Headers$1 } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/ofetch/dist/node.mjs';
import { fetchNodeRequestHandler, callNodeRequestHandler } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/node-mock-http/dist/index.mjs';
import { createStorage, prefixStorage } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/unstorage/dist/index.mjs';
import unstorage_47drivers_47fs from 'file://H:/Documents/GitHub/dreamine2api/node_modules/unstorage/drivers/fs.mjs';
import file_58_47_47_47H_58_47Documents_47GitHub_47dreamine2api_47node_modules_47_64nuxt_47nitro_45server_47dist_47runtime_47utils_47cache_45driver_46js from 'file://H:/Documents/GitHub/dreamine2api/node_modules/@nuxt/nitro-server/dist/runtime/utils/cache-driver.js';
import { digest, hash as hash$1 } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/ohash/dist/index.mjs';
import { toRouteMatcher, createRouter } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/radix3/dist/index.mjs';
import { readFile } from 'node:fs/promises';
import consola, { consola as consola$1 } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/consola/dist/index.mjs';
import { ErrorParser } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/youch-core/build/index.js';
import { Youch } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/youch/build/index.js';
import { SourceMapConsumer } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/source-map/source-map.js';
import { AsyncLocalStorage } from 'node:async_hooks';
import { getContext } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/unctx/dist/index.mjs';
import { captureRawStackTrace, parseRawStackTrace } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/errx/dist/index.js';
import fs$1, { promises } from 'node:fs';
import * as TOML from 'file://H:/Documents/GitHub/dreamine2api/node_modules/smol-toml/dist/index.js';
import { createRequire } from 'node:module';
import _wH6JrtIxmaSoA8lCPWFnE9z4lQeXW6H5z3l5aymEQw from 'file://H:/Documents/GitHub/dreamine2api/node_modules/@nuxt/vite-builder/dist/fix-stacktrace.mjs';
import { fileURLToPath } from 'node:url';
import { dirname as dirname$1, resolve as resolve$1, basename } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/pathe/dist/index.mjs';
import _ from 'file://H:/Documents/GitHub/dreamine2api/node_modules/lodash/lodash.js';
import assert from 'node:assert';
import _util from 'node:util';
import fs from 'file://H:/Documents/GitHub/dreamine2api/node_modules/fs-extra/lib/index.js';
import { format } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/date-fns/index.mjs';
import yaml from 'file://H:/Documents/GitHub/dreamine2api/node_modules/yaml/dist/index.js';
import minimist from 'file://H:/Documents/GitHub/dreamine2api/node_modules/minimist/index.js';
import { Writable, Readable, PassThrough } from 'node:stream';
import mime from 'file://H:/Documents/GitHub/dreamine2api/node_modules/mime/dist/src/index.js';
import axios from 'file://H:/Documents/GitHub/dreamine2api/node_modules/axios/index.js';
import CRC32 from 'file://H:/Documents/GitHub/dreamine2api/node_modules/crc-32/crc32.js';
import randomstring from 'file://H:/Documents/GitHub/dreamine2api/node_modules/randomstring/index.js';
import { CronJob } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/cron/dist/index.js';
import { HttpsProxyAgent } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/https-proxy-agent/dist/index.js';
import { SocksProxyAgent } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/socks-proxy-agent/dist/index.js';
import { getIcons } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/@iconify/utils/lib/index.mjs';
import { collections } from 'file://H:/Documents/GitHub/dreamine2api/.nuxt/nuxt-icon-server-bundle.mjs';
import { walkResolver } from 'file://H:/Documents/GitHub/dreamine2api/node_modules/unhead/dist/utils.mjs';

const serverAssets = [{"baseName":"server","dir":"H:/Documents/GitHub/dreamine2api/server/assets"}];

const assets$1 = createStorage();

for (const asset of serverAssets) {
  assets$1.mount(asset.baseName, unstorage_47drivers_47fs({ base: asset.dir, ignore: (asset?.ignore || []) }));
}

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('root', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"H:/Documents/GitHub/dreamine2api","watchOptions":{"ignored":[null]}}));
storage.mount('src', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"H:/Documents/GitHub/dreamine2api/server","watchOptions":{"ignored":[null]}}));
storage.mount('cache:nuxt:payload', file_58_47_47_47H_58_47Documents_47GitHub_47dreamine2api_47node_modules_47_64nuxt_47nitro_45server_47dist_47runtime_47utils_47cache_45driver_46js({"driver":"file:///H:/Documents/GitHub/dreamine2api/node_modules/@nuxt/nitro-server/dist/runtime/utils/cache-driver.js","base":"H:/Documents/GitHub/dreamine2api/.nuxt/cache/nuxt/payload"}));
storage.mount('build', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"H:/Documents/GitHub/dreamine2api/.nuxt"}));
storage.mount('cache', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"H:/Documents/GitHub/dreamine2api/.nuxt/cache"}));
storage.mount('data', unstorage_47drivers_47fs({"driver":"fs","base":"H:/Documents/GitHub/dreamine2api/.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
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
    "buildId": "dev",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_fonts/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        },
        "cache": {
          "maxAge": 31536000
        }
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
  createRouter({ routes: config$1.nitro.routeRules })
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
            throw createError({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
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
            throw createError({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
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

const iframeStorageBridge = (nonce) => `
(function () {
  const NONCE = ${JSON.stringify(nonce)};
  const memoryStore = Object.create(null);

  const post = (type, payload) => {
    window.parent.postMessage({ type, nonce: NONCE, ...payload }, '*');
  };

  const isValid = (data) => data && data.nonce === NONCE;

  const mockStorage = {
    getItem(key) {
      return Object.hasOwn(memoryStore, key)
        ? memoryStore[key]
        : null;
    },
    setItem(key, value) {
      const v = String(value);
      memoryStore[key] = v;
      post('storage-set', { key, value: v });
    },
    removeItem(key) {
      delete memoryStore[key];
      post('storage-remove', { key });
    },
    clear() {
      for (const key of Object.keys(memoryStore))
        delete memoryStore[key];
      post('storage-clear', {});
    },
    key(index) {
      const keys = Object.keys(memoryStore);
      return keys[index] ?? null;
    },
    get length() {
      return Object.keys(memoryStore).length;
    }
  };

  const defineLocalStorage = () => {
    try {
      Object.defineProperty(window, 'localStorage', {
        value: mockStorage,
        writable: false,
        configurable: true
      });
    } catch {
      window.localStorage = mockStorage;
    }
  };

  defineLocalStorage();

  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!isValid(data) || data.type !== 'storage-sync-data') return;

    const incoming = data.data || {};
    for (const key of Object.keys(incoming))
      memoryStore[key] = incoming[key];

    if (typeof window.initTheme === 'function')
      window.initTheme();
    window.dispatchEvent(new Event('storage-ready'));
  });

  // Clipboard API is unavailable in data: URL iframe, so we use postMessage
  document.addEventListener('DOMContentLoaded', function() {
    window.copyErrorMessage = function(button) {
      post('clipboard-copy', { text: button.dataset.errorText });
      button.classList.add('copied');
      setTimeout(function() { button.classList.remove('copied'); }, 2000);
    };
  });

  post('storage-sync-request', {});
})();
`;
const parentStorageBridge = (nonce) => `
(function () {
  const host = document.querySelector('nuxt-error-overlay');
  if (!host) return;

  const NONCE = ${JSON.stringify(nonce)};
  const isValid = (data) => data && data.nonce === NONCE;

  // Handle clipboard copy from iframe
  window.addEventListener('message', function(e) {
    if (isValid(e.data) && e.data.type === 'clipboard-copy') {
      navigator.clipboard.writeText(e.data.text).catch(function() {});
    }
  });

  const collectLocalStorage = () => {
    const all = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k != null) all[k] = localStorage.getItem(k);
    }
    return all;
  };

  const attachWhenReady = () => {
    const root = host.shadowRoot;
    if (!root)
      return false;
    const iframe = root.getElementById('frame');
    if (!iframe || !iframe.contentWindow)
      return false;

    const handlers = {
      'storage-set': (d) => localStorage.setItem(d.key, d.value),
      'storage-remove': (d) => localStorage.removeItem(d.key),
      'storage-clear': () => localStorage.clear(),
      'storage-sync-request': () => {
        iframe.contentWindow.postMessage({
          type: 'storage-sync-data',
          data: collectLocalStorage(),
          nonce: NONCE
        }, '*');
      }
    };

    window.addEventListener('message', (event) => {
      const data = event.data;
      if (!isValid(data)) return;
      const fn = handlers[data.type];
      if (fn) fn(data);
    });

    return true;
  };

  if (attachWhenReady())
    return;

  const obs = new MutationObserver(() => {
    if (attachWhenReady())
      obs.disconnect();
  });

  obs.observe(host, { childList: true, subtree: true });
})();
`;
const errorCSS = `
:host {
  --preview-width: 240px;
  --preview-height: 180px;
  --base-width: 1200px;
  --base-height: 900px;
  --z-base: 999999998;
  --error-pip-left: auto;
  --error-pip-top: auto;
  --error-pip-right: 5px;
  --error-pip-bottom: 5px;
  --error-pip-origin: bottom right;
  --app-preview-left: auto;
  --app-preview-top: auto;
  --app-preview-right: 5px;
  --app-preview-bottom: 5px;
  all: initial;
  display: contents;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
#frame {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  border: none;
  z-index: var(--z-base);
}
#frame[inert] {
  left: var(--error-pip-left);
  top: var(--error-pip-top);
  right: var(--error-pip-right);
  bottom: var(--error-pip-bottom);
  width: var(--base-width);
  height: var(--base-height);
  transform: scale(calc(240 / 1200));
  transform-origin: var(--error-pip-origin);
  overflow: hidden;
  border-radius: calc(1200 * 8px / 240);
}
#preview {
  position: fixed;
  left: var(--app-preview-left);
  top: var(--app-preview-top);
  right: var(--app-preview-right);
  bottom: var(--app-preview-bottom);
  width: var(--preview-width);
  height: var(--preview-height);
  overflow: hidden;
  border-radius: 6px;
  pointer-events: none;
  z-index: var(--z-base);
  background: white;
  display: none;
}
#preview iframe {
  transform-origin: var(--error-pip-origin);
}
#frame:not([inert]) + #preview {
  display: block;
}
#toggle {
  position: fixed;
  left: var(--app-preview-left);
  top: var(--app-preview-top);
  right: calc(var(--app-preview-right) - 3px);
  bottom: calc(var(--app-preview-bottom) - 3px);
  width: var(--preview-width);
  height: var(--preview-height);
  background: none;
  border: 3px solid #00DC82;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s, box-shadow 0.2s;
  z-index: calc(var(--z-base) + 1);
  display: flex;
  align-items: center;
  justify-content: center;
}
#toggle:hover,
#toggle:focus {
  opacity: 1;
  box-shadow: 0 0 20px rgba(0, 220, 130, 0.6);
}
#toggle:focus-visible {
  outline: 3px solid #00DC82;
  outline-offset: 0;
  box-shadow: 0 0 24px rgba(0, 220, 130, 0.8);
}
#frame[inert] ~ #toggle {
  left: var(--error-pip-left);
  top: var(--error-pip-top);
  right: calc(var(--error-pip-right) - 3px);
  bottom: calc(var(--error-pip-bottom) - 3px);
  cursor: grab;
}
:host(.dragging) #frame[inert] ~ #toggle {
  cursor: grabbing;
}
#frame:not([inert]) ~ #toggle,
#frame:not([inert]) + #preview {
  cursor: grab;
}
:host(.dragging-preview) #frame:not([inert]) ~ #toggle,
:host(.dragging-preview) #frame:not([inert]) + #preview {
  cursor: grabbing;
}

#pip-close {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 16px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  pointer-events: auto;
}
#pip-close:focus-visible {
  outline: 2px solid #00DC82;
  outline-offset: 2px;
}

#pip-restore {
  position: fixed;
  right: 16px;
  bottom: 16px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 2px solid #00DC82;
  background: #111;
  color: #fff;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  z-index: calc(var(--z-base) + 2);
  cursor: grab;
}
#pip-restore:focus-visible {
  outline: 2px solid #00DC82;
  outline-offset: 2px;
}
:host(.dragging-restore) #pip-restore {
  cursor: grabbing;
}

#frame[hidden],
#toggle[hidden],
#preview[hidden],
#pip-restore[hidden],
#pip-close[hidden] {
  display: none !important;
}

@media (prefers-reduced-motion: reduce) {
  #toggle {
    transition: none;
  }
}
`;
function webComponentScript(base64HTML, startMinimized) {
	return `
(function () {
  try {
    // =========================
    // Host + Shadow
    // =========================
    const host = document.querySelector('nuxt-error-overlay');
    if (!host)
      return;
    const shadow = host.attachShadow({ mode: 'open' });

    // =========================
    // DOM helpers
    // =========================
    const el = (tag) => document.createElement(tag);
    const on = (node, type, fn, opts) => node.addEventListener(type, fn, opts);
    const hide = (node, v) => node.toggleAttribute('hidden', !!v);
    const setVar = (name, value) => host.style.setProperty(name, value);
    const unsetVar = (name) => host.style.removeProperty(name);

    // =========================
    // Create DOM
    // =========================
    const style = el('style');
    style.textContent = ${JSON.stringify(errorCSS)};

    const iframe = el('iframe');
    iframe.id = 'frame';
    iframe.src = 'data:text/html;base64,${base64HTML}';
    iframe.title = 'Detailed error stack trace';
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-top-navigation-by-user-activation');

    const preview = el('div');
    preview.id = 'preview';

    const toggle = el('div');
    toggle.id = 'toggle';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('tabindex', '0');
    toggle.innerHTML = '<span class="sr-only">Toggle detailed error view</span>';

    const liveRegion = el('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.className = 'sr-only';

    const pipCloseButton = el('button');
    pipCloseButton.id = 'pip-close';
    pipCloseButton.setAttribute('type', 'button');
    pipCloseButton.setAttribute('aria-label', 'Hide error preview overlay');
    pipCloseButton.innerHTML = '&times;';
    pipCloseButton.hidden = true;
    toggle.appendChild(pipCloseButton);

    const pipRestoreButton = el('button');
    pipRestoreButton.id = 'pip-restore';
    pipRestoreButton.setAttribute('type', 'button');
    pipRestoreButton.setAttribute('aria-label', 'Show error overlay');
    pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error overlay</span>';
    pipRestoreButton.hidden = true;

    // Order matters: #frame + #preview adjacency
    shadow.appendChild(style);
    shadow.appendChild(liveRegion);
    shadow.appendChild(iframe);
    shadow.appendChild(preview);
    shadow.appendChild(toggle);
    shadow.appendChild(pipRestoreButton);

    // =========================
    // Constants / keys
    // =========================
    const POS_KEYS = {
      position: 'nuxt-error-overlay:position',
      hiddenPretty: 'nuxt-error-overlay:error-pip:hidden',
      hiddenPreview: 'nuxt-error-overlay:app-preview:hidden'
    };

    const CSS_VARS = {
      pip: {
        left: '--error-pip-left',
        top: '--error-pip-top',
        right: '--error-pip-right',
        bottom: '--error-pip-bottom'
      },
      preview: {
        left: '--app-preview-left',
        top: '--app-preview-top',
        right: '--app-preview-right',
        bottom: '--app-preview-bottom'
      }
    };

    const MIN_GAP = 5;
    const DRAG_THRESHOLD = 2;

    // =========================
    // Local storage safe access + state
    // =========================
    let storageReady = true;
    let isPrettyHidden = false;
    let isPreviewHidden = false;

    const safeGet = (k) => {
      try {
        return localStorage.getItem(k);
      } catch {
        return null;
      }
    };

    const safeSet = (k, v) => {
      if (!storageReady) 
        return;
      try {
        localStorage.setItem(k, v);
      } catch {}
    };

    // =========================
    // Sizing helpers
    // =========================
    const vvSize = () => {
      const v = window.visualViewport;
      return v ? { w: v.width, h: v.height } : { w: window.innerWidth, h: window.innerHeight };
    };

    const previewSize = () => {
      const styles = getComputedStyle(host);
      const w = parseFloat(styles.getPropertyValue('--preview-width')) || 240;
      const h = parseFloat(styles.getPropertyValue('--preview-height')) || 180;
      return { w, h };
    };

    const sizeForTarget = (target) => {
      if (!target)
        return previewSize();
      const rect = target.getBoundingClientRect();
      if (rect.width && rect.height)
        return { w: rect.width, h: rect.height };
      return previewSize();
    };

    // =========================
    // Dock model + offset/alignment calculations
    // =========================
    const dock = { edge: null, offset: null, align: null, gap: null };

    const maxOffsetFor = (edge, size) => {
      const vv = vvSize();
      if (edge === 'left' || edge === 'right')
        return Math.max(MIN_GAP, vv.h - size.h - MIN_GAP);
      return Math.max(MIN_GAP, vv.w - size.w - MIN_GAP);
    };

    const clampOffset = (edge, value, size) => {
      const max = maxOffsetFor(edge, size);
      return Math.min(Math.max(value, MIN_GAP), max);
    };

    const updateDockAlignment = (size) => {
      if (!dock.edge || dock.offset == null)
        return;
      const max = maxOffsetFor(dock.edge, size);
      if (dock.offset <= max / 2) {
        dock.align = 'start';
        dock.gap = dock.offset;
      } else {
        dock.align = 'end';
        dock.gap = Math.max(0, max - dock.offset);
      }
    };

    const appliedOffsetFor = (size) => {
      if (!dock.edge || dock.offset == null)
        return null;
      const max = maxOffsetFor(dock.edge, size);

      if (dock.align === 'end' && typeof dock.gap === 'number') {
        return clampOffset(dock.edge, max - dock.gap, size);
      }
      if (dock.align === 'start' && typeof dock.gap === 'number') {
        return clampOffset(dock.edge, dock.gap, size);
      }
      return clampOffset(dock.edge, dock.offset, size);
    };

    const nearestEdgeAt = (x, y) => {
      const { w, h } = vvSize();
      const d = { left: x, right: w - x, top: y, bottom: h - y };
      return Object.keys(d).reduce((a, b) => (d[a] < d[b] ? a : b));
    };

    const cornerDefaultDock = () => {
      const vv = vvSize();
      const size = previewSize();
      const offset = Math.max(MIN_GAP, vv.w - size.w - MIN_GAP);
      return { edge: 'bottom', offset };
    };

    const currentTransformOrigin = () => {
      if (!dock.edge) return null;
      if (dock.edge === 'left' || dock.edge === 'top')
        return 'top left';
      if (dock.edge === 'right')
        return 'top right';
      return 'bottom left';
    };

    // =========================
    // Persist / load dock
    // =========================
    const loadDock = () => {
      const raw = safeGet(POS_KEYS.position);
      if (!raw)
        return;
      try {
        const parsed = JSON.parse(raw);
        const { edge, offset, align, gap } = parsed || {};
        if (!['left', 'right', 'top', 'bottom'].includes(edge))
          return;
        if (typeof offset !== 'number')
          return;

        dock.edge = edge;
        dock.offset = clampOffset(edge, offset, previewSize());
        dock.align = align === 'start' || align === 'end' ? align : null;
        dock.gap = typeof gap === 'number' ? gap : null;

        if (!dock.align || dock.gap == null)
          updateDockAlignment(previewSize());
      } catch {}
    };

    const persistDock = () => {
      if (!dock.edge || dock.offset == null)
        return; 
      safeSet(POS_KEYS.position, JSON.stringify({
        edge: dock.edge,
        offset: dock.offset,
        align: dock.align,
        gap: dock.gap
      }));
    };

    // =========================
    // Apply dock
    // =========================
    const dockToVars = (vars) => ({
      set: (side, v) => host.style.setProperty(vars[side], v),
      clear: (side) => host.style.removeProperty(vars[side])
    });

    const dockToEl = (node) => ({
      set: (side, v) => { node.style[side] = v; },
      clear: (side) => { node.style[side] = ''; }
    });

    const applyDock = (target, size, opts) => {
      if (!dock.edge || dock.offset == null) {
        target.clear('left');
        target.clear('top');
        target.clear('right');
        target.clear('bottom');
        return;
      }

      target.set('left', 'auto');
      target.set('top', 'auto');
      target.set('right', 'auto');
      target.set('bottom', 'auto');

      const applied = appliedOffsetFor(size);

      if (dock.edge === 'left') {
        target.set('left', MIN_GAP + 'px');
        target.set('top', applied + 'px');
      } else if (dock.edge === 'right') {
        target.set('right', MIN_GAP + 'px');
        target.set('top', applied + 'px');
      } else if (dock.edge === 'top') {
        target.set('top', MIN_GAP + 'px');
        target.set('left', applied + 'px');
      } else {
        target.set('bottom', MIN_GAP + 'px');
        target.set('left', applied + 'px');
      }

      if (!opts || opts.persist !== false)
        persistDock();
    };

    const applyDockAll = (opts) => {
      applyDock(dockToVars(CSS_VARS.pip), previewSize(), opts);
      applyDock(dockToVars(CSS_VARS.preview), previewSize(), opts);
      applyDock(dockToEl(pipRestoreButton), sizeForTarget(pipRestoreButton), opts);
    };

    const repaintToDock = () => {
      if (!dock.edge || dock.offset == null)
        return;
      const origin = currentTransformOrigin();
      if (origin)
        setVar('--error-pip-origin', origin);
      else 
        unsetVar('--error-pip-origin');
      applyDockAll({ persist: false });
    };

    // =========================
    // Hidden state + UI
    // =========================
    const loadHidden = () => {
      const rawPretty = safeGet(POS_KEYS.hiddenPretty);
      if (rawPretty != null)
        isPrettyHidden = rawPretty === '1' || rawPretty === 'true';
      const rawPreview = safeGet(POS_KEYS.hiddenPreview);
      if (rawPreview != null)
        isPreviewHidden = rawPreview === '1' || rawPreview === 'true';
    };

    const setPrettyHidden = (v) => {
      isPrettyHidden = !!v;
      safeSet(POS_KEYS.hiddenPretty, isPrettyHidden ? '1' : '0');
      updateUI();
    };

    const setPreviewHidden = (v) => {
      isPreviewHidden = !!v;
      safeSet(POS_KEYS.hiddenPreview, isPreviewHidden ? '1' : '0');
      updateUI();
    };

    const isMinimized = () => iframe.hasAttribute('inert');

    const setMinimized = (v) => {
      if (v) {
        iframe.setAttribute('inert', '');
        toggle.setAttribute('aria-expanded', 'false');
      } else {
        iframe.removeAttribute('inert');
        toggle.setAttribute('aria-expanded', 'true');
      }
    };

    const setRestoreLabel = (kind) => {
      if (kind === 'pretty') {
        pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error overlay</span>';
        pipRestoreButton.setAttribute('aria-label', 'Show error overlay');
      } else {
        pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error page</span>';
        pipRestoreButton.setAttribute('aria-label', 'Show error page');
      }
    };

    const updateUI = () => {
      const minimized = isMinimized();
      const showPiP = minimized && !isPrettyHidden;
      const showPreview = !minimized && !isPreviewHidden;
      const pipHiddenByUser = minimized && isPrettyHidden;
      const previewHiddenByUser = !minimized && isPreviewHidden;
      const showToggle = minimized ? showPiP : showPreview;
      const showRestore = pipHiddenByUser || previewHiddenByUser;

      hide(iframe, pipHiddenByUser);
      hide(preview, !showPreview);
      hide(toggle, !showToggle);
      hide(pipCloseButton, !showToggle);
      hide(pipRestoreButton, !showRestore);

      pipCloseButton.setAttribute('aria-label', minimized ? 'Hide error overlay' : 'Hide error page preview');

      if (pipHiddenByUser)
        setRestoreLabel('pretty');
      else if (previewHiddenByUser)
        setRestoreLabel('preview');

      host.classList.toggle('pip-hidden', isPrettyHidden);
      host.classList.toggle('preview-hidden', isPreviewHidden);
    };

    // =========================
    // Preview snapshot
    // =========================
    const updatePreview = () => {
      try {
        let previewIframe = preview.querySelector('iframe');
        if (!previewIframe) {
          previewIframe = el('iframe');
          previewIframe.style.cssText = 'width: 1200px; height: 900px; transform: scale(0.2); transform-origin: top left; border: none;';
          previewIframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
          preview.appendChild(previewIframe);
        }

        const doctype = document.doctype ? '<!DOCTYPE ' + document.doctype.name + '>' : '';
        const cleanedHTML = document.documentElement.outerHTML
          .replace(/<nuxt-error-overlay[^>]*>.*?<\\/nuxt-error-overlay>/gs, '')
          .replace(/<script[^>]*>.*?<\\/script>/gs, '');

        const iframeDoc = previewIframe.contentDocument || previewIframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(doctype + cleanedHTML);
        iframeDoc.close();
      } catch (err) {
        console.error('Failed to update preview:', err);
      }
    };

    // =========================
    // View toggling
    // =========================
    const toggleView = () => {
      if (isMinimized()) {
        updatePreview();
        setMinimized(false);
        liveRegion.textContent = 'Showing detailed error view';
        setTimeout(() => { 
          try { 
            iframe.contentWindow.focus();
          } catch {}
        }, 100);
      } else {
        setMinimized(true);
        liveRegion.textContent = 'Showing error page';
        repaintToDock();
        void iframe.offsetWidth;
      }
      updateUI();
    };

    // =========================
    // Dragging (unified, rAF throttled)
    // =========================
    let drag = null;
    let rafId = null;
    let suppressToggleClick = false;
    let suppressRestoreClick = false;

    const beginDrag = (e) => {
      if (drag) 
        return;

      if (!dock.edge || dock.offset == null) {
        const def = cornerDefaultDock();
        dock.edge = def.edge;
        dock.offset = def.offset;
        updateDockAlignment(previewSize());
      }

      const isRestoreTarget = e.currentTarget === pipRestoreButton;

      drag = {
        kind: isRestoreTarget ? 'restore' : (isMinimized() ? 'pip' : 'preview'),
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastY: e.clientY,
        moved: false,
        target: e.currentTarget
      };

      drag.target.setPointerCapture(e.pointerId);

      if (drag.kind === 'restore')
        host.classList.add('dragging-restore');
      else 
        host.classList.add(drag.kind === 'pip' ? 'dragging' : 'dragging-preview');

      e.preventDefault();
    };

    const moveDrag = (e) => {
      if (!drag || drag.pointerId !== e.pointerId)
        return;

      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      
      const dx = drag.lastX - drag.startX;
      const dy = drag.lastY - drag.startY;

      if (!drag.moved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
        drag.moved = true;
      }

      if (!drag.moved)
        return;
      if (rafId)
        return;

      rafId = requestAnimationFrame(() => {
        rafId = null;

        const edge = nearestEdgeAt(drag.lastX, drag.lastY);
        const size = sizeForTarget(drag.target);

        let offset;
        if (edge === 'left' || edge === 'right') {
          const top = drag.lastY - (size.h / 2);
          offset = clampOffset(edge, Math.round(top), size);
        } else {
          const left = drag.lastX - (size.w / 2);
          offset = clampOffset(edge, Math.round(left), size);
        }

        dock.edge = edge;
        dock.offset = offset;
        updateDockAlignment(size);

        const origin = currentTransformOrigin();
        setVar('--error-pip-origin', origin || 'bottom right');

        applyDockAll({ persist: false });
      });
    };

    const endDrag = (e) => {
      if (!drag || drag.pointerId !== e.pointerId)
        return;

      const endedKind = drag.kind;
      drag.target.releasePointerCapture(e.pointerId);

      if (endedKind === 'restore')
        host.classList.remove('dragging-restore');
      else 
        host.classList.remove(endedKind === 'pip' ? 'dragging' : 'dragging-preview');

      const didMove = drag.moved;
      drag = null;

      if (didMove) {
        persistDock();
        if (endedKind === 'restore')
          suppressRestoreClick = true;
        else 
          suppressToggleClick = true;
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const bindDragTarget = (node) => {
      on(node, 'pointerdown', beginDrag);
      on(node, 'pointermove', moveDrag);
      on(node, 'pointerup', endDrag);
      on(node, 'pointercancel', endDrag);
    };

    bindDragTarget(toggle);
    bindDragTarget(pipRestoreButton);

    // =========================
    // Events (toggle / close / restore)
    // =========================
    on(toggle, 'click', (e) => {
      if (suppressToggleClick) {
        e.preventDefault();
        suppressToggleClick = false;
        return;
      }
      toggleView();
    });

    on(toggle, 'keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleView();
      }
    });

    on(pipCloseButton, 'click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isMinimized())
        setPrettyHidden(true);
      else
        setPreviewHidden(true);
    });

    on(pipCloseButton, 'pointerdown', (e) => {
      e.stopPropagation();
    });

    on(pipRestoreButton, 'click', (e) => {
      if (suppressRestoreClick) {
        e.preventDefault();
        suppressRestoreClick = false;
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      if (isMinimized()) 
        setPrettyHidden(false);
      else 
        setPreviewHidden(false);
    });

    // =========================
    // Lifecycle: load / sync / repaint
    // =========================
    const loadState = () => {
      loadDock();
      loadHidden();

      if (isPrettyHidden && !isMinimized())
        setMinimized(true);

      updateUI();
      repaintToDock();
    };

    loadState();

    on(window, 'storage-ready', () => {
      storageReady = true;
      loadState();
    });

    const onViewportChange = () => repaintToDock();

    on(window, 'resize', onViewportChange);

    if (window.visualViewport) {
      on(window.visualViewport, 'resize', onViewportChange);
      on(window.visualViewport, 'scroll', onViewportChange);
    }

    // initial preview
    setTimeout(updatePreview, 100);

    // initial minimized option
    if (${startMinimized}) {
      setMinimized(true);
      repaintToDock();
      void iframe.offsetWidth;
      updateUI();
    }
  } catch (err) {
    console.error('Failed to initialize Nuxt error overlay:', err);
  }
})();
`;
}
function generateErrorOverlayHTML(html, options) {
	const nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
	const errorPage = html.replace("<head>", `<head><script>${iframeStorageBridge(nonce)}<\/script>`);
	const base64HTML = Buffer.from(errorPage, "utf8").toString("base64");
	return `
    <script>${parentStorageBridge(nonce)}<\/script>
    <nuxt-error-overlay></nuxt-error-overlay>
    <script>${webComponentScript(base64HTML, options?.startMinimized ?? false)}<\/script>
  `;
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
	if (typeof defaultRes.body !== "string" && Array.isArray(defaultRes.body.stack)) {
		
		defaultRes.body.stack = defaultRes.body.stack.join("\n");
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
		const { template } = await Promise.resolve().then(function () { return error500; });
		{
			
			errorObject.description = errorObject.message;
		}
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
	if (!globalThis._importMeta_.test && typeof html === "string") {
		const prettyResponse = await defaultHandler(error, event, { json: false });
		if (typeof prettyResponse.body === "string") {
			return send(event, html.replace("</body>", `${generateErrorOverlayHTML(prettyResponse.body, { startMinimized: 300 <= status && status < 500 })}</body>`));
		}
	}
	return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  async function defaultNitroErrorHandler(error, event) {
    const res = await defaultHandler(error, event);
    if (!event.node?.res.headersSent) {
      setResponseHeaders$1(event, res.headers);
    }
    setResponseStatus(event, res.status, res.statusText);
    return send(
      event,
      typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2)
    );
  }
);
async function defaultHandler(error, event, opts) {
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
  await loadStackTrace(error).catch(consola.error);
  const youch = new Youch();
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    const ansiError = await (await youch.toANSI(error)).replaceAll(process.cwd(), ".");
    consola.error(
      `[request error] ${tags} [${event.method}] ${url}

`,
      ansiError
    );
  }
  const useJSON = opts?.json ?? !getRequestHeader(event, "accept")?.includes("text/html");
  const headers = {
    "content-type": useJSON ? "application/json" : "text/html",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';"
  };
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = useJSON ? {
    error: true,
    url,
    statusCode,
    statusMessage,
    message: error.message,
    data: error.data,
    stack: error.stack?.split("\n").map((line) => line.trim())
  } : await youch.toHTML(error, {
    request: {
      url: url.href,
      method: event.method,
      headers: getRequestHeaders(event)
    }
  });
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}
async function loadStackTrace(error) {
  if (!(error instanceof Error)) {
    return;
  }
  const parsed = await new ErrorParser().defineSourceLoader(sourceLoader).parse(error);
  const stack = error.message + "\n" + parsed.frames.map((frame) => fmtFrame(frame)).join("\n");
  Object.defineProperty(error, "stack", { value: stack });
  if (error.cause) {
    await loadStackTrace(error.cause).catch(consola.error);
  }
}
async function sourceLoader(frame) {
  if (!frame.fileName || frame.fileType !== "fs" || frame.type === "native") {
    return;
  }
  if (frame.type === "app") {
    const rawSourceMap = await readFile(`${frame.fileName}.map`, "utf8").catch(() => {
    });
    if (rawSourceMap) {
      const consumer = await new SourceMapConsumer(rawSourceMap);
      const originalPosition = consumer.originalPositionFor({ line: frame.lineNumber, column: frame.columnNumber });
      if (originalPosition.source && originalPosition.line) {
        frame.fileName = resolve(dirname(frame.fileName), originalPosition.source);
        frame.lineNumber = originalPosition.line;
        frame.columnNumber = originalPosition.column || 0;
      }
    }
  }
  const contents = await readFile(frame.fileName, "utf8").catch(() => {
  });
  return contents ? { contents } : void 0;
}
function fmtFrame(frame) {
  if (frame.type === "native") {
    return frame.raw;
  }
  const src = `${frame.fileName || ""}:${frame.lineNumber}:${frame.columnNumber})`;
  return frame.functionName ? `at ${frame.functionName} (${src}` : `at ${src}`;
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

const script$1 = `
if (!window.__NUXT_DEVTOOLS_TIME_METRIC__) {
  Object.defineProperty(window, '__NUXT_DEVTOOLS_TIME_METRIC__', {
    value: {},
    enumerable: false,
    configurable: true,
  })
}
window.__NUXT_DEVTOOLS_TIME_METRIC__.appInit = Date.now()
`;

const _2Zop7jU7k_l_c_Q2ZvtpULiHLjWrjSqfbpcHAX_X8 = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script$1}<\/script>`);
  });
});

const rootDir = "H:/Documents/GitHub/dreamine2api";

const appHead = {"meta":[{"name":"viewport","content":"width=device-width, initial-scale=1"},{"charset":"utf-8"}],"link":[],"style":[],"script":[],"noscript":[]};

const appRootTag = "div";

const appRootAttrs = {"id":"__nuxt","class":"isolate"};

const appTeleportTag = "div";

const appTeleportAttrs = {"id":"teleports"};

const appId = "nuxt-app";

const devReducers = {
	VNode: (data) => isVNode(data) ? {
		type: data.type,
		props: data.props
	} : undefined,
	URL: (data) => data instanceof URL ? data.toString() : undefined,
	Symbol: (data) => typeof data === "symbol" ? data.description ?? "" : undefined
};
const asyncContext = getContext("nuxt-dev", {
	asyncContext: true,
	AsyncLocalStorage
});
const _LgSMiGE7G3eMv8AGZNnZUm0o7U14YhDrEt9m4KNNG4 = (nitroApp) => {
	const handler = nitroApp.h3App.handler;
	nitroApp.h3App.handler = (event) => {
		return asyncContext.callAsync({
			logs: [],
			event
		}, () => handler(event));
	};
	onConsoleLog((_log) => {
		const ctx = asyncContext.tryUse();
		if (!ctx) {
			return;
		}
		const rawStack = captureRawStackTrace();
		if (!rawStack || rawStack.includes("runtime/vite-node.mjs")) {
			return;
		}
		const trace = [];
		let filename = "";
		for (const entry of parseRawStackTrace(rawStack)) {
			if (entry.source === globalThis._importMeta_.url) {
				continue;
			}
			if (EXCLUDE_TRACE_RE.test(entry.source)) {
				continue;
			}
			filename ||= entry.source.replace(withTrailingSlash(rootDir), "");
			trace.push({
				...entry,
				source: entry.source.startsWith("file://") ? entry.source.replace("file://", "") : entry.source
			});
		}
		const log = {
			..._log,
			
			filename,
			
			stack: trace
		};
		
		ctx.logs.push(log);
	});
	nitroApp.hooks.hook("afterResponse", () => {
		const ctx = asyncContext.tryUse();
		if (!ctx) {
			return;
		}
		return nitroApp.hooks.callHook("dev:ssr-logs", {
			logs: ctx.logs,
			path: ctx.event.path
		});
	});
	
	nitroApp.hooks.hook("render:html", (htmlContext) => {
		const ctx = asyncContext.tryUse();
		if (!ctx) {
			return;
		}
		try {
			const reducers = Object.assign(Object.create(null), devReducers, ctx.event.context["~payloadReducers"]);
			htmlContext.bodyAppend.unshift(`<script type="application/json" data-nuxt-logs="${appId}">${stringify(ctx.logs, reducers)}<\/script>`);
		} catch (e) {
			const shortError = e instanceof Error && "toString" in e ? ` Received \`${e.toString()}\`.` : "";
			console.warn(`[nuxt] Failed to stringify dev server logs.${shortError} You can define your own reducer/reviver for rich types following the instructions in https://nuxt.com/docs/api/composables/use-nuxt-app#payload.`);
		}
	});
};
const EXCLUDE_TRACE_RE = /\/node_modules\/(?:.*\/)?(?:nuxt|nuxt-nightly|nuxt-edge|nuxt3|consola|@vue)\/|core\/runtime\/nitro/;
function onConsoleLog(callback) {
	consola$1.addReporter({ log(logObj) {
		callback(logObj);
	} });
	consola$1.wrapConsole();
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
    this.env = _.defaultTo(cmdArgs2.env || envVars2.SERVER_ENV, "dev");
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
    crypto$1.randomFillSync(rnds8Pool);
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
    return _.isArray(value) && (!value[0] || _.isArray(value[0]) && _.isArray(value[value.length - 1]));
  },
  uuid: (separator = true) => separator ? v1() : v1().replace(/\-/g, ""),
  autoId: (prefix = "") => {
    let index = autoIdMap.get(prefix);
    if (index > 999999) index = 0;
    autoIdMap.set(prefix, (index || 0) + 1);
    return `${prefix}${index || 1}`;
  },
  ignoreJSONParse(value) {
    const result = _.attempt(() => JSON.parse(value));
    if (_.isError(result)) return null;
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
    if (!_.isFunction(callback))
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
    return _.isString(value) && (/^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/.test(
      value
    ) || /\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*/.test(
      value
    ));
  },
  isPort(value) {
    return _.isNumber(value) && value > 0 && value < 65536;
  },
  isReadStream(value) {
    return value && (value instanceof Readable || "readable" in value || value.readable);
  },
  isWriteStream(value) {
    return value && (value instanceof Writable || "writable" in value || value.writable);
  },
  isHttpStatusCode(value) {
    return _.isNumber(value) && Object.values(HTTP_STATUS_CODES).includes(value);
  },
  isURL(value) {
    return !_.isUndefined(value) && /^(http|https)/.test(value);
  },
  isSrc(value) {
    return !_.isUndefined(value) && /^\/.+\.[0-9a-zA-Z]+(\?.+)?$/.test(value);
  },
  isBASE64(value) {
    return !_.isUndefined(value) && /^[a-zA-Z0-9\/\+]+(=?)+$/.test(value);
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
    return _.isFinite(Number(value));
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
    if (_.isString(milliseconds)) return milliseconds;
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
    return crypto$1.createHash("md5").update(value).digest("hex");
  },
  crc32(value) {
    return _.isBuffer(value) ? CRC32.buf(value) : CRC32.str(value);
  },
  arrayParse(value) {
    return _.isArray(value) ? value : [value];
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
    this.name = _.defaultTo(name, "dreamina-free-api");
    this.host = _.defaultTo(host, "0.0.0.0");
    this.port = _.defaultTo(port, 5200);
    this.urlPrefix = _.defaultTo(urlPrefix, "");
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
    const external = _.pickBy(environment, (v, k) => ["name", "host", "port"].includes(k) && !_.isUndefined(v));
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
    this.requestLog = _.defaultTo(requestLog, false);
    this.tmpDir = _.defaultTo(tmpDir, "./tmp");
    this.logDir = _.defaultTo(logDir, "./logs");
    this.logWriteInterval = _.defaultTo(logWriteInterval, 200);
    this.logFileExpires = _.defaultTo(logFileExpires, 262656e4);
    this.publicDir = _.defaultTo(publicDir, "./public");
    this.tmpFileExpires = _.defaultTo(tmpFileExpires, 864e5);
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
    this.debug = _.defaultTo(debug, true);
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
  if (!match || !_.isString(match[2] || match[1]))
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
  return _.isString(colored) ? colored : content;
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
  return path.resolve(process.cwd(), "config.toml");
}
function readAppConfig() {
  const file = configFilePath();
  if (!fs$1.existsSync(file)) {
    writeAppConfig(DEFAULT_CONFIG);
    return structuredClone(DEFAULT_CONFIG);
  }
  const raw = TOML.parse(fs$1.readFileSync(file, "utf8"));
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
  fs$1.writeFileSync(file, TOML.stringify(doc), "utf8");
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
    process.env.DREAMINE_DB_PATH = path.resolve(process.cwd(), config.database.path);
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
  _2Zop7jU7k_l_c_Q2ZvtpULiHLjWrjSqfbpcHAX_X8,
_LgSMiGE7G3eMv8AGZNnZUm0o7U14YhDrEt9m4KNNG4,
_b9NnPMJR55LxyMsgOKeOTlYwg1z6m47FnZK5A28ZQw,
_sB7_AI4branVlKVkYEayE1oTtt04JwjmMJThH_bfQs,
_wH6JrtIxmaSoA8lCPWFnE9z4lQeXW6H5z3l5aymEQw
];

const assets = {
  "/index.mjs": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4cc66-mgcPAGgL1AWyktOWqbfES+RYYo0\"",
    "mtime": "2026-06-30T05:36:57.561Z",
    "size": 314470,
    "path": "index.mjs"
  },
  "/index.mjs.map": {
    "type": "application/json",
    "etag": "\"12aeea-ufJdrFSWqprCz+6ZabF1sGvDTQw\"",
    "mtime": "2026-06-30T05:36:57.564Z",
    "size": 1224426,
    "path": "index.mjs.map"
  }
};

function readAsset (id) {
  const serverDir = dirname$1(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve$1(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1},"/_fonts/":{"maxAge":31536000}};

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
      throw createError({ statusCode: 404 });
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
    assert(_.isArray(exception), "Exception must be Array");
    const [errcode, errmsg] = exception;
    assert(_.isFinite(errcode), "Exception errcode invalid");
    assert(_.isString(errmsg), "Exception errmsg invalid");
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
    this.data = _.defaultTo(value, null);
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
    this.time = Number(_.defaultTo(time, util.timestamp()));
  }
  validate(key, fn, message) {
    try {
      const value = _.get(this, key);
      if (fn) {
        if (fn(value) === false)
          throw `[Mismatch] -> ${fn}`;
      } else if (_.isUndefined(value))
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
    this.code = Number(_.defaultTo(code, 0));
    this.message = _.defaultTo(message, "OK");
    this.data = _.defaultTo(data, null);
    this.statusCode = Number(_.defaultTo(statusCode, 200));
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
    this.statusCode = Number(_.defaultTo(statusCode, Body.isInstance(body) ? body.statusCode : void 0));
    this.type = type;
    this.headers = headers;
    this.redirect = redirect;
    this.size = size;
    this.time = Number(_.defaultTo(time, util.timestamp()));
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
    if (_.isString(error))
      error = new Exception(EX.SYSTEM_ERROR, error);
    if (error instanceof APIException || error instanceof Exception)
      ({ errcode, errmsg, data, httpStatusCode } = error);
    else if (_.isError(error))
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
          ..._.omit(options, "headers")
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
            ..._.omit(axiosOpts, "params", "headers")
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
  if (!_.isFinite(Number(ret))) return result.data;
  if (ret === "0") return data;
  DreaminaErrorHandler.handleApiResponse(result.data, {
    context: "Dreamina API\u8BF7\u6C42",
    operation: "\u8BF7\u6C42"
  });
}
function tokenSplit(authorization) {
  return authorization.replace("Bearer ", "").split(",");
}
const PASSPORT_API_URL$1 = "https://login-row.www.capcut.com";
async function getTokenLiveStatus(refreshToken, proxyOpts = {}) {
  try {
    const info = await getAccountInfo(refreshToken, proxyOpts);
    return !!(info == null ? void 0 : info.user_id);
  } catch (err) {
    return false;
  }
}
async function getAccountInfo(refreshToken, proxyOpts = {}) {
  const token = await acquireToken(refreshToken);
  const deviceTime = util.unixTimestamp();
  const uri = "/passport/account/info/v2";
  const sign = util.md5(
    `9e2c|${uri.slice(-7)}|${PLATFORM_CODE}|${VERSION_CODE}|${deviceTime}||11ac`
  );
  const fullUrl = `${PASSPORT_API_URL$1}${uri}`;
  const headers = {
    ...FAKE_HEADERS,
    Cookie: generateCookie(token),
    "Device-Time": deviceTime.toString(),
    "Sign": sign,
    "Sign-Ver": "1",
    "Tdid": ""
  };
  logger.info(`\u53D1\u9001\u8D26\u6237\u4FE1\u606F\u8BF7\u6C42: POST ${fullUrl}`);
  const proxyUrl = resolveApiProxy(proxyOpts.proxyUrl);
  const response = await axios.request(
    withProxyConfig(
      {
        method: "POST",
        url: fullUrl,
        params: {
          aid: DEFAULT_ASSISTANT_ID,
          device_platform: "web",
          region: "US",
          account_sdk_source: "web"
        },
        headers,
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
  throw new Error(`\u8D26\u6237\u4FE1\u606F\u67E5\u8BE2\u5931\u8D25: ${errmsg || ret}`);
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
  let payloadHash = crypto$1.createHash("sha256").update("").digest("hex");
  if (method.toUpperCase() === "POST" && payload) {
    payloadHash = crypto$1.createHash("sha256").update(payload, "utf8").digest("hex");
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
    crypto$1.createHash("sha256").update(canonicalRequest, "utf8").digest("hex")
  ].join("\n");
  const kDate = crypto$1.createHmac("sha256", `AWS4${secretAccessKey}`).update(date).digest();
  const kRegion = crypto$1.createHmac("sha256", kDate).update(region).digest();
  const kService = crypto$1.createHmac("sha256", kRegion).update(service).digest();
  const kSigning = crypto$1.createHmac("sha256", kService).update("aws4_request").digest();
  const signature = crypto$1.createHmac("sha256", kSigning).update(stringToSign).digest("hex");
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
    const payloadHash = crypto$1.createHash("sha256").update(commitPayload, "utf8").digest("hex");
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
  return _.sample(rows);
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
  return _.sample(resolveSessions(authorization));
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
    sampleStrength: _.isFinite(body.sample_strength) ? body.sample_strength : void 0,
    responseFormat: body.response_format || "url",
    imageUrls
  };
}
function normalizeVideoBody(body) {
  var _a;
  const prompt = String((_a = body.prompt) != null ? _a : "");
  if (!prompt) throw new Error("prompt is required");
  const model = resolveModelReqKey(body.model);
  let width = _.isFinite(body.width) ? Number(body.width) : 1024;
  let height = _.isFinite(body.height) ? Number(body.height) : 1024;
  let ratio = body.ratio;
  if (!ratio && body.aspect_ratio) ratio = String(body.aspect_ratio);
  if (ratio && ASPECT_RATIOS[ratio]) {
    width = ASPECT_RATIOS[ratio].width;
    height = ASPECT_RATIOS[ratio].height;
  }
  const resolution = resolutionFromGrok(
    typeof body.resolution === "string" ? body.resolution : void 0
  );
  const durationSec = _.isFinite(body.duration) ? Number(body.duration) : void 0;
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
      request.validate("headers.authorization", _.isString);
      const session = requireActiveSession(request.headers.authorization);
      const norm = normalizeImageBody(request.body);
      if (norm.imageUrls.length > 0) {
        throw new Error("\u56FE\u751F\u56FE\u8BF7\u4F7F\u7528 POST /v1/images/edits \u6216 /v1/images/compositions");
      }
      const ratioConfig = parseRatio(norm.ratio);
      const width = ratioConfig.width;
      const height = ratioConfig.height;
      const responseFormat = _.defaultTo(norm.responseFormat, "url");
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
      request.validate("headers.authorization", _.isString);
      const session = requireActiveSession(request.headers.authorization);
      const norm = normalizeImageBody(request.body);
      if (norm.imageUrls.length === 0) {
        throw new Error("image edits \u9700\u8981 image / image_url \u6216 images \u53C2\u6570");
      }
      if (norm.imageUrls.length > 10) {
        throw new Error("\u6700\u591A\u652F\u630110\u5F20\u8F93\u5165\u56FE\u7247");
      }
      const ratioConfig = parseRatio(norm.ratio);
      const responseFormat = _.defaultTo(norm.responseFormat, "url");
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
      request.validate("body.model", (v) => _.isUndefined(v) || _.isString(v)).validate("body.prompt", _.isString).validate("body.images", _.isArray).validate("body.negative_prompt", (v) => _.isUndefined(v) || _.isString(v)).validate("body.ratio", (v) => _.isUndefined(v) || _.isString(v)).validate("body.sample_strength", (v) => _.isUndefined(v) || _.isFinite(v)).validate("body.response_format", (v) => _.isUndefined(v) || _.isString(v)).validate("headers.authorization", _.isString);
      const session = requireActiveSession(request.headers.authorization);
      const { images } = request.body;
      if (!images || images.length === 0) {
        throw new Error("\u81F3\u5C11\u9700\u8981\u63D0\u4F9B1\u5F20\u8F93\u5165\u56FE\u7247");
      }
      if (images.length > 10) {
        throw new Error("\u6700\u591A\u652F\u630110\u5F20\u8F93\u5165\u56FE\u7247");
      }
      images.forEach((image, index) => {
        if (!_.isString(image) && !_.isObject(image)) {
          throw new Error(`\u56FE\u7247 ${index + 1} \u683C\u5F0F\u4E0D\u6B63\u786E\uFF1A\u5E94\u4E3AURL\u5B57\u7B26\u4E32\u6216\u5305\u542Burl\u5B57\u6BB5\u7684\u5BF9\u8C61`);
        }
        if (_.isObject(image) && !image.url) {
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
      const imageUrls = images.map((img) => _.isString(img) ? img : img.url);
      const responseFormat = _.defaultTo(response_format, "url");
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
      request.validate("body.submit_ids", _.isArray).validate("headers.authorization", _.isString);
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
  let payloadHash = crypto$1.createHash("sha256").update("").digest("hex");
  if (method.toUpperCase() === "POST" && payload) {
    payloadHash = crypto$1.createHash("sha256").update(payload, "utf8").digest("hex");
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
    crypto$1.createHash("sha256").update(canonicalRequest, "utf8").digest("hex")
  ].join("\n");
  const kDate = crypto$1.createHmac("sha256", `AWS4${secretAccessKey}`).update(date).digest();
  const kRegion = crypto$1.createHmac("sha256", kDate).update(region).digest();
  const kService = crypto$1.createHmac("sha256", kRegion).update(service).digest();
  const kSigning = crypto$1.createHmac("sha256", kService).update("aws4_request").digest();
  const signature = crypto$1.createHmac("sha256", kSigning).update(stringToSign).digest("hex");
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
    const payloadHash = crypto$1.createHash("sha256").update(commitPayload, "utf8").digest("hex");
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
      request.validate("body.model", (v) => _.isUndefined(v) || _.isString(v)).validate("body.messages", _.isArray).validate("headers.authorization", _.isString);
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
      request.validate("body.token", _.isString);
      const live = await getTokenLiveStatus(request.body.token);
      return {
        live
      };
    },
    "/points": async (request) => {
      request.validate("headers.authorization", _.isString);
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
      request.validate("headers.authorization", _.isString);
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
      if (_.isString(global_proxy_url)) setGlobalProxyUrl(global_proxy_url);
      if (_.isString(credit_refresh_proxy_url)) setCreditRefreshProxyUrl(credit_refresh_proxy_url);
      if (_.isString(pool_api_key)) setPoolApiKey(pool_api_key);
      return getProxySettings();
    },
    "/accounts": async (request) => {
      assertPoolAdmin(request);
      request.validate("body.session_id", _.isString);
      const { session_id, label, proxy_url } = request.body;
      addAccount(session_id, label, proxy_url);
      return { ok: true };
    },
    "/accounts/update": async (request) => {
      assertPoolAdmin(request);
      request.validate("body.id", _.isFinite);
      const { id, label, enabled, proxy_url, session_id } = request.body;
      updateAccount(Number(id), { label, enabled, proxy_url, session_id });
      return { ok: true };
    },
    "/accounts/delete": async (request) => {
      assertPoolAdmin(request);
      request.validate("body.id", _.isFinite);
      deleteAccount(Number(request.body.id));
      return { ok: true };
    },
    "/accounts/refresh-credit": async (request) => {
      var _a;
      assertPoolAdmin(request);
      if (((_a = request.body) == null ? void 0 : _a.id) !== void 0) {
        request.validate("body.id", _.isFinite);
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
    query: getQuery$1(event),
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

const scheduledTasks = false;

const tasks = {
  
};

const __runningTasks__ = {};
async function runTask(name, {
  payload = {},
  context = {}
} = {}) {
  if (__runningTasks__[name]) {
    return __runningTasks__[name];
  }
  if (!(name in tasks)) {
    throw createError({
      message: `Task \`${name}\` is not available!`,
      statusCode: 404
    });
  }
  if (!tasks[name].resolve) {
    throw createError({
      message: `Task \`${name}\` is not implemented!`,
      statusCode: 501
    });
  }
  const handler = await tasks[name].resolve();
  const taskEvent = { name, payload, context };
  __runningTasks__[name] = handler.run(taskEvent);
  try {
    const res = await __runningTasks__[name];
    return res;
  } finally {
    delete __runningTasks__[name];
  }
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
    throw createError({ statusCode: 403, message: "admin panel disabled" });
  }
  const key = cfg.admin.api_key.trim();
  if (!key) {
    throw createError({
      statusCode: 503,
      message: "\u672A\u914D\u7F6E admin.api_key\uFF08config.toml\uFF09"
    });
  }
  const token = getBearer(event);
  if (token !== key) {
    throw createError({ statusCode: 401, message: "unauthorized" });
  }
}

const warnOnceSet = /* @__PURE__ */ new Set();
const DEFAULT_ENDPOINT = "https://api.iconify.design";
const _uoEltu = defineCachedEventHandler(async (event) => {
  const url = getRequestURL(event);
  if (!url)
    return createError({ status: 400, message: "Invalid icon request" });
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
      consola$1.debug(`[Icon] serving ${(icons || []).map((i) => "`" + collectionName + ":" + i + "`").join(",")} from bundled collection`);
      return data;
    }
  } else {
    if (collectionName && !warnOnceSet.has(collectionName) && apiEndPoint === DEFAULT_ENDPOINT) {
      consola$1.warn([
        `[Icon] Collection \`${collectionName}\` is not found locally`,
        `We suggest to install it via \`npm i -D @iconify-json/${collectionName}\` to provide the best end-user experience.`
      ].join("\n"));
      warnOnceSet.add(collectionName);
    }
  }
  if (options.fallbackToApi === true || options.fallbackToApi === "server-only") {
    const apiUrl = new URL("./" + basename(url.pathname) + url.search, apiEndPoint);
    consola$1.debug(`[Icon] fetching ${(icons || []).map((i) => "`" + collectionName + ":" + i + "`").join(",")} from iconify api`);
    if (apiUrl.host !== new URL(apiEndPoint).host) {
      return createError({ status: 400, message: "Invalid icon request" });
    }
    try {
      const data = await $fetch(apiUrl.href);
      return data;
    } catch (e) {
      consola$1.error(e);
      if (e.status === 404)
        return createError({ status: 404 });
      else
        return createError({ status: 500, message: "Failed to fetch fallback icon" });
    }
  }
  return createError({ status: 404 });
}, {
  group: "nuxt",
  name: "icon",
  getKey(event) {
    const collection = event.context.params?.collection?.replace(/\.json$/, "") || "unknown";
    const icons = String(getQuery$1(event).icons || "");
    return `${collection}_${icons.split(",")[0]}_${icons.length}_${hash$1(icons)}`;
  },
  swr: true,
  maxAge: 60 * 60 * 24 * 7
  // 1 week
});

const VueResolver = (_, value) => {
  return isRef(value) ? toValue(value) : value;
};

const headSymbol = "usehead";
// @__NO_SIDE_EFFECTS__
function vueInstall(head) {
  const plugin = {
    install(app) {
      app.config.globalProperties.$unhead = head;
      app.config.globalProperties.$head = head;
      app.provide(headSymbol, head);
    }
  };
  return plugin.install;
}

// @__NO_SIDE_EFFECTS__
function resolveUnrefHeadInput(input) {
  return walkResolver(input, VueResolver);
}

function filterIslandProps(props) {
  if (!props) {
    return {};
  }
  const out = {};
  for (const key in props) {
    if (!key.startsWith("data-v-")) {
      out[key] = props[key];
    }
  }
  return out;
}
function computeIslandHash(name, filteredProps, context, source) {
  return hash$1([name, filteredProps, context, source]).replace(/[-_]/g, "");
}

// @__NO_SIDE_EFFECTS__
function createHead(options = {}) {
  const head = createHead$1({
    ...options,
    propResolvers: [VueResolver]
  });
  head.install = vueInstall(head);
  return head;
}

const unheadOptions = {
  disableDefaults: true,
  disableCapoSorting: false,
  plugins: [DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin],
};

function encodeEventPath(path) {
	const queryIndex = path.indexOf("?");
	if (queryIndex === -1) {
		return encodePath(path);
	}
	return encodePath(path.slice(0, queryIndex)) + path.slice(queryIndex);
}
function createSSRContext(event) {
	const url = encodeEventPath(event.path);
	const ssrContext = {
		url,
		event,
		runtimeConfig: useRuntimeConfig(event),
		noSSR: event.context.nuxt?.noSSR || (false),
		head: createHead(unheadOptions),
		error: false,
		nuxt: undefined,
		payload: {},
		["~payloadReducers"]: Object.create(null),
		modules: new Set()
	};
	return ssrContext;
}
function setSSRError(ssrContext, error) {
	ssrContext.error = true;
	ssrContext.payload = { error };
	ssrContext.url = error.url;
}

// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__buildAssetsURL = buildAssetsURL;
// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__publicAssetsURL = publicAssetsURL;
const APP_ROOT_OPEN_TAG = `<${appRootTag}${propsToString(appRootAttrs)}>`;
const APP_ROOT_CLOSE_TAG = `</${appRootTag}>`;
// @ts-expect-error file will be produced after app build
const getServerEntry = () => Promise.resolve().then(function () { return server; }).then((r) => r.default || r);
// @ts-expect-error file will be produced after app build
const getClientManifest = () => Promise.resolve().then(function () { return client_manifest$1; }).then((r) => r.default || r).then((r) => typeof r === "function" ? r() : r);

const getSSRRenderer = lazyCachedFunction(async () => {
	
	const createSSRApp = await getServerEntry();
	if (!createSSRApp) {
		throw new Error("Server bundle is not available");
	}
	
	const precomputed = undefined ;
	
	const renderer = createRenderer(createSSRApp, {
		precomputed,
		manifest: await getClientManifest() ,
		renderToString: renderToString$1,
		buildAssetsURL
	});
	async function renderToString$1(input, context) {
		const html = await renderToString(input, context);
		
		
		if (process.env.NUXT_VITE_NODE_OPTIONS) {
			renderer.rendererContext.updateManifest(await getClientManifest());
		}
		return APP_ROOT_OPEN_TAG + html + APP_ROOT_CLOSE_TAG;
	}
	return renderer;
});

const getSPARenderer = lazyCachedFunction(async () => {
	const precomputed = undefined ;
	// @ts-expect-error virtual file
	const spaTemplate = await Promise.resolve().then(function () { return _virtual__spaTemplate; }).then((r) => r.template).catch(() => "").then((r) => {
		{
			return APP_ROOT_OPEN_TAG + r + APP_ROOT_CLOSE_TAG;
		}
	});
	
	const renderer = createRenderer(() => () => {}, {
		precomputed,
		manifest: await getClientManifest() ,
		renderToString: () => spaTemplate,
		buildAssetsURL
	});
	const result = await renderer.renderToString({});
	const renderToString = (ssrContext) => {
		const config = useRuntimeConfig(ssrContext.event);
		ssrContext.modules ||= new Set();
		ssrContext.payload.serverRendered = false;
		ssrContext.config = {
			public: config.public,
			app: config.app
		};
		return Promise.resolve(result);
	};
	return {
		rendererContext: renderer.rendererContext,
		renderToString
	};
});
function lazyCachedFunction(fn) {
	let res = null;
	return () => {
		if (res === null) {
			res = fn().catch((err) => {
				res = null;
				throw err;
			});
		}
		return res;
	};
}
function getRenderer(ssrContext) {
	return ssrContext.noSSR ? getSPARenderer() : getSSRRenderer();
}
// @ts-expect-error file will be produced after app build
const getSSRStyles = lazyCachedFunction(() => Promise.resolve().then(function () { return styles$1; }).then((r) => r.default || r));

async function renderInlineStyles(usedModules) {
	const styleMap = await getSSRStyles();
	const inlinedStyles = new Set();
	for (const mod of usedModules) {
		if (mod in styleMap && styleMap[mod]) {
			for (const style of await styleMap[mod]()) {
				inlinedStyles.add(style);
			}
		}
	}
	return Array.from(inlinedStyles).map((style) => ({ innerHTML: style }));
}

// @ts-expect-error virtual file
const ROOT_NODE_REGEX = new RegExp(`^<${appRootTag}[^>]*>([\\s\\S]*)<\\/${appRootTag}>$`);

function getServerComponentHTML(body) {
	const match = body.match(ROOT_NODE_REGEX);
	return match?.[1] || body;
}
const SSR_SLOT_TELEPORT_MARKER = /^uid=([^;]*);slot=(.*)$/;
const SSR_CLIENT_TELEPORT_MARKER = /^uid=([^;]*);client=(.*)$/;
const SSR_CLIENT_SLOT_MARKER = /^island-slot=([^;]*);(.*)$/;
function getSlotIslandResponse(ssrContext) {
	if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.slots).length) {
		return undefined;
	}
	const response = {};
	for (const [name, slot] of Object.entries(ssrContext.islandContext.slots)) {
		response[name] = {
			...slot,
			fallback: ssrContext.teleports?.[`island-fallback=${name}`]
		};
	}
	return response;
}
function getClientIslandResponse(ssrContext) {
	if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.components).length) {
		return undefined;
	}
	const response = {};
	for (const [clientUid, component] of Object.entries(ssrContext.islandContext.components)) {
		
		const html = ssrContext.teleports?.[clientUid]?.replaceAll("<!--teleport start anchor-->", "") || "";
		response[clientUid] = {
			...component,
			html,
			slots: getComponentSlotTeleport(clientUid, ssrContext.teleports ?? {})
		};
	}
	return response;
}
function getComponentSlotTeleport(clientUid, teleports) {
	const entries = Object.entries(teleports);
	const slots = {};
	for (const [key, value] of entries) {
		const match = key.match(SSR_CLIENT_SLOT_MARKER);
		if (match) {
			const [, id, slot] = match;
			if (!slot || clientUid !== id) {
				continue;
			}
			slots[slot] = value;
		}
	}
	return slots;
}
function replaceIslandTeleports(ssrContext, html) {
	const { teleports, islandContext } = ssrContext;
	if (islandContext || !teleports) {
		return html;
	}
	for (const key in teleports) {
		const matchClientComp = key.match(SSR_CLIENT_TELEPORT_MARKER);
		if (matchClientComp) {
			const [, uid, clientId] = matchClientComp;
			if (!uid || !clientId) {
				continue;
			}
			html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-component="${clientId}"[^>]*>`), (full) => {
				return full + teleports[key];
			});
			continue;
		}
		const matchSlot = key.match(SSR_SLOT_TELEPORT_MARKER);
		if (matchSlot) {
			const [, uid, slot] = matchSlot;
			if (!uid || !slot) {
				continue;
			}
			html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-slot="${slot}"[^>]*>`), (full) => {
				return full + teleports[key];
			});
		}
	}
	return html;
}

const ISLAND_SUFFIX_RE = /\.json(?:\?.*)?$/;
const handler$1 = defineEventHandler(async (event) => {
	const nitroApp = useNitroApp();
	setResponseHeaders$1(event, {
		"content-type": "application/json;charset=utf-8",
		"x-powered-by": "Nuxt"
	});
	const islandContext = await getIslandContext(event);
	const ssrContext = {
		...createSSRContext(event),
		islandContext,
		noSSR: false,
		url: islandContext.url
	};
	
	const renderer = await getSSRRenderer();
	const renderResult = await renderer.renderToString(ssrContext).catch(async (err) => {
		if (ssrContext["~renderResponse"] && err?.message === "skipping render") {
			return {};
		}
		await ssrContext.nuxt?.hooks.callHook("app:error", err);
		throw err;
	});
	
	
	await ssrContext.nuxt?.hooks.callHook("app:rendered", {
		ssrContext,
		renderResult
	});
	if (ssrContext["~renderResponse"]) {
		const response = ssrContext["~renderResponse"];
		if (response.statusCode && response.statusCode >= 400) {
			throw createError({
				statusCode: response.statusCode,
				statusMessage: response.statusMessage
			});
		}
		return returnIslandResponse(event, response);
	}
	
	if (ssrContext.payload?.error) {
		throw ssrContext.payload.error;
	}
	const inlinedStyles = await renderInlineStyles(ssrContext.modules ?? []);
	if (inlinedStyles.length) {
		ssrContext.head.push({ style: inlinedStyles });
	}
	{
		const { styles } = getRequestDependencies(ssrContext, renderer.rendererContext);
		const link = [];
		for (const resource of Object.values(styles)) {
			
			if ("inline" in getQuery(resource.file)) {
				continue;
			}
			
			
			if (resource.file.includes("scoped") && !resource.file.includes("pages/")) {
				link.push({
					rel: "stylesheet",
					href: renderer.rendererContext.buildAssetsURL(resource.file),
					crossorigin: ""
				});
			}
		}
		if (link.length) {
			ssrContext.head.push({ link }, { mode: "server" });
		}
	}
	const islandHead = {};
	for (const entry of ssrContext.head.entries.values()) {
		
		for (const [key, value] of Object.entries(resolveUnrefHeadInput(entry.input))) {
			const currentValue = islandHead[key];
			if (Array.isArray(currentValue)) {
				currentValue.push(...value);
			} else {
				islandHead[key] = value;
			}
		}
	}
	
	islandHead.link ||= [];
	islandHead.style ||= [];
	const islandResponse = {
		id: islandContext.id,
		head: islandHead,
		html: getServerComponentHTML(renderResult.html),
		components: getClientIslandResponse(ssrContext),
		slots: getSlotIslandResponse(ssrContext)
	};
	await nitroApp.hooks.callHook("render:island", islandResponse, {
		event,
		islandContext
	});
	return islandResponse;
});
function returnIslandResponse(event, response) {
	for (const header in response.headers || {}) {
		setResponseHeader(event, header, response.headers[header]);
	}
	if (response.statusCode) {
		setResponseStatus(event, response.statusCode, response.statusMessage);
	}
	return response.body;
}
const ISLAND_PATH_PREFIX = "/__nuxt_island/";
const VALID_COMPONENT_NAME_RE = /^[a-z][\w.-]*$/i;
async function getIslandContext(event) {
	let url = event.path || "";
	url.replace(/\?.*$/, "");
	if (!url.startsWith(ISLAND_PATH_PREFIX)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid island request path"
		});
	}
	const componentParts = url.substring(ISLAND_PATH_PREFIX.length).replace(ISLAND_SUFFIX_RE, "").split("_");
	const hashId = componentParts.length > 1 ? componentParts.pop() : undefined;
	const componentName = componentParts.join("_");
	if (!componentName || !VALID_COMPONENT_NAME_RE.test(componentName)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid island component name"
		});
	}
	const rawContext = event.method === "GET" ? getQuery$1(event) : await readBody(event);
	const rawProps = destr$1(rawContext?.props) || {};
	const filteredProps = filterIslandProps(rawProps);
	
	
	const clientContext = {};
	if (rawContext && typeof rawContext === "object") {
		for (const key in rawContext) {
			if (key !== "props") {
				clientContext[key] = rawContext[key];
			}
		}
	}
	
	
	const expectedHash = computeIslandHash(componentName, filteredProps, clientContext, undefined);
	if (!hashId || hashId !== expectedHash) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid island request hash"
		});
	}
	return {
		url: typeof rawContext?.url === "string" ? rawContext.url : "/",
		id: hashId,
		name: componentName,
		props: rawProps,
		slots: {},
		components: {}
	};
}

const _lazy_cA_g3W = () => Promise.resolve().then(function () { return accounts_get$1; });
const _lazy_u7nxPa = () => Promise.resolve().then(function () { return accounts_post$1; });
const _lazy_wSJIic = () => Promise.resolve().then(function () { return _id__delete$1; });
const _lazy_y06UIK = () => Promise.resolve().then(function () { return _id__patch$1; });
const _lazy_GL0aY5 = () => Promise.resolve().then(function () { return info_post$1; });
const _lazy_7YCcx0 = () => Promise.resolve().then(function () { return refreshSession_post$1; });
const _lazy_07NugC = () => Promise.resolve().then(function () { return login_post$1; });
const _lazy_CwIRZq = () => Promise.resolve().then(function () { return refresh_post$1; });
const _lazy_eDZQDH = () => Promise.resolve().then(function () { return calls_get$1; });
const _lazy_fLRlS6 = () => Promise.resolve().then(function () { return config_get$1; });
const _lazy_Nxwc_F = () => Promise.resolve().then(function () { return config_put$1; });
const _lazy_nSWJCJ = () => Promise.resolve().then(function () { return renderer; });

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
  { route: '/__nuxt_island/**', handler: handler$1, lazy: false, middleware: false, method: undefined },
  { route: '/_fonts/**', handler: _lazy_nSWJCJ, lazy: true, middleware: false, method: undefined },
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
    debug: destr(true),
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
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter$1({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => callNodeRequestHandler(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return fetchNodeRequestHandler(
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
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

if (!globalThis.crypto) {
  globalThis.crypto = crypto$1.webcrypto;
}
const { NITRO_NO_UNIX_SOCKET, NITRO_DEV_WORKER_ID } = process.env;
trapUnhandledNodeErrors();
parentPort?.on("message", (msg) => {
  if (msg && msg.event === "shutdown") {
    shutdown();
  }
});
const nitroApp = useNitroApp();
const server$1 = new Server(toNodeListener(nitroApp.h3App));
let listener;
listen().catch(() => listen(
  true
  /* use random port */
)).catch((error) => {
  console.error("Dev worker failed to listen:", error);
  return shutdown();
});
nitroApp.router.get(
  "/_nitro/tasks",
  defineEventHandler(async (event) => {
    const _tasks = await Promise.all(
      Object.entries(tasks).map(async ([name, task]) => {
        const _task = await task.resolve?.();
        return [name, { description: _task?.meta?.description }];
      })
    );
    return {
      tasks: Object.fromEntries(_tasks),
      scheduledTasks
    };
  })
);
nitroApp.router.use(
  "/_nitro/tasks/:name",
  defineEventHandler(async (event) => {
    const name = getRouterParam(event, "name");
    const payload = {
      ...getQuery$1(event),
      ...await readBody(event).then((r) => r?.payload).catch(() => ({}))
    };
    return await runTask(name, { payload });
  })
);
function listen(useRandomPort = Boolean(
  NITRO_NO_UNIX_SOCKET || process.versions.webcontainer || "Bun" in globalThis && process.platform === "win32"
)) {
  return new Promise((resolve, reject) => {
    try {
      listener = server$1.listen(useRandomPort ? 0 : getSocketAddress(), () => {
        const address = server$1.address();
        parentPort?.postMessage({
          event: "listen",
          address: typeof address === "string" ? { socketPath: address } : { host: "localhost", port: address?.port }
        });
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
function getSocketAddress() {
  const socketName = `nitro-worker-${process.pid}-${threadId}-${NITRO_DEV_WORKER_ID}-${Math.round(Math.random() * 1e4)}.sock`;
  if (process.platform === "win32") {
    return join(String.raw`\\.\pipe`, socketName);
  }
  if (process.platform === "linux") {
    const nodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);
    if (nodeMajor >= 20) {
      return `\0${socketName}`;
    }
  }
  return join(tmpdir(), socketName);
}
async function shutdown() {
  server$1.closeAllConnections?.();
  await Promise.all([
    new Promise((resolve) => listener?.close(resolve)),
    nitroApp.hooks.callHook("close").catch(console.error)
  ]);
  parentPort?.postMessage({ event: "exit" });
}

const _messages = {
	"appName": "Nuxt",
	"version": "",
	"status": 500,
	"statusText": "Server error",
	"description": "This page is temporarily unavailable."
};
const template$1 = (messages) => {
	messages = {
		..._messages,
		...messages
	};
	return "<!DOCTYPE html><html lang=\"en\"><head><title>" + escapeHtml(messages.status) + " - " + escapeHtml(messages.statusText) + " | " + escapeHtml(messages.appName) + "</title><meta charset=\"utf-8\"><meta content=\"width=device-width,initial-scale=1.0,minimum-scale=1.0\" name=\"viewport\"><style>.spotlight{background:linear-gradient(45deg,#00dc82,#36e4da 50%,#0047e1);filter:blur(20vh)}*,:after,:before{border-color:var(--un-default-border-color,#e5e7eb);border-style:solid;border-width:0;box-sizing:border-box}:after,:before{--un-content:\"\"}html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-moz-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}body{line-height:inherit;margin:0}h1{font-size:inherit;font-weight:inherit}h1,p{margin:0}*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.fixed{position:fixed}.-bottom-1\\/2{bottom:-50%}.left-0{left:0}.right-0{right:0}.grid{display:grid}.mb-16{margin-bottom:4rem}.mb-8{margin-bottom:2rem}.h-1\\/2{height:50%}.max-w-520px{max-width:520px}.min-h-screen{min-height:100vh}.place-content-center{place-content:center}.overflow-hidden{overflow:hidden}.bg-white{--un-bg-opacity:1;background-color:rgb(255 255 255/var(--un-bg-opacity))}.px-8{padding-left:2rem;padding-right:2rem}.text-center{text-align:center}.text-8xl{font-size:6rem;line-height:1}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-black{--un-text-opacity:1;color:rgb(0 0 0/var(--un-text-opacity))}.font-light{font-weight:300}.font-medium{font-weight:500}.leading-tight{line-height:1.25}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}@media(prefers-color-scheme:dark){.dark\\:bg-black{--un-bg-opacity:1;background-color:rgb(0 0 0/var(--un-bg-opacity))}.dark\\:text-white{--un-text-opacity:1;color:rgb(255 255 255/var(--un-text-opacity))}}@media(min-width:640px){.sm\\:px-0{padding-left:0;padding-right:0}.sm\\:text-4xl{font-size:2.25rem;line-height:2.5rem}}</style><script>!function(){const e=document.createElement(\"link\").relList;if(!(e&&e.supports&&e.supports(\"modulepreload\"))){for(const e of document.querySelectorAll('link[rel=\"modulepreload\"]'))r(e);new MutationObserver(e=>{for(const o of e)if(\"childList\"===o.type)for(const e of o.addedNodes)\"LINK\"===e.tagName&&\"modulepreload\"===e.rel&&r(e)}).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;const r=function(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),\"use-credentials\"===e.crossOrigin?r.credentials=\"include\":\"anonymous\"===e.crossOrigin?r.credentials=\"omit\":r.credentials=\"same-origin\",r}(e);fetch(e.href,r)}}();<\/script></head><body class=\"antialiased bg-white dark:bg-black dark:text-white font-sans grid min-h-screen overflow-hidden place-content-center text-black\"><div class=\"-bottom-1/2 fixed h-1/2 left-0 right-0 spotlight\"></div><div class=\"max-w-520px text-center\"><h1 class=\"font-medium mb-8 sm:text-10xl text-8xl\">" + escapeHtml(messages.status) + "</h1><p class=\"font-light leading-tight mb-16 px-8 sm:px-0 sm:text-4xl text-xl\">" + escapeHtml(messages.description) + "</p></div></body></html>";
};

const error500 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template$1
}, Symbol.toStringTag, { value: 'Module' }));

const server = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: viteNodeEntry_mjs
}, Symbol.toStringTag, { value: 'Module' }));

const client_manifest = () => viteNodeFetch.getManifest();

const client_manifest$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: client_manifest
}, Symbol.toStringTag, { value: 'Module' }));

const template = "";

const _virtual__spaTemplate = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template
}, Symbol.toStringTag, { value: 'Module' }));

const styles = {};

const styles$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: styles
}, Symbol.toStringTag, { value: 'Module' }));

const accounts_get = defineEventHandler((event) => {
  assertAdmin(event);
  return { data: listAccounts().map(toPublicAccount) };
});

const accounts_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: accounts_get
}, Symbol.toStringTag, { value: 'Module' }));

const accounts_post = defineEventHandler(async (event) => {
  var _a;
  assertAdmin(event);
  const body = await readBody(event);
  if (!((_a = body == null ? void 0 : body.session_id) == null ? void 0 : _a.trim())) {
    throw createError({ statusCode: 400, message: "session_id required" });
  }
  addAccount(body.session_id, body.label, body.proxy_url);
  return { ok: true };
});

const accounts_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: accounts_post
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete = defineEventHandler((event) => {
  assertAdmin(event);
  const id = Number(getRouterParam(event, "id"));
  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, message: "invalid id" });
  }
  deleteAccount(id);
  return { ok: true };
});

const _id__delete$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete
}, Symbol.toStringTag, { value: 'Module' }));

const _id__patch = defineEventHandler(async (event) => {
  assertAdmin(event);
  const id = Number(getRouterParam(event, "id"));
  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, message: "invalid id" });
  }
  const body = await readBody(event);
  updateAccount(id, body);
  return { ok: true };
});

const _id__patch$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__patch
}, Symbol.toStringTag, { value: 'Module' }));

const info_post = defineEventHandler(async (event) => {
  assertAdmin(event);
  const id = Number(getRouterParam(event, "id"));
  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, message: "invalid id" });
  }
  try {
    return await fetchAccountInfo(id);
  } catch (e) {
    throw createError({ statusCode: 502, message: (e == null ? void 0 : e.message) || "\u83B7\u53D6\u8D26\u6237\u4FE1\u606F\u5931\u8D25" });
  }
});

const info_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: info_post
}, Symbol.toStringTag, { value: 'Module' }));

const refreshSession_post = defineEventHandler(async (event) => {
  assertAdmin(event);
  const id = Number(getRouterParam(event, "id"));
  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, message: "invalid id" });
  }
  try {
    return await refreshSession(id);
  } catch (e) {
    throw createError({ statusCode: 502, message: (e == null ? void 0 : e.message) || "\u5237\u65B0 session \u5931\u8D25" });
  }
});

const refreshSession_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: refreshSession_post
}, Symbol.toStringTag, { value: 'Module' }));

const login_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  assertAdmin(event);
  const body = await readBody(event);
  if (!((_a = body == null ? void 0 : body.email) == null ? void 0 : _a.trim())) {
    throw createError({ statusCode: 400, message: "email required" });
  }
  if (!(body == null ? void 0 : body.password)) {
    throw createError({ statusCode: 400, message: "password required" });
  }
  let result;
  try {
    result = await loginWithEmail(body.email, body.password, {
      proxyUrl: body.proxy_url
    });
  } catch (e) {
    throw createError({
      statusCode: 502,
      message: (e == null ? void 0 : e.message) || "\u767B\u5F55\u5931\u8D25\uFF1A\u65E0\u6CD5\u8FDE\u63A5 Dreamina passport \u670D\u52A1\uFF0C\u8BF7\u68C0\u67E5\u4EE3\u7406\u914D\u7F6E"
    });
  }
  const existing = listAccounts().find((a) => a.session_id === result.sessionId);
  const userName = ((_b = result.userInfo) == null ? void 0 : _b.name) || void 0;
  if (existing) {
    updateAccount(existing.id, {
      session_id: result.sessionId,
      label: ((_c = body.label) == null ? void 0 : _c.trim()) || existing.label,
      enabled: true,
      proxy_url: (_d = body.proxy_url) != null ? _d : existing.proxy_url,
      email: body.email,
      password: body.password,
      user_id: result.userId,
      user_name: userName
    });
    return {
      ok: true,
      action: "updated",
      id: existing.id,
      user_id: result.userId
    };
  }
  addAccount(result.sessionId, body.label, body.proxy_url, {
    email: body.email,
    password: body.password,
    userId: result.userId,
    userName
  });
  return {
    ok: true,
    action: "added",
    user_id: result.userId
  };
});

const login_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: login_post
}, Symbol.toStringTag, { value: 'Module' }));

const refresh_post = defineEventHandler(async (event) => {
  assertAdmin(event);
  const body = await readBody(event);
  if ((body == null ? void 0 : body.id) !== void 0) {
    return refreshAccountCredit(Number(body.id));
  }
  return { results: await refreshAllCredits() };
});

const refresh_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: refresh_post
}, Symbol.toStringTag, { value: 'Module' }));

const calls_get = defineEventHandler((event) => {
  assertAdmin(event);
  const query = getQuery$1(event);
  const limit = Math.min(Number(query.limit) || 50, 200);
  const offset = Number(query.offset) || 0;
  const sinceHours = Number(query.since_hours) || 24;
  const sinceTs = Math.floor(Date.now() / 1e3) - sinceHours * 3600;
  return {
    total: countApiCalls(),
    stats: apiCallStats(sinceTs),
    data: listApiCalls(limit, offset)
  };
});

const calls_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: calls_get
}, Symbol.toStringTag, { value: 'Module' }));

const config_get = defineEventHandler((event) => {
  assertAdmin(event);
  const cfg = readAppConfig();
  return {
    server: cfg.server,
    system: cfg.system,
    proxy: cfg.proxy,
    pool: { api_key_set: !!cfg.pool.api_key },
    admin: { enabled: cfg.admin.enabled, api_key_set: !!cfg.admin.api_key },
    database: cfg.database
  };
});

const config_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: config_get
}, Symbol.toStringTag, { value: 'Module' }));

const config_put = defineEventHandler(async (event) => {
  assertAdmin(event);
  const body = await readBody(event);
  const current = readAppConfig();
  const patch = { ...body };
  if (patch.pool && !patch.pool.api_key) {
    patch.pool = { ...current.pool, ...patch.pool, api_key: current.pool.api_key };
  }
  if (patch.admin && !patch.admin.api_key) {
    patch.admin = { ...current.admin, ...patch.admin, api_key: current.admin.api_key };
  }
  const next = mergeConfig(current, patch);
  writeAppConfig(next);
  applyConfigToEnv(next);
  syncTomlToSqlite(next);
  return { ok: true };
});

const config_put$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: config_put
}, Symbol.toStringTag, { value: 'Module' }));

function renderPayloadResponse(ssrContext) {
	return {
		body: encodeForwardSlashes(stringify(splitPayload(ssrContext).payload, ssrContext["~payloadReducers"])) ,
		statusCode: getResponseStatus(ssrContext.event),
		statusMessage: getResponseStatusText(ssrContext.event),
		headers: {
			"content-type": "application/json;charset=utf-8" ,
			"x-powered-by": "Nuxt"
		}
	};
}
function renderPayloadJsonScript(opts) {
	const contents = opts.data ? encodeForwardSlashes(stringify(opts.data, opts.ssrContext["~payloadReducers"])) : "";
	const payload = {
		"type": "application/json",
		"innerHTML": contents,
		"data-nuxt-data": appId,
		"data-ssr": !(opts.ssrContext.noSSR)
	};
	{
		payload.id = "__NUXT_DATA__";
	}
	if (opts.src) {
		payload["data-src"] = opts.src;
	}
	const config = uneval(opts.ssrContext.config);
	return [payload, { innerHTML: `window.__NUXT__={};window.__NUXT__.config=${config}` }];
}

function encodeForwardSlashes(str) {
	return str.replaceAll("/", "\\u002F");
}
function splitPayload(ssrContext) {
	const { data, prerenderedAt, ...initial } = ssrContext.payload;
	return {
		initial: {
			...initial,
			prerenderedAt
		},
		payload: {
			data,
			prerenderedAt
		}
	};
}

const renderSSRHeadOptions = {"omitLineBreaks":false};

// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__buildAssetsURL = buildAssetsURL;
// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__publicAssetsURL = publicAssetsURL;
const HAS_APP_TELEPORTS = !!(appTeleportAttrs.id);
const APP_TELEPORT_OPEN_TAG = HAS_APP_TELEPORTS ? `<${appTeleportTag}${propsToString(appTeleportAttrs)}>` : "";
const APP_TELEPORT_CLOSE_TAG = HAS_APP_TELEPORTS ? `</${appTeleportTag}>` : "";
const PAYLOAD_URL_RE = /^[^?]*\/_payload.json(?:\?.*)?$/ ;
const PAYLOAD_FILENAME = "_payload.json" ;
const handler = defineRenderHandler((event) => {
	
	const ssrError = event.path.startsWith("/__nuxt_error") ? getQuery$1(event) : null;
	if (ssrError && !("__unenv__" in event.node.req)) {
		throw createError({
			status: 404,
			statusText: "Page Not Found: /__nuxt_error",
			message: "Page Not Found: /__nuxt_error"
		});
	}
	return renderRoute(event, ssrError);
});
async function renderRoute(event, ssrError) {
	const nitroApp = useNitroApp();
	
	const ssrContext = createSSRContext(event);
	
	const headEntryOptions = { mode: "server" };
	ssrContext.head.push(appHead, headEntryOptions);
	if (ssrError) {
		
		const status = ssrError.status || ssrError.statusCode;
		if (status) {
			
			ssrError.status = ssrError.statusCode = Number.parseInt(status);
		}
		setSSRError(ssrContext, ssrError);
	}
	
	const routeOptions = getRouteRules(event);
	if (routeOptions.ssr === false) {
		ssrContext.noSSR = true;
	}
	
	const _PAYLOAD_EXTRACTION = !ssrContext.noSSR && ((routeOptions.isr || routeOptions.cache));
	const isRenderingPayload = (_PAYLOAD_EXTRACTION || routeOptions.prerender) && PAYLOAD_URL_RE.test(ssrContext.url);
	if (isRenderingPayload) {
		const url = ssrContext.url.substring(0, ssrContext.url.lastIndexOf("/")) || "/";
		ssrContext.url = url;
		event._path = event.node.req.url = url;
	}
	const payloadURL = _PAYLOAD_EXTRACTION ? joinURL(ssrContext.runtimeConfig.app.cdnURL || ssrContext.runtimeConfig.app.baseURL, ssrContext.url.replace(/\?.*$/, ""), PAYLOAD_FILENAME) + "?" + ssrContext.runtimeConfig.app.buildId : undefined;
	
	const renderer = await getRenderer(ssrContext);
	const _rendered = await renderer.renderToString(ssrContext).catch(async (error) => {
		
		
		if ((ssrContext["~renderResponse"] || ssrContext._renderResponse) && error.message === "skipping render") {
			return {};
		}
		
		const _err = !ssrError && ssrContext.payload?.error || error;
		await ssrContext.nuxt?.hooks.callHook("app:error", _err);
		throw _err;
	});
	
	
	const inlinedStyles = [];
	await ssrContext.nuxt?.hooks.callHook("app:rendered", {
		ssrContext,
		renderResult: _rendered
	});
	if (ssrContext["~renderResponse"] || ssrContext._renderResponse) {
		
		return ssrContext["~renderResponse"] || ssrContext._renderResponse;
	}
	
	if (ssrContext.payload?.error && !ssrError) {
		throw ssrContext.payload.error;
	}
	
	if (isRenderingPayload) {
		const response = renderPayloadResponse(ssrContext);
		return response;
	}
	const NO_SCRIPTS = routeOptions.noScripts;
	
	const { styles, scripts } = getRequestDependencies(ssrContext, renderer.rendererContext);
	
	if (_PAYLOAD_EXTRACTION && !NO_SCRIPTS) {
		ssrContext.head.push({ link: [{
			rel: "preload",
			as: "fetch",
			crossorigin: "anonymous",
			href: payloadURL
		} ] }, headEntryOptions);
	}
	if (ssrContext["~preloadManifest"] && !NO_SCRIPTS) {
		ssrContext.head.push({ link: [{
			rel: "preload",
			as: "fetch",
			fetchpriority: "low",
			crossorigin: "anonymous",
			href: buildAssetsURL(`builds/meta/${ssrContext.runtimeConfig.app.buildId}.json`)
		}] }, {
			...headEntryOptions,
			tagPriority: "low"
		});
	}
	
	if (inlinedStyles.length) {
		ssrContext.head.push({ style: inlinedStyles });
	}
	const link = [];
	for (const resource of Object.values(styles)) {
		
		if ("inline" in getQuery(resource.file)) {
			continue;
		}
		
		
		
		link.push({
			rel: "stylesheet",
			href: renderer.rendererContext.buildAssetsURL(resource.file),
			crossorigin: ""
		});
	}
	if (link.length) {
		ssrContext.head.push({ link }, headEntryOptions);
	}
	if (!NO_SCRIPTS) {
		
		
		
		if (ssrContext["~lazyHydratedModules"]) {
			for (const id of ssrContext["~lazyHydratedModules"]) {
				ssrContext.modules?.delete(id);
			}
		}
		
		ssrContext.head.push({ link: getPreloadLinks(ssrContext, renderer.rendererContext) }, headEntryOptions);
		ssrContext.head.push({ link: getPrefetchLinks(ssrContext, renderer.rendererContext) }, headEntryOptions);
		
		ssrContext.head.push({ script: _PAYLOAD_EXTRACTION ? renderPayloadJsonScript({
			ssrContext,
			data: splitPayload(ssrContext).initial,
			src: payloadURL
		})  : renderPayloadJsonScript({
			ssrContext,
			data: ssrContext.payload
		})  }, {
			...headEntryOptions,
			
			tagPosition: "bodyClose",
			tagPriority: "high"
		});
	}
	
	if (!routeOptions.noScripts) {
		const tagPosition = "head";
		ssrContext.head.push({ script: Object.values(scripts).map((resource) => ({
			type: resource.module ? "module" : null,
			src: renderer.rendererContext.buildAssetsURL(resource.file),
			defer: resource.module ? null : true,
			
			
			tagPosition,
			crossorigin: ""
		})) }, headEntryOptions);
	}
	const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = await renderSSRHead(ssrContext.head, renderSSRHeadOptions);
	
	const htmlContext = {
		htmlAttrs: htmlAttrs ? [htmlAttrs] : [],
		head: normalizeChunks([headTags]),
		bodyAttrs: bodyAttrs ? [bodyAttrs] : [],
		bodyPrepend: normalizeChunks([bodyTagsOpen, ssrContext.teleports?.body]),
		body: [replaceIslandTeleports(ssrContext, _rendered.html) , APP_TELEPORT_OPEN_TAG + (HAS_APP_TELEPORTS ? joinTags([ssrContext.teleports?.[`#${appTeleportAttrs.id}`]]) : "") + APP_TELEPORT_CLOSE_TAG],
		bodyAppend: [bodyTags]
	};
	
	await nitroApp.hooks.callHook("render:html", htmlContext, { event });
	
	return {
		body: renderHTMLDocument(htmlContext),
		statusCode: getResponseStatus(event),
		statusMessage: getResponseStatusText(event),
		headers: {
			"content-type": "text/html;charset=utf-8",
			"x-powered-by": "Nuxt"
		}
	};
}
function normalizeChunks(chunks) {
	const result = [];
	for (const _chunk of chunks) {
		const chunk = _chunk?.trim();
		if (chunk) {
			result.push(chunk);
		}
	}
	return result;
}
function joinTags(tags) {
	return tags.join("");
}
function joinAttrs(chunks) {
	if (chunks.length === 0) {
		return "";
	}
	return " " + chunks.join(" ");
}
function renderHTMLDocument(html) {
	return "<!DOCTYPE html>" + `<html${joinAttrs(html.htmlAttrs)}>` + `<head>${joinTags(html.head)}</head>` + `<body${joinAttrs(html.bodyAttrs)}>${joinTags(html.bodyPrepend)}${joinTags(html.body)}${joinTags(html.bodyAppend)}</body>` + "</html>";
}

const renderer = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: handler
}, Symbol.toStringTag, { value: 'Module' }));
//# sourceMappingURL=index.mjs.map
