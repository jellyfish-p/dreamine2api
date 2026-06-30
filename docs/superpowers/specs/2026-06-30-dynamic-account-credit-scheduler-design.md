# Dynamic Account Credit Scheduler Design

## Goal

Route pool API requests to an enabled account that likely has enough credit for the requested Dreamina model. The scheduler should use per-account dynamic price data when available, fall back to a startup static cache, then fall back to the captured `benefit_metadata` response committed with the project. If price resolution still fails, preserve the current random account selection behavior.

## Current Context

The pool currently selects a random enabled account when the request uses `pool.api_key`. Account rows already cache credit totals and successful generation calls refresh the selected account credit afterward. The new `commerce/v3/resource/benefit_metadata` response contains model and feature prices, but different sessions may receive different prices for the same model.

The captured response shape is an outer success envelope whose `response` field is a JSON string. The inner payload has `metadata_list`, and each item contains `resource_type`, `resource_id`, and `benefits_pay_strategy`. Credit prices live at `benefits_pay_strategy[].credit_strategy.credit_pricing_info.credit_unit_price`.

## Architecture

Add a benefit metadata module under the Dreamina client/service boundary. It will:

- Build and call the `commerce-api-sg.capcut.com/commerce/v3/resource/benefit_metadata` request for a session.
- Parse both direct object payloads and the captured string-in-`response` envelope.
- Normalize strategies into a compact index keyed by `benefit_type`.
- Load `data/dreamina-benefit-metadata-fallback.json` at startup as the built-in fallback.

Add account price cache fields to `pool_accounts`:

- `last_benefit_metadata`
- `last_benefit_metadata_at`

Account refresh paths can update these fields, but a failure must not make the account unusable.

Add a scheduler service around pool account selection. It receives a request cost context rather than raw HTTP bodies. Image and video services will normalize request bodies first, then ask for an active session with the normalized context.

## Cache Priority

Price lookup priority:

1. Per-account `last_benefit_metadata`.
2. Startup static cache loaded from the fallback data file.
3. Hard fallback behavior: use the same fallback index if dynamic refresh fails.
4. Existing random enabled-account selection if no price can be estimated.

This keeps startup immediately usable and avoids blocking generation when Commerce price metadata is unavailable.

## Cost Resolution

Image requests resolve a benefit type from operation, model req key, and resolution. Initial mappings will cover the existing catalog models, including examples from the captured metadata such as:

- `gpt-image-2` / `dreamina_lib_img_20260423` -> `image_basic_gpt_image_v2`
- `high_aes_general_v50` -> `image_basic_v5_2k` or `image_basic_v5_4k`
- `high_aes_general_v43` -> `image_basic_v43_2k` or `image_basic_v43_4k`
- `high_aes_general_v42` -> `image_basic_v46_2k` or `image_basic_v46_4k`

Video requests resolve a benefit type from model req key, normalized resolution, duration, and whether an input video/frame mode changes pricing. For second-based strategies, estimated cost is `credit_unit_price * duration_seconds`, using the adapted Dreamina duration when available.

When role-specific prices exist, the scheduler should prefer the cheapest strategy whose role is `all` or appears compatible with the cached account type. If the role cannot be trusted, use any matching price as an estimate rather than rejecting the request.

## Scheduling

For `pool.api_key` requests:

1. Normalize the request body.
2. Build a cost context.
3. Estimate required credits from the selected cache.
4. Filter enabled accounts whose `last_total_credit` is at least the estimate.
5. Randomly choose among eligible accounts.
6. If estimation fails or no cached credit exists, use the current random enabled-account selection.
7. After successful generation, keep the existing credit refresh behavior.

Direct bearer session requests do not use the scheduler and keep current behavior.

## Error Handling

Dynamic metadata refresh errors are logged and treated as non-fatal. Malformed metadata is ignored for that cache layer. If all cache layers fail, the system still picks a random enabled account so availability stays the default.

If an account has known credit and the estimate succeeds but no account has enough credit, the scheduler falls back to current random selection for compatibility with the requested high-availability behavior.

## Testing

Use Node test runner tests with the existing source-inspection style and targeted runtime imports.

Coverage:

- Parse captured `benefit_metadata` envelopes and extract credit prices.
- Load fallback metadata from `data/dreamina-benefit-metadata-fallback.json`.
- Persist account metadata cache fields and expose refresh helpers.
- Estimate image and video costs from normalized request context.
- Select only eligible accounts when price and credit data are available.
- Fall back to random enabled-account selection when metadata, mappings, or eligible accounts are missing.
- Ensure image and video services pass cost context into pool session resolution.

## Out of Scope

This change will not add a UI for price metadata, reject requests for insufficient credit, or attempt to perfectly model every Dreamina benefit type. The first implementation covers the active public model catalog and keeps fallback behavior for unknown cases.
