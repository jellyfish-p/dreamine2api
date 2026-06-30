import { b as useRuntimeConfig, c as _sfc_main$8 } from './server.mjs';
import { defineComponent, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const appName = useRuntimeConfig().public.appName;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$8;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col items-center justify-center gap-4 text-gray-200 p-6" }, _attrs))}><h1 class="text-2xl font-bold">${ssrInterpolate(unref(appName))}</h1><p class="text-gray-500 text-center max-w-md"> OpenAI \u517C\u5BB9\u56FE\u50CF/\u89C6\u9891 API\u3002\u7BA1\u7406\u9762\u677F\u53EF\u7F16\u8F91 <code class="text-primary-400">config.toml</code> \u4E0E SQLite \u8D26\u53F7/\u8C03\u7528\u6570\u636E\u3002 </p><div class="flex gap-3">`);
      _push(ssrRenderComponent(_component_UButton, {
        to: "/admin",
        color: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u7BA1\u7406\u9762\u677F`);
          } else {
            return [
              createTextVNode("\u7BA1\u7406\u9762\u677F")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        to: "/admin/login",
        variant: "outline",
        color: "neutral"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u767B\u5F55`);
          } else {
            return [
              createTextVNode("\u767B\u5F55")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-IeI_cCdF.mjs.map
