import _ from "lodash";

import Request from "@/lib/request/Request.ts";
import { generateImages, generateImageComposition, getHistoryBySubmitIds } from "@/api/controllers/images.ts";
import { requireActiveSession } from "@/lib/pool/session-context.ts";
import { ASPECT_RATIOS } from "@/api/consts/common.ts";
import util from "@/lib/util.ts";
import { normalizeImageBody } from "@/lib/format-adapters.ts";

// 解析ratio参数为width和height（仅支持官网标准比例）
function parseRatio(ratio?: string): { width: number; height: number } {
  if (!ratio) {
    return { width: 2048, height: 2048 }; // 默认1:1
  }

  // 只从ASPECT_RATIOS中查找匹配的标准比例
  const ratioConfig = ASPECT_RATIOS[ratio];
  if (ratioConfig) {
    return {
      width: ratioConfig.width,
      height: ratioConfig.height
    };
  }

  // 如果不是标准比例，抛出错误
  const supportedRatios = Object.keys(ASPECT_RATIOS).join(', ');
  throw new Error(`不支持的比例 "${ratio}"。支持的比例: ${supportedRatios}`);
}



export default {
  prefix: "/v1/images",

  post: {
    "/generations": async (request: Request) => {
      request.validate("headers.authorization", _.isString);
      const session = requireActiveSession(request.headers.authorization);

      const norm = normalizeImageBody(request.body as Record<string, unknown>);
      if (norm.imageUrls.length > 0) {
        throw new Error("图生图请使用 POST /v1/images/edits 或 /v1/images/compositions");
      }

      const ratioConfig = parseRatio(norm.ratio);
      const width = ratioConfig.width;
      const height = ratioConfig.height;
      const responseFormat = _.defaultTo(norm.responseFormat, "url");
      const imageUrls = await generateImages(norm.model, norm.prompt, {
        width,
        height,
        sampleStrength: norm.sampleStrength,
        negativePrompt: norm.negativePrompt,
      }, session.sessionId, { proxyUrl: session.apiProxy });
      let data = [];
      if (responseFormat == "b64_json") {
        data = (
          await Promise.all(imageUrls.map((url) => util.fetchFileBASE64(url)))
        ).map((b64) => ({ b64_json: b64 }));
      } else {
        data = imageUrls.map((url) => ({
          url,
        }));
      }
      return {
        created: util.unixTimestamp(),
        data,
      };
    },

    "/edits": async (request: Request) => {
      request.validate("headers.authorization", _.isString);
      const session = requireActiveSession(request.headers.authorization);
      const norm = normalizeImageBody(request.body as Record<string, unknown>);
      if (norm.imageUrls.length === 0) {
        throw new Error("image edits 需要 image / image_url 或 images 参数");
      }
      if (norm.imageUrls.length > 10) {
        throw new Error("最多支持10张输入图片");
      }
      const ratioConfig = parseRatio(norm.ratio);
      const responseFormat = _.defaultTo(norm.responseFormat, "url");
      const resultUrls = await generateImageComposition(norm.model, norm.prompt, norm.imageUrls, {
        width: ratioConfig.width,
        height: ratioConfig.height,
        sampleStrength: norm.sampleStrength,
        negativePrompt: norm.negativePrompt,
      }, session.sessionId, { proxyUrl: session.apiProxy });
      let data = [];
      if (responseFormat == "b64_json") {
        data = (
          await Promise.all(resultUrls.map((url) => util.fetchFileBASE64(url)))
        ).map((b64) => ({ b64_json: b64 }));
      } else {
        data = resultUrls.map((url) => ({ url }));
      }
      return { created: util.unixTimestamp(), data };
    },
    
    // 新增图片合成路由
    "/compositions": async (request: Request) => {
      // 检查是否包含不支持的参数
      const unsupportedParams = ['size', 'width', 'height'];
      const bodyKeys = Object.keys(request.body);
      const foundUnsupported = unsupportedParams.filter(param => bodyKeys.includes(param));

      if (foundUnsupported.length > 0) {
        throw new Error(`不支持的参数: ${foundUnsupported.join(', ')}。请前往项目文档页面查看支持的参数，当前只支持ratio参数控制图像尺寸。`);
      }

      request
        .validate("body.model", v => _.isUndefined(v) || _.isString(v))
        .validate("body.prompt", _.isString)
        .validate("body.images", _.isArray)
        .validate("body.negative_prompt", v => _.isUndefined(v) || _.isString(v))
        .validate("body.ratio", v => _.isUndefined(v) || _.isString(v))
        .validate("body.sample_strength", v => _.isUndefined(v) || _.isFinite(v))
        .validate("body.response_format", v => _.isUndefined(v) || _.isString(v))
        .validate("headers.authorization", _.isString);

      const session = requireActiveSession(request.headers.authorization);

      // 验证图片数组
      const { images } = request.body;
      if (!images || images.length === 0) {
        throw new Error("至少需要提供1张输入图片");
      }
      if (images.length > 10) {
        throw new Error("最多支持10张输入图片");
      }

      // 验证每个图片元素
      images.forEach((image: any, index: number) => {
        if (!_.isString(image) && !_.isObject(image)) {
          throw new Error(`图片 ${index + 1} 格式不正确：应为URL字符串或包含url字段的对象`);
        }
        if (_.isObject(image) && !(image as { url?: string }).url) {
          throw new Error(`图片 ${index + 1} 缺少url字段`);
        }
      });

      const {
        model,
        prompt,
        negative_prompt: negativePrompt,
        ratio,
        sample_strength: sampleStrength,
        response_format,
      } = request.body;

      // 解析尺寸：使用ratio参数
      const ratioConfig = parseRatio(ratio);
      const width = ratioConfig.width;
      const height = ratioConfig.height;

      // 提取图片URL
      const imageUrls = images.map((img: any) => _.isString(img) ? img : img.url);

      const responseFormat = _.defaultTo(response_format, "url");
      const resultUrls = await generateImageComposition(model, prompt, imageUrls, {
        width,
        height,
        sampleStrength,
        negativePrompt,
      }, session.sessionId, { proxyUrl: session.apiProxy });

      let data = [];
      if (responseFormat == "b64_json") {
        data = (
          await Promise.all(resultUrls.map((url) => util.fetchFileBASE64(url)))
        ).map((b64) => ({ b64_json: b64 }));
      } else {
        data = resultUrls.map((url) => ({
          url,
        }));
      }

      return {
        created: util.unixTimestamp(),
        data,
        input_images: imageUrls.length,
        composition_type: "multi_image_synthesis",
      };
    },

    // 获取图片生成历史（通过submit_ids）
    "/history": async (request: Request) => {
      request
        .validate("body.submit_ids", _.isArray)
        .validate("headers.authorization", _.isString);

      const { submit_ids } = request.body;
      if (!submit_ids || submit_ids.length === 0) {
        throw new Error("至少需要提供1个submit_id");
      }
      if (submit_ids.length > 20) {
        throw new Error("最多支持20个submit_id");
      }

      const session = requireActiveSession(request.headers.authorization);

      const histories = await getHistoryBySubmitIds(submit_ids, session.sessionId);
      
      return {
        created: util.unixTimestamp(),
        data: histories,
      };
    },
  },
};
