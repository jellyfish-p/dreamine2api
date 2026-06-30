import { a as __nuxt_component_0, c as _sfc_main$8, n as navigateTo } from './server.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { u as useAdminToken } from './useAdminToken-CtgvElor.mjs';
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
import 'reka-ui';
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
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    const { clearToken } = useAdminToken();
    async function logout() {
      clearToken();
      await navigateTo("/admin/login");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_UButton = _sfc_main$8;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen text-gray-100" }, _attrs))}><header class="border-b px-4 py-3 flex items-center justify-between"><div class="flex items-center gap-6">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin",
        class: "font-semibold text-primary-400"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Dreamine \u7BA1\u7406`);
          } else {
            return [
              createTextVNode("Dreamine \u7BA1\u7406")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="flex gap-4 text-sm text-gray-400">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/settings",
        "active-class": "text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u914D\u7F6E`);
          } else {
            return [
              createTextVNode("\u914D\u7F6E")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/accounts",
        "active-class": "text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u8D26\u53F7\u6C60`);
          } else {
            return [
              createTextVNode("\u8D26\u53F7\u6C60")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/calls",
        "active-class": "text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u8C03\u7528\u8BB0\u5F55`);
          } else {
            return [
              createTextVNode("\u8C03\u7528\u8BB0\u5F55")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        size: "xs",
        color: "neutral",
        variant: "ghost",
        onClick: logout
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u9000\u51FA`);
          } else {
            return [
              createTextVNode("\u9000\u51FA")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</header><main class="max-w-6xl mx-auto p-4 md:p-6">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=admin-Cm-eMvwu.mjs.map
