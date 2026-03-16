import { Request, Response, NextFunction } from "express";

export const validateParams = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {

    const { value, error } = schema.validate(req.params);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }

    req.params = value;

    next();
  };
};