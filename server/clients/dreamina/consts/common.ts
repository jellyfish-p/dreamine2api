/**
 * Dreamina API通用常量
 */

// 默认助手ID (海外站使用 513641)
export const DEFAULT_ASSISTANT_ID = "513641";

// 平台代码
export const PLATFORM_CODE = "7";

// 版本代码
export const VERSION_CODE = "8.4.0";

// APP SDK 版本
export const APP_SDK_VERSION = "48.0.0";

// Web版本
export const WEB_VERSION = "7.5.0";

// DA版本 (draft版本)
export const DA_VERSION = "3.3.20";

// 默认模型
export const DEFAULT_IMAGE_MODEL = "high_aes_general_v40l";
export const DEFAULT_VIDEO_MODEL = "dreamina_seedance_40_pro";

// 草稿版本
export const DRAFT_VERSION = "3.3.20";

// 图像模型映射
export const IMAGE_MODEL_MAP: Record<string, string> = {
  "gpt-image-2": "dreamina_lib_img_20260423",
  "dreamina-5.0-lite": "high_aes_general_v50",
  "dreamina-4.7": "high_aes_general_v43",
  "dreamina-4.6": "high_aes_general_v42",
  "dreamina-4.5": "high_aes_general_v40l",
};

// 视频模型映射
export const VIDEO_MODEL_MAP: Record<string, string> = {
  "seedance-1.0": "dreamina_ic_generate_video_model_vgfm_3.0_pro",
  "seedance-1.0-fast": "dreamina_ic_generate_video_model_vgfm_3.0_fast",
  "seedance-1.5-pro": "dreamina_ic_generate_video_model_vgfm_3.5_pro",
  "seedance-2.0": "dreamina_seedance_40_pro",
  "seedance-2.0-fast": "dreamina_seedance_40",
  "seedance-2.0-mini": "dreamina_seedance_40_mini"
};

// 状态码映射
export const STATUS_CODE_MAP: Record<number, string> = {
  20: 'PROCESSING',
  10: 'SUCCESS',
  30: 'FAILED',
  42: 'POST_PROCESSING',
  45: 'FINALIZING',
  50: 'COMPLETED'
};

// 重试配置
export const RETRY_CONFIG = {
  MAX_RETRY_COUNT: 3,
  RETRY_DELAY: 5000
};

// 轮询配置
export const POLLING_CONFIG = {
  MAX_POLL_COUNT: 900, // 15分钟
  POLL_INTERVAL: 1000, // 1秒
  STABLE_ROUNDS: 5,    // 稳定轮次
  TIMEOUT_SECONDS: 900 // 15分钟超时
};

// 支持的图片比例和分辨率（2K分辨率配置）
export const ASPECT_RATIOS: Record<string, { width: number; height: number; ratio: number }> = {
  "1:1": { width: 2048, height: 2048, ratio: 1 },
  "4:3": { width: 2304, height: 1728, ratio: 4 },
  "3:4": { width: 1728, height: 2304, ratio: 2 },
  "16:9": { width: 2560, height: 1440, ratio: 3 },
  "9:16": { width: 1440, height: 2560, ratio: 5 },
  "3:2": { width: 2496, height: 1664, ratio: 7 },
  "2:3": { width: 1664, height: 2496, ratio: 6 },
  "21:9": { width: 3024, height: 1296, ratio: 8 }
};
