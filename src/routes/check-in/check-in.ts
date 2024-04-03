import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { BadRequest } from '../../_erros/bad-request'
import { prisma } from '../../lib/prisma'

export const checkIn = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/attendees/:attendeeId/check-in',
    {
      schema: {
        summary: 'Check in an attendee',
        tags: ['check-in'],
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (req, reply) => {
      const { attendeeId } = req.params

      const attendeeCheckIn = await prisma.checkIn.findUnique({
        where: {
          attendeeId,
        },
      })

      if (attendeeCheckIn !== null) {
        throw new BadRequest('Attendee already checked in')
      }

      const checkIn = await prisma.checkIn.create({
        data: {
          attendeeId,
        },
      })

      if (checkIn === null) {
        throw new Error('Error on creating check in, try again later')
      }

      reply.status(201)
    },
  )
}
