import { Request, Response, NextFunction } from "express"
import { ZodSchema, ZodError } from "zod"

type RequestProperty = "body" | "params" | "query"

export const validate =
  (schema: ZodSchema, property: RequestProperty = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const rawData = { ...req[property] }
      const parsed = schema.parse(rawData)

      if (property === "body") req.validatedBody = parsed
      if (property === "query") req.validatedQuery = parsed
      if (property === "params") req.validatedParams = parsed

      // console.log('RAW query:', req.query)
      // console.log('VALIDATED query:', req.validatedQuery)

      next()
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.issues.map((e) => ({
            path: e.path.join("."),
            message: e.message
          }))
        })
      }

      return res.status(500).json({
        message: "Unexpected error in validation middleware"
      })
    }
  }