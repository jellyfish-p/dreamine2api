import { useSlots, ref, computed, useModel, watch, unref, mergeProps, withCtx, createVNode, openBlock, createBlock, renderSlot, createTextVNode, toDisplayString, createCommentVNode, Fragment, renderList, mergeModels, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderClass, ssrRenderSlot, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderStyle } from 'vue/server-renderer';
import { Primitive } from 'reka-ui';
import { a3 as upperFirst } from '../_/nitro.mjs';
import { useVueTable, getExpandedRowModel, getSortedRowModel, getFilteredRowModel, getCoreRowModel, FlexRender } from '@tanstack/vue-table';
import { reactiveOmit } from '@vueuse/core';
import { j as useLocale, e as useAppConfig, t as tv } from './server.mjs';

const theme = {
  "slots": {
    "root": "relative overflow-auto",
    "base": "min-w-full overflow-clip",
    "caption": "sr-only",
    "thead": "relative",
    "tbody": "divide-y divide-default [&>tr]:data-[selectable=true]:hover:bg-elevated/50 [&>tr]:data-[selectable=true]:focus-visible:outline-primary",
    "tfoot": "relative",
    "tr": "data-[selected=true]:bg-elevated/50",
    "th": "px-4 py-3.5 text-sm text-highlighted text-left rtl:text-right font-semibold [&:has([role=checkbox])]:pe-0",
    "td": "p-4 text-sm text-muted whitespace-nowrap [&:has([role=checkbox])]:pe-0",
    "separator": "absolute z-[1] left-0 w-full h-px bg-(--ui-border-accented)",
    "empty": "py-6 text-center text-sm text-muted",
    "loading": "py-6 text-center"
  },
  "variants": {
    "pinned": {
      "true": {
        "th": "sticky bg-default/75 data-[pinned=left]:left-0 data-[pinned=right]:right-0",
        "td": "sticky bg-default/75 data-[pinned=left]:left-0 data-[pinned=right]:right-0"
      }
    },
    "sticky": {
      "true": {
        "thead": "sticky top-0 inset-x-0 bg-default/75 z-[1] backdrop-blur",
        "tfoot": "sticky bottom-0 inset-x-0 bg-default/75 z-[1] backdrop-blur"
      },
      "header": {
        "thead": "sticky top-0 inset-x-0 bg-default/75 z-[1] backdrop-blur"
      },
      "footer": {
        "tfoot": "sticky bottom-0 inset-x-0 bg-default/75 z-[1] backdrop-blur"
      }
    },
    "loading": {
      "true": {
        "thead": "after:absolute after:z-[1] after:h-px"
      }
    },
    "loadingAnimation": {
      "carousel": "",
      "carousel-inverse": "",
      "swing": "",
      "elastic": ""
    },
    "loadingColor": {
      "primary": "",
      "secondary": "",
      "success": "",
      "info": "",
      "warning": "",
      "error": "",
      "neutral": ""
    }
  },
  "compoundVariants": [
    {
      "loading": true,
      "loadingColor": "primary",
      "class": {
        "thead": "after:bg-primary"
      }
    },
    {
      "loading": true,
      "loadingColor": "secondary",
      "class": {
        "thead": "after:bg-secondary"
      }
    },
    {
      "loading": true,
      "loadingColor": "success",
      "class": {
        "thead": "after:bg-success"
      }
    },
    {
      "loading": true,
      "loadingColor": "info",
      "class": {
        "thead": "after:bg-info"
      }
    },
    {
      "loading": true,
      "loadingColor": "warning",
      "class": {
        "thead": "after:bg-warning"
      }
    },
    {
      "loading": true,
      "loadingColor": "error",
      "class": {
        "thead": "after:bg-error"
      }
    },
    {
      "loading": true,
      "loadingColor": "neutral",
      "class": {
        "thead": "after:bg-inverted"
      }
    },
    {
      "loading": true,
      "loadingAnimation": "carousel",
      "class": {
        "thead": "after:animate-[carousel_2s_ease-in-out_infinite] rtl:after:animate-[carousel-rtl_2s_ease-in-out_infinite]"
      }
    },
    {
      "loading": true,
      "loadingAnimation": "carousel-inverse",
      "class": {
        "thead": "after:animate-[carousel-inverse_2s_ease-in-out_infinite] rtl:after:animate-[carousel-inverse-rtl_2s_ease-in-out_infinite]"
      }
    },
    {
      "loading": true,
      "loadingAnimation": "swing",
      "class": {
        "thead": "after:animate-[swing_2s_ease-in-out_infinite]"
      }
    },
    {
      "loading": true,
      "loadingAnimation": "elastic",
      "class": {
        "thead": "after:animate-[elastic_2s_ease-in-out_infinite]"
      }
    }
  ],
  "defaultVariants": {
    "loadingColor": "primary",
    "loadingAnimation": "carousel"
  }
};
const _sfc_main = {
  __name: "Table",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    as: { type: null, required: false },
    data: { type: Array, required: false },
    columns: { type: Array, required: false },
    caption: { type: String, required: false },
    meta: { type: Object, required: false },
    empty: { type: String, required: false },
    sticky: { type: [Boolean, String], required: false },
    loading: { type: Boolean, required: false },
    loadingColor: { type: null, required: false },
    loadingAnimation: { type: null, required: false },
    watchOptions: { type: Object, required: false, default: () => ({
      deep: true
    }) },
    globalFilterOptions: { type: Object, required: false },
    columnFiltersOptions: { type: Object, required: false },
    columnPinningOptions: { type: Object, required: false },
    columnSizingOptions: { type: Object, required: false },
    visibilityOptions: { type: Object, required: false },
    sortingOptions: { type: Object, required: false },
    groupingOptions: { type: Object, required: false },
    expandedOptions: { type: Object, required: false },
    rowSelectionOptions: { type: Object, required: false },
    rowPinningOptions: { type: Object, required: false },
    paginationOptions: { type: Object, required: false },
    facetedOptions: { type: Object, required: false },
    onSelect: { type: Function, required: false },
    onHover: { type: Function, required: false },
    onContextmenu: { type: [Function, Array], required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    state: { type: Object, required: false },
    onStateChange: { type: Function, required: false },
    renderFallbackValue: { type: null, required: false },
    _features: { type: Array, required: false },
    autoResetAll: { type: Boolean, required: false },
    debugAll: { type: Boolean, required: false },
    debugCells: { type: Boolean, required: false },
    debugColumns: { type: Boolean, required: false },
    debugHeaders: { type: Boolean, required: false },
    debugRows: { type: Boolean, required: false },
    debugTable: { type: Boolean, required: false },
    defaultColumn: { type: Object, required: false },
    getRowId: { type: Function, required: false },
    getSubRows: { type: Function, required: false },
    initialState: { type: Object, required: false },
    mergeOptions: { type: Function, required: false }
  }, {
    "globalFilter": { type: String, ...{ default: void 0 } },
    "globalFilterModifiers": {},
    "columnFilters": { type: Array, ...{ default: [] } },
    "columnFiltersModifiers": {},
    "columnOrder": { type: Array, ...{ default: [] } },
    "columnOrderModifiers": {},
    "columnVisibility": { type: Object, ...{ default: {} } },
    "columnVisibilityModifiers": {},
    "columnPinning": { type: Object, ...{ default: {} } },
    "columnPinningModifiers": {},
    "columnSizing": { type: Object, ...{ default: {} } },
    "columnSizingModifiers": {},
    "columnSizingInfo": { type: Object, ...{ default: {} } },
    "columnSizingInfoModifiers": {},
    "rowSelection": { type: Object, ...{ default: {} } },
    "rowSelectionModifiers": {},
    "rowPinning": { type: Object, ...{ default: {} } },
    "rowPinningModifiers": {},
    "sorting": { type: Array, ...{ default: [] } },
    "sortingModifiers": {},
    "grouping": { type: Array, ...{ default: [] } },
    "groupingModifiers": {},
    "expanded": { type: [Boolean, Object], ...{ default: {} } },
    "expandedModifiers": {},
    "pagination": { type: Object, ...{ default: {} } },
    "paginationModifiers": {}
  }),
  emits: ["update:globalFilter", "update:columnFilters", "update:columnOrder", "update:columnVisibility", "update:columnPinning", "update:columnSizing", "update:columnSizingInfo", "update:rowSelection", "update:rowPinning", "update:sorting", "update:grouping", "update:expanded", "update:pagination"],
  setup(__props, { expose: __expose }) {
    var _a;
    const props = __props;
    const slots = useSlots();
    const { t } = useLocale();
    const appConfig = useAppConfig();
    const data = ref((_a = props.data) != null ? _a : []);
    const meta = computed(() => {
      var _a2;
      return (_a2 = props.meta) != null ? _a2 : {};
    });
    const columns = computed(() => {
      var _a2, _b;
      return processColumns((_b = props.columns) != null ? _b : Object.keys((_a2 = data.value[0]) != null ? _a2 : {}).map((accessorKey) => ({ accessorKey, header: upperFirst(accessorKey) })));
    });
    function processColumns(columns2) {
      return columns2.map((column) => {
        const col = { ...column };
        if ("columns" in col && col.columns) {
          col.columns = processColumns(col.columns);
        }
        if (!col.cell) {
          col.cell = ({ getValue }) => {
            const value = getValue();
            if (value === "" || value === null || value === void 0) {
              return "\xA0";
            }
            return String(value);
          };
        }
        return col;
      });
    }
    const ui = computed(() => {
      var _a2;
      return tv({ extend: tv(theme), ...((_a2 = appConfig.ui) == null ? void 0 : _a2.table) || {} })({
        sticky: props.sticky,
        loading: props.loading,
        loadingColor: props.loadingColor,
        loadingAnimation: props.loadingAnimation
      });
    });
    const hasFooter = computed(() => {
      function hasFooterRecursive(columns2) {
        for (const column of columns2) {
          if ("footer" in column) {
            return true;
          }
          if ("columns" in column && hasFooterRecursive(column.columns)) {
            return true;
          }
        }
        return false;
      }
      return hasFooterRecursive(columns.value);
    });
    const globalFilterState = useModel(__props, "globalFilter", { type: String, ...{ default: void 0 } });
    const columnFiltersState = useModel(__props, "columnFilters", { type: Array, ...{ default: [] } });
    const columnOrderState = useModel(__props, "columnOrder", { type: Array, ...{ default: [] } });
    const columnVisibilityState = useModel(__props, "columnVisibility", { type: Object, ...{ default: {} } });
    const columnPinningState = useModel(__props, "columnPinning", { type: Object, ...{ default: {} } });
    const columnSizingState = useModel(__props, "columnSizing", { type: Object, ...{ default: {} } });
    const columnSizingInfoState = useModel(__props, "columnSizingInfo", { type: Object, ...{ default: {} } });
    const rowSelectionState = useModel(__props, "rowSelection", { type: Object, ...{ default: {} } });
    const rowPinningState = useModel(__props, "rowPinning", { type: Object, ...{ default: {} } });
    const sortingState = useModel(__props, "sorting", { type: Array, ...{ default: [] } });
    const groupingState = useModel(__props, "grouping", { type: Array, ...{ default: [] } });
    const expandedState = useModel(__props, "expanded", { type: [Boolean, Object], ...{ default: {} } });
    const paginationState = useModel(__props, "pagination", { type: Object, ...{ default: {} } });
    const tableRef = ref(null);
    const tableApi = useVueTable({
      ...reactiveOmit(props, "as", "data", "columns", "caption", "sticky", "loading", "loadingColor", "loadingAnimation", "class", "ui"),
      data,
      get columns() {
        return columns.value;
      },
      meta: meta.value,
      getCoreRowModel: getCoreRowModel(),
      ...props.globalFilterOptions || {},
      onGlobalFilterChange: (updaterOrValue) => valueUpdater(updaterOrValue, globalFilterState),
      ...props.columnFiltersOptions || {},
      getFilteredRowModel: getFilteredRowModel(),
      onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFiltersState),
      onColumnOrderChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnOrderState),
      ...props.visibilityOptions || {},
      onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibilityState),
      ...props.columnPinningOptions || {},
      onColumnPinningChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnPinningState),
      ...props.columnSizingOptions || {},
      onColumnSizingChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnSizingState),
      onColumnSizingInfoChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnSizingInfoState),
      ...props.rowSelectionOptions || {},
      onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelectionState),
      ...props.rowPinningOptions || {},
      onRowPinningChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowPinningState),
      ...props.sortingOptions || {},
      getSortedRowModel: getSortedRowModel(),
      onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sortingState),
      ...props.groupingOptions || {},
      onGroupingChange: (updaterOrValue) => valueUpdater(updaterOrValue, groupingState),
      ...props.expandedOptions || {},
      getExpandedRowModel: getExpandedRowModel(),
      onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expandedState),
      ...props.paginationOptions || {},
      onPaginationChange: (updaterOrValue) => valueUpdater(updaterOrValue, paginationState),
      ...props.facetedOptions || {},
      state: {
        get globalFilter() {
          return globalFilterState.value;
        },
        get columnFilters() {
          return columnFiltersState.value;
        },
        get columnOrder() {
          return columnOrderState.value;
        },
        get columnVisibility() {
          return columnVisibilityState.value;
        },
        get columnPinning() {
          return columnPinningState.value;
        },
        get expanded() {
          return expandedState.value;
        },
        get rowSelection() {
          return rowSelectionState.value;
        },
        get sorting() {
          return sortingState.value;
        },
        get grouping() {
          return groupingState.value;
        },
        get rowPinning() {
          return rowPinningState.value;
        },
        get columnSizing() {
          return columnSizingState.value;
        },
        get columnSizingInfo() {
          return columnSizingInfoState.value;
        },
        get pagination() {
          return paginationState.value;
        }
      }
    });
    function valueUpdater(updaterOrValue, ref2) {
      ref2.value = typeof updaterOrValue === "function" ? updaterOrValue(ref2.value) : updaterOrValue;
    }
    function onRowSelect(e, row) {
      if (!props.onSelect) {
        return;
      }
      const target = e.target;
      const isInteractive = target.closest("button") || target.closest("a");
      if (isInteractive) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      props.onSelect(row, e);
    }
    function onRowHover(e, row) {
      if (!props.onHover) {
        return;
      }
      props.onHover(e, row);
    }
    function onRowContextmenu(e, row) {
      if (!props.onContextmenu) {
        return;
      }
      if (Array.isArray(props.onContextmenu)) {
        props.onContextmenu.forEach((fn) => fn(e, row));
      } else {
        props.onContextmenu(e, row);
      }
    }
    function resolveValue(prop, arg) {
      if (typeof prop === "function") {
        return prop(arg);
      }
      return prop;
    }
    watch(
      () => props.data,
      () => {
        data.value = props.data ? [...props.data] : [];
      },
      props.watchOptions
    );
    __expose({
      tableRef,
      tableApi
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a2;
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: __props.as,
        class: ui.value.root({ class: [(_a2 = props.ui) == null ? void 0 : _a2.root, props.class] })
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a3, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
          if (_push2) {
            _push2(`<table class="${ssrRenderClass(ui.value.base({ class: [(_a3 = props.ui) == null ? void 0 : _a3.base] }))}"${_scopeId}>`);
            if (__props.caption || !!slots.caption) {
              _push2(`<caption class="${ssrRenderClass(ui.value.caption({ class: [(_b = props.ui) == null ? void 0 : _b.caption] }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "caption", {}, () => {
                _push2(`${ssrInterpolate(__props.caption)}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</caption>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<thead class="${ssrRenderClass(ui.value.thead({ class: [(_c = props.ui) == null ? void 0 : _c.thead] }))}"${_scopeId}><!--[-->`);
            ssrRenderList(unref(tableApi).getHeaderGroups(), (headerGroup) => {
              var _a4;
              _push2(`<tr class="${ssrRenderClass(ui.value.tr({ class: [(_a4 = props.ui) == null ? void 0 : _a4.tr] }))}"${_scopeId}><!--[-->`);
              ssrRenderList(headerGroup.headers, (header) => {
                var _a5, _b2, _c2;
                _push2(`<th${ssrRenderAttr("data-pinned", header.column.getIsPinned())}${ssrRenderAttr("scope", header.colSpan > 1 ? "colgroup" : "col")}${ssrRenderAttr("colspan", header.colSpan > 1 ? header.colSpan : void 0)}${ssrRenderAttr("rowspan", header.rowSpan > 1 ? header.rowSpan : void 0)} class="${ssrRenderClass(ui.value.th({
                  class: [
                    (_a5 = props.ui) == null ? void 0 : _a5.th,
                    resolveValue((_c2 = (_b2 = header.column.columnDef.meta) == null ? void 0 : _b2.class) == null ? void 0 : _c2.th, header)
                  ],
                  pinned: !!header.column.getIsPinned()
                }))}"${_scopeId}>`);
                ssrRenderSlot(_ctx.$slots, `${header.id}-header`, mergeProps({ ref_for: true }, header.getContext()), () => {
                  if (!header.isPlaceholder) {
                    _push2(ssrRenderComponent(unref(FlexRender), {
                      render: header.column.columnDef.header,
                      props: header.getContext()
                    }, null, _parent2, _scopeId));
                  } else {
                    _push2(`<!---->`);
                  }
                }, _push2, _parent2, _scopeId);
                _push2(`</th>`);
              });
              _push2(`<!--]--></tr>`);
            });
            _push2(`<!--]--><tr class="${ssrRenderClass(ui.value.separator({ class: [(_d = props.ui) == null ? void 0 : _d.separator] }))}"${_scopeId}></tr></thead><tbody class="${ssrRenderClass(ui.value.tbody({ class: [(_e = props.ui) == null ? void 0 : _e.tbody] }))}"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "body-top", {}, null, _push2, _parent2, _scopeId);
            if ((_f = unref(tableApi).getRowModel().rows) == null ? void 0 : _f.length) {
              _push2(`<!--[-->`);
              ssrRenderList(unref(tableApi).getRowModel().rows, (row) => {
                var _a4, _b2, _c2, _d2, _e2, _f2, _g2;
                _push2(`<!--[--><tr${ssrRenderAttr("data-selected", row.getIsSelected())}${ssrRenderAttr("data-selectable", !!props.onSelect || !!props.onHover || !!props.onContextmenu)}${ssrRenderAttr("data-expanded", row.getIsExpanded())}${ssrRenderAttr("role", props.onSelect ? "button" : void 0)}${ssrRenderAttr("tabindex", props.onSelect ? 0 : void 0)} class="${ssrRenderClass(ui.value.tr({
                  class: [
                    (_a4 = props.ui) == null ? void 0 : _a4.tr,
                    resolveValue((_c2 = (_b2 = unref(tableApi).options.meta) == null ? void 0 : _b2.class) == null ? void 0 : _c2.tr, row)
                  ]
                }))}" style="${ssrRenderStyle(resolveValue((_e2 = (_d2 = unref(tableApi).options.meta) == null ? void 0 : _d2.style) == null ? void 0 : _e2.tr, row))}"${_scopeId}><!--[-->`);
                ssrRenderList(row.getVisibleCells(), (cell) => {
                  var _a5, _b3, _c3, _d3, _e3, _f3, _g3, _h2, _i2;
                  _push2(`<td${ssrRenderAttr("data-pinned", cell.column.getIsPinned())}${ssrRenderAttr("colspan", resolveValue((_b3 = (_a5 = cell.column.columnDef.meta) == null ? void 0 : _a5.colspan) == null ? void 0 : _b3.td, cell))}${ssrRenderAttr("rowspan", resolveValue((_d3 = (_c3 = cell.column.columnDef.meta) == null ? void 0 : _c3.rowspan) == null ? void 0 : _d3.td, cell))} class="${ssrRenderClass(ui.value.td({
                    class: [
                      (_e3 = props.ui) == null ? void 0 : _e3.td,
                      resolveValue((_g3 = (_f3 = cell.column.columnDef.meta) == null ? void 0 : _f3.class) == null ? void 0 : _g3.td, cell)
                    ],
                    pinned: !!cell.column.getIsPinned()
                  }))}" style="${ssrRenderStyle(resolveValue((_i2 = (_h2 = cell.column.columnDef.meta) == null ? void 0 : _h2.style) == null ? void 0 : _i2.td, cell))}"${_scopeId}>`);
                  ssrRenderSlot(_ctx.$slots, `${cell.column.id}-cell`, mergeProps({ ref_for: true }, cell.getContext()), () => {
                    _push2(ssrRenderComponent(unref(FlexRender), {
                      render: cell.column.columnDef.cell,
                      props: cell.getContext()
                    }, null, _parent2, _scopeId));
                  }, _push2, _parent2, _scopeId);
                  _push2(`</td>`);
                });
                _push2(`<!--]--></tr>`);
                if (row.getIsExpanded()) {
                  _push2(`<tr class="${ssrRenderClass(ui.value.tr({ class: [(_f2 = props.ui) == null ? void 0 : _f2.tr] }))}"${_scopeId}><td${ssrRenderAttr("colspan", row.getAllCells().length)} class="${ssrRenderClass(ui.value.td({ class: [(_g2 = props.ui) == null ? void 0 : _g2.td] }))}"${_scopeId}>`);
                  ssrRenderSlot(_ctx.$slots, "expanded", { row }, null, _push2, _parent2, _scopeId);
                  _push2(`</td></tr>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--]-->`);
              });
              _push2(`<!--]-->`);
            } else if (__props.loading && !!slots["loading"]) {
              _push2(`<tr${_scopeId}><td${ssrRenderAttr("colspan", unref(tableApi).getAllLeafColumns().length)} class="${ssrRenderClass(ui.value.loading({ class: (_g = props.ui) == null ? void 0 : _g.loading }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "loading", {}, null, _push2, _parent2, _scopeId);
              _push2(`</td></tr>`);
            } else {
              _push2(`<tr${_scopeId}><td${ssrRenderAttr("colspan", unref(tableApi).getAllLeafColumns().length)} class="${ssrRenderClass(ui.value.empty({ class: (_h = props.ui) == null ? void 0 : _h.empty }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "empty", {}, () => {
                _push2(`${ssrInterpolate(__props.empty || unref(t)("table.noData"))}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</td></tr>`);
            }
            ssrRenderSlot(_ctx.$slots, "body-bottom", {}, null, _push2, _parent2, _scopeId);
            _push2(`</tbody>`);
            if (hasFooter.value) {
              _push2(`<tfoot class="${ssrRenderClass(ui.value.tfoot({ class: [(_i = props.ui) == null ? void 0 : _i.tfoot] }))}"${_scopeId}><tr class="${ssrRenderClass(ui.value.separator({ class: [(_j = props.ui) == null ? void 0 : _j.separator] }))}"${_scopeId}></tr><!--[-->`);
              ssrRenderList(unref(tableApi).getFooterGroups(), (footerGroup) => {
                var _a4;
                _push2(`<tr class="${ssrRenderClass(ui.value.tr({ class: [(_a4 = props.ui) == null ? void 0 : _a4.tr] }))}"${_scopeId}><!--[-->`);
                ssrRenderList(footerGroup.headers, (header) => {
                  var _a5, _b2, _c2, _d2, _e2;
                  _push2(`<th${ssrRenderAttr("data-pinned", header.column.getIsPinned())}${ssrRenderAttr("colspan", header.colSpan > 1 ? header.colSpan : void 0)}${ssrRenderAttr("rowspan", header.rowSpan > 1 ? header.rowSpan : void 0)} class="${ssrRenderClass(ui.value.th({
                    class: [
                      (_a5 = props.ui) == null ? void 0 : _a5.th,
                      resolveValue((_c2 = (_b2 = header.column.columnDef.meta) == null ? void 0 : _b2.class) == null ? void 0 : _c2.th, header)
                    ],
                    pinned: !!header.column.getIsPinned()
                  }))}" style="${ssrRenderStyle(resolveValue((_e2 = (_d2 = header.column.columnDef.meta) == null ? void 0 : _d2.style) == null ? void 0 : _e2.th, header))}"${_scopeId}>`);
                  ssrRenderSlot(_ctx.$slots, `${header.id}-footer`, mergeProps({ ref_for: true }, header.getContext()), () => {
                    if (!header.isPlaceholder) {
                      _push2(ssrRenderComponent(unref(FlexRender), {
                        render: header.column.columnDef.footer,
                        props: header.getContext()
                      }, null, _parent2, _scopeId));
                    } else {
                      _push2(`<!---->`);
                    }
                  }, _push2, _parent2, _scopeId);
                  _push2(`</th>`);
                });
                _push2(`<!--]--></tr>`);
              });
              _push2(`<!--]--></tfoot>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</table>`);
          } else {
            return [
              createVNode("table", {
                ref_key: "tableRef",
                ref: tableRef,
                class: ui.value.base({ class: [(_k = props.ui) == null ? void 0 : _k.base] })
              }, [
                __props.caption || !!slots.caption ? (openBlock(), createBlock("caption", {
                  key: 0,
                  class: ui.value.caption({ class: [(_l = props.ui) == null ? void 0 : _l.caption] })
                }, [
                  renderSlot(_ctx.$slots, "caption", {}, () => [
                    createTextVNode(toDisplayString(__props.caption), 1)
                  ])
                ], 2)) : createCommentVNode("", true),
                createVNode("thead", {
                  class: ui.value.thead({ class: [(_m = props.ui) == null ? void 0 : _m.thead] })
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(tableApi).getHeaderGroups(), (headerGroup) => {
                    var _a4;
                    return openBlock(), createBlock("tr", {
                      key: headerGroup.id,
                      class: ui.value.tr({ class: [(_a4 = props.ui) == null ? void 0 : _a4.tr] })
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(headerGroup.headers, (header) => {
                        var _a5, _b2, _c2;
                        return openBlock(), createBlock("th", {
                          key: header.id,
                          "data-pinned": header.column.getIsPinned(),
                          scope: header.colSpan > 1 ? "colgroup" : "col",
                          colspan: header.colSpan > 1 ? header.colSpan : void 0,
                          rowspan: header.rowSpan > 1 ? header.rowSpan : void 0,
                          class: ui.value.th({
                            class: [
                              (_a5 = props.ui) == null ? void 0 : _a5.th,
                              resolveValue((_c2 = (_b2 = header.column.columnDef.meta) == null ? void 0 : _b2.class) == null ? void 0 : _c2.th, header)
                            ],
                            pinned: !!header.column.getIsPinned()
                          })
                        }, [
                          renderSlot(_ctx.$slots, `${header.id}-header`, mergeProps({ ref_for: true }, header.getContext()), () => [
                            !header.isPlaceholder ? (openBlock(), createBlock(unref(FlexRender), {
                              key: 0,
                              render: header.column.columnDef.header,
                              props: header.getContext()
                            }, null, 8, ["render", "props"])) : createCommentVNode("", true)
                          ])
                        ], 10, ["data-pinned", "scope", "colspan", "rowspan"]);
                      }), 128))
                    ], 2);
                  }), 128)),
                  createVNode("tr", {
                    class: ui.value.separator({ class: [(_n = props.ui) == null ? void 0 : _n.separator] })
                  }, null, 2)
                ], 2),
                createVNode("tbody", {
                  class: ui.value.tbody({ class: [(_o = props.ui) == null ? void 0 : _o.tbody] })
                }, [
                  renderSlot(_ctx.$slots, "body-top"),
                  ((_p = unref(tableApi).getRowModel().rows) == null ? void 0 : _p.length) ? (openBlock(true), createBlock(Fragment, { key: 0 }, renderList(unref(tableApi).getRowModel().rows, (row) => {
                    var _a4, _b2, _c2, _d2, _e2, _f2, _g2;
                    return openBlock(), createBlock(Fragment, {
                      key: row.id
                    }, [
                      createVNode("tr", {
                        "data-selected": row.getIsSelected(),
                        "data-selectable": !!props.onSelect || !!props.onHover || !!props.onContextmenu,
                        "data-expanded": row.getIsExpanded(),
                        role: props.onSelect ? "button" : void 0,
                        tabindex: props.onSelect ? 0 : void 0,
                        class: ui.value.tr({
                          class: [
                            (_a4 = props.ui) == null ? void 0 : _a4.tr,
                            resolveValue((_c2 = (_b2 = unref(tableApi).options.meta) == null ? void 0 : _b2.class) == null ? void 0 : _c2.tr, row)
                          ]
                        }),
                        style: resolveValue((_e2 = (_d2 = unref(tableApi).options.meta) == null ? void 0 : _d2.style) == null ? void 0 : _e2.tr, row),
                        onClick: ($event) => onRowSelect($event, row),
                        onPointerenter: ($event) => onRowHover($event, row),
                        onPointerleave: ($event) => onRowHover($event, null),
                        onContextmenu: ($event) => onRowContextmenu($event, row)
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(row.getVisibleCells(), (cell) => {
                          var _a5, _b3, _c3, _d3, _e3, _f3, _g3, _h2, _i2;
                          return openBlock(), createBlock("td", {
                            key: cell.id,
                            "data-pinned": cell.column.getIsPinned(),
                            colspan: resolveValue((_b3 = (_a5 = cell.column.columnDef.meta) == null ? void 0 : _a5.colspan) == null ? void 0 : _b3.td, cell),
                            rowspan: resolveValue((_d3 = (_c3 = cell.column.columnDef.meta) == null ? void 0 : _c3.rowspan) == null ? void 0 : _d3.td, cell),
                            class: ui.value.td({
                              class: [
                                (_e3 = props.ui) == null ? void 0 : _e3.td,
                                resolveValue((_g3 = (_f3 = cell.column.columnDef.meta) == null ? void 0 : _f3.class) == null ? void 0 : _g3.td, cell)
                              ],
                              pinned: !!cell.column.getIsPinned()
                            }),
                            style: resolveValue((_i2 = (_h2 = cell.column.columnDef.meta) == null ? void 0 : _h2.style) == null ? void 0 : _i2.td, cell)
                          }, [
                            renderSlot(_ctx.$slots, `${cell.column.id}-cell`, mergeProps({ ref_for: true }, cell.getContext()), () => [
                              createVNode(unref(FlexRender), {
                                render: cell.column.columnDef.cell,
                                props: cell.getContext()
                              }, null, 8, ["render", "props"])
                            ])
                          ], 14, ["data-pinned", "colspan", "rowspan"]);
                        }), 128))
                      ], 46, ["data-selected", "data-selectable", "data-expanded", "role", "tabindex", "onClick", "onPointerenter", "onPointerleave", "onContextmenu"]),
                      row.getIsExpanded() ? (openBlock(), createBlock("tr", {
                        key: 0,
                        class: ui.value.tr({ class: [(_f2 = props.ui) == null ? void 0 : _f2.tr] })
                      }, [
                        createVNode("td", {
                          colspan: row.getAllCells().length,
                          class: ui.value.td({ class: [(_g2 = props.ui) == null ? void 0 : _g2.td] })
                        }, [
                          renderSlot(_ctx.$slots, "expanded", { row })
                        ], 10, ["colspan"])
                      ], 2)) : createCommentVNode("", true)
                    ], 64);
                  }), 128)) : __props.loading && !!slots["loading"] ? (openBlock(), createBlock("tr", { key: 1 }, [
                    createVNode("td", {
                      colspan: unref(tableApi).getAllLeafColumns().length,
                      class: ui.value.loading({ class: (_q = props.ui) == null ? void 0 : _q.loading })
                    }, [
                      renderSlot(_ctx.$slots, "loading")
                    ], 10, ["colspan"])
                  ])) : (openBlock(), createBlock("tr", { key: 2 }, [
                    createVNode("td", {
                      colspan: unref(tableApi).getAllLeafColumns().length,
                      class: ui.value.empty({ class: (_r = props.ui) == null ? void 0 : _r.empty })
                    }, [
                      renderSlot(_ctx.$slots, "empty", {}, () => [
                        createTextVNode(toDisplayString(__props.empty || unref(t)("table.noData")), 1)
                      ])
                    ], 10, ["colspan"])
                  ])),
                  renderSlot(_ctx.$slots, "body-bottom")
                ], 2),
                hasFooter.value ? (openBlock(), createBlock("tfoot", {
                  key: 1,
                  class: ui.value.tfoot({ class: [(_s = props.ui) == null ? void 0 : _s.tfoot] })
                }, [
                  createVNode("tr", {
                    class: ui.value.separator({ class: [(_t = props.ui) == null ? void 0 : _t.separator] })
                  }, null, 2),
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(tableApi).getFooterGroups(), (footerGroup) => {
                    var _a4;
                    return openBlock(), createBlock("tr", {
                      key: footerGroup.id,
                      class: ui.value.tr({ class: [(_a4 = props.ui) == null ? void 0 : _a4.tr] })
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(footerGroup.headers, (header) => {
                        var _a5, _b2, _c2, _d2, _e2;
                        return openBlock(), createBlock("th", {
                          key: header.id,
                          "data-pinned": header.column.getIsPinned(),
                          colspan: header.colSpan > 1 ? header.colSpan : void 0,
                          rowspan: header.rowSpan > 1 ? header.rowSpan : void 0,
                          class: ui.value.th({
                            class: [
                              (_a5 = props.ui) == null ? void 0 : _a5.th,
                              resolveValue((_c2 = (_b2 = header.column.columnDef.meta) == null ? void 0 : _b2.class) == null ? void 0 : _c2.th, header)
                            ],
                            pinned: !!header.column.getIsPinned()
                          }),
                          style: resolveValue((_e2 = (_d2 = header.column.columnDef.meta) == null ? void 0 : _d2.style) == null ? void 0 : _e2.th, header)
                        }, [
                          renderSlot(_ctx.$slots, `${header.id}-footer`, mergeProps({ ref_for: true }, header.getContext()), () => [
                            !header.isPlaceholder ? (openBlock(), createBlock(unref(FlexRender), {
                              key: 0,
                              render: header.column.columnDef.footer,
                              props: header.getContext()
                            }, null, 8, ["render", "props"])) : createCommentVNode("", true)
                          ])
                        ], 14, ["data-pinned", "colspan", "rowspan"]);
                      }), 128))
                    ], 2);
                  }), 128))
                ], 2)) : createCommentVNode("", true)
              ], 2)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/Table.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Table-B22j8vPn.mjs.map
