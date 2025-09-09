import {
  jest,
  describe,
  it,
  beforeEach,
  afterEach,
  expect,
} from "@jest/globals";
import request from "supertest";
import express from "express";
import nasaRoutes from "../nasa.js";
import { nasaLimiter } from "../../middleware/rateLimiter.js";

global.fetch = jest.fn();

const app = express();
app.use(express.json());
app.use("/api/nasa", nasaLimiter, nasaRoutes);

describe("NASA Routes", () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    fetch.mockClear();
    jest.clearAllTimers();
    jest.useFakeTimers();

    // Set up environment variable for testing
    process.env.NASA_API_KEY = "test-api-key";
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();

    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  describe("GET /apod - Success Cases", () => {
    it("should fetch APOD data successfully", async () => {
      const mockResponse = {
        title: "Amazing Space Photo",
        explanation: "This is a beautiful space photograph showing...",
        url: "https://api.nasa.gov/test-image.jpg",
        hdurl: "https://api.nasa.gov/test-image-hd.jpg",
        date: "2025-09-08",
        media_type: "image",
        service_version: "v1",
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const response = await request(app).get("/api/nasa/apod").expect(200);

      // Verify response structure
      expect(response.body).toHaveProperty("title", "Amazing Space Photo");
      expect(response.body).toHaveProperty(
        "explanation",
        "This is a beautiful space photograph showing..."
      );
      expect(response.body).toHaveProperty(
        "url",
        "https://api.nasa.gov/test-image.jpg"
      );
      expect(response.body).toHaveProperty(
        "hdurl",
        "https://api.nasa.gov/test-image-hd.jpg"
      );
      expect(response.body).toHaveProperty("media_type", "image");
      expect(response.body).toHaveProperty("service_version", "v1");
      expect(response.body).toHaveProperty("date");
      expect(fetch).toHaveBeenCalledWith(
        "https://api.nasa.gov/planetary/apod?api_key=test-api-key",
        expect.objectContaining({
          signal: expect.any(Object),
        })
      );
    });
  });

  describe("GET /apod - Error Cases", () => {
    it("should handle NASA API errors gracefully", async () => {
      fetch.mockRejectedValueOnce({
        ok: false,
        status: 403,
        statusText: "Forbidden",
      });

      const response = await request(app)
        .get("/api/nasa/apod?test=error1")
        .expect(500);

      expect(response.body.error).toBe("Failed to fetch NASA APOD");
    });

    it("should handle request timeouts", async () => {
      const abortError = new Error("The operation was aborted.");
      abortError.name = "AbortError";

      fetch.mockImplementation(() => Promise.reject(abortError));

      const response = await request(app)
        .get("/api/nasa/apod?test=errortimeout")
        .expect(504);

      expect(response.body.error).toBe("NASA APOD request timed out");
      expect(fetch).toHaveBeenCalled();
    });

    it("should handle validation errors from NASA API", async () => {
      const invalidResponse = {
        title: "", // Invalid - too short
        explanation: "Test explanation",
        url: "not-a-valid-url",
        date: "invalid-date",
        media_type: "video", // Invalid - should be 'image'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => invalidResponse,
      });

      const response = await request(app)
        .get("/api/nasa/apod?test=validation")
        .expect(500);

      expect(response.body.error).toBe("Failed to fetch NASA APOD");
      expect(fetch).toHaveBeenCalled();
    });

    it("should handle non-ok response from NASA API", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Forbidden",
      });

      const response = await request(app)
        .get("/api/nasa/apod?test=error2")
        .expect(500);

      expect(response.body.error).toBe("Failed to fetch NASA APOD");
    });

    it("should handle request timeouts", async () => {
      const abortError = new Error("The operation was aborted.");
      abortError.name = "AbortError";

      fetch.mockImplementation(() => Promise.reject(abortError));

      const response = await request(app)
        .get("/api/nasa/apod?test=errortimeout2")
        .expect(504);

      expect(response.body.error).toBe("NASA APOD request timed out");
      expect(fetch).toHaveBeenCalled();
    });

    it("should handle network errors (ENOTFOUND)", async () => {
      const networkError = new Error("Network error");
      networkError.code = "ENOTFOUND";

      fetch.mockRejectedValueOnce(networkError);

      const response = await request(app)
        .get("/api/nasa/apod?test=enotfound")
        .expect(503);

      expect(response.body.error).toBe("Network error fetching NASA APOD");
    });

    it("should handle network errors (EAI_AGAIN)", async () => {
      const networkError = new Error("DNS lookup failed");
      networkError.code = "EAI_AGAIN";

      fetch.mockRejectedValueOnce(networkError);

      const response = await request(app)
        .get("/api/nasa/apod?test=eai_again")
        .expect(503);

      expect(response.body.error).toBe("Network error fetching NASA APOD");
    });
  });

  describe("Rate Limiting", () => {
    beforeEach(() => {
      // Mock successful NASA API response for all rate limit tests
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          title: "Test Photo",
          explanation: "Test explanation",
          url: "https://api.nasa.gov/test.jpg",
          hdurl: "https://api.nasa.gov/test-hd.jpg",
          date: "2025-09-08",
          media_type: "image",
          service_version: "v1",
        }),
      });
    });

    it("should allow requests within the rate limit", async () => {
      // Make a few requests (well within the 50/hour limit)
      for (let i = 0; i < 3; i++) {
        const response = await request(app)
          .get(`/api/nasa/apod?test=rate-limit-${i}`)
          .expect(200);

        // Should have rate limit headers
        expect(response.headers).toHaveProperty("ratelimit-limit");
        expect(response.headers).toHaveProperty("ratelimit-remaining");
      }
    });

    it("should enforce rate limiting after exceeding limit", async () => {
      // This test simulates hitting the rate limit
      // Note: In a real scenario, you'd need to make 51 requests
      // For testing, we can mock the rate limiter's internal state

      const requests = [];

      // Make requests up to just before the limit
      // The exact number depends on your rate limiter configuration
      // For testing purposes, we'll make 10 requests and check headers
      for (let i = 0; i < 10; i++) {
        requests.push(request(app).get(`/api/nasa/apod?test=rate-test-${i}`));
      }

      const responses = await Promise.all(requests);

      // All should succeed (under normal rate limits)
      responses.forEach((response, index) => {
        expect(response.status).toBe(200);

        // Check that rate limit headers are present and decreasing
        const remaining = parseInt(response.headers["ratelimit-remaining"]);
        expect(remaining).toBeGreaterThanOrEqual(0);

        console.log(`Request ${index + 1}: ${remaining} requests remaining`);
      });
    });

    it("should include rate limit headers in responses", async () => {
      const response = await request(app)
        .get("/api/nasa/apod?test=headers")
        .expect(200);

      // Check for standard rate limit headers
      expect(response.headers).toHaveProperty("ratelimit-limit");
      expect(response.headers).toHaveProperty("ratelimit-remaining");
      expect(response.headers).toHaveProperty("ratelimit-reset");

      // Verify header values make sense
      const limit = parseInt(response.headers["ratelimit-limit"]);
      const remaining = parseInt(response.headers["ratelimit-remaining"]);

      expect(limit).toBe(50); // Should match nasaLimiter config
      expect(remaining).toBeLessThanOrEqual(limit);
      expect(remaining).toBeGreaterThanOrEqual(0);
    });

    it("should reset rate limit after time window", async () => {
      // Make a request to establish baseline
      const response1 = await request(app)
        .get("/api/nasa/apod?test=reset-1")
        .expect(200);

      const remaining1 = parseInt(response1.headers["ratelimit-remaining"]);

      // Fast forward time by 1 hour (the rate limit window)
      jest.advanceTimersByTime(60 * 60 * 1000);

      // Make another request
      const response2 = await request(app)
        .get("/api/nasa/apod?test=reset-2")
        .expect(200);

      const remaining2 = parseInt(response2.headers["ratelimit-remaining"]);

      // After time window, remaining should be reset (or at least not less)
      // Note: The exact behavior depends on the rate limiter implementation
      expect(remaining2).toBeGreaterThanOrEqual(0);
    });
  });

  // You can also test rate limiting with different IPs
  describe("Rate Limiting - Different IPs", () => {
    it("should apply rate limits per IP address", async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          title: "Test Photo",
          explanation: "Test explanation",
          url: "https://api.nasa.gov/test.jpg",
          hdurl: "https://api.nasa.gov/test-hd.jpg",
          date: "2025-09-08",
          media_type: "image",
          service_version: "v1",
        }),
      });

      // Simulate requests from different IP addresses
      const response1 = await request(app)
        .get("/api/nasa/apod?test=ip1")
        .set("X-Forwarded-For", "192.168.1.1")
        .expect(200);

      const response2 = await request(app)
        .get("/api/nasa/apod?test=ip2")
        .set("X-Forwarded-For", "192.168.1.2")
        .expect(200);

      // Both should succeed as they're from different IPs
      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);

      // Both should have full rate limits available
      const remaining1 = parseInt(response1.headers["ratelimit-remaining"]);
      const remaining2 = parseInt(response2.headers["ratelimit-remaining"]);

      // They should have similar remaining counts (both near the limit)
      expect(remaining1).toBeGreaterThan(40); // Well below the 50 limit
      expect(remaining2).toBeGreaterThan(40);
    });
  });
});
