import { _ as _sfc_main$1 } from './Card-CAi0hXpp.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, withCtx, unref, createVNode, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useAdminToken } from './useAdminToken-CtgvElor.mjs';
import { d as useAsyncData } from './server.mjs';
import 'reka-ui';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'smol-toml';
import 'fs';
import 'node:module';
import 'path';
import 'node:url';
import 'lodash';
import 'assert';
import 'util';
import 'fs-extra';
import 'date-fns';
import 'yaml';
import 'minimist';
import 'os';
import 'crypto';
import 'stream';
import 'mime';
import 'axios';
import 'crc-32';
import 'randomstring';
import 'cron';
import 'https-proxy-agent';
import 'socks-proxy-agent';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'vue-router';
import 'tailwindcss/colors';
import '@iconify/vue';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { adminFetch } = useAdminToken();
    const { data } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "admin-calls-stats",
      () => adminFetch("/api/admin/calls?limit=1")
    )), __temp = await __temp, __restore(), __temp);
    const stats = computed(() => {
      var _a;
      return (_a = data.value) == null ? void 0 : _a.stats;
    });
    const avgMs = computed(() => {
      var _a;
      const v = (_a = stats.value) == null ? void 0 : _a.avg_ms;
      return v == null ? "\u2014" : Math.round(v);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><h1 class="text-xl font-semibold">\u6982\u89C8</h1><div class="grid gap-4 md:grid-cols-3">`);
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d;
          if (_push2) {
            _push2(`<p class="text-sm text-gray-500"${_scopeId}>\u8FD1 24h \u8C03\u7528</p><p class="text-2xl font-bold mt-1"${_scopeId}>${ssrInterpolate((_b = (_a = unref(stats)) == null ? void 0 : _a.total) != null ? _b : "\u2014")}</p>`);
          } else {
            return [
              createVNode("p", { class: "text-sm text-gray-500" }, "\u8FD1 24h \u8C03\u7528"),
              createVNode("p", { class: "text-2xl font-bold mt-1" }, toDisplayString((_d = (_c = unref(stats)) == null ? void 0 : _c.total) != null ? _d : "\u2014"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d;
          if (_push2) {
            _push2(`<p class="text-sm text-gray-500"${_scopeId}>\u8FD1 24h \u9519\u8BEF</p><p class="text-2xl font-bold mt-1 text-red-400"${_scopeId}>${ssrInterpolate((_b = (_a = unref(stats)) == null ? void 0 : _a.errors) != null ? _b : "\u2014")}</p>`);
          } else {
            return [
              createVNode("p", { class: "text-sm text-gray-500" }, "\u8FD1 24h \u9519\u8BEF"),
              createVNode("p", { class: "text-2xl font-bold mt-1 text-red-400" }, toDisplayString((_d = (_c = unref(stats)) == null ? void 0 : _c.errors) != null ? _d : "\u2014"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-sm text-gray-500"${_scopeId}>\u5E73\u5747\u8017\u65F6 (ms)</p><p class="text-2xl font-bold mt-1"${_scopeId}>${ssrInterpolate(unref(avgMs))}</p>`);
          } else {
            return [
              createVNode("p", { class: "text-sm text-gray-500" }, "\u5E73\u5747\u8017\u65F6 (ms)"),
              createVNode("p", { class: "text-2xl font-bold mt-1" }, toDisplayString(unref(avgMs)), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u914D\u7F6E\u6587\u4EF6`);
          } else {
            return [
              createTextVNode("\u914D\u7F6E\u6587\u4EF6")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-sm text-gray-400"${_scopeId}> \u5173\u952E\u9879\u4FDD\u5B58\u5728\u9879\u76EE\u6839\u76EE\u5F55 <code${_scopeId}>config.toml</code>\u3002\u5728\u300C\u914D\u7F6E\u300D\u9875\u4FDD\u5B58\u4F1A\u5199\u56DE\u8BE5\u6587\u4EF6\uFF0C\u5E76\u540C\u6B65 SQLite \u4E2D\u7684\u4EE3\u7406\u4E0E\u53F7\u6C60\u5BC6\u94A5\u3002 </p>`);
          } else {
            return [
              createVNode("p", { class: "text-sm text-gray-400" }, [
                createTextVNode(" \u5173\u952E\u9879\u4FDD\u5B58\u5728\u9879\u76EE\u6839\u76EE\u5F55 "),
                createVNode("code", null, "config.toml"),
                createTextVNode("\u3002\u5728\u300C\u914D\u7F6E\u300D\u9875\u4FDD\u5B58\u4F1A\u5199\u56DE\u8BE5\u6587\u4EF6\uFF0C\u5E76\u540C\u6B65 SQLite \u4E2D\u7684\u4EE3\u7406\u4E0E\u53F7\u6C60\u5BC6\u94A5\u3002 ")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DmmKnM2W.mjs.map
