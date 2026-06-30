import _ from "lodash";
import { PassThrough } from "stream";

import APIException from "@/lib/exceptions/APIException.ts";
import EX from "@/api/consts/exceptions.ts";
import logger from "@/lib/logger.ts";
import util from "@/lib/util.ts";
import { generateImages, DEFAULT_MODEL } from "./images.ts";
import { generateVideo, DEFAULT_MODEL as DEFAULT_VIDEO_MODEL } from "./videos.ts";
import { DreaminaErrorHandler, withRetry } from "@/lib/error-handler.ts";
import { RETRY_CONFIG } from "@/api/consts/common.ts";

/**
 * 解析模型
 *
 * @param model 模型名称
 * @returns 模型信息
 */
function parseModel(model: string) {
  const [_model, size] = model.split(":");
  const [_, width, height] = /(\d+)[\W\w](\d+)/.exec(size || "") ?? [];
  return {
    model: _model,
    width: size ? Math.ceil(parseInt(width) / 2) * 2 : 1024,
    height: size ? Math.ceil(parseInt(height) / 2) * 2 : 1024,
  };
}

/**
 * 检测是否为视频生成请求
 *
 * @param model 模型名称
 * @returns 是否为视频生成请求
 */
function isVideoModel(model: string) {
  return model.startsWith("dreamina-video");
}

/**
 * 同步对话补全
 *
 * @param messages 参考gpt系列消息格式，多轮对话请完整提供上下文
 * @param refreshToken 用于刷新access_token的refresh_token
 * @param assistantId 智能体ID，默认使用dreamina原版
 * @param retryCount 重试次数
 */
export async function createCompletion(
  messages: any[],
  refreshToken: string,
  _model = DEFAULT_MODEL,
  retryCount = 0
) {
  return (async () => {
    if (messages.length === 0)
      throw new APIException(EX.API_REQUEST_PARAMS_INVALID, "消息不能为空");

    const { model, width, height } = parseModel(_model);
    logger.info(messages);

    // 检查是否为视频生成请求
    if (isVideoModel(_model)) {
      try {
        // 视频生成
        logger.info(`开始生成视频，模型: ${_model}`);
        const videoUrl = await generateVideo(
          _model,
          messages[messages.length - 1].content,
          {
            width,
            height,
            resolution: "720p",
          },
          refreshToken
        );

        logger.info(`视频生成成功，URL: ${videoUrl}`);
        return {
          id: util.uuid(),
          model: _model,
          object: "chat.completion",
          choices: [
            {
              index: 0,
              message: {
                role: "assistant",
                content: `![video](${videoUrl})\n`,
              },
              finish_reason: "stop",
            },
          ],
          usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
          created: util.unixTimestamp(),
        };
      } catch (error: any) {
        logger.error(`视频生成失败: ${error.message}`);
        if (error instanceof APIException) {
          throw error;
        }

        return {
          id: util.uuid(),
          model: _model,
          object: "chat.completion",
          choices: [
            {
              index: 0,
              message: {
                role: "assistant",
                content: `生成视频失败: ${error.message}\n\n如果您在Dreamina官网看到已生成的视频，可能是获取结果时出现了问题，请前往Dreamina官网查看。`,
              },
              finish_reason: "stop",
            },
          ],
          usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
          created: util.unixTimestamp(),
        };
      }
    } else {
      // 图像生成
      const imageUrls = await generateImages(
        model,
        messages[messages.length - 1].content,
        {
          width,
          height,
        },
        refreshToken
      );

      return {
        id: util.uuid(),
        model: _model || model,
        object: "chat.completion",
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: imageUrls.reduce(
                (acc, url, i) => acc + `![image_${i}](${url})\n`,
                ""
              ),
            },
            finish_reason: "stop",
          },
        ],
        usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
        created: util.unixTimestamp(),
      };
    }
  })().catch((err) => {
    if (retryCount < RETRY_CONFIG.MAX_RETRY_COUNT) {
      logger.error(`Response error: ${err.stack}`);
      logger.warn(`Try again after ${RETRY_CONFIG.RETRY_DELAY / 1000}s...`);
      return (async () => {
        await new Promise((resolve) => setTimeout(resolve, RETRY_CONFIG.RETRY_DELAY));
        return createCompletion(messages, refreshToken, _model, retryCount + 1);
      })();
    }
    throw err;
  });
}

/**
 * 流式对话补全
 *
 * @param messages 参考gpt系列消息格式，多轮对话请完整提供上下文
 * @param refreshToken 用于刷新access_token的refresh_token
 * @param assistantId 智能体ID，默认使用dreamina原版
 * @param retryCount 重试次数
 */
export async function createCompletionStream(
  messages: any[],
  refreshToken: string,
  _model = DEFAULT_MODEL,
  retryCount = 0
) {
  return (async () => {
    const { model, width, height } = parseModel(_model);
    logger.info(messages);

    const stream = new PassThrough();

    if (messages.length === 0) {
      logger.warn("消息为空，返回空流");
      stream.end("data: [DONE]\n\n");
      return stream;
    }

    // 检查是否为视频生成请求
    if (isVideoModel(_model)) {
      // 视频生成
      stream.write(
        "data: " +
          JSON.stringify({
            id: util.uuid(),
            model: _model,
            object: "chat.completion.chunk",
            choices: [
              {
                index: 0,
                delta: { role: "assistant", content: "🎬 Video generation in progress...\nThis may take 1-2 minutes, please wait" },
                finish_reason: null,
              },
            ],
          }) +
          "\n\n"
      );

      logger.info(`开始生成视频，提示词: ${messages[messages.length - 1].content}`);

      const progressInterval = setInterval(() => {
        if (stream.destroyed) {
          clearInterval(progressInterval);
          return;
        }
        stream.write(
          "data: " +
            JSON.stringify({
              id: util.uuid(),
              model: _model,
              object: "chat.completion.chunk",
              choices: [
                {
                  index: 0,
                  delta: { role: "assistant", content: "." },
                  finish_reason: null,
                },
              ],
            }) +
            "\n\n"
        );
      }, 5000);

      const timeoutId = setTimeout(() => {
        clearInterval(progressInterval);
        logger.warn(`视频生成超时（2分钟），提示用户前往Dreamina官网查看`);
        if (!stream.destroyed) {
          stream.write(
            "data: " +
              JSON.stringify({
                id: util.uuid(),
                model: _model,
                object: "chat.completion.chunk",
                choices: [
                  {
                    index: 1,
                    delta: {
                      role: "assistant",
                      content: "\n\nVideo generation is taking longer than expected (2 minutes elapsed).\n\nPlease check Dreamina website for your video:\n1. Visit https://dreamina.capcut.com/ai-tool/video/generate\n2. Log in and check your creation history\n3. If the video is generated, you can download or share it directly",
                    },
                    finish_reason: "stop",
                  },
                ],
              }) +
              "\n\n"
          );
        }
      }, 2 * 60 * 1000);

      stream.on('close', () => {
        clearInterval(progressInterval);
        clearTimeout(timeoutId);
        logger.debug('视频生成流已关闭，定时器已清理');
      });

      logger.info(`开始生成视频，模型: ${_model}, 提示词: ${messages[messages.length - 1].content.substring(0, 50)}...`);

      stream.write(
        "data: " +
          JSON.stringify({
            id: util.uuid(),
            model: _model,
            object: "chat.completion.chunk",
            choices: [
              {
                index: 0,
                delta: {
                  role: "assistant",
                  content: "\n\n🎬 Video generation started, this may take a few minutes...",
                },
                finish_reason: null,
              },
            ],
          }) +
          "\n\n"
      );

      generateVideo(
        _model,
        messages[messages.length - 1].content,
        { width, height, resolution: "720p" },
        refreshToken
      )
        .then((videoUrl) => {
          clearInterval(progressInterval);
          clearTimeout(timeoutId);

          logger.info(`视频生成成功，URL: ${videoUrl}`);

          if (!stream.destroyed && stream.writable) {
            stream.write(
              "data: " +
                JSON.stringify({
                  id: util.uuid(),
                  model: _model,
                  object: "chat.completion.chunk",
                  choices: [
                    {
                      index: 1,
                      delta: {
                        role: "assistant",
                        content: `\n\n✅ Video generation complete!\n\n![video](${videoUrl})\n\nYou can:\n1. View the video above\n2. Download or share using: ${videoUrl}`,
                      },
                      finish_reason: null,
                    },
                  ],
                }) +
                "\n\n"
            );

            stream.write(
              "data: " +
                JSON.stringify({
                  id: util.uuid(),
                  model: _model,
                  object: "chat.completion.chunk",
                  choices: [
                    {
                      index: 2,
                      delta: {
                        role: "assistant",
                        content: "",
                      },
                      finish_reason: "stop",
                    },
                  ],
                }) +
                "\n\n"
            );
            stream.end("data: [DONE]\n\n");
          } else {
            logger.debug('视频生成完成，但流已关闭，跳过写入');
          }
        })
        .catch((err) => {
          clearInterval(progressInterval);
          clearTimeout(timeoutId);

          logger.error(`视频生成失败: ${err.message}`);
          logger.error(`错误详情: ${JSON.stringify(err)}`);

          let errorMessage = `⚠️ Video generation encountered an issue: ${err.message}`;

          if (err.message.includes("历史记录不存在")) {
            errorMessage += "\n\nPossible causes:\n1. Request was sent but API couldn't retrieve history\n2. Video generation service temporarily unavailable\n\nPlease check Dreamina website: https://dreamina.capcut.com/ai-tool/video/generate";
          } else if (err.message.includes("获取视频生成结果超时")) {
            errorMessage += "\n\nVideo generation may still be in progress but timeout exceeded.\n\nPlease check Dreamina website: https://dreamina.capcut.com/ai-tool/video/generate";
          } else {
            errorMessage += "\n\nPlease check Dreamina website for your creation history: https://dreamina.capcut.com/ai-tool/video/generate";
          }

          if (err.historyId) {
            errorMessage += `\n\nHistory ID: ${err.historyId}`;
          }

          if (!stream.destroyed && stream.writable) {
            stream.write(
              "data: " +
                JSON.stringify({
                  id: util.uuid(),
                  model: _model,
                  object: "chat.completion.chunk",
                  choices: [
                    {
                      index: 1,
                      delta: {
                        role: "assistant",
                        content: `\n\n${errorMessage}`,
                      },
                      finish_reason: "stop",
                    },
                  ],
                }) +
                "\n\n"
            );
            stream.end("data: [DONE]\n\n");
          } else {
            logger.debug('视频生成失败，但流已关闭，跳过错误信息写入');
          }
        });
    } else {
      // 图像生成
      stream.write(
        "data: " +
          JSON.stringify({
            id: util.uuid(),
            model: _model || model,
            object: "chat.completion.chunk",
            choices: [
              {
                index: 0,
                delta: { role: "assistant", content: "🎨 Image generation in progress..." },
                finish_reason: null,
              },
            ],
          }) +
          "\n\n"
      );

      generateImages(
        model,
        messages[messages.length - 1].content,
        { width, height },
        refreshToken
      )
        .then((imageUrls) => {
          if (!stream.destroyed && stream.writable) {
            for (let i = 0; i < imageUrls.length; i++) {
              const url = imageUrls[i];
              stream.write(
                "data: " +
                  JSON.stringify({
                    id: util.uuid(),
                    model: _model || model,
                    object: "chat.completion.chunk",
                    choices: [
                      {
                        index: i + 1,
                        delta: {
                          role: "assistant",
                          content: `![image_${i}](${url})\n`,
                        },
                        finish_reason: i < imageUrls.length - 1 ? null : "stop",
                      },
                    ],
                  }) +
                  "\n\n"
              );
            }
            stream.write(
              "data: " +
                JSON.stringify({
                  id: util.uuid(),
                  model: _model || model,
                  object: "chat.completion.chunk",
                  choices: [
                    {
                      index: imageUrls.length + 1,
                      delta: {
                        role: "assistant",
                        content: "Image generation complete!",
                      },
                      finish_reason: "stop",
                    },
                  ],
                }) +
                "\n\n"
            );
            stream.end("data: [DONE]\n\n");
          } else {
            logger.debug('图像生成完成，但流已关闭，跳过写入');
          }
        })
        .catch((err) => {
          if (!stream.destroyed && stream.writable) {
            stream.write(
              "data: " +
                JSON.stringify({
                  id: util.uuid(),
                  model: _model || model,
                  object: "chat.completion.chunk",
                  choices: [
                    {
                      index: 1,
                      delta: {
                        role: "assistant",
                        content: `Image generation failed: ${err.message}`,
                      },
                      finish_reason: "stop",
                    },
                  ],
                }) +
                "\n\n"
            );
            stream.end("data: [DONE]\n\n");
          } else {
            logger.debug('图像生成失败，但流已关闭，跳过错误信息写入');
          }
        });
    }
    return stream;
  })().catch((err) => {
    if (retryCount < RETRY_CONFIG.MAX_RETRY_COUNT) {
      logger.error(`Response error: ${err.stack}`);
      logger.warn(`Try again after ${RETRY_CONFIG.RETRY_DELAY / 1000}s...`);
      return (async () => {
        await new Promise((resolve) => setTimeout(resolve, RETRY_CONFIG.RETRY_DELAY));
        return createCompletionStream(
          messages,
          refreshToken,
          _model,
          retryCount + 1
        );
      })();
    }
    throw err;
  });
}
