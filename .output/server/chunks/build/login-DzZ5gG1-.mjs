import { _ as _sfc_main$1 } from './Card-CAi0hXpp.mjs';
import { _ as _sfc_main$2 } from './Input-BoUm5ePS.mjs';
import { c as _sfc_main$8, n as navigateTo } from './server.mjs';
import { defineComponent, ref, mergeProps, withCtx, isRef, unref, createTextVNode, createVNode, withModifiers, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useAdminToken } from './useAdminToken-CtgvElor.mjs';
import 'reka-ui';
import '@vueuse/core';
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
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const { setToken, adminFetch } = useAdminToken();
    const apiKey = ref("");
    const loading = ref(false);
    const error = ref("");
    async function submit() {
      error.value = "";
      loading.value = true;
      try {
        setToken(apiKey.value);
        await adminFetch("/api/admin/config");
        await navigateTo("/admin");
      } catch (e) {
        error.value = e instanceof Error ? e.message : "\u767B\u5F55\u5931\u8D25";
        useAdminToken().clearToken();
      } finally {
        loading.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$1;
      const _component_UInput = _sfc_main$2;
      const _component_UButton = _sfc_main$8;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex items-center justify-center bg-gray-950 p-4" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_UCard, { class: "w-full max-w-md" }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h1 class="text-lg font-semibold"${_scopeId}>\u7BA1\u7406\u767B\u5F55</h1><p class="text-sm text-gray-500 mt-1"${_scopeId}>\u4F7F\u7528 config.toml \u4E2D admin.api_key</p>`);
          } else {
            return [
              createVNode("h1", { class: "text-lg font-semibold" }, "\u7BA1\u7406\u767B\u5F55"),
              createVNode("p", { class: "text-sm text-gray-500 mt-1" }, "\u4F7F\u7528 config.toml \u4E2D admin.api_key")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="space-y-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(apiKey),
              "onUpdate:modelValue": ($event) => isRef(apiKey) ? apiKey.value = $event : null,
              type: "password",
              placeholder: "Bearer API Key",
              class: "w-full"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              type: "submit",
              block: "",
              loading: unref(loading)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`\u767B\u5F55`);
                } else {
                  return [
                    createTextVNode("\u767B\u5F55")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (unref(error)) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(error))}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</form>`);
          } else {
            return [
              createVNode("form", {
                class: "space-y-4",
                onSubmit: withModifiers(submit, ["prevent"])
              }, [
                createVNode(_component_UInput, {
                  modelValue: unref(apiKey),
                  "onUpdate:modelValue": ($event) => isRef(apiKey) ? apiKey.value = $event : null,
                  type: "password",
                  placeholder: "Bearer API Key",
                  class: "w-full"
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                createVNode(_component_UButton, {
                  type: "submit",
                  block: "",
                  loading: unref(loading)
                }, {
                  default: withCtx(() => [
                    createTextVNode("\u767B\u5F55")
                  ]),
                  _: 1
                }, 8, ["loading"]),
                unref(error) ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "text-sm text-red-500"
                }, toDisplayString(unref(error)), 1)) : createCommentVNode("", true)
              ], 32)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-DzZ5gG1-.mjs.map
