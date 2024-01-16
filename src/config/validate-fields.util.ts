import { Request } from "express";
import { Schema, checkSchema, validationResult } from "express-validator";
import { QueryError } from "../domain/errors/query.error";

export class ValidateField {

  static async create(schema: Schema, req: Request) {

    await checkSchema(schema, ['body', 'params', 'query']).run(req);
    const validated = validationResult(req);

    if (!validated.isEmpty()) return validated.array().map(QueryError.fromObject);
    
    return false;
  }

}
