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

global.fetch = jest.fn();

const app = express();
app.use(express.json());
app.use("/api/nasa", nasaRoutes);

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
        url: "not-a-valid-url", // Invalid URL
        date: "invalid-date", // Invalid date
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
  });
});
