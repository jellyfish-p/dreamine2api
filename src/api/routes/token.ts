import _ from 'lodash';

import Request from '@/lib/request/Request.ts';
import Response from '@/lib/response/Response.ts';
import { getTokenLiveStatus, getCredit } from '@/api/controllers/core.ts';
import { resolveSessions } from '@/lib/pool/auth.ts';
import { resolveCreditProxy } from '@/lib/pool/settings.ts';
import logger from '@/lib/logger.ts';

export default {

    prefix: '/token',

    post: {

        '/check': async (request: Request) => {
            request
                .validate('body.token', _.isString)
            const live = await getTokenLiveStatus(request.body.token);
            return {
                live
            }
        },

        '/points': async (request: Request) => {
            request
                .validate('headers.authorization', _.isString)
            const sessions = resolveSessions(request.headers.authorization);
            const points = await Promise.all(sessions.map(async (s) => {
                return {
                    token: s.sessionId.length > 8 ? `${s.sessionId.slice(0, 4)}...${s.sessionId.slice(-4)}` : "***",
                    from_pool: s.fromPool,
                    points: await getCredit(s.sessionId, { proxyUrl: resolveCreditProxy(s.creditProxy) })
                }
            }))
            return points;
        }

    }

}
