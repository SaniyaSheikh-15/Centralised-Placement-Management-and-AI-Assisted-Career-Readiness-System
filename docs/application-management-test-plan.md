# Application Management basic API test plan

| Scenario | Request expectation |
| --- | --- |
| Apply to an open, not-yet-applied drive | `201`, application is `APPLIED`, timeline starts at Applied |
| Apply twice to the same drive | `409` |
| Apply after deadline or to a closed drive | `422` |
| Retrieve a known application, status, and timeline | `200` |
| Use an invalid status body | `400` |
| Update without `x-actor-role` | `403` |
| Eligibility Engine sends `ELIGIBLE` from `APPLIED` | `200`, status becomes `ELIGIBILITY_VERIFIED`, history source is `ELIGIBILITY_ENGINE` |
| Skip `ELIGIBILITY_VERIFIED` and update `APPLIED → ASSESSMENT` | `422` |
| Update a selected/rejected/withdrawn application | `409` |

Static verification uses the checked-in TypeScript/Next binaries when the global npm shim is unavailable: `./node_modules/.bin/tsc.cmd --noEmit` and `./node_modules/.bin/next.cmd build`.
