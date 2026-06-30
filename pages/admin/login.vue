<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-950 p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-lg font-semibold">管理登录</h1>
        <p class="text-sm text-gray-500 mt-1">使用 config.toml 中 admin.api_key</p>
      </template>
      <form class="space-y-4" @submit.prevent="submit">
        <UInput v-model="apiKey" type="password" placeholder="Bearer API Key" class="w-full" />
        <UButton type="submit" block :loading="loading">登录</UButton>
        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
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
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : "登录失败";
    useAdminToken().clearToken();
  } finally {
    loading.value = false;
  }
}
</script>
