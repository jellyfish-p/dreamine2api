import _ from 'lodash';

import Request from '@/lib/request/Request.ts';
import Response from '@/lib/response/Response.ts';
import { requireActiveSession } from '@/lib/pool/session-context.ts';
import { createCompletion, createCompletionStream } from '@/api/controllers/chat.ts';

export default {

    prefix: '/v1/chat',

    post: {

        '/completions': async (request: Request) => {
            request
                .validate('body.model', v => _.isUndefined(v) || _.isString(v))
                .validate('body.messages', _.isArray)
                .validate('headers.authorization', _.isString)
            const session = requireActiveSession(request.headers.authorization);
            const { model, messages, stream } = request.body;
            if (stream) {
                const stream = await createCompletionStream(messages, session.sessionId, model);
                return new Response(stream, {
                    type: "text/event-stream"
                });
            }
            else
                return await createCompletion(messages, session.sessionId, model);
        }

    }

}
