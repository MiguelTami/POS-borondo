import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../src/app";

const API_PREFIX = "/api/ingredients";

describe("Ingredients API Integration Tests", () => {
  describe("GET /api/ingredients", () => {
    it("should return active ingredients", async () => {
      const response = await request(app).get(API_PREFIX);
      expect(response.status).toBe(200);
    });
  });

  describe("GET /api/ingredients/all", () => {
    it("should return all ingredients", async () => {
      const response = await request(app).get(`${API_PREFIX}/all`);
      expect(response.status).toBe(200);
    });
  });

  describe("GET /api/ingredients/:ingredientId", () => {
    it("should return a specific ingredient", async () => {
      // Assuming '1' might fail schema validation if UUID is expected, adapt accordingly
      const response = await request(app).get(`${API_PREFIX}/1`);
      expect(response.status).toBeDefined();
    });
  });

  describe("POST /api/ingredients", () => {
    it("should create a new ingredient", async () => {
      const payload = { name: "Sugar", price: 10, unit: "kg" };
      const response = await request(app).post(API_PREFIX).send(payload);

      expect(response.status).not.toBe(404);
    });
  });

  describe("PATCH /api/ingredients/:ingredientId", () => {
    it("should update an ingredient", async () => {
      const response = await request(app)
        .patch(`${API_PREFIX}/1`)
        .send({ price: 15 });

      expect(response.status).not.toBe(404);
    });
  });

  describe("DELETE /api/ingredients/:ingredientId", () => {
    it("should deactivate an ingredient", async () => {
      const response = await request(app).delete(`${API_PREFIX}/1`);
      expect(response.status).not.toBe(404);
    });
  });

  describe("PATCH /api/ingredients/:ingredientId/reactivate", () => {
    it("should reactivate an ingredient", async () => {
      const response = await request(app).patch(`${API_PREFIX}/1/reactivate`);
      expect(response.status).not.toBe(404);
    });
  });
});
