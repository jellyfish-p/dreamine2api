# OpenAI Image Interface Design

## Goal

Expose image generation and edits as OpenAI-compatible synchronous image APIs. Dreamina task submission, `submit_id`, `history_id`, `get_history_by_ids`, polling, partial failures, and retry-related details stay fully internal to the server.

Clients should not need to call a history endpoint, inspect Dreamina statuses, or handle mixed success and failure lists.

## Public API Surface

Keep these OpenAI-compatible endpoints:

- `POST /v1/images/generations`
- `POST /v1/images/edits`

Remove customer-visible non-standard image endpoints:

- `POST /v1/images/compositions`
- `POST /v1/images/history`

The generated response shape remains OpenAI-style:

```json
{
  "created": 1782877460,
  "data": [
    { "url": "https://..." }
  ]
}
```

For `response_format: "b64_json"`, each result item contains `b64_json` instead of `url`.

## Internal Dreamina Flow

The Dreamina client still submits work through `/mweb/v1/aigc_draft/generate`. It then polls `/mweb/v1/get_history_by_ids` internally using `history_ids` or `submit_ids` as needed.

Polling completion must consider both successful and failed items:

- Successful outputs from `item_list`.
- Failed outputs from `failed_item_list`.
- Expected batch size from `pre_gen_item_ids.length` when present.
- Fallback expected batch size from the current request configuration.
- `finished_image_count`, `task.finish_time`, and terminal statuses where available.

If Dreamina returns a mixed result such as 3 successful images and 1 `SystemBusy` failed item, the server treats the batch as complete and returns the 3 successful images to the client.

## Partial Failure Behavior

Partial failures are hidden from the public response when at least one image succeeded. The server logs failed item IDs, result codes, and result messages for operations and debugging.

If no image succeeds, the public API returns an OpenAI-style error object. Dreamina-specific failures are mapped into stable client-facing errors:

- Content or review failure maps to a content-filter style error.
- `SystemBusy`, empty completed batches, and upstream task failures map to image generation failure.
- Polling timeout with no successful image maps to image generation timeout.

## Implementation Boundaries

The service layer continues to format results through the existing OpenAI response formatter. Dreamina-specific result parsing belongs in the Dreamina client module, not in route handlers.

Route handlers should stay thin:

- Read JSON body.
- Validate authorization.
- Call the image service.
- Return the service result.

Removing `/v1/images/history` includes deleting its route and removing service exports that only support customer-facing history calls. Internal helper functions may remain if they are still used by synchronous polling.

## Testing

Add focused tests for:

- No public `server/routes/v1/images/history.post.ts` route.
- Mixed Dreamina results are considered complete when successful plus failed item counts satisfy the expected batch size.
- Partial success returns only successful image URLs in OpenAI response format.
- Zero successful images raises a stable generation error.
- `response_format: "b64_json"` still works after internal polling changes.

## Non-Goals

- No new async image API.
- No public `submit_id` or `history_id`.
- No Dreamina-specific fields in the OpenAI-compatible success response.
