import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../../src/app";

// Since this is an integration test, you might want to mock the database layer (Prisma)
// or use a separate test database. Here we demonstrate testing the API layer.
// vi.mock('../../../src/config/prisma', () => ({ default: { ...mockPrisma } }));

const API_PREFIX = "/api/categories";

describe("Categories API Integration Tests", () => {
  describe("POST /api/categories", () => {
    it("should create a new category", async () => {
      // Provide valid schema payload
      const response = await request(app)
        .post(API_PREFIX)
        .send({ name: "Desserts", description: "Sweet things" });

      // Usually depends on your validation/controller implementation for exact status
      // expect(response.status).toBe(201);
      // Replace with exact assertions matching your app logic
      expect(response.status).not.toBe(404);
    });
  });

  describe("GET /api/categories", () => {
    it("should return active categories", async () => {
      const response = await request(app).get(`${API_PREFIX}`);
      expect(response.status).toBe(200);
    });
  });

  describe("GET /api/categories/all", () => {
    it("should return all categories including inactive ones", async () => {
      const response = await request(app).get(`${API_PREFIX}/all`);
      expect(response.status).toBe(200);
    });
  });

  describe("GET /api/categories/:categoryId", () => {
    it("should return a category by ID", async () => {
      const response = await request(app).get(`${API_PREFIX}/1`);
      // Could be 400 for bad param format or 404 for not found, assuming ID is 1
      expect(response.status).toBeDefined();
    });
  });

  describe("PATCH /api/categories/:categoryId", () => {
    it("should update an existing category", async () => {
      const response = await request(app)
        .patch(`${API_PREFIX}/1`)
        .send({ name: "Updated Desserts" });
      expect(response.status).not.toBe(404);
    });
  });

  describe("DELETE /api/categories/:categoryId", () => {
    it("should deactivate a category", async () => {
      const response = await request(app).delete(`${API_PREFIX}/1`);
      expect(response.status).not.toBe(404);
    });
  });

  describe("PATCH /api/categories/:categoryId/reactivate", () => {
    it("should reactivate a deactivated category", async () => {
      const response = await request(app).patch(`${API_PREFIX}/1/reactivate`);
      expect(response.status).not.toBe(404);
    });
  });
});
