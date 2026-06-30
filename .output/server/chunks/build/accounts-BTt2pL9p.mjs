import { l as useToast, c as _sfc_main$8, e as useAppConfig, f as useButtonGroup, g as useComponentIcons, t as tv, h as _sfc_main$d, i as _sfc_main$b, j as useLocale, k as usePortal } from './server.mjs';
import { _ as _sfc_main$3 } from './Table-B22j8vPn.mjs';
import { defineComponent, ref, withAsyncContext, mergeProps, unref, withCtx, createTextVNode, createVNode, openBlock, createBlock, toDisplayString, isRef, withModifiers, createCommentVNode, useSlots, computed, renderSlot, toRef, toHandlers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSlot, ssrRenderClass } from 'vue/server-renderer';
import { Primitive, useForwardPropsEmits, DialogRoot, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, VisuallyHidden, DialogTitle, DialogDescription, DialogClose } from 'reka-ui';
import { reactivePick } from '@vueuse/core';
import { _ as _sfc_main$4 } from './Card-CAi0hXpp.mjs';
import { _ as _sfc_main$5 } from './Input-BoUm5ePS.mjs';
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
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import '@tanstack/vue-table';

const theme$1 = {
  "slots": {
    "base": "font-medium inline-flex items-center",
    "label": "truncate",
    "leadingIcon": "shrink-0",
    "leadingAvatar": "shrink-0",
    "leadingAvatarSize": "",
    "trailingIcon": "shrink-0"
  },
  "variants": {
    "buttonGroup": {
      "horizontal": "not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]",
      "vertical": "not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]"
    },
    "color": {
      "primary": "",
      "secondary": "",
      "success": "",
      "info": "",
      "warning": "",
      "error": "",
      "neutral": ""
    },
    "variant": {
      "solid": "",
      "outline": "",
      "soft": "",
      "subtle": ""
    },
    "size": {
      "xs": {
        "base": "text-[8px]/3 px-1 py-0.5 gap-1 rounded-sm",
        "leadingIcon": "size-3",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-3"
      },
      "sm": {
        "base": "text-[10px]/3 px-1.5 py-1 gap-1 rounded-sm",
        "leadingIcon": "size-3",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-3"
      },
      "md": {
        "base": "text-xs px-2 py-1 gap-1 rounded-md",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4"
      },
      "lg": {
        "base": "text-sm px-2 py-1 gap-1.5 rounded-md",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5"
      },
      "xl": {
        "base": "text-base px-2.5 py-1 gap-1.5 rounded-md",
        "leadingIcon": "size-6",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-6"
      }
    },
    "square": {
      "true": ""
    }
  },
  "compoundVariants": [
    {
      "color": "primary",
      "variant": "solid",
      "class": "bg-primary text-inverted"
    },
    {
      "color": "secondary",
      "variant": "solid",
      "class": "bg-secondary text-inverted"
    },
    {
      "color": "success",
      "variant": "solid",
      "class": "bg-success text-inverted"
    },
    {
      "color": "info",
      "variant": "solid",
      "class": "bg-info text-inverted"
    },
    {
      "color": "warning",
      "variant": "solid",
      "class": "bg-warning text-inverted"
    },
    {
      "color": "error",
      "variant": "solid",
      "class": "bg-error text-inverted"
    },
    {
      "color": "primary",
      "variant": "outline",
      "class": "text-primary ring ring-inset ring-primary/50"
    },
    {
      "color": "secondary",
      "variant": "outline",
      "class": "text-secondary ring ring-inset ring-secondary/50"
    },
    {
      "color": "success",
      "variant": "outline",
      "class": "text-success ring ring-inset ring-success/50"
    },
    {
      "color": "info",
      "variant": "outline",
      "class": "text-info ring ring-inset ring-info/50"
    },
    {
      "color": "warning",
      "variant": "outline",
      "class": "text-warning ring ring-inset ring-warning/50"
    },
    {
      "color": "error",
      "variant": "outline",
      "class": "text-error ring ring-inset ring-error/50"
    },
    {
      "color": "primary",
      "variant": "soft",
      "class": "bg-primary/10 text-primary"
    },
    {
      "color": "secondary",
      "variant": "soft",
      "class": "bg-secondary/10 text-secondary"
    },
    {
      "color": "success",
      "variant": "soft",
      "class": "bg-success/10 text-success"
    },
    {
      "color": "info",
      "variant": "soft",
      "class": "bg-info/10 text-info"
    },
    {
      "color": "warning",
      "variant": "soft",
      "class": "bg-warning/10 text-warning"
    },
    {
      "color": "error",
      "variant": "soft",
      "class": "bg-error/10 text-error"
    },
    {
      "color": "primary",
      "variant": "subtle",
      "class": "bg-primary/10 text-primary ring ring-inset ring-primary/25"
    },
    {
      "color": "secondary",
      "variant": "subtle",
      "class": "bg-secondary/10 text-secondary ring ring-inset ring-secondary/25"
    },
    {
      "color": "success",
      "variant": "subtle",
      "class": "bg-success/10 text-success ring ring-inset ring-success/25"
    },
    {
      "color": "info",
      "variant": "subtle",
      "class": "bg-info/10 text-info ring ring-inset ring-info/25"
    },
    {
      "color": "warning",
      "variant": "subtle",
      "class": "bg-warning/10 text-warning ring ring-inset ring-warning/25"
    },
    {
      "color": "error",
      "variant": "subtle",
      "class": "bg-error/10 text-error ring ring-inset ring-error/25"
    },
    {
      "color": "neutral",
      "variant": "solid",
      "class": "text-inverted bg-inverted"
    },
    {
      "color": "neutral",
      "variant": "outline",
      "class": "ring ring-inset ring-accented text-default bg-default"
    },
    {
      "color": "neutral",
      "variant": "soft",
      "class": "text-default bg-elevated"
    },
    {
      "color": "neutral",
      "variant": "subtle",
      "class": "ring ring-inset ring-accented text-default bg-elevated"
    },
    {
      "size": "xs",
      "square": true,
      "class": "p-0.5"
    },
    {
      "size": "sm",
      "square": true,
      "class": "p-1"
    },
    {
      "size": "md",
      "square": true,
      "class": "p-1"
    },
    {
      "size": "lg",
      "square": true,
      "class": "p-1"
    },
    {
      "size": "xl",
      "square": true,
      "class": "p-1"
    }
  ],
  "defaultVariants": {
    "color": "primary",
    "variant": "solid",
    "size": "md"
  }
};
const _sfc_main$2 = {
  __name: "Badge",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false, default: "span" },
    label: { type: [String, Number], required: false },
    color: { type: null, required: false },
    variant: { type: null, required: false },
    size: { type: null, required: false },
    square: { type: Boolean, required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    icon: { type: String, required: false },
    avatar: { type: Object, required: false },
    leading: { type: Boolean, required: false },
    leadingIcon: { type: String, required: false },
    trailing: { type: Boolean, required: false },
    trailingIcon: { type: String, required: false }
  },
  setup(__props) {
    const props = __props;
    const slots = useSlots();
    const appConfig = useAppConfig();
    const { orientation, size: buttonGroupSize } = useButtonGroup(props);
    const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props);
    const ui = computed(() => {
      var _a;
      return tv({ extend: tv(theme$1), ...((_a = appConfig.ui) == null ? void 0 : _a.badge) || {} })({
        color: props.color,
        variant: props.variant,
        size: buttonGroupSize.value || props.size,
        square: props.square || !slots.default && !props.label,
        buttonGroup: orientation.value
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: __props.as,
        class: ui.value.base({ class: [(_a = props.ui) == null ? void 0 : _a.base, props.class] })
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "leading", {}, () => {
              var _a2, _b, _c;
              if (unref(isLeading) && unref(leadingIconName)) {
                _push2(ssrRenderComponent(_sfc_main$d, {
                  name: unref(leadingIconName),
                  class: ui.value.leadingIcon({ class: (_a2 = props.ui) == null ? void 0 : _a2.leadingIcon })
                }, null, _parent2, _scopeId));
              } else if (!!__props.avatar) {
                _push2(ssrRenderComponent(_sfc_main$b, mergeProps({
                  size: ((_b = props.ui) == null ? void 0 : _b.leadingAvatarSize) || ui.value.leadingAvatarSize()
                }, __props.avatar, {
                  class: ui.value.leadingAvatar({ class: (_c = props.ui) == null ? void 0 : _c.leadingAvatar })
                }), null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            }, _push2, _parent2, _scopeId);
            ssrRenderSlot(_ctx.$slots, "default", {}, () => {
              var _a2;
              if (__props.label !== void 0 && __props.label !== null) {
                _push2(`<span class="${ssrRenderClass(ui.value.label({ class: (_a2 = props.ui) == null ? void 0 : _a2.label }))}"${_scopeId}>${ssrInterpolate(__props.label)}</span>`);
              } else {
                _push2(`<!---->`);
              }
            }, _push2, _parent2, _scopeId);
            ssrRenderSlot(_ctx.$slots, "trailing", {}, () => {
              var _a2;
              if (unref(isTrailing) && unref(trailingIconName)) {
                _push2(ssrRenderComponent(_sfc_main$d, {
                  name: unref(trailingIconName),
                  class: ui.value.trailingIcon({ class: (_a2 = props.ui) == null ? void 0 : _a2.trailingIcon })
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "leading", {}, () => {
                var _a2, _b, _c;
                return [
                  unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$d, {
                    key: 0,
                    name: unref(leadingIconName),
                    class: ui.value.leadingIcon({ class: (_a2 = props.ui) == null ? void 0 : _a2.leadingIcon })
                  }, null, 8, ["name", "class"])) : !!__props.avatar ? (openBlock(), createBlock(_sfc_main$b, mergeProps({
                    key: 1,
                    size: ((_b = props.ui) == null ? void 0 : _b.leadingAvatarSize) || ui.value.leadingAvatarSize()
                  }, __props.avatar, {
                    class: ui.value.leadingAvatar({ class: (_c = props.ui) == null ? void 0 : _c.leadingAvatar })
                  }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                ];
              }),
              renderSlot(_ctx.$slots, "default", {}, () => {
                var _a2;
                return [
                  __props.label !== void 0 && __props.label !== null ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: ui.value.label({ class: (_a2 = props.ui) == null ? void 0 : _a2.label })
                  }, toDisplayString(__props.label), 3)) : createCommentVNode("", true)
                ];
              }),
              renderSlot(_ctx.$slots, "trailing", {}, () => {
                var _a2;
                return [
                  unref(isTrailing) && unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$d, {
                    key: 0,
                    name: unref(trailingIconName),
                    class: ui.value.trailingIcon({ class: (_a2 = props.ui) == null ? void 0 : _a2.trailingIcon })
                  }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                ];
              })
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/Badge.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const theme = {
  "slots": {
    "overlay": "fixed inset-0 bg-elevated/75",
    "content": "fixed bg-default divide-y divide-default flex flex-col focus:outline-none",
    "header": "flex items-center gap-1.5 p-4 sm:px-6 min-h-16",
    "wrapper": "",
    "body": "flex-1 overflow-y-auto p-4 sm:p-6",
    "footer": "flex items-center gap-1.5 p-4 sm:px-6",
    "title": "text-highlighted font-semibold",
    "description": "mt-1 text-muted text-sm",
    "close": "absolute top-4 end-4"
  },
  "variants": {
    "transition": {
      "true": {
        "overlay": "data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in]",
        "content": "data-[state=open]:animate-[scale-in_200ms_ease-out] data-[state=closed]:animate-[scale-out_200ms_ease-in]"
      }
    },
    "fullscreen": {
      "true": {
        "content": "inset-0"
      },
      "false": {
        "content": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-lg max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] rounded-lg shadow-lg ring ring-default overflow-hidden"
      }
    }
  }
};
const _sfc_main$1 = {
  __name: "Modal",
  __ssrInlineRender: true,
  props: {
    title: { type: String, required: false },
    description: { type: String, required: false },
    content: { type: Object, required: false },
    overlay: { type: Boolean, required: false, default: true },
    transition: { type: Boolean, required: false, default: true },
    fullscreen: { type: Boolean, required: false },
    portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
    close: { type: [Boolean, Object], required: false, default: true },
    closeIcon: { type: String, required: false },
    dismissible: { type: Boolean, required: false, default: true },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    open: { type: Boolean, required: false },
    defaultOpen: { type: Boolean, required: false },
    modal: { type: Boolean, required: false, default: true }
  },
  emits: ["after:leave", "after:enter", "close:prevent", "update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = useSlots();
    const { t } = useLocale();
    const appConfig = useAppConfig();
    const rootProps = useForwardPropsEmits(reactivePick(props, "open", "defaultOpen", "modal"), emits);
    const portalProps = usePortal(toRef(() => props.portal));
    const contentProps = toRef(() => props.content);
    const contentEvents = computed(() => {
      const defaultEvents = {
        closeAutoFocus: (e) => e.preventDefault()
      };
      if (!props.dismissible) {
        const events = ["pointerDownOutside", "interactOutside", "escapeKeyDown"];
        return events.reduce((acc, curr) => {
          acc[curr] = (e) => {
            e.preventDefault();
            emits("close:prevent");
          };
          return acc;
        }, defaultEvents);
      }
      return defaultEvents;
    });
    const ui = computed(() => {
      var _a;
      return tv({ extend: tv(theme), ...((_a = appConfig.ui) == null ? void 0 : _a.modal) || {} })({
        transition: props.transition,
        fullscreen: props.fullscreen
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogRoot), mergeProps(unref(rootProps), _attrs), {
        default: withCtx(({ open, close }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!!slots.default) {
              _push2(ssrRenderComponent(unref(DialogTrigger), {
                "as-child": "",
                class: props.class
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "default", { open }, null, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "default", { open })
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(DialogPortal), unref(portalProps), {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                var _a, _b, _c, _d;
                if (_push3) {
                  if (__props.overlay) {
                    _push3(ssrRenderComponent(unref(DialogOverlay), {
                      class: ui.value.overlay({ class: (_a = props.ui) == null ? void 0 : _a.overlay })
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(unref(DialogContent), mergeProps({
                    class: ui.value.content({ class: [!slots.default && props.class, (_b = props.ui) == null ? void 0 : _b.content] })
                  }, contentProps.value, {
                    onAfterEnter: ($event) => emits("after:enter"),
                    onAfterLeave: ($event) => emits("after:leave")
                  }, toHandlers(contentEvents.value)), {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (!!slots.content && (__props.title || !!slots.title || (__props.description || !!slots.description))) {
                          _push4(ssrRenderComponent(unref(VisuallyHidden), null, {
                            default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                if (__props.title || !!slots.title) {
                                  _push5(ssrRenderComponent(unref(DialogTitle), null, {
                                    default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        ssrRenderSlot(_ctx.$slots, "title", {}, () => {
                                          _push6(`${ssrInterpolate(__props.title)}`);
                                        }, _push6, _parent6, _scopeId5);
                                      } else {
                                        return [
                                          renderSlot(_ctx.$slots, "title", {}, () => [
                                            createTextVNode(toDisplayString(__props.title), 1)
                                          ])
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  _push5(`<!---->`);
                                }
                                if (__props.description || !!slots.description) {
                                  _push5(ssrRenderComponent(unref(DialogDescription), null, {
                                    default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        ssrRenderSlot(_ctx.$slots, "description", {}, () => {
                                          _push6(`${ssrInterpolate(__props.description)}`);
                                        }, _push6, _parent6, _scopeId5);
                                      } else {
                                        return [
                                          renderSlot(_ctx.$slots, "description", {}, () => [
                                            createTextVNode(toDisplayString(__props.description), 1)
                                          ])
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  _push5(`<!---->`);
                                }
                              } else {
                                return [
                                  __props.title || !!slots.title ? (openBlock(), createBlock(unref(DialogTitle), { key: 0 }, {
                                    default: withCtx(() => [
                                      renderSlot(_ctx.$slots, "title", {}, () => [
                                        createTextVNode(toDisplayString(__props.title), 1)
                                      ])
                                    ]),
                                    _: 3
                                  })) : createCommentVNode("", true),
                                  __props.description || !!slots.description ? (openBlock(), createBlock(unref(DialogDescription), { key: 1 }, {
                                    default: withCtx(() => [
                                      renderSlot(_ctx.$slots, "description", {}, () => [
                                        createTextVNode(toDisplayString(__props.description), 1)
                                      ])
                                    ]),
                                    _: 3
                                  })) : createCommentVNode("", true)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        ssrRenderSlot(_ctx.$slots, "content", { close }, () => {
                          var _a2, _b2, _c2;
                          if (!!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) || (props.close || !!slots.close)) {
                            _push4(`<div class="${ssrRenderClass(ui.value.header({ class: (_a2 = props.ui) == null ? void 0 : _a2.header }))}"${_scopeId3}>`);
                            ssrRenderSlot(_ctx.$slots, "header", { close }, () => {
                              var _a3, _b3, _c3;
                              _push4(`<div class="${ssrRenderClass(ui.value.wrapper({ class: (_a3 = props.ui) == null ? void 0 : _a3.wrapper }))}"${_scopeId3}>`);
                              if (__props.title || !!slots.title) {
                                _push4(ssrRenderComponent(unref(DialogTitle), {
                                  class: ui.value.title({ class: (_b3 = props.ui) == null ? void 0 : _b3.title })
                                }, {
                                  default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                                    if (_push5) {
                                      ssrRenderSlot(_ctx.$slots, "title", {}, () => {
                                        _push5(`${ssrInterpolate(__props.title)}`);
                                      }, _push5, _parent5, _scopeId4);
                                    } else {
                                      return [
                                        renderSlot(_ctx.$slots, "title", {}, () => [
                                          createTextVNode(toDisplayString(__props.title), 1)
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent4, _scopeId3));
                              } else {
                                _push4(`<!---->`);
                              }
                              if (__props.description || !!slots.description) {
                                _push4(ssrRenderComponent(unref(DialogDescription), {
                                  class: ui.value.description({ class: (_c3 = props.ui) == null ? void 0 : _c3.description })
                                }, {
                                  default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                                    if (_push5) {
                                      ssrRenderSlot(_ctx.$slots, "description", {}, () => {
                                        _push5(`${ssrInterpolate(__props.description)}`);
                                      }, _push5, _parent5, _scopeId4);
                                    } else {
                                      return [
                                        renderSlot(_ctx.$slots, "description", {}, () => [
                                          createTextVNode(toDisplayString(__props.description), 1)
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent4, _scopeId3));
                              } else {
                                _push4(`<!---->`);
                              }
                              _push4(`</div>`);
                              ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push4, _parent4, _scopeId3);
                              if (props.close || !!slots.close) {
                                _push4(ssrRenderComponent(unref(DialogClose), { "as-child": "" }, {
                                  default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                                    if (_push5) {
                                      ssrRenderSlot(_ctx.$slots, "close", {
                                        close,
                                        ui: ui.value
                                      }, () => {
                                        var _a4;
                                        if (props.close) {
                                          _push5(ssrRenderComponent(_sfc_main$8, mergeProps({
                                            icon: __props.closeIcon || unref(appConfig).ui.icons.close,
                                            color: "neutral",
                                            variant: "ghost",
                                            "aria-label": unref(t)("modal.close")
                                          }, typeof props.close === "object" ? props.close : {}, {
                                            class: ui.value.close({ class: (_a4 = props.ui) == null ? void 0 : _a4.close })
                                          }), null, _parent5, _scopeId4));
                                        } else {
                                          _push5(`<!---->`);
                                        }
                                      }, _push5, _parent5, _scopeId4);
                                    } else {
                                      return [
                                        renderSlot(_ctx.$slots, "close", {
                                          close,
                                          ui: ui.value
                                        }, () => {
                                          var _a4;
                                          return [
                                            props.close ? (openBlock(), createBlock(_sfc_main$8, mergeProps({
                                              key: 0,
                                              icon: __props.closeIcon || unref(appConfig).ui.icons.close,
                                              color: "neutral",
                                              variant: "ghost",
                                              "aria-label": unref(t)("modal.close")
                                            }, typeof props.close === "object" ? props.close : {}, {
                                              class: ui.value.close({ class: (_a4 = props.ui) == null ? void 0 : _a4.close })
                                            }), null, 16, ["icon", "aria-label", "class"])) : createCommentVNode("", true)
                                          ];
                                        })
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent4, _scopeId3));
                              } else {
                                _push4(`<!---->`);
                              }
                            }, _push4, _parent4, _scopeId3);
                            _push4(`</div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          if (!!slots.body) {
                            _push4(`<div class="${ssrRenderClass(ui.value.body({ class: (_b2 = props.ui) == null ? void 0 : _b2.body }))}"${_scopeId3}>`);
                            ssrRenderSlot(_ctx.$slots, "body", { close }, null, _push4, _parent4, _scopeId3);
                            _push4(`</div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          if (!!slots.footer) {
                            _push4(`<div class="${ssrRenderClass(ui.value.footer({ class: (_c2 = props.ui) == null ? void 0 : _c2.footer }))}"${_scopeId3}>`);
                            ssrRenderSlot(_ctx.$slots, "footer", { close }, null, _push4, _parent4, _scopeId3);
                            _push4(`</div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                        }, _push4, _parent4, _scopeId3);
                      } else {
                        return [
                          !!slots.content && (__props.title || !!slots.title || (__props.description || !!slots.description)) ? (openBlock(), createBlock(unref(VisuallyHidden), { key: 0 }, {
                            default: withCtx(() => [
                              __props.title || !!slots.title ? (openBlock(), createBlock(unref(DialogTitle), { key: 0 }, {
                                default: withCtx(() => [
                                  renderSlot(_ctx.$slots, "title", {}, () => [
                                    createTextVNode(toDisplayString(__props.title), 1)
                                  ])
                                ]),
                                _: 3
                              })) : createCommentVNode("", true),
                              __props.description || !!slots.description ? (openBlock(), createBlock(unref(DialogDescription), { key: 1 }, {
                                default: withCtx(() => [
                                  renderSlot(_ctx.$slots, "description", {}, () => [
                                    createTextVNode(toDisplayString(__props.description), 1)
                                  ])
                                ]),
                                _: 3
                              })) : createCommentVNode("", true)
                            ]),
                            _: 3
                          })) : createCommentVNode("", true),
                          renderSlot(_ctx.$slots, "content", { close }, () => {
                            var _a2, _b2, _c2;
                            return [
                              !!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) || (props.close || !!slots.close) ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: ui.value.header({ class: (_a2 = props.ui) == null ? void 0 : _a2.header })
                              }, [
                                renderSlot(_ctx.$slots, "header", { close }, () => {
                                  var _a3, _b3, _c3;
                                  return [
                                    createVNode("div", {
                                      class: ui.value.wrapper({ class: (_a3 = props.ui) == null ? void 0 : _a3.wrapper })
                                    }, [
                                      __props.title || !!slots.title ? (openBlock(), createBlock(unref(DialogTitle), {
                                        key: 0,
                                        class: ui.value.title({ class: (_b3 = props.ui) == null ? void 0 : _b3.title })
                                      }, {
                                        default: withCtx(() => [
                                          renderSlot(_ctx.$slots, "title", {}, () => [
                                            createTextVNode(toDisplayString(__props.title), 1)
                                          ])
                                        ]),
                                        _: 3
                                      }, 8, ["class"])) : createCommentVNode("", true),
                                      __props.description || !!slots.description ? (openBlock(), createBlock(unref(DialogDescription), {
                                        key: 1,
                                        class: ui.value.description({ class: (_c3 = props.ui) == null ? void 0 : _c3.description })
                                      }, {
                                        default: withCtx(() => [
                                          renderSlot(_ctx.$slots, "description", {}, () => [
                                            createTextVNode(toDisplayString(__props.description), 1)
                                          ])
                                        ]),
                                        _: 3
                                      }, 8, ["class"])) : createCommentVNode("", true)
                                    ], 2),
                                    renderSlot(_ctx.$slots, "actions"),
                                    props.close || !!slots.close ? (openBlock(), createBlock(unref(DialogClose), {
                                      key: 0,
                                      "as-child": ""
                                    }, {
                                      default: withCtx(() => [
                                        renderSlot(_ctx.$slots, "close", {
                                          close,
                                          ui: ui.value
                                        }, () => {
                                          var _a4;
                                          return [
                                            props.close ? (openBlock(), createBlock(_sfc_main$8, mergeProps({
                                              key: 0,
                                              icon: __props.closeIcon || unref(appConfig).ui.icons.close,
                                              color: "neutral",
                                              variant: "ghost",
                                              "aria-label": unref(t)("modal.close")
                                            }, typeof props.close === "object" ? props.close : {}, {
                                              class: ui.value.close({ class: (_a4 = props.ui) == null ? void 0 : _a4.close })
                                            }), null, 16, ["icon", "aria-label", "class"])) : createCommentVNode("", true)
                                          ];
                                        })
                                      ]),
                                      _: 2
                                    }, 1024)) : createCommentVNode("", true)
                                  ];
                                })
                              ], 2)) : createCommentVNode("", true),
                              !!slots.body ? (openBlock(), createBlock("div", {
                                key: 1,
                                class: ui.value.body({ class: (_b2 = props.ui) == null ? void 0 : _b2.body })
                              }, [
                                renderSlot(_ctx.$slots, "body", { close })
                              ], 2)) : createCommentVNode("", true),
                              !!slots.footer ? (openBlock(), createBlock("div", {
                                key: 2,
                                class: ui.value.footer({ class: (_c2 = props.ui) == null ? void 0 : _c2.footer })
                              }, [
                                renderSlot(_ctx.$slots, "footer", { close })
                              ], 2)) : createCommentVNode("", true)
                            ];
                          })
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    __props.overlay ? (openBlock(), createBlock(unref(DialogOverlay), {
                      key: 0,
                      class: ui.value.overlay({ class: (_c = props.ui) == null ? void 0 : _c.overlay })
                    }, null, 8, ["class"])) : createCommentVNode("", true),
                    createVNode(unref(DialogContent), mergeProps({
                      class: ui.value.content({ class: [!slots.default && props.class, (_d = props.ui) == null ? void 0 : _d.content] })
                    }, contentProps.value, {
                      onAfterEnter: ($event) => emits("after:enter"),
                      onAfterLeave: ($event) => emits("after:leave")
                    }, toHandlers(contentEvents.value)), {
                      default: withCtx(() => [
                        !!slots.content && (__props.title || !!slots.title || (__props.description || !!slots.description)) ? (openBlock(), createBlock(unref(VisuallyHidden), { key: 0 }, {
                          default: withCtx(() => [
                            __props.title || !!slots.title ? (openBlock(), createBlock(unref(DialogTitle), { key: 0 }, {
                              default: withCtx(() => [
                                renderSlot(_ctx.$slots, "title", {}, () => [
                                  createTextVNode(toDisplayString(__props.title), 1)
                                ])
                              ]),
                              _: 3
                            })) : createCommentVNode("", true),
                            __props.description || !!slots.description ? (openBlock(), createBlock(unref(DialogDescription), { key: 1 }, {
                              default: withCtx(() => [
                                renderSlot(_ctx.$slots, "description", {}, () => [
                                  createTextVNode(toDisplayString(__props.description), 1)
                                ])
                              ]),
                              _: 3
                            })) : createCommentVNode("", true)
                          ]),
                          _: 3
                        })) : createCommentVNode("", true),
                        renderSlot(_ctx.$slots, "content", { close }, () => {
                          var _a2, _b2, _c2;
                          return [
                            !!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) || (props.close || !!slots.close) ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: ui.value.header({ class: (_a2 = props.ui) == null ? void 0 : _a2.header })
                            }, [
                              renderSlot(_ctx.$slots, "header", { close }, () => {
                                var _a3, _b3, _c3;
                                return [
                                  createVNode("div", {
                                    class: ui.value.wrapper({ class: (_a3 = props.ui) == null ? void 0 : _a3.wrapper })
                                  }, [
                                    __props.title || !!slots.title ? (openBlock(), createBlock(unref(DialogTitle), {
                                      key: 0,
                                      class: ui.value.title({ class: (_b3 = props.ui) == null ? void 0 : _b3.title })
                                    }, {
                                      default: withCtx(() => [
                                        renderSlot(_ctx.$slots, "title", {}, () => [
                                          createTextVNode(toDisplayString(__props.title), 1)
                                        ])
                                      ]),
                                      _: 3
                                    }, 8, ["class"])) : createCommentVNode("", true),
                                    __props.description || !!slots.description ? (openBlock(), createBlock(unref(DialogDescription), {
                                      key: 1,
                                      class: ui.value.description({ class: (_c3 = props.ui) == null ? void 0 : _c3.description })
                                    }, {
                                      default: withCtx(() => [
                                        renderSlot(_ctx.$slots, "description", {}, () => [
                                          createTextVNode(toDisplayString(__props.description), 1)
                                        ])
                                      ]),
                                      _: 3
                                    }, 8, ["class"])) : createCommentVNode("", true)
                                  ], 2),
                                  renderSlot(_ctx.$slots, "actions"),
                                  props.close || !!slots.close ? (openBlock(), createBlock(unref(DialogClose), {
                                    key: 0,
                                    "as-child": ""
                                  }, {
                                    default: withCtx(() => [
                                      renderSlot(_ctx.$slots, "close", {
                                        close,
                                        ui: ui.value
                                      }, () => {
                                        var _a4;
                                        return [
                                          props.close ? (openBlock(), createBlock(_sfc_main$8, mergeProps({
                                            key: 0,
                                            icon: __props.closeIcon || unref(appConfig).ui.icons.close,
                                            color: "neutral",
                                            variant: "ghost",
                                            "aria-label": unref(t)("modal.close")
                                          }, typeof props.close === "object" ? props.close : {}, {
                                            class: ui.value.close({ class: (_a4 = props.ui) == null ? void 0 : _a4.close })
                                          }), null, 16, ["icon", "aria-label", "class"])) : createCommentVNode("", true)
                                        ];
                                      })
                                    ]),
                                    _: 2
                                  }, 1024)) : createCommentVNode("", true)
                                ];
                              })
                            ], 2)) : createCommentVNode("", true),
                            !!slots.body ? (openBlock(), createBlock("div", {
                              key: 1,
                              class: ui.value.body({ class: (_b2 = props.ui) == null ? void 0 : _b2.body })
                            }, [
                              renderSlot(_ctx.$slots, "body", { close })
                            ], 2)) : createCommentVNode("", true),
                            !!slots.footer ? (openBlock(), createBlock("div", {
                              key: 2,
                              class: ui.value.footer({ class: (_c2 = props.ui) == null ? void 0 : _c2.footer })
                            }, [
                              renderSlot(_ctx.$slots, "footer", { close })
                            ], 2)) : createCommentVNode("", true)
                          ];
                        })
                      ]),
                      _: 2
                    }, 1040, ["class", "onAfterEnter", "onAfterLeave"])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              !!slots.default ? (openBlock(), createBlock(unref(DialogTrigger), {
                key: 0,
                "as-child": "",
                class: props.class
              }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default", { open })
                ]),
                _: 2
              }, 1032, ["class"])) : createCommentVNode("", true),
              createVNode(unref(DialogPortal), unref(portalProps), {
                default: withCtx(() => {
                  var _a, _b;
                  return [
                    __props.overlay ? (openBlock(), createBlock(unref(DialogOverlay), {
                      key: 0,
                      class: ui.value.overlay({ class: (_a = props.ui) == null ? void 0 : _a.overlay })
                    }, null, 8, ["class"])) : createCommentVNode("", true),
                    createVNode(unref(DialogContent), mergeProps({
                      class: ui.value.content({ class: [!slots.default && props.class, (_b = props.ui) == null ? void 0 : _b.content] })
                    }, contentProps.value, {
                      onAfterEnter: ($event) => emits("after:enter"),
                      onAfterLeave: ($event) => emits("after:leave")
                    }, toHandlers(contentEvents.value)), {
                      default: withCtx(() => [
                        !!slots.content && (__props.title || !!slots.title || (__props.description || !!slots.description)) ? (openBlock(), createBlock(unref(VisuallyHidden), { key: 0 }, {
                          default: withCtx(() => [
                            __props.title || !!slots.title ? (openBlock(), createBlock(unref(DialogTitle), { key: 0 }, {
                              default: withCtx(() => [
                                renderSlot(_ctx.$slots, "title", {}, () => [
                                  createTextVNode(toDisplayString(__props.title), 1)
                                ])
                              ]),
                              _: 3
                            })) : createCommentVNode("", true),
                            __props.description || !!slots.description ? (openBlock(), createBlock(unref(DialogDescription), { key: 1 }, {
                              default: withCtx(() => [
                                renderSlot(_ctx.$slots, "description", {}, () => [
                                  createTextVNode(toDisplayString(__props.description), 1)
                                ])
                              ]),
                              _: 3
                            })) : createCommentVNode("", true)
                          ]),
                          _: 3
                        })) : createCommentVNode("", true),
                        renderSlot(_ctx.$slots, "content", { close }, () => {
                          var _a2, _b2, _c;
                          return [
                            !!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) || (props.close || !!slots.close) ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: ui.value.header({ class: (_a2 = props.ui) == null ? void 0 : _a2.header })
                            }, [
                              renderSlot(_ctx.$slots, "header", { close }, () => {
                                var _a3, _b3, _c2;
                                return [
                                  createVNode("div", {
                                    class: ui.value.wrapper({ class: (_a3 = props.ui) == null ? void 0 : _a3.wrapper })
                                  }, [
                                    __props.title || !!slots.title ? (openBlock(), createBlock(unref(DialogTitle), {
                                      key: 0,
                                      class: ui.value.title({ class: (_b3 = props.ui) == null ? void 0 : _b3.title })
                                    }, {
                                      default: withCtx(() => [
                                        renderSlot(_ctx.$slots, "title", {}, () => [
                                          createTextVNode(toDisplayString(__props.title), 1)
                                        ])
                                      ]),
                                      _: 3
                                    }, 8, ["class"])) : createCommentVNode("", true),
                                    __props.description || !!slots.description ? (openBlock(), createBlock(unref(DialogDescription), {
                                      key: 1,
                                      class: ui.value.description({ class: (_c2 = props.ui) == null ? void 0 : _c2.description })
                                    }, {
                                      default: withCtx(() => [
                                        renderSlot(_ctx.$slots, "description", {}, () => [
                                          createTextVNode(toDisplayString(__props.description), 1)
                                        ])
                                      ]),
                                      _: 3
                                    }, 8, ["class"])) : createCommentVNode("", true)
                                  ], 2),
                                  renderSlot(_ctx.$slots, "actions"),
                                  props.close || !!slots.close ? (openBlock(), createBlock(unref(DialogClose), {
                                    key: 0,
                                    "as-child": ""
                                  }, {
                                    default: withCtx(() => [
                                      renderSlot(_ctx.$slots, "close", {
                                        close,
                                        ui: ui.value
                                      }, () => {
                                        var _a4;
                                        return [
                                          props.close ? (openBlock(), createBlock(_sfc_main$8, mergeProps({
                                            key: 0,
                                            icon: __props.closeIcon || unref(appConfig).ui.icons.close,
                                            color: "neutral",
                                            variant: "ghost",
                                            "aria-label": unref(t)("modal.close")
                                          }, typeof props.close === "object" ? props.close : {}, {
                                            class: ui.value.close({ class: (_a4 = props.ui) == null ? void 0 : _a4.close })
                                          }), null, 16, ["icon", "aria-label", "class"])) : createCommentVNode("", true)
                                        ];
                                      })
                                    ]),
                                    _: 2
                                  }, 1024)) : createCommentVNode("", true)
                                ];
                              })
                            ], 2)) : createCommentVNode("", true),
                            !!slots.body ? (openBlock(), createBlock("div", {
                              key: 1,
                              class: ui.value.body({ class: (_b2 = props.ui) == null ? void 0 : _b2.body })
                            }, [
                              renderSlot(_ctx.$slots, "body", { close })
                            ], 2)) : createCommentVNode("", true),
                            !!slots.footer ? (openBlock(), createBlock("div", {
                              key: 2,
                              class: ui.value.footer({ class: (_c = props.ui) == null ? void 0 : _c.footer })
                            }, [
                              renderSlot(_ctx.$slots, "footer", { close })
                            ], 2)) : createCommentVNode("", true)
                          ];
                        })
                      ]),
                      _: 2
                    }, 1040, ["class", "onAfterEnter", "onAfterLeave"])
                  ];
                }),
                _: 2
              }, 1040)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/Modal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "accounts",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { adminFetch } = useAdminToken();
    const rows = ref([]);
    async function loadAccounts() {
      var _a;
      const res = await adminFetch("/api/admin/accounts");
      rows.value = (_a = res == null ? void 0 : res.data) != null ? _a : [];
    }
    [__temp, __restore] = withAsyncContext(() => loadAccounts()), await __temp, __restore();
    const columns = [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "session_mask", header: "Session" },
      { accessorKey: "label", header: "\u5907\u6CE8" },
      { accessorKey: "enabled", header: "\u542F\u7528" },
      { accessorKey: "last_total_credit", header: "\u79EF\u5206" },
      { accessorKey: "account_type", header: "\u7C7B\u578B" },
      { accessorKey: "vip_level", header: "\u4F1A\u5458" },
      { accessorKey: "vip_expire_at", header: "\u5230\u671F" },
      { accessorKey: "fail_count", header: "\u5931\u8D25" },
      { id: "actions", header: "\u64CD\u4F5C" }
    ];
    const showAdd = ref(false);
    const newSession = ref("");
    const newLabel = ref("");
    const newProxy = ref("");
    const adding = ref(false);
    const refreshing = ref(false);
    const showLogin = ref(false);
    const loginEmail = ref("");
    const loginPassword = ref("");
    const loginLabel = ref("");
    const loginProxy = ref("");
    const logining = ref(false);
    const loginError = ref("");
    const loginSuccessMsg = ref("");
    const loadingId = ref(null);
    const loadingAction = ref("");
    const toast = useToast();
    async function add() {
      adding.value = true;
      try {
        await adminFetch("/api/admin/accounts", {
          method: "POST",
          body: {
            session_id: newSession.value,
            label: newLabel.value,
            proxy_url: newProxy.value || void 0
          }
        });
        showAdd.value = false;
        newSession.value = "";
        newLabel.value = "";
        newProxy.value = "";
        await loadAccounts();
      } finally {
        adding.value = false;
      }
    }
    async function loginAdd() {
      var _a;
      loginError.value = "";
      loginSuccessMsg.value = "";
      if (!loginEmail.value.trim() || !loginPassword.value) {
        loginError.value = "\u8BF7\u586B\u5199\u90AE\u7BB1\u548C\u5BC6\u7801";
        return;
      }
      logining.value = true;
      try {
        const res = await adminFetch(
          "/api/admin/accounts/login",
          {
            method: "POST",
            body: {
              email: loginEmail.value,
              password: loginPassword.value,
              label: loginLabel.value || void 0,
              proxy_url: loginProxy.value || void 0
            }
          }
        );
        loginSuccessMsg.value = `\u767B\u5F55\u6210\u529F\uFF08${res.action === "updated" ? "\u5DF2\u66F4\u65B0" : "\u5DF2\u6DFB\u52A0"}\uFF09${res.user_id ? `\uFF0Cuser_id: ${res.user_id}` : ""}`;
        loginEmail.value = "";
        loginPassword.value = "";
        loginLabel.value = "";
        loginProxy.value = "";
        await loadAccounts();
      } catch (e) {
        loginError.value = ((_a = e == null ? void 0 : e.data) == null ? void 0 : _a.message) || (e == null ? void 0 : e.message) || "\u767B\u5F55\u5931\u8D25";
      } finally {
        logining.value = false;
      }
    }
    async function refreshAll() {
      refreshing.value = true;
      try {
        await adminFetch("/api/admin/accounts/refresh", { method: "POST", body: {} });
        await loadAccounts();
      } finally {
        refreshing.value = false;
      }
    }
    async function refreshCredit(row) {
      var _a;
      loadingId.value = row.id;
      loadingAction.value = "credit";
      try {
        await adminFetch("/api/admin/accounts/refresh", { method: "POST", body: { id: row.id } });
        toast.add({ title: "\u989D\u5EA6\u5237\u65B0\u6210\u529F", color: "success" });
        await loadAccounts();
      } catch (e) {
        toast.add({ title: "\u989D\u5EA6\u5237\u65B0\u5931\u8D25", description: ((_a = e == null ? void 0 : e.data) == null ? void 0 : _a.message) || (e == null ? void 0 : e.message), color: "error" });
      } finally {
        loadingId.value = null;
        loadingAction.value = "";
      }
    }
    async function fetchInfo(row) {
      var _a;
      loadingId.value = row.id;
      loadingAction.value = "info";
      try {
        const res = await adminFetch(`/api/admin/accounts/${row.id}/info`, { method: "POST" });
        toast.add({
          title: "\u83B7\u53D6\u8D26\u6237\u4FE1\u606F\u6210\u529F",
          description: `\u7C7B\u578B: ${res.account_type}${res.vip_level ? `\uFF0C\u4F1A\u5458: ${res.vip_level}` : ""}${res.vip_expire_at ? `\uFF0C\u5230\u671F: ${res.vip_expire_at}` : ""}`,
          color: "success"
        });
        await loadAccounts();
      } catch (e) {
        toast.add({ title: "\u83B7\u53D6\u8D26\u6237\u4FE1\u606F\u5931\u8D25", description: ((_a = e == null ? void 0 : e.data) == null ? void 0 : _a.message) || (e == null ? void 0 : e.message), color: "error" });
      } finally {
        loadingId.value = null;
        loadingAction.value = "";
      }
    }
    async function refreshSession(row) {
      var _a;
      loadingId.value = row.id;
      loadingAction.value = "session";
      try {
        await adminFetch(`/api/admin/accounts/${row.id}/refresh-session`, { method: "POST" });
        toast.add({ title: "Session \u5237\u65B0\u6210\u529F", color: "success" });
        await loadAccounts();
      } catch (e) {
        toast.add({ title: "Session \u5237\u65B0\u5931\u8D25", description: ((_a = e == null ? void 0 : e.data) == null ? void 0 : _a.message) || (e == null ? void 0 : e.message), color: "error" });
      } finally {
        loadingId.value = null;
        loadingAction.value = "";
      }
    }
    async function removeAccount(row) {
      var _a;
      loadingId.value = row.id;
      loadingAction.value = "delete";
      try {
        await adminFetch(`/api/admin/accounts/${row.id}`, { method: "DELETE" });
        toast.add({ title: "\u8D26\u53F7\u5DF2\u5220\u9664", color: "success" });
        await loadAccounts();
      } catch (e) {
        toast.add({ title: "\u5220\u9664\u5931\u8D25", description: ((_a = e == null ? void 0 : e.data) == null ? void 0 : _a.message) || (e == null ? void 0 : e.message), color: "error" });
      } finally {
        loadingId.value = null;
        loadingAction.value = "";
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$8;
      const _component_UTable = _sfc_main$3;
      const _component_UBadge = _sfc_main$2;
      const _component_UModal = _sfc_main$1;
      const _component_UCard = _sfc_main$4;
      const _component_UInput = _sfc_main$5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex flex-wrap items-center justify-between gap-3"><h1 class="text-xl font-semibold">\u8D26\u53F7\u6C60</h1><div class="flex gap-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        variant: "outline",
        loading: unref(refreshing),
        onClick: refreshAll
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u5237\u65B0\u5168\u90E8\u989D\u5EA6`);
          } else {
            return [
              createTextVNode("\u5237\u65B0\u5168\u90E8\u989D\u5EA6")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        variant: "outline",
        onClick: ($event) => showLogin.value = true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u90AE\u7BB1\u767B\u5F55`);
          } else {
            return [
              createTextVNode("\u90AE\u7BB1\u767B\u5F55")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        onClick: ($event) => showAdd.value = true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u6DFB\u52A0\u8D26\u53F7`);
          } else {
            return [
              createTextVNode("\u6DFB\u52A0\u8D26\u53F7")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_UTable, {
        data: unref(rows),
        columns
      }, {
        "enabled-cell": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UBadge, {
              color: row.enabled ? "success" : "neutral",
              variant: "subtle"
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(row.enabled ? "\u542F\u7528" : "\u7981\u7528")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(row.enabled ? "\u542F\u7528" : "\u7981\u7528"), 1)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UBadge, {
                color: row.enabled ? "success" : "neutral",
                variant: "subtle"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(row.enabled ? "\u542F\u7528" : "\u7981\u7528"), 1)
                ]),
                _: 2
              }, 1032, ["color"])
            ];
          }
        }),
        "account_type-cell": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (row.account_type) {
              _push2(`<span class="text-xs"${_scopeId}>${ssrInterpolate(row.account_type)}</span>`);
            } else {
              _push2(`<span class="text-xs text-muted"${_scopeId}>\u2014</span>`);
            }
          } else {
            return [
              row.account_type ? (openBlock(), createBlock("span", {
                key: 0,
                class: "text-xs"
              }, toDisplayString(row.account_type), 1)) : (openBlock(), createBlock("span", {
                key: 1,
                class: "text-xs text-muted"
              }, "\u2014"))
            ];
          }
        }),
        "vip_level-cell": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (row.vip_level) {
              _push2(ssrRenderComponent(_component_UBadge, {
                color: "warning",
                variant: "subtle",
                class: "text-xs"
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(row.vip_level)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(row.vip_level), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<span class="text-xs text-muted"${_scopeId}>\u2014</span>`);
            }
          } else {
            return [
              row.vip_level ? (openBlock(), createBlock(_component_UBadge, {
                key: 0,
                color: "warning",
                variant: "subtle",
                class: "text-xs"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(row.vip_level), 1)
                ]),
                _: 2
              }, 1024)) : (openBlock(), createBlock("span", {
                key: 1,
                class: "text-xs text-muted"
              }, "\u2014"))
            ];
          }
        }),
        "vip_expire_at-cell": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (row.vip_expire_at) {
              _push2(`<span class="text-xs"${_scopeId}>${ssrInterpolate(row.vip_expire_at)}</span>`);
            } else {
              _push2(`<span class="text-xs text-muted"${_scopeId}>\u2014</span>`);
            }
          } else {
            return [
              row.vip_expire_at ? (openBlock(), createBlock("span", {
                key: 0,
                class: "text-xs"
              }, toDisplayString(row.vip_expire_at), 1)) : (openBlock(), createBlock("span", {
                key: 1,
                class: "text-xs text-muted"
              }, "\u2014"))
            ];
          }
        }),
        "actions-cell": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-wrap gap-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              size: "xs",
              variant: "outline",
              loading: unref(loadingId) === row.id && unref(loadingAction) === "credit",
              onClick: ($event) => refreshCredit(row)
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`\u5237\u65B0\u989D\u5EA6`);
                } else {
                  return [
                    createTextVNode("\u5237\u65B0\u989D\u5EA6")
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              size: "xs",
              variant: "outline",
              loading: unref(loadingId) === row.id && unref(loadingAction) === "info",
              onClick: ($event) => fetchInfo(row)
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`\u83B7\u53D6\u7C7B\u578B`);
                } else {
                  return [
                    createTextVNode("\u83B7\u53D6\u7C7B\u578B")
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              size: "xs",
              variant: "outline",
              disabled: !row.has_password,
              loading: unref(loadingId) === row.id && unref(loadingAction) === "session",
              onClick: ($event) => refreshSession(row)
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`\u5237\u65B0Session`);
                } else {
                  return [
                    createTextVNode("\u5237\u65B0Session")
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              size: "xs",
              color: "error",
              variant: "ghost",
              onClick: ($event) => removeAccount(row)
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`\u5220\u9664`);
                } else {
                  return [
                    createTextVNode("\u5220\u9664")
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-wrap gap-1" }, [
                createVNode(_component_UButton, {
                  size: "xs",
                  variant: "outline",
                  loading: unref(loadingId) === row.id && unref(loadingAction) === "credit",
                  onClick: ($event) => refreshCredit(row)
                }, {
                  default: withCtx(() => [
                    createTextVNode("\u5237\u65B0\u989D\u5EA6")
                  ]),
                  _: 1
                }, 8, ["loading", "onClick"]),
                createVNode(_component_UButton, {
                  size: "xs",
                  variant: "outline",
                  loading: unref(loadingId) === row.id && unref(loadingAction) === "info",
                  onClick: ($event) => fetchInfo(row)
                }, {
                  default: withCtx(() => [
                    createTextVNode("\u83B7\u53D6\u7C7B\u578B")
                  ]),
                  _: 1
                }, 8, ["loading", "onClick"]),
                createVNode(_component_UButton, {
                  size: "xs",
                  variant: "outline",
                  disabled: !row.has_password,
                  loading: unref(loadingId) === row.id && unref(loadingAction) === "session",
                  onClick: ($event) => refreshSession(row)
                }, {
                  default: withCtx(() => [
                    createTextVNode("\u5237\u65B0Session")
                  ]),
                  _: 1
                }, 8, ["disabled", "loading", "onClick"]),
                createVNode(_component_UButton, {
                  size: "xs",
                  color: "error",
                  variant: "ghost",
                  onClick: ($event) => removeAccount(row)
                }, {
                  default: withCtx(() => [
                    createTextVNode("\u5220\u9664")
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UModal, {
        open: unref(showAdd),
        "onUpdate:open": ($event) => isRef(showAdd) ? showAdd.value = $event : null
      }, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, null, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`\u6DFB\u52A0 Dreamina Session`);
                } else {
                  return [
                    createTextVNode("\u6DFB\u52A0 Dreamina Session")
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<form class="space-y-3"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(newSession),
                    "onUpdate:modelValue": ($event) => isRef(newSession) ? newSession.value = $event : null,
                    placeholder: "session_id"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(newLabel),
                    "onUpdate:modelValue": ($event) => isRef(newLabel) ? newLabel.value = $event : null,
                    placeholder: "\u5907\u6CE8 label"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(newProxy),
                    "onUpdate:modelValue": ($event) => isRef(newProxy) ? newProxy.value = $event : null,
                    placeholder: "\u4EE3\u7406 proxy_url\uFF08\u53EF\u9009\uFF09"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "submit",
                    block: "",
                    loading: unref(adding)
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`\u6DFB\u52A0`);
                      } else {
                        return [
                          createTextVNode("\u6DFB\u52A0")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</form>`);
                } else {
                  return [
                    createVNode("form", {
                      class: "space-y-3",
                      onSubmit: withModifiers(add, ["prevent"])
                    }, [
                      createVNode(_component_UInput, {
                        modelValue: unref(newSession),
                        "onUpdate:modelValue": ($event) => isRef(newSession) ? newSession.value = $event : null,
                        placeholder: "session_id"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_component_UInput, {
                        modelValue: unref(newLabel),
                        "onUpdate:modelValue": ($event) => isRef(newLabel) ? newLabel.value = $event : null,
                        placeholder: "\u5907\u6CE8 label"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_component_UInput, {
                        modelValue: unref(newProxy),
                        "onUpdate:modelValue": ($event) => isRef(newProxy) ? newProxy.value = $event : null,
                        placeholder: "\u4EE3\u7406 proxy_url\uFF08\u53EF\u9009\uFF09"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_component_UButton, {
                        type: "submit",
                        block: "",
                        loading: unref(adding)
                      }, {
                        default: withCtx(() => [
                          createTextVNode("\u6DFB\u52A0")
                        ]),
                        _: 1
                      }, 8, ["loading"])
                    ], 32)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UCard, null, {
                header: withCtx(() => [
                  createTextVNode("\u6DFB\u52A0 Dreamina Session")
                ]),
                default: withCtx(() => [
                  createVNode("form", {
                    class: "space-y-3",
                    onSubmit: withModifiers(add, ["prevent"])
                  }, [
                    createVNode(_component_UInput, {
                      modelValue: unref(newSession),
                      "onUpdate:modelValue": ($event) => isRef(newSession) ? newSession.value = $event : null,
                      placeholder: "session_id"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UInput, {
                      modelValue: unref(newLabel),
                      "onUpdate:modelValue": ($event) => isRef(newLabel) ? newLabel.value = $event : null,
                      placeholder: "\u5907\u6CE8 label"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UInput, {
                      modelValue: unref(newProxy),
                      "onUpdate:modelValue": ($event) => isRef(newProxy) ? newProxy.value = $event : null,
                      placeholder: "\u4EE3\u7406 proxy_url\uFF08\u53EF\u9009\uFF09"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UButton, {
                      type: "submit",
                      block: "",
                      loading: unref(adding)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("\u6DFB\u52A0")
                      ]),
                      _: 1
                    }, 8, ["loading"])
                  ], 32)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UModal, {
        open: unref(showLogin),
        "onUpdate:open": ($event) => isRef(showLogin) ? showLogin.value = $event : null
      }, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, null, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`\u90AE\u7BB1\u5BC6\u7801\u81EA\u52A8\u767B\u5F55`);
                } else {
                  return [
                    createTextVNode("\u90AE\u7BB1\u5BC6\u7801\u81EA\u52A8\u767B\u5F55")
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<form class="space-y-3"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(loginEmail),
                    "onUpdate:modelValue": ($event) => isRef(loginEmail) ? loginEmail.value = $event : null,
                    type: "email",
                    placeholder: "\u90AE\u7BB1 email"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(loginPassword),
                    "onUpdate:modelValue": ($event) => isRef(loginPassword) ? loginPassword.value = $event : null,
                    type: "password",
                    placeholder: "\u5BC6\u7801 password"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(loginLabel),
                    "onUpdate:modelValue": ($event) => isRef(loginLabel) ? loginLabel.value = $event : null,
                    placeholder: "\u5907\u6CE8 label\uFF08\u53EF\u9009\uFF09"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(loginProxy),
                    "onUpdate:modelValue": ($event) => isRef(loginProxy) ? loginProxy.value = $event : null,
                    placeholder: "\u4EE3\u7406 proxy_url\uFF08\u53EF\u9009\uFF09"
                  }, null, _parent3, _scopeId2));
                  if (unref(loginError)) {
                    _push3(`<div class="text-sm text-red-500"${_scopeId2}>${ssrInterpolate(unref(loginError))}</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  if (unref(loginSuccessMsg)) {
                    _push3(`<div class="text-sm text-green-500"${_scopeId2}>${ssrInterpolate(unref(loginSuccessMsg))}</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "submit",
                    block: "",
                    loading: unref(logining)
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`\u767B\u5F55\u5E76\u6DFB\u52A0`);
                      } else {
                        return [
                          createTextVNode("\u767B\u5F55\u5E76\u6DFB\u52A0")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</form>`);
                } else {
                  return [
                    createVNode("form", {
                      class: "space-y-3",
                      onSubmit: withModifiers(loginAdd, ["prevent"])
                    }, [
                      createVNode(_component_UInput, {
                        modelValue: unref(loginEmail),
                        "onUpdate:modelValue": ($event) => isRef(loginEmail) ? loginEmail.value = $event : null,
                        type: "email",
                        placeholder: "\u90AE\u7BB1 email"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_component_UInput, {
                        modelValue: unref(loginPassword),
                        "onUpdate:modelValue": ($event) => isRef(loginPassword) ? loginPassword.value = $event : null,
                        type: "password",
                        placeholder: "\u5BC6\u7801 password"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_component_UInput, {
                        modelValue: unref(loginLabel),
                        "onUpdate:modelValue": ($event) => isRef(loginLabel) ? loginLabel.value = $event : null,
                        placeholder: "\u5907\u6CE8 label\uFF08\u53EF\u9009\uFF09"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_component_UInput, {
                        modelValue: unref(loginProxy),
                        "onUpdate:modelValue": ($event) => isRef(loginProxy) ? loginProxy.value = $event : null,
                        placeholder: "\u4EE3\u7406 proxy_url\uFF08\u53EF\u9009\uFF09"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      unref(loginError) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "text-sm text-red-500"
                      }, toDisplayString(unref(loginError)), 1)) : createCommentVNode("", true),
                      unref(loginSuccessMsg) ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "text-sm text-green-500"
                      }, toDisplayString(unref(loginSuccessMsg)), 1)) : createCommentVNode("", true),
                      createVNode(_component_UButton, {
                        type: "submit",
                        block: "",
                        loading: unref(logining)
                      }, {
                        default: withCtx(() => [
                          createTextVNode("\u767B\u5F55\u5E76\u6DFB\u52A0")
                        ]),
                        _: 1
                      }, 8, ["loading"])
                    ], 32)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UCard, null, {
                header: withCtx(() => [
                  createTextVNode("\u90AE\u7BB1\u5BC6\u7801\u81EA\u52A8\u767B\u5F55")
                ]),
                default: withCtx(() => [
                  createVNode("form", {
                    class: "space-y-3",
                    onSubmit: withModifiers(loginAdd, ["prevent"])
                  }, [
                    createVNode(_component_UInput, {
                      modelValue: unref(loginEmail),
                      "onUpdate:modelValue": ($event) => isRef(loginEmail) ? loginEmail.value = $event : null,
                      type: "email",
                      placeholder: "\u90AE\u7BB1 email"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UInput, {
                      modelValue: unref(loginPassword),
                      "onUpdate:modelValue": ($event) => isRef(loginPassword) ? loginPassword.value = $event : null,
                      type: "password",
                      placeholder: "\u5BC6\u7801 password"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UInput, {
                      modelValue: unref(loginLabel),
                      "onUpdate:modelValue": ($event) => isRef(loginLabel) ? loginLabel.value = $event : null,
                      placeholder: "\u5907\u6CE8 label\uFF08\u53EF\u9009\uFF09"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UInput, {
                      modelValue: unref(loginProxy),
                      "onUpdate:modelValue": ($event) => isRef(loginProxy) ? loginProxy.value = $event : null,
                      placeholder: "\u4EE3\u7406 proxy_url\uFF08\u53EF\u9009\uFF09"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    unref(loginError) ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-sm text-red-500"
                    }, toDisplayString(unref(loginError)), 1)) : createCommentVNode("", true),
                    unref(loginSuccessMsg) ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "text-sm text-green-500"
                    }, toDisplayString(unref(loginSuccessMsg)), 1)) : createCommentVNode("", true),
                    createVNode(_component_UButton, {
                      type: "submit",
                      block: "",
                      loading: unref(logining)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("\u767B\u5F55\u5E76\u6DFB\u52A0")
                      ]),
                      _: 1
                    }, 8, ["loading"])
                  ], 32)
                ]),
                _: 1
              })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/accounts.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=accounts-BTt2pL9p.mjs.map
