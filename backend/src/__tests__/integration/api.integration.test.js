import supertest from "supertest";
import app from "../../../server.js";

const request = supertest(app);

describe("Nasa API Integration Tests", () => {
  it("should debug server health", async () => {
    const response = await request.get("/api/health");
    console.log("Health Check Response:", response.status, response.body);
    expect(response.status).toBe(200);
  })
  describe("GET /api/nasa/apod", () => {
    it("should fetch data from NASA API", async () => {
      const response = await request
        .get("/api/nasa/apod")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toHaveProperty("title");
      expect(response.body).toHaveProperty("url");
      expect(response.body).toHaveProperty("hdurl");
      expect(response.body).toHaveProperty("explanation");
      expect(response.body).toHaveProperty("media_type", "image");
      expect(response.body).toHaveProperty("date");
    });
  });
  describe("Middleware Integration", () => {
    describe("CORS Integration", () => {
      it("should only accept requests from the frontend origin", async () => {
        const allowedOrigin =
          process.env.FRONTEND_URL || "http://localhost:3000";

        const response = await request
          .get("/api/nasa/apod")
          .set("Origin", allowedOrigin)
          .expect(200);

        expect(response.headers["access-control-allow-origin"]).toBe(
          allowedOrigin
        );
      });
      it("should block requests from unauthorized origins", async () => {
        const response = await request
          .get("/api/nasa/apod")
          .set("Origin", "http://malicious-site.com")
          .expect(403);

        expect(response.body).toHaveProperty("status", "fail");
        expect(response.body).toHaveProperty("message", "Origin http://malicious-site.com not allowed by CORS policy");
        expect(response.body).toHaveProperty("code", "CORS_ORIGIN_NOT_ALLOWED");
      });
    });
    describe("Rate Limiting Integration", () => {
      it("should apply rate limiting", async () => {
        const promises = Array(115)
          .fill()
          .map(() => {
            return request.get("/api/nasa/apod");
          });

        const responses = await Promise.all(promises);

        const successResponses = responses.filter((res) => res.status === 200);
        const rateLimitedResponses = responses.filter(
          (res) => res.status === 429
        );

        expect(successResponses.length).toBeGreaterThan(0);
        expect(rateLimitedResponses.length).toBeGreaterThan(0);
        expect(rateLimitedResponses[0].body).toHaveProperty(
          "message",
          "Too many NASA API requests from this IP. Please try again in an hour."
        );
      });
    });
  });
});
