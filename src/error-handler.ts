import { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'

import { BadRequest } from './_erros/bad-request'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, _req, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Error during validation',
      errors: error.flatten().fieldErrors,
    })
  }

  if (error instanceof BadRequest) {
    return reply.status(400).send({
      message: error.message,
    })
  }

  return reply.status(500).send({ messagem: 'Internal server error!' })
}
