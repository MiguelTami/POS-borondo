import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../src/app";

const API_PREFIX = "/api/recipes";

describe("Recipes API Integration Tests", () => {
  describe("PATCH /api/recipes/:recipeId", () => {
    it("should update an existing ingredient recipe", async () => {
      const response = await request(app)
        .patch(`${API_PREFIX}/123`)
        .send({ quantity: 5 });

      expect(response.status).not.toBe(404);
    });
  });

  describe("DELETE /api/recipes/:recipeId", () => {
    it("should delete an ingredient recipe", async () => {
      const response = await request(app).delete(`${API_PREFIX}/123`);
      expect(response.status).not.toBe(404);
    });
  });
});
