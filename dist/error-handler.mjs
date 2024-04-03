import {
  BadRequest
} from "./chunk-A42IFF2V.mjs";

// src/error-handler.ts
import { ZodError } from "zod";
var errorHandler = (error, _req, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Error during validation",
      errors: error.flatten().fieldErrors
    });
  }
  if (error instanceof BadRequest) {
    return reply.status(400).send({
      message: error.message
    });
  }
  return reply.status(500).send({ messagem: "Internal server error!" });
};
export {
  errorHandler
};
