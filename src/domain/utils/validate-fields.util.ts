import { Request } from "express";
import { Schema, checkSchema, validationResult } from "express-validator";
import { QueryError } from "../errors/query.error";

export class ValidateField {

  static async create(schema: Schema, req: Request) {

    return new Promise(async (resolve, reject) => {
      await checkSchema(schema).run(req);

      const validated = validationResult(req);

      if (!validated.isEmpty()) reject(validated.array().map(QueryError.fromObject));
      resolve(true);

    });

  }

}
