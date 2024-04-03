import {
  createEvent
} from "./chunk-RXCTKQYB.mjs";
import {
  getEventAttendees
} from "./chunk-EQZHEGOD.mjs";
import {
  getEvent
} from "./chunk-5VFN7KXL.mjs";
import "./chunk-FQ6L5EXQ.mjs";
import {
  getAttendeeBadge
} from "./chunk-KVAIWBRO.mjs";
import {
  registerForEvent
} from "./chunk-ZJJKE2Z3.mjs";
import {
  checkIn
} from "./chunk-KCS7LLWD.mjs";
import "./chunk-JV6GRE7Y.mjs";
import "./chunk-A42IFF2V.mjs";

// src/server.ts
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler
} from "fastify-type-provider-zod";
var app = fastify();
app.register(fastifyCors, {
  origin: "*"
});
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "Pass.in API",
      description: "Especifica\xE7\xF5es da API para o back-end da aplica\xE7\xE3o pass.in construida durante o evento NLW Unite da Rocketseat.",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUi, {
  routePrefix: "/docs"
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(getEvent);
app.register(getEventAttendees);
app.register(createEvent);
app.register(getAttendeeBadge);
app.register(registerForEvent);
app.register(checkIn);
app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("Server is running");
});
