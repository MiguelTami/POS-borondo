import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      validatedBody?: any;
      validatedQuery?: any;
      validatedParams?: any;
      user?: {
        id: number;
        role: string;
      };
    }
  }
}
