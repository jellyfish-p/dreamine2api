import { defineComponent, withAsyncContext, ref, watch, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, isRef, openBlock, createBlock, toDisplayString, createCommentVNode, useId, inject, provide, reactive, readonly, resolveDynamicComponent, renderSlot, useSlots, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderVNode, ssrRenderSlot, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import { useEventBus } from '@vueuse/core';
import { d as useAsyncData, c as _sfc_main$8, e as useAppConfig, t as tv, m as formBusInjectionKey, o as formErrorsInjectionKey, p as formInputsInjectionKey, q as formLoadingInjectionKey, r as formOptionsInjectionKey, s as inputIdInjectionKey, v as formFieldInjectionKey } from './server.mjs';
import { _ as _sfc_main$3 } from './Card-CAi0hXpp.mjs';
import { Primitive, Label } from 'reka-ui';
import { _ as _sfc_main$4 } from './Input-BoUm5ePS.mjs';
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

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
function isYupSchema(schema) {
  return schema.validate && schema.__isYupSchema__;
}
function isYupError(error) {
  return error.inner !== void 0;
}
function isSuperStructSchema(schema) {
  return "schema" in schema && typeof schema.coercer === "function" && typeof schema.validator === "function" && typeof schema.refiner === "function";
}
function isJoiSchema(schema) {
  return schema.validateAsync !== void 0 && schema.id !== void 0;
}
function isJoiError(error) {
  return error.isJoi === true;
}
function isStandardSchema(schema) {
  return "~standard" in schema;
}
async function validateStandardSchema(state, schema) {
  var _a;
  const result = await schema["~standard"].validate(state);
  if (result.issues) {
    return {
      errors: ((_a = result.issues) == null ? void 0 : _a.map((issue) => {
        var _a2;
        return {
          name: ((_a2 = issue.path) == null ? void 0 : _a2.map((item) => typeof item === "object" ? item.key : item).join(".")) || "",
          message: issue.message
        };
      })) || [],
      result: null
    };
  }
  return {
    errors: null,
    result: result.value
  };
}
async function validateYupSchema(state, schema) {
  try {
    const result = await schema.validate(state, { abortEarly: false });
    return {
      errors: null,
      result
    };
  } catch (error) {
    if (isYupError(error)) {
      const errors = error.inner.map((issue) => {
        var _a;
        return {
          name: (_a = issue.path) != null ? _a : "",
          message: issue.message
        };
      });
      return {
        errors,
        result: null
      };
    } else {
      throw error;
    }
  }
}
async function validateSuperstructSchema(state, schema) {
  const [err, result] = schema.validate(state);
  if (err) {
    const errors = err.failures().map((error) => ({
      message: error.message,
      name: error.path.join(".")
    }));
    return {
      errors,
      result: null
    };
  }
  return {
    errors: null,
    result
  };
}
async function validateJoiSchema(state, schema) {
  try {
    const result = await schema.validateAsync(state, { abortEarly: false });
    return {
      errors: null,
      result
    };
  } catch (error) {
    if (isJoiError(error)) {
      const errors = error.details.map((issue) => ({
        name: issue.path.join("."),
        message: issue.message
      }));
      return {
        errors,
        result: null
      };
    } else {
      throw error;
    }
  }
}
function validateSchema(state, schema) {
  if (isStandardSchema(schema)) {
    return validateStandardSchema(state, schema);
  } else if (isJoiSchema(schema)) {
    return validateJoiSchema(state, schema);
  } else if (isYupSchema(schema)) {
    return validateYupSchema(state, schema);
  } else if (isSuperStructSchema(schema)) {
    return validateSuperstructSchema(state, schema);
  } else {
    throw new Error("Form validation failed: Unsupported form schema");
  }
}
class FormValidationException extends Error {
  constructor(formId, errors, childErrors) {
    super("Form validation exception");
    __publicField(this, "formId");
    __publicField(this, "errors");
    __publicField(this, "children");
    this.formId = formId;
    this.errors = errors;
    this.children = childErrors;
    Object.setPrototypeOf(this, FormValidationException.prototype);
  }
}
const theme$1 = {
  "base": ""
};
const _sfc_main$2 = {
  __name: "Form",
  __ssrInlineRender: true,
  props: {
    id: { type: [String, Number], required: false },
    schema: { type: null, required: false },
    state: { type: Object, required: true },
    validate: { type: Function, required: false },
    validateOn: { type: Array, required: false, default() {
      return ["input", "blur", "change"];
    } },
    disabled: { type: Boolean, required: false },
    validateOnInputDelay: { type: Number, required: false, default: 300 },
    transform: { type: null, required: false, default: () => true },
    attach: { type: Boolean, required: false, default: true },
    loadingAuto: { type: Boolean, required: false, default: true },
    class: { type: null, required: false },
    onSubmit: { type: Function, required: false }
  },
  emits: ["submit", "error"],
  setup(__props, { expose: __expose, emit: __emit }) {
    var _a;
    const props = __props;
    const emits = __emit;
    const appConfig = useAppConfig();
    const ui = computed(() => {
      var _a2;
      return tv({ extend: tv(theme$1), ...((_a2 = appConfig.ui) == null ? void 0 : _a2.form) || {} });
    });
    const formId = (_a = props.id) != null ? _a : useId();
    const bus = useEventBus(`form-${formId}`);
    const parentBus = props.attach && inject(
      formBusInjectionKey,
      void 0
    );
    provide(formBusInjectionKey, bus);
    const nestedForms = ref(/* @__PURE__ */ new Map());
    const errors = ref([]);
    provide(formErrorsInjectionKey, errors);
    const inputs = ref({});
    provide(formInputsInjectionKey, inputs);
    const dirtyFields = reactive(/* @__PURE__ */ new Set());
    const touchedFields = reactive(/* @__PURE__ */ new Set());
    const blurredFields = reactive(/* @__PURE__ */ new Set());
    function resolveErrorIds(errs) {
      return errs.map((err) => {
        var _a2;
        return {
          ...err,
          id: (err == null ? void 0 : err.name) ? (_a2 = inputs.value[err.name]) == null ? void 0 : _a2.id : void 0
        };
      });
    }
    const transformedState = ref(null);
    async function getErrors() {
      var _a2;
      let errs = props.validate ? (_a2 = await props.validate(props.state)) != null ? _a2 : [] : [];
      if (props.schema) {
        const { errors: errors2, result } = await validateSchema(props.state, props.schema);
        if (errors2) {
          errs = errs.concat(errors2);
        } else {
          transformedState.value = result;
        }
      }
      return resolveErrorIds(errs);
    }
    async function _validate(opts = { silent: false, nested: true, transform: false }) {
      const names = opts.name && !Array.isArray(opts.name) ? [opts.name] : opts.name;
      const nestedValidatePromises = !names && opts.nested ? Array.from(nestedForms.value.values()).map(
        ({ validate }) => validate(opts).then(() => void 0).catch((error) => {
          if (!(error instanceof FormValidationException)) {
            throw error;
          }
          return error;
        })
      ) : [];
      if (names) {
        const namesSet = new Set(names);
        const patterns = names.map((name) => {
          var _a2, _b;
          return (_b = (_a2 = inputs.value) == null ? void 0 : _a2[name]) == null ? void 0 : _b.pattern;
        }).filter(Boolean);
        const isErrorForPath = (error) => {
          if (!error.name) return false;
          if (namesSet.has(error.name)) return true;
          return patterns.some((pattern) => pattern.test(error.name));
        };
        const allNewErrors = await getErrors();
        const otherErrors = errors.value.filter((error) => !isErrorForPath(error));
        const pathErrors = allNewErrors.filter(isErrorForPath);
        errors.value = otherErrors.concat(pathErrors);
      } else {
        errors.value = await getErrors();
      }
      const childErrors = (await Promise.all(nestedValidatePromises)).filter((val) => val !== void 0);
      if (errors.value.length + childErrors.length > 0) {
        if (opts.silent) return false;
        throw new FormValidationException(formId, errors.value, childErrors);
      }
      if (opts.transform) {
        Object.assign(props.state, transformedState.value);
      }
      return props.state;
    }
    const loading = ref(false);
    provide(formLoadingInjectionKey, readonly(loading));
    async function onSubmitWrapper(payload) {
      var _a2;
      loading.value = props.loadingAuto && true;
      const event = payload;
      try {
        event.data = await _validate({ nested: true, transform: props.transform });
        await ((_a2 = props.onSubmit) == null ? void 0 : _a2.call(props, event));
        dirtyFields.clear();
      } catch (error) {
        if (!(error instanceof FormValidationException)) {
          throw error;
        }
        const errorEvent = {
          ...event,
          errors: error.errors,
          children: error.children
        };
        emits("error", errorEvent);
      } finally {
        loading.value = false;
      }
    }
    const disabled = computed(() => props.disabled || loading.value);
    provide(formOptionsInjectionKey, computed(() => ({
      disabled: disabled.value,
      validateOnInputDelay: props.validateOnInputDelay
    })));
    __expose({
      validate: _validate,
      errors,
      setErrors(errs, name) {
        if (name) {
          errors.value = errors.value.filter((err) => name instanceof RegExp ? !(err.name && name.test(err.name)) : err.name !== name).concat(resolveErrorIds(errs));
        } else {
          errors.value = resolveErrorIds(errs);
        }
      },
      async submit() {
        await onSubmitWrapper(new Event("submit"));
      },
      getErrors(name) {
        if (name) {
          return errors.value.filter((err) => name instanceof RegExp ? err.name && name.test(err.name) : err.name === name);
        }
        return errors.value;
      },
      clear(name) {
        if (name) {
          errors.value = errors.value.filter((err) => name instanceof RegExp ? !(err.name && name.test(err.name)) : err.name !== name);
        } else {
          errors.value = [];
        }
      },
      disabled,
      loading,
      dirty: computed(() => !!dirtyFields.size),
      dirtyFields: readonly(dirtyFields),
      blurredFields: readonly(blurredFields),
      touchedFields: readonly(touchedFields)
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(parentBus) ? "div" : "form"), mergeProps({
        id: unref(formId),
        class: ui.value({ class: props.class }),
        onSubmit: onSubmitWrapper
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {
              errors: errors.value,
              loading: loading.value
            }, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", {
                errors: errors.value,
                loading: loading.value
              })
            ];
          }
        }),
        _: 3
      }), _parent);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/Form.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const theme = {
  "slots": {
    "root": "",
    "wrapper": "",
    "labelWrapper": "flex content-center items-center justify-between",
    "label": "block font-medium text-default",
    "container": "mt-1 relative",
    "description": "text-muted",
    "error": "mt-2 text-error",
    "hint": "text-muted",
    "help": "mt-2 text-muted"
  },
  "variants": {
    "size": {
      "xs": {
        "root": "text-xs"
      },
      "sm": {
        "root": "text-xs"
      },
      "md": {
        "root": "text-sm"
      },
      "lg": {
        "root": "text-sm"
      },
      "xl": {
        "root": "text-base"
      }
    },
    "required": {
      "true": {
        "label": "after:content-['*'] after:ms-0.5 after:text-error"
      }
    }
  },
  "defaultVariants": {
    "size": "md"
  }
};
const _sfc_main$1 = {
  __name: "FormField",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    name: { type: String, required: false },
    errorPattern: { type: null, required: false },
    label: { type: String, required: false },
    description: { type: String, required: false },
    help: { type: String, required: false },
    error: { type: [Boolean, String], required: false },
    hint: { type: String, required: false },
    size: { type: null, required: false },
    required: { type: Boolean, required: false },
    eagerValidation: { type: Boolean, required: false },
    validateOnInputDelay: { type: Number, required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false }
  },
  setup(__props) {
    const props = __props;
    const slots = useSlots();
    const appConfig = useAppConfig();
    const ui = computed(() => {
      var _a;
      return tv({ extend: tv(theme), ...((_a = appConfig.ui) == null ? void 0 : _a.formField) || {} })({
        size: props.size,
        required: props.required
      });
    });
    const formErrors = inject(formErrorsInjectionKey, null);
    const error = computed(() => {
      var _a, _b;
      return props.error || ((_b = (_a = formErrors == null ? void 0 : formErrors.value) == null ? void 0 : _a.find((error2) => error2.name && (error2.name === props.name || props.errorPattern && error2.name.match(props.errorPattern)))) == null ? void 0 : _b.message);
    });
    const id = ref(useId());
    const ariaId = id.value;
    provide(inputIdInjectionKey, id);
    provide(formFieldInjectionKey, computed(() => ({
      error: error.value,
      name: props.name,
      size: props.size,
      eagerValidation: props.eagerValidation,
      validateOnInputDelay: props.validateOnInputDelay,
      errorPattern: props.errorPattern,
      hint: props.hint,
      description: props.description,
      help: props.help,
      ariaId
    })));
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: __props.as,
        class: ui.value.root({ class: [(_a = props.ui) == null ? void 0 : _a.root, props.class] })
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
          if (_push2) {
            _push2(`<div class="${ssrRenderClass(ui.value.wrapper({ class: (_a2 = props.ui) == null ? void 0 : _a2.wrapper }))}"${_scopeId}>`);
            if (__props.label || !!slots.label) {
              _push2(`<div class="${ssrRenderClass(ui.value.labelWrapper({ class: (_b = props.ui) == null ? void 0 : _b.labelWrapper }))}"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Label), {
                for: id.value,
                class: ui.value.label({ class: (_c = props.ui) == null ? void 0 : _c.label })
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "label", { label: __props.label }, () => {
                      _push3(`${ssrInterpolate(__props.label)}`);
                    }, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "label", { label: __props.label }, () => [
                        createTextVNode(toDisplayString(__props.label), 1)
                      ])
                    ];
                  }
                }),
                _: 3
              }, _parent2, _scopeId));
              if (__props.hint || !!slots.hint) {
                _push2(`<span${ssrRenderAttr("id", `${unref(ariaId)}-hint`)} class="${ssrRenderClass(ui.value.hint({ class: (_d = props.ui) == null ? void 0 : _d.hint }))}"${_scopeId}>`);
                ssrRenderSlot(_ctx.$slots, "hint", { hint: __props.hint }, () => {
                  _push2(`${ssrInterpolate(__props.hint)}`);
                }, _push2, _parent2, _scopeId);
                _push2(`</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.description || !!slots.description) {
              _push2(`<p${ssrRenderAttr("id", `${unref(ariaId)}-description`)} class="${ssrRenderClass(ui.value.description({ class: (_e = props.ui) == null ? void 0 : _e.description }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "description", { description: __props.description }, () => {
                _push2(`${ssrInterpolate(__props.description)}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="${ssrRenderClass([(__props.label || !!slots.label || __props.description || !!slots.description) && ui.value.container({ class: (_f = props.ui) == null ? void 0 : _f.container })])}"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "default", { error: error.value }, null, _push2, _parent2, _scopeId);
            if (typeof error.value === "string" && error.value || !!slots.error) {
              _push2(`<div${ssrRenderAttr("id", `${unref(ariaId)}-error`)} class="${ssrRenderClass(ui.value.error({ class: (_g = props.ui) == null ? void 0 : _g.error }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "error", { error: error.value }, () => {
                _push2(`${ssrInterpolate(error.value)}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</div>`);
            } else if (__props.help || !!slots.help) {
              _push2(`<div${ssrRenderAttr("id", `${unref(ariaId)}-help`)} class="${ssrRenderClass(ui.value.help({ class: (_h = props.ui) == null ? void 0 : _h.help }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "help", { help: __props.help }, () => {
                _push2(`${ssrInterpolate(__props.help)}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", {
                class: ui.value.wrapper({ class: (_i = props.ui) == null ? void 0 : _i.wrapper })
              }, [
                __props.label || !!slots.label ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: ui.value.labelWrapper({ class: (_j = props.ui) == null ? void 0 : _j.labelWrapper })
                }, [
                  createVNode(unref(Label), {
                    for: id.value,
                    class: ui.value.label({ class: (_k = props.ui) == null ? void 0 : _k.label })
                  }, {
                    default: withCtx(() => [
                      renderSlot(_ctx.$slots, "label", { label: __props.label }, () => [
                        createTextVNode(toDisplayString(__props.label), 1)
                      ])
                    ]),
                    _: 3
                  }, 8, ["for", "class"]),
                  __props.hint || !!slots.hint ? (openBlock(), createBlock("span", {
                    key: 0,
                    id: `${unref(ariaId)}-hint`,
                    class: ui.value.hint({ class: (_l = props.ui) == null ? void 0 : _l.hint })
                  }, [
                    renderSlot(_ctx.$slots, "hint", { hint: __props.hint }, () => [
                      createTextVNode(toDisplayString(__props.hint), 1)
                    ])
                  ], 10, ["id"])) : createCommentVNode("", true)
                ], 2)) : createCommentVNode("", true),
                __props.description || !!slots.description ? (openBlock(), createBlock("p", {
                  key: 1,
                  id: `${unref(ariaId)}-description`,
                  class: ui.value.description({ class: (_m = props.ui) == null ? void 0 : _m.description })
                }, [
                  renderSlot(_ctx.$slots, "description", { description: __props.description }, () => [
                    createTextVNode(toDisplayString(__props.description), 1)
                  ])
                ], 10, ["id"])) : createCommentVNode("", true)
              ], 2),
              createVNode("div", {
                class: [(__props.label || !!slots.label || __props.description || !!slots.description) && ui.value.container({ class: (_n = props.ui) == null ? void 0 : _n.container })]
              }, [
                renderSlot(_ctx.$slots, "default", { error: error.value }),
                typeof error.value === "string" && error.value || !!slots.error ? (openBlock(), createBlock("div", {
                  key: 0,
                  id: `${unref(ariaId)}-error`,
                  class: ui.value.error({ class: (_o = props.ui) == null ? void 0 : _o.error })
                }, [
                  renderSlot(_ctx.$slots, "error", { error: error.value }, () => [
                    createTextVNode(toDisplayString(error.value), 1)
                  ])
                ], 10, ["id"])) : __props.help || !!slots.help ? (openBlock(), createBlock("div", {
                  key: 1,
                  id: `${unref(ariaId)}-help`,
                  class: ui.value.help({ class: (_p = props.ui) == null ? void 0 : _p.help })
                }, [
                  renderSlot(_ctx.$slots, "help", { help: __props.help }, () => [
                    createTextVNode(toDisplayString(__props.help), 1)
                  ])
                ], 10, ["id"])) : createCommentVNode("", true)
              ], 2)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/FormField.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "settings",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { adminFetch } = useAdminToken();
    const { data, refresh } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "admin-config",
      () => adminFetch("/api/admin/config")
    )), __temp = await __temp, __restore(), __temp);
    const form = ref({
      server: { name: "", host: "", port: 5200 },
      system: { request_log: true, tmp_dir: "./tmp", log_dir: "./logs", public_dir: "./public" },
      proxy: { global_proxy_url: "", credit_refresh_proxy_url: "" },
      database: { path: "data/dreamine2api.db" }
    });
    watch(
      data,
      (v) => {
        if (!v) return;
        form.value.server = { ...v.server };
        form.value.system = { ...v.system };
        form.value.proxy = { ...v.proxy };
        form.value.database = { ...v.database };
      },
      { immediate: true }
    );
    const poolKey = ref("");
    const adminKey = ref("");
    const poolKeySet = computed(() => {
      var _a;
      return (_a = data.value) == null ? void 0 : _a.pool.api_key_set;
    });
    const adminKeySet = computed(() => {
      var _a;
      return (_a = data.value) == null ? void 0 : _a.admin.api_key_set;
    });
    const saving = ref(false);
    const message = ref("");
    const saveError = ref("");
    async function save() {
      saving.value = true;
      message.value = "";
      saveError.value = "";
      try {
        const body = {
          server: form.value.server,
          system: form.value.system,
          proxy: form.value.proxy,
          database: form.value.database
        };
        if (poolKey.value) body.pool = { api_key: poolKey.value };
        if (adminKey.value) body.admin = { api_key: adminKey.value, enabled: true };
        await adminFetch("/api/admin/config", { method: "PUT", body });
        poolKey.value = "";
        adminKey.value = "";
        await refresh();
        message.value = "\u5DF2\u4FDD\u5B58";
      } catch (e) {
        saveError.value = e instanceof Error ? e.message : "\u4FDD\u5B58\u5931\u8D25";
      } finally {
        saving.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UForm = _sfc_main$2;
      const _component_UCard = _sfc_main$3;
      const _component_UFormField = _sfc_main$1;
      const _component_UInput = _sfc_main$4;
      const _component_UButton = _sfc_main$8;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 max-w-2xl" }, _attrs))}><h1 class="text-xl font-semibold">\u7CFB\u7EDF\u914D\u7F6E</h1><p class="text-sm text-gray-500">\u4FDD\u5B58\u540E\u5199\u5165 <code>config.toml</code>\uFF0C\u5E76\u540C\u6B65 SQLite \u4EE3\u7406/\u53F7\u6C60\u5BC6\u94A5\u3002</p>`);
      if (unref(form)) {
        _push(ssrRenderComponent(_component_UForm, {
          state: unref(form),
          class: "space-y-4",
          onSubmit: save
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UCard, null, {
                header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`\u670D\u52A1`);
                  } else {
                    return [
                      createTextVNode("\u670D\u52A1")
                    ];
                  }
                }),
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="grid gap-3 md:grid-cols-2"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_UFormField, { label: "\u540D\u79F0" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UInput, {
                            modelValue: unref(form).server.name,
                            "onUpdate:modelValue": ($event) => unref(form).server.name = $event
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).server.name,
                              "onUpdate:modelValue": ($event) => unref(form).server.name = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_UFormField, { label: "\u7AEF\u53E3" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UInput, {
                            modelValue: unref(form).server.port,
                            "onUpdate:modelValue": ($event) => unref(form).server.port = $event,
                            modelModifiers: { number: true },
                            type: "number"
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).server.port,
                              "onUpdate:modelValue": ($event) => unref(form).server.port = $event,
                              modelModifiers: { number: true },
                              type: "number"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_UFormField, {
                      label: "Host",
                      class: "md:col-span-2"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UInput, {
                            modelValue: unref(form).server.host,
                            "onUpdate:modelValue": ($event) => unref(form).server.host = $event
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).server.host,
                              "onUpdate:modelValue": ($event) => unref(form).server.host = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    return [
                      createVNode("div", { class: "grid gap-3 md:grid-cols-2" }, [
                        createVNode(_component_UFormField, { label: "\u540D\u79F0" }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).server.name,
                              "onUpdate:modelValue": ($event) => unref(form).server.name = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, { label: "\u7AEF\u53E3" }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).server.port,
                              "onUpdate:modelValue": ($event) => unref(form).server.port = $event,
                              modelModifiers: { number: true },
                              type: "number"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, {
                          label: "Host",
                          class: "md:col-span-2"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).server.host,
                              "onUpdate:modelValue": ($event) => unref(form).server.host = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UCard, null, {
                header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`\u4EE3\u7406`);
                  } else {
                    return [
                      createTextVNode("\u4EE3\u7406")
                    ];
                  }
                }),
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UFormField, { label: "\u5168\u5C40\u4EE3\u7406 URL" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UInput, {
                            modelValue: unref(form).proxy.global_proxy_url,
                            "onUpdate:modelValue": ($event) => unref(form).proxy.global_proxy_url = $event,
                            placeholder: "http://127.0.0.1:7890"
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).proxy.global_proxy_url,
                              "onUpdate:modelValue": ($event) => unref(form).proxy.global_proxy_url = $event,
                              placeholder: "http://127.0.0.1:7890"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_UFormField, {
                      label: "\u5237\u65B0\u989D\u5EA6\u4EE3\u7406 URL",
                      class: "mt-3"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UInput, {
                            modelValue: unref(form).proxy.credit_refresh_proxy_url,
                            "onUpdate:modelValue": ($event) => unref(form).proxy.credit_refresh_proxy_url = $event
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).proxy.credit_refresh_proxy_url,
                              "onUpdate:modelValue": ($event) => unref(form).proxy.credit_refresh_proxy_url = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UFormField, { label: "\u5168\u5C40\u4EE3\u7406 URL" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).proxy.global_proxy_url,
                            "onUpdate:modelValue": ($event) => unref(form).proxy.global_proxy_url = $event,
                            placeholder: "http://127.0.0.1:7890"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, {
                        label: "\u5237\u65B0\u989D\u5EA6\u4EE3\u7406 URL",
                        class: "mt-3"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).proxy.credit_refresh_proxy_url,
                            "onUpdate:modelValue": ($event) => unref(form).proxy.credit_refresh_proxy_url = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UCard, null, {
                header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`\u5BC6\u94A5`);
                  } else {
                    return [
                      createTextVNode("\u5BC6\u94A5")
                    ];
                  }
                }),
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UFormField, {
                      label: `\u53F7\u6C60 API Key${unref(poolKeySet) ? "\uFF08\u5DF2\u8BBE\u7F6E\uFF0C\u7559\u7A7A\u4E0D\u4FEE\u6539\uFF09" : ""}`
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UInput, {
                            modelValue: unref(poolKey),
                            "onUpdate:modelValue": ($event) => isRef(poolKey) ? poolKey.value = $event : null,
                            type: "password",
                            placeholder: "pool.api_key"
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              modelValue: unref(poolKey),
                              "onUpdate:modelValue": ($event) => isRef(poolKey) ? poolKey.value = $event : null,
                              type: "password",
                              placeholder: "pool.api_key"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_UFormField, {
                      label: `\u7BA1\u7406 API Key${unref(adminKeySet) ? "\uFF08\u5DF2\u8BBE\u7F6E\uFF0C\u7559\u7A7A\u4E0D\u4FEE\u6539\uFF09" : ""}`,
                      class: "mt-3"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UInput, {
                            modelValue: unref(adminKey),
                            "onUpdate:modelValue": ($event) => isRef(adminKey) ? adminKey.value = $event : null,
                            type: "password",
                            placeholder: "admin.api_key"
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              modelValue: unref(adminKey),
                              "onUpdate:modelValue": ($event) => isRef(adminKey) ? adminKey.value = $event : null,
                              type: "password",
                              placeholder: "admin.api_key"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UFormField, {
                        label: `\u53F7\u6C60 API Key${unref(poolKeySet) ? "\uFF08\u5DF2\u8BBE\u7F6E\uFF0C\u7559\u7A7A\u4E0D\u4FEE\u6539\uFF09" : ""}`
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(poolKey),
                            "onUpdate:modelValue": ($event) => isRef(poolKey) ? poolKey.value = $event : null,
                            type: "password",
                            placeholder: "pool.api_key"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }, 8, ["label"]),
                      createVNode(_component_UFormField, {
                        label: `\u7BA1\u7406 API Key${unref(adminKeySet) ? "\uFF08\u5DF2\u8BBE\u7F6E\uFF0C\u7559\u7A7A\u4E0D\u4FEE\u6539\uFF09" : ""}`,
                        class: "mt-3"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(adminKey),
                            "onUpdate:modelValue": ($event) => isRef(adminKey) ? adminKey.value = $event : null,
                            type: "password",
                            placeholder: "admin.api_key"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }, 8, ["label"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UCard, null, {
                header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`\u6570\u636E\u5E93`);
                  } else {
                    return [
                      createTextVNode("\u6570\u636E\u5E93")
                    ];
                  }
                }),
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UFormField, { label: "SQLite \u8DEF\u5F84" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UInput, {
                            modelValue: unref(form).database.path,
                            "onUpdate:modelValue": ($event) => unref(form).database.path = $event
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).database.path,
                              "onUpdate:modelValue": ($event) => unref(form).database.path = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UFormField, { label: "SQLite \u8DEF\u5F84" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).database.path,
                            "onUpdate:modelValue": ($event) => unref(form).database.path = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UButton, {
                type: "submit",
                loading: unref(saving)
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`\u4FDD\u5B58\u5230 config.toml`);
                  } else {
                    return [
                      createTextVNode("\u4FDD\u5B58\u5230 config.toml")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              if (unref(message)) {
                _push2(`<p class="text-sm text-green-500"${_scopeId}>${ssrInterpolate(unref(message))}</p>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(saveError)) {
                _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(saveError))}</p>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createVNode(_component_UCard, null, {
                  header: withCtx(() => [
                    createTextVNode("\u670D\u52A1")
                  ]),
                  default: withCtx(() => [
                    createVNode("div", { class: "grid gap-3 md:grid-cols-2" }, [
                      createVNode(_component_UFormField, { label: "\u540D\u79F0" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).server.name,
                            "onUpdate:modelValue": ($event) => unref(form).server.name = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, { label: "\u7AEF\u53E3" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).server.port,
                            "onUpdate:modelValue": ($event) => unref(form).server.port = $event,
                            modelModifiers: { number: true },
                            type: "number"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, {
                        label: "Host",
                        class: "md:col-span-2"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).server.host,
                            "onUpdate:modelValue": ($event) => unref(form).server.host = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ])
                  ]),
                  _: 1
                }),
                createVNode(_component_UCard, null, {
                  header: withCtx(() => [
                    createTextVNode("\u4EE3\u7406")
                  ]),
                  default: withCtx(() => [
                    createVNode(_component_UFormField, { label: "\u5168\u5C40\u4EE3\u7406 URL" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(form).proxy.global_proxy_url,
                          "onUpdate:modelValue": ($event) => unref(form).proxy.global_proxy_url = $event,
                          placeholder: "http://127.0.0.1:7890"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      label: "\u5237\u65B0\u989D\u5EA6\u4EE3\u7406 URL",
                      class: "mt-3"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(form).proxy.credit_refresh_proxy_url,
                          "onUpdate:modelValue": ($event) => unref(form).proxy.credit_refresh_proxy_url = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(_component_UCard, null, {
                  header: withCtx(() => [
                    createTextVNode("\u5BC6\u94A5")
                  ]),
                  default: withCtx(() => [
                    createVNode(_component_UFormField, {
                      label: `\u53F7\u6C60 API Key${unref(poolKeySet) ? "\uFF08\u5DF2\u8BBE\u7F6E\uFF0C\u7559\u7A7A\u4E0D\u4FEE\u6539\uFF09" : ""}`
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(poolKey),
                          "onUpdate:modelValue": ($event) => isRef(poolKey) ? poolKey.value = $event : null,
                          type: "password",
                          placeholder: "pool.api_key"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }, 8, ["label"]),
                    createVNode(_component_UFormField, {
                      label: `\u7BA1\u7406 API Key${unref(adminKeySet) ? "\uFF08\u5DF2\u8BBE\u7F6E\uFF0C\u7559\u7A7A\u4E0D\u4FEE\u6539\uFF09" : ""}`,
                      class: "mt-3"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(adminKey),
                          "onUpdate:modelValue": ($event) => isRef(adminKey) ? adminKey.value = $event : null,
                          type: "password",
                          placeholder: "admin.api_key"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }, 8, ["label"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UCard, null, {
                  header: withCtx(() => [
                    createTextVNode("\u6570\u636E\u5E93")
                  ]),
                  default: withCtx(() => [
                    createVNode(_component_UFormField, { label: "SQLite \u8DEF\u5F84" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(form).database.path,
                          "onUpdate:modelValue": ($event) => unref(form).database.path = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(_component_UButton, {
                  type: "submit",
                  loading: unref(saving)
                }, {
                  default: withCtx(() => [
                    createTextVNode("\u4FDD\u5B58\u5230 config.toml")
                  ]),
                  _: 1
                }, 8, ["loading"]),
                unref(message) ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "text-sm text-green-500"
                }, toDisplayString(unref(message)), 1)) : createCommentVNode("", true),
                unref(saveError) ? (openBlock(), createBlock("p", {
                  key: 1,
                  class: "text-sm text-red-500"
                }, toDisplayString(unref(saveError)), 1)) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=settings-B-H12Ntn.mjs.map
