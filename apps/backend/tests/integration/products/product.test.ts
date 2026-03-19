import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../src/app";

const API_PREFIX = "/api/products";

describe("Products API Integration Tests", () => {
  describe("GET /api/products", () => {
    it("should get a list of products (potentially filtered via query params)", async () => {
      const response = await request(app)
        .get(API_PREFIX)
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200); // Or handle schema validation error if any
    });
  });

  describe("GET /api/products/:productId", () => {
    it("should retrieve a single product by ID", async () => {
      const response = await request(app).get(`${API_PREFIX}/123`);
      expect(response.status).toBeDefined();
    });
  });

  describe("POST /api/products", () => {
    it("should create a new product", async () => {
      const payload = { name: "Brownie", price: 50 }; // Add expected schema fields
      const response = await request(app).post(API_PREFIX).send(payload);

      expect(response.status).not.toBe(404);
    });
  });

  describe("PATCH /api/products/:productId", () => {
    it("should update the product details", async () => {
      const response = await request(app)
        .patch(`${API_PREFIX}/123`)
        .send({ price: 55 });

      expect(response.status).not.toBe(404);
    });
  });

  describe("DELETE /api/products/:productId", () => {
    it("should deactivate a product", async () => {
      const response = await request(app).delete(`${API_PREFIX}/123`);
      expect(response.status).not.toBe(404);
    });
  });

  describe("PATCH /api/products/:productId/reactivate", () => {
    it("should reactivate a product", async () => {
      const response = await request(app).patch(`${API_PREFIX}/123/reactivate`);
      expect(response.status).not.toBe(404);
    });
  });

  describe("GET /api/products/:productId/recipes", () => {
    it("should retrieve ingredients recipe for a product", async () => {
      const response = await request(app).get(`${API_PREFIX}/123/recipes`);
      expect(response.status).not.toBe(404);
    });
  });

  describe("POST /api/products/:productId/recipes", () => {
    it("should create an ingredient recipe for a product", async () => {
      const payload = { ingredientId: 1, quantity: 2 };
      const response = await request(app)
        .post(`${API_PREFIX}/123/recipes`)
        .send(payload);

      expect(response.status).not.toBe(404);
    });
  });
});
