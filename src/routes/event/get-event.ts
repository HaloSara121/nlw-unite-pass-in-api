import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { BadRequest } from '../../_erros/bad-request'
import { prisma } from '../../lib/prisma'

export const getEvent = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/events/:eventId',

    {
      schema: {
        summary: 'Get event',
        tags: ['events'],
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            event: z.object({
              id: z.string().uuid(),
              title: z.string(),
              details: z.string().nullable(),
              slug: z.string(),
              maximumAttendees: z.number().int().positive().nullable(),
              attendeesAmount: z.number().int().positive(),
            }),
          }),
        },
      },
    },

    async (req, reply) => {
      const { eventId } = req.params

      const event = await prisma.event.findUnique({
        where: {
          id: eventId,
        },
        select: {
          id: true,
          title: true,
          details: true,
          slug: true,
          maximumAttendees: true,
          _count: {
            select: {
              attendees: true,
            },
          },
        },
      })

      if (event === null) {
        throw new BadRequest('Event does not exists')
      }

      reply.send({
        event: {
          id: event.id,
          title: event.title,
          details: event.details,
          slug: event.slug,
          maximumAttendees: event.maximumAttendees,
          attendeesAmount: event._count.attendees,
        },
      })
    },
  )
}
