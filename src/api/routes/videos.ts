import _ from 'lodash';

import Request from '@/lib/request/Request.ts';
import { requireActiveSession } from '@/lib/pool/session-context.ts';
import { generateVideo, DEFAULT_MODEL } from '@/api/controllers/videos.ts';
import util from '@/lib/util.ts';
import { normalizeVideoBody, grokVideoCreateResponse, grokVideoPollResponse } from '@/lib/format-adapters.ts';
import {
  createVideoJob,
  setVideoJobProcessing,
  completeVideoJob,
  failVideoJob,
  getVideoJob,
} from '@/lib/video-jobs.ts';

async function runVideoGeneration(
  sessionId: string,
  norm: ReturnType<typeof normalizeVideoBody>,
  apiProxy?: string
) {
  return generateVideo(
    norm.model || DEFAULT_MODEL,
    norm.prompt,
    {
      width: norm.width,
      height: norm.height,
      resolution: norm.resolution,
      filePaths: norm.filePaths,
    },
    sessionId,
    { proxyUrl: apiProxy }
  );
}

export default {

    prefix: '/v1/videos',

    post: {

        '/generations': async (request: Request) => {
            request.validate('headers.authorization', _.isString);
            const session = requireActiveSession(request.headers.authorization);
            const norm = normalizeVideoBody(request.body as Record<string, unknown>);

            if (norm.asyncMode) {
              const requestId = createVideoJob();
              setVideoJobProcessing(requestId);
              runVideoGeneration(session.sessionId, norm, session.apiProxy)
                .then((url) => completeVideoJob(requestId, url))
                .catch((err) => failVideoJob(requestId, err?.message || String(err)));
              return grokVideoCreateResponse(requestId);
            }

            const videoUrl = await runVideoGeneration(session.sessionId, norm, session.apiProxy);

            if (norm.responseFormat === "b64_json") {
                const videoBase64 = await util.fetchFileBASE64(videoUrl);
                return {
                    created: util.unixTimestamp(),
                    data: [{
                        b64_json: videoBase64,
                        revised_prompt: norm.prompt
                    }]
                };
            }
            return {
                created: util.unixTimestamp(),
                data: [{
                    url: videoUrl,
                    revised_prompt: norm.prompt
                }]
            };
        }

    },

    get: {
        '/:request_id': async (request: Request) => {
            const requestId = request.params?.request_id as string;
            if (!requestId) throw new Error('request_id required');
            const job = getVideoJob(requestId);
            if (!job) throw new Error('unknown request_id');
            return grokVideoPollResponse(
              job.id,
              job.status,
              job.videoUrl,
              job.error
            );
        },
    }

}