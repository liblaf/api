import { z } from "zod";
import zu, { type AllowedZodTypes } from "zod_utilz";

export function coerce<Schema extends AllowedZodTypes>(schema: Schema) {
  return z.preprocess(zu.coerce(schema).parse, schema);
}
