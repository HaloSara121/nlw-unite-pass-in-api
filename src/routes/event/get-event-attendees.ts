import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '../../lib/prisma'

export const getEventAttendees = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/events/:eventId/attendees',
    {
      schema: {
        summary: 'Get attendees from an event',
        tags: ['events'],
        params: z.object({
          eventId: z.string().uuid(),
        }),
        querystring: z.object({
          pageIndex: z.string().nullish().default('0').transform(Number),
          query: z.string().nullish(),
        }),
        response: {
          200: z.object({
            attendees: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
                email: z.string().email(),
                createdAt: z.date(),
                checkedInAt: z.date().nullable(),
              }),
            ),
          }),
        },
      },
    },
    async (req, reply) => {
      const { eventId } = req.params
      const { pageIndex, query } = req.query

      const attendees = await prisma.attendee.findMany({
        where: query
          ? {
              eventId,
              name: {
                contains: query,
              },
            }
          : {
              eventId,
            },
        take: 10,
        skip: pageIndex * 10,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          checkIn: {
            select: {
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      reply.send({
        attendees: attendees.map((attendee) => {
          return {
            id: attendee.id,
            name: attendee.name,
            email: attendee.email,
            createdAt: attendee.createdAt,
            checkedInAt: attendee.checkIn ? attendee.checkIn.createdAt : null,
          }
        }),
      })
    },
  )
}
