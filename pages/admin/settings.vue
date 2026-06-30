<template>
  <div class="space-y-6 max-w-2xl">
    <h1 class="text-xl font-semibold">系统配置</h1>
    <p class="text-sm text-gray-500">保存后写入 <code>config.toml</code>，并同步 SQLite 代理/号池密钥。</p>
    <UForm v-if="form" :state="form" class="space-y-4" @submit="save">
      <UCard>
        <template #header>服务</template>
        <div class="grid gap-3 md:grid-cols-2">
          <UFormField label="名称">
            <UInput v-model="form.server.name" />
          </UFormField>
          <UFormField label="端口">
            <UInput v-model.number="form.server.port" type="number" />
          </UFormField>
          <UFormField label="Host" class="md:col-span-2">
            <UInput v-model="form.server.host" />
          </UFormField>
        </div>
      </UCard>
      <UCard>
        <template #header>代理</template>
        <UFormField label="全局代理 URL">
          <UInput v-model="form.proxy.global_proxy_url" placeholder="http://127.0.0.1:7890" />
        </UFormField>
        <UFormField label="刷新额度代理 URL" class="mt-3">
          <UInput v-model="form.proxy.credit_refresh_proxy_url" />
        </UFormField>
      </UCard>
      <UCard>
        <template #header>密钥</template>
        <UFormField :label="`号池 API Key${poolKeySet ? '（已设置，留空不修改）' : ''}`">
          <UInput v-model="poolKey" type="password" placeholder="pool.api_key" />
        </UFormField>
        <UFormField :label="`管理 API Key${adminKeySet ? '（已设置，留空不修改）' : ''}`" class="mt-3">
          <UInput v-model="adminKey" type="password" placeholder="admin.api_key" />
        </UFormField>
      </UCard>
      <UCard>
        <template #header>数据库</template>
        <UFormField label="SQLite 路径">
          <UInput v-model="form.database.path" />
        </UFormField>
      </UCard>
      <UButton type="submit" :loading="saving">保存到 config.toml</UButton>
      <p v-if="message" class="text-sm text-green-500">{{ message }}</p>
      <p v-if="saveError" class="text-sm text-red-500">{{ saveError }}</p>
    </UForm>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "admin-auth" });

type ConfigView = {
  server: { name: string; host: string; port: number };
  system: { request_log: boolean; tmp_dir: string; log_dir: string; public_dir: string };
  proxy: { global_proxy_url: string; credit_refresh_proxy_url: string };
  pool: { api_key_set: boolean };
  admin: { enabled: boolean; api_key_set: boolean };
  database: { path: string };
};

const { adminFetch } = useAdminToken();
const { data, refresh } = await useAsyncData("admin-config", () =>
  adminFetch<ConfigView>("/api/admin/config"),
);

const form = ref({
  server: { name: "", host: "", port: 5200 },
  system: { request_log: true, tmp_dir: "./tmp", log_dir: "./logs", public_dir: "./public" },
  proxy: { global_proxy_url: "", credit_refresh_proxy_url: "" },
  database: { path: "data/dreamine2api.db" },
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
  { immediate: true },
);

const poolKey = ref("");
const adminKey = ref("");
const poolKeySet = computed(() => data.value?.pool.api_key_set);
const adminKeySet = computed(() => data.value?.admin.api_key_set);
const saving = ref(false);
const message = ref("");
const saveError = ref("");

async function save() {
  saving.value = true;
  message.value = "";
  saveError.value = "";
  try {
    const body: Record<string, unknown> = {
      server: form.value.server,
      system: form.value.system,
      proxy: form.value.proxy,
      database: form.value.database,
    };
    if (poolKey.value) body.pool = { api_key: poolKey.value };
    if (adminKey.value) body.admin = { api_key: adminKey.value, enabled: true };
    await adminFetch("/api/admin/config", { method: "PUT", body });
    poolKey.value = "";
    adminKey.value = "";
    await refresh();
    message.value = "已保存";
  } catch (e: unknown) {
    saveError.value = e instanceof Error ? e.message : "保存失败";
  } finally {
    saving.value = false;
  }
}
</script>