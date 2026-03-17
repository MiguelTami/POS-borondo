import { Request, Response, NextFunction } from "express"
import { ZodSchema } from "zod"

type RequestProperty = "body" | "params" | "query"

export const validate =
  (schema: ZodSchema, property: RequestProperty = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[property])

      req[property] = parsed

      next()
    } catch (error: any) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors?.map((e: any) => ({
          path: e.path.join("."),
          message: e.message
        }))
      })
    }
  }