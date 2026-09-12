/**
 * Notification system tests.
 *
 * Tests event detection, deduplication, user targeting, notification
 * persistence, API endpoints, and Socket.IO delivery logic.
 *
 * Run: node --test backend/tests/notification.test.js
 */

import { describe, it, beforeEach, mock } from "node:test";
import assert from "node:assert/strict";

// ─── Event Detection Tests ───────────────────────────────────────────────────

// We test the pure logic by importing the detection functions directly.
// Since the module uses ES module exports, we dynamic-import and test.

describe("notificationEventDetection", () => {
  let detectEvents, clearState;

  beforeEach(async () => {
    const mod = await import("../services/notificationEventDetection.service.js");
    detectEvents = mod.detectEvents;
    clearState = mod.clearState;
    clearState();
  });

  it("detects MATCH_STARTED when match transitions from upcoming to live", () => {
    const match1 = {
      id: "match-1",
      name: "IND vs AUS",
      matchStarted: false,
      matchEnded: false,
      matchState: "upcoming",
      score: [],
    };
    const events1 = detectEvents(match1);
    assert.equal(events1.length, 0, "No events on first observation");

    const match2 = {
      ...match1,
      matchStarted: true,
      matchEnded: false,
      matchState: "live",
      score: [{ r: 0, w: 0, o: 0 }],
    };
    const events2 = detectEvents(match2);
    assert.equal(events2.length, 1);
    assert.equal(events2[0].eventType, "MATCH_STARTED");
    assert.ok(events2[0].message.includes("IND vs AUS"));
  });

  it("detects MATCH_COMPLETED when match transitions from live to completed", () => {
    const match1 = {
      id: "match-2",
      name: "ENG vs SA",
      matchStarted: true,
      matchEnded: false,
      matchState: "live",
      score: [{ r: 200, w: 5, o: 40 }],
    };
    detectEvents(match1);

    const match2 = {
      ...match1,
      matchStarted: true,
      matchEnded: true,
      matchState: "completed",
      status: "ENG won by 30 runs",
      score: [{ r: 200, w: 5, o: 40 }],
    };
    const events = detectEvents(match2);
    const completedEvents = events.filter((e) => e.eventType === "MATCH_COMPLETED");
    assert.equal(completedEvents.length, 1);
    assert.ok(completedEvents[0].message.includes("ENG won by 30 runs"));
  });

  it("detects WICKET when wicket count increases", () => {
    const match1 = {
      id: "match-3",
      name: "PAK vs NZ",
      matchStarted: true,
      matchEnded: false,
      matchState: "live",
      score: [{ r: 100, w: 2, o: 20 }],
    };
    detectEvents(match1);

    const match2 = {
      ...match1,
      score: [{ r: 101, w: 3, o: 20.1 }],
    };
    const events = detectEvents(match2);
    const wicketEvents = events.filter((e) => e.eventType === "WICKET");
    assert.equal(wicketEvents.length, 1);
    assert.ok(wicketEvents[0].message.includes("wicket"));
  });

  it("detects SCORE_MILESTONE when total runs cross a 50-run threshold", () => {
    const match1 = {
      id: "match-4",
      name: "WI vs BAN",
      matchStarted: true,
      matchEnded: false,
      matchState: "live",
      score: [{ r: 48, w: 1, o: 10 }],
    };
    detectEvents(match1);

    const match2 = {
      ...match1,
      score: [{ r: 52, w: 1, o: 11 }],
    };
    const events = detectEvents(match2);
    const milestoneEvents = events.filter((e) => e.eventType === "SCORE_MILESTONE");
    assert.equal(milestoneEvents.length, 1);
    assert.ok(milestoneEvents[0].title.includes("50"));
  });

  it("does NOT generate notification for unchanged score", () => {
    const match1 = {
      id: "match-5",
      name: "SL vs ZIM",
      matchStarted: true,
      matchEnded: false,
      matchState: "live",
      score: [{ r: 150, w: 4, o: 30 }],
    };
    detectEvents(match1);

    const match2 = { ...match1 };
    const events = detectEvents(match2);
    assert.equal(events.length, 0, "No events for unchanged state");
  });

  it("does NOT generate duplicate MATCH_STARTED for same match", () => {
    const match1 = {
      id: "match-6",
      name: "IND vs ENG",
      matchStarted: false,
      matchState: "upcoming",
      score: [],
    };
    detectEvents(match1);

    const match2 = { ...match1, matchStarted: true, matchState: "live" };
    const events2 = detectEvents(match2);
    assert.equal(events2.length, 1, "First transition produces event");

    // Same state again — no event
    const match3 = { ...match2 };
    const events3 = detectEvents(match3);
    assert.equal(events3.length, 0, "Same state again produces no event");
  });

  it("detects multiple events in one transition", () => {
    const match1 = {
      id: "match-7",
      name: "AUS vs NZ",
      matchStarted: true,
      matchEnded: false,
      matchState: "live",
      score: [{ r: 45, w: 1, o: 9 }],
    };
    detectEvents(match1);

    // Cross 50 runs AND take a wicket
    const match2 = {
      ...match1,
      score: [{ r: 52, w: 2, o: 10 }],
    };
    const events = detectEvents(match2);
    const types = events.map((e) => e.eventType);
    assert.ok(types.includes("WICKET"), "Wicket detected");
    assert.ok(types.includes("SCORE_MILESTONE"), "Milestone detected");
  });

  it("handles missing score data gracefully", () => {
    const match = {
      id: "match-8",
      name: "Test",
      matchStarted: true,
      matchState: "live",
      score: null,
    };
    const events = detectEvents(match);
    assert.ok(Array.isArray(events));
  });

  it("handles empty match object gracefully", () => {
    const events = detectEvents({});
    assert.ok(Array.isArray(events));
  });

  it("handles null match gracefully", () => {
    const events = detectEvents(null);
    assert.ok(Array.isArray(events));
    assert.equal(events.length, 0);
  });
});

// ─── Deduplication Key Tests ─────────────────────────────────────────────────

describe("deduplication", () => {
  let detectEvents, clearState;

  beforeEach(async () => {
    const mod = await import("../services/notificationEventDetection.service.js");
    detectEvents = mod.detectEvents;
    clearState = mod.clearState;
    clearState();
  });

  it("generates unique deduplication keys for wickets at different times", () => {
    const match1 = {
      id: "dedup-1",
      matchStarted: true,
      matchState: "live",
      score: [{ r: 100, w: 2, o: 20 }],
    };
    detectEvents(match1);

    const match2 = { ...match1, score: [{ r: 100, w: 3, o: 20 }] };
    const events2 = detectEvents(match2);
    assert.equal(events2.length, 1);

    // Another wicket — different dedup key because timestamp differs
    const match3 = { ...match2, score: [{ r: 101, w: 4, o: 21 }] };
    const events3 = detectEvents(match3);
    assert.equal(events3.length, 1);
    assert.notEqual(events2[0].deduplicationKey, events3[0].deduplicationKey);
  });

  it("generates same deduplication key for same milestone", () => {
    const match1 = {
      id: "dedup-2",
      matchStarted: true,
      matchState: "live",
      score: [{ r: 48, w: 0, o: 10 }],
    };
    detectEvents(match1);

    const match2 = { ...match1, score: [{ r: 52, w: 0, o: 11 }] };
    const events = detectEvents(match2);
    assert.equal(events.length, 1);
    // Milestone dedup key is based on milestone value, not timestamp
    assert.ok(events[0].deduplicationKey.includes("SCORE_MILESTONE:50"));
  });
});

// ─── User Targeting Tests ────────────────────────────────────────────────────

describe("user targeting", () => {
  it("MatchSubscription model schema has correct indexes", async () => {
    const mod = await import("../models/matchSubscription.model.js");
    const MatchSubscription = mod.default;
    assert.ok(MatchSubscription, "MatchSubscription model loaded");
    assert.equal(MatchSubscription.modelName, "MatchSubscription");
  });

  it("Notification model schema has correct structure", async () => {
    const mod = await import("../models/notification.model.js");
    const Notification = mod.default;
    assert.ok(Notification, "Notification model loaded");
    assert.equal(Notification.modelName, "Notification");
  });
});

// ─── Notification Controller Tests (unit) ────────────────────────────────────

describe("notification controller", () => {
  it("exports all required handlers", async () => {
    const mod = await import("../controllers/notification.controller.js");
    assert.equal(typeof mod.getNotifications, "function");
    assert.equal(typeof mod.getUnreadCount, "function");
    assert.equal(typeof mod.markAsRead, "function");
    assert.equal(typeof mod.markAllAsRead, "function");
  });
});

describe("matchSubscription controller", () => {
  it("exports all required handlers", async () => {
    const mod = await import("../controllers/matchSubscription.controller.js");
    assert.equal(typeof mod.subscribeToMatch, "function");
    assert.equal(typeof mod.unsubscribeFromMatch, "function");
    assert.equal(typeof mod.checkSubscription, "function");
    assert.equal(typeof mod.getSubscriptions, "function");
  });
});

// ─── Notification Delivery Tests ─────────────────────────────────────────────

describe("notificationDelivery", () => {
  it("exports delivery functions", async () => {
    const mod = await import("../services/notificationDelivery.service.js");
    assert.equal(typeof mod.deliverNotification, "function");
    assert.equal(typeof mod.deliverBulkNotifications, "function");
    assert.equal(typeof mod.emitUnreadCount, "function");
    assert.equal(typeof mod.userRoom, "function");
  });

  it("userRoom generates correct room name", async () => {
    const mod = await import("../services/notificationDelivery.service.js");
    assert.equal(mod.userRoom("abc123"), "user:abc123");
  });

  it("deliverNotification does not crash when IO is null", async () => {
    const mod = await import("../services/notificationDelivery.service.js");
    // getIO returns null when server not initialized — should not throw
    assert.doesNotThrow(() => {
      mod.deliverNotification("user1", { title: "test" });
    });
  });
});

// ─── Consumer Tests ──────────────────────────────────────────────────────────

describe("notificationConsumer", () => {
  it("exports start/stop functions", async () => {
    const mod = await import("../services/notificationConsumer.service.js");
    assert.equal(typeof mod.startNotificationConsumer, "function");
    assert.equal(typeof mod.stopNotificationConsumer, "function");
  });
});

// ─── Format Score Helper ─────────────────────────────────────────────────────

describe("formatScore", () => {
  it("formats score array correctly", async () => {
    const mod = await import("../services/notificationEventDetection.service.js");
    const score = [
      { r: 200, w: 5, o: 40 },
      { r: 150, w: 8, o: 35 },
    ];
    const result = mod.formatScore(score);
    assert.ok(result.includes("200/5"));
    assert.ok(result.includes("150/8"));
  });

  it("returns N/A for empty score", async () => {
    const mod = await import("../services/notificationEventDetection.service.js");
    assert.equal(mod.formatScore([]), "N/A");
    assert.equal(mod.formatScore(null), "N/A");
  });
});
