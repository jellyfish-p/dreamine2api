import { HttpsProxyAgent } from "https-proxy-agent";
import { SocksProxyAgent } from "socks-proxy-agent";
import type { AxiosRequestConfig } from "axios";

export function normalizeProxyUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  const t = url.trim();
  return t.length > 0 ? t : undefined;
}

export function buildProxyAgents(proxyUrl?: string | null) {
  const url = normalizeProxyUrl(proxyUrl);
  if (!url) return undefined;
  if (url.startsWith("socks4://") || url.startsWith("socks5://") || url.startsWith("socks://")) {
    const agent = new SocksProxyAgent(url);
    return { httpAgent: agent, httpsAgent: agent };
  }
  const agent = new HttpsProxyAgent(url);
  return { httpAgent: agent, httpsAgent: agent };
}

export function withProxyConfig(
  config: AxiosRequestConfig,
  proxyUrl?: string | null
): AxiosRequestConfig {
  const agents = buildProxyAgents(proxyUrl);
  if (!agents) return config;
  return { ...config, ...agents, proxy: false };
}