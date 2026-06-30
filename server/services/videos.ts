import { createError } from "h3";
import {
  DEFAULT_MODEL,
  generateVideo,
} from "~~/server/clients/dreamina/videos";
import {
  normalizeVideoBody,
  videoJobAcceptedResponse,
  videoJobStatusResponse,
} from "~~/server/services/media-format";
import type { CreditCostContext } from "~~/server/services/pool/credit-cost";
import {
  completeVideoJob,
  createVideoJob,
  failVideoJob,
  getVideoJob,
  setVideoJobProcessing,
} from "~~/server/services/video-jobs";
import {
  refreshActiveSessionCredit,
  requireActiveSession,
  type ActiveSession,
} from "~~/server/services/pool/session-context";
import util from "~~/server/utils/util";

function videoCostContext(request: ReturnType<typeof normalizeVideoBody>): CreditCostContext {
  return {
    kind: "video",
    model: request.model || DEFAULT_MODEL,
    width: request.width,
    height: request.height,
    resolution: request.resolution,
    durationSec: request.durationSec,
    filePaths: request.filePaths,
  };
}

async function runVideoGeneration(
  session: ActiveSession,
  request: ReturnType<typeof normalizeVideoBody>,
) {
  return generateVideo(
    request.model || DEFAULT_MODEL,
    request.prompt,
    {
      width: request.width,
      height: request.height,
      resolution: request.resolution,
      durationSec: request.durationSec,
      filePaths: request.filePaths,
    },
    session.sessionId,
    { proxyUrl: session.apiProxy },
  );
}

export async function createVideoGeneration(
  body: Record<string, unknown>,
  authorization: string,
) {
  const request = normalizeVideoBody(body);
  const costContext = videoCostContext(request);
  const session = requireActiveSession(authorization, costContext);

  if (request.asyncMode) {
    const requestId = createVideoJob();
    setVideoJobProcessing(requestId);
    runVideoGeneration(session, request)
      .then(async (url) => {
        completeVideoJob(requestId, url);
        await refreshActiveSessionCredit(session);
      })
      .catch((err: unknown) => failVideoJob(requestId, err instanceof Error ? err.message : String(err)));
    return videoJobAcceptedResponse(requestId);
  }

  const videoUrl = await runVideoGeneration(session, request);
  await refreshActiveSessionCredit(session);
  if (request.responseFormat === "b64_json") {
    return {
      created: util.unixTimestamp(),
      data: [{ b64_json: await util.fetchFileBASE64(videoUrl), revised_prompt: request.prompt }],
    };
  }
  return {
    created: util.unixTimestamp(),
    data: [{ url: videoUrl, revised_prompt: request.prompt }],
  };
}

export function getVideoGenerationStatus(requestId: string) {
  if (!requestId) throw createError({ statusCode: 400, message: "request_id required" });
  const job = getVideoJob(requestId);
  if (!job) throw createError({ statusCode: 404, message: "unknown request_id" });
  return videoJobStatusResponse(job.id, job.status, job.videoUrl, job.error);
}
