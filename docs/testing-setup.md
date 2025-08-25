# Testing Setup

## Playwright run in container

```

> vite_react_shadcn_ts@0.0.0 test:e2e
> playwright test


Running 1 test using 1 worker

  ✘  1 tests/example.spec.ts:3:1 › example (1.4s)


  1) tests/example.spec.ts:3:1 › example ───────────────────────────────────────────────────────────

    Error: page.goto: net::ERR_TUNNEL_CONNECTION_FAILED at https://example.com/
    Call log:
    [2m  - navigating to "https://example.com/", waiting until "load"[22m


      2 |
      3 | test('example', async ({ page }) => {
    > 4 |   await page.goto('https://example.com');
        |              ^
      5 |   await expect(page).toHaveTitle(/Example/);
      6 | });
      7 |
        at /workspace/Synapse/tests/example.spec.ts:4:14

  1 failed
    tests/example.spec.ts:3:1 › example ────────────────────────────────────────────────────────────
```
