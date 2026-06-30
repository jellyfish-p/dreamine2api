import { _ as _sfc_main$1 } from './Table-B22j8vPn.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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
import '@tanstack/vue-table';
import '@vueuse/core';
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
  __name: "calls",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { adminFetch } = useAdminToken();
    const { data } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "admin-calls",
      () => adminFetch("/api/admin/calls?limit=100")
    )), __temp = await __temp, __restore(), __temp);
    const rows = computed(() => {
      var _a, _b;
      return (_b = (_a = data.value) == null ? void 0 : _a.data) != null ? _b : [];
    });
    const columns = [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "created_at", header: "\u65F6\u95F4", cell: ({ row }) => formatTs(row.original.created_at) },
      { accessorKey: "method", header: "\u65B9\u6CD5" },
      { accessorKey: "path", header: "\u8DEF\u5F84" },
      { accessorKey: "status_code", header: "\u72B6\u6001" },
      { accessorKey: "duration_ms", header: "\u8017\u65F6(ms)" },
      { accessorKey: "error", header: "\u9519\u8BEF" }
    ];
    function formatTs(ts) {
      return new Date(ts * 1e3).toLocaleString();
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UTable = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><h1 class="text-xl font-semibold">API \u8C03\u7528\u8BB0\u5F55</h1><p class="text-sm text-gray-500">\u5B58\u50A8\u4E8E SQLite \u8868 <code>api_calls</code></p>`);
      _push(ssrRenderComponent(_component_UTable, {
        data: unref(rows),
        columns
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/calls.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=calls-CkC0Bnb7.mjs.map
