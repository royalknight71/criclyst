/**
 * CricAPI service tests — API-key handling and secret scrubbing.
 *
 * Uses a mocked global fetch: no real provider requests are made and no
 * CricAPI quota is consumed. The API key value is a fake test fixture
 * that never appears in assertions output.
 *
 * Run: node --test backend/tests/cricketApi.test.js
 */

import { describe, it, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";

import {
    fetchCurrentMatches,
    fetchMatchScorecard,
} from "../services/cricketApi.service.js";

const TEST_KEY = "test-fixture-key-9f8e7d";
const realFetch = globalThis.fetch;
const realKey = process.env.CRICKET_API_KEY;

function mockFetchOnce(payload, { ok = true, status = 200 } = {}) {
    globalThis.fetch = async (url) => {
        globalThis.__lastRequestedUrl = String(url);
        return {
            ok,
            status,
            json: async () => payload,
        };
    };
}

before(() => {
    // Trailing/leading whitespace mimics a hand-edited .env value.
    process.env.CRICKET_API_KEY = `  ${TEST_KEY}  `;
});

after(() => {
    globalThis.fetch = realFetch;
    if (realKey === undefined) delete process.env.CRICKET_API_KEY;
    else process.env.CRICKET_API_KEY = realKey;
});

beforeEach(() => {
    globalThis.__lastRequestedUrl = "";
});

describe("API key handling", () => {
    it("trims whitespace from the configured key before use", async () => {
        mockFetchOnce({ status: "success", data: [] });
        await fetchCurrentMatches();
        const url = globalThis.__lastRequestedUrl;
        assert.ok(
            url.includes(`apikey=${TEST_KEY}&`),
            "trimmed key must be sent exactly"
        );
        assert.ok(!url.includes("%20"), "no stray whitespace may reach the URL");
    });

    it("throws a configuration error when the key is missing/blank", async () => {
        process.env.CRICKET_API_KEY = "   ";
        await assert.rejects(fetchCurrentMatches(), /not configured/);
        process.env.CRICKET_API_KEY = `  ${TEST_KEY}  `;
    });
});

describe("secret scrubbing", () => {
    it("strips the echoed apikey from successful payloads", async () => {
        mockFetchOnce({
            status: "success",
            apikey: TEST_KEY,
            data: [{ id: "m1" }],
        });
        const data = await fetchCurrentMatches();
        assert.ok(!("apikey" in data));
        assert.equal(data.data.length, 1);
    });

    it("strips the echoed apikey from failure payloads too", async () => {
        mockFetchOnce({
            status: "failure",
            apikey: TEST_KEY,
            reason: "Invalid API Key",
        });
        await assert.rejects(fetchCurrentMatches(), (error) => {
            assert.ok(!error.message.includes(TEST_KEY), "key must not leak");
            assert.match(error.message, /Invalid API Key/);
            return true;
        });
    });

    it("scrubs the key even if a provider reason echoes it", async () => {
        mockFetchOnce({
            status: "failure",
            reason: `Blocked: key ${TEST_KEY} exceeded quota`,
        });
        await assert.rejects(fetchCurrentMatches(), (error) => {
            assert.ok(!error.message.includes(TEST_KEY), "key must not leak");
            assert.ok(error.message.includes("***"), "scrub marker expected");
            return true;
        });
    });

    it("never leaks the key on non-2xx responses", async () => {
        mockFetchOnce({}, { ok: false, status: 401 });
        await assert.rejects(fetchCurrentMatches(), (error) => {
            assert.ok(!error.message.includes(TEST_KEY));
            assert.match(error.message, /status 401/);
            return true;
        });
    });
});

describe("scorecard fetch", () => {
    it("uses the same trimming + scrubbing rules", async () => {
        mockFetchOnce({ status: "failure", reason: `bad key ${TEST_KEY}` });
        await assert.rejects(fetchMatchScorecard("abc-123"), (error) => {
            assert.ok(!error.message.includes(TEST_KEY));
            return true;
        });
        assert.ok(
            globalThis.__lastRequestedUrl.includes(`apikey=${TEST_KEY}&`)
        );
    });
});
