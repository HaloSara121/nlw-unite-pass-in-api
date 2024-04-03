import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequest } from '../../_erros/bad-request'
import { prisma } from '../../lib/prisma'

export const registerForEvent = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/events/:eventId/attendees',

    {
      schema: {
        summary: 'Register an attendee for event',
        tags: ['attendees'],
        body: z.object({
          name: z.string().min(4),
          email: z.string().email(),
        }),
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            attendeeId: z.number(),
          }),
        },
      },
    },

    async (req, reply) => {
      const { name, email } = req.body
      const { eventId } = req.params

      const [event, amountOfAttendeesForEvent] = await Promise.all([
        prisma.event.findUnique({
          where: {
            id: eventId,
          },
        }),

        prisma.attendee.count({
          where: {
            eventId,
          },
        }),
      ])

      if (!event) {
        throw new BadRequest('Event does no exist')
      }

      if (
        event?.maximumAttendees &&
        amountOfAttendeesForEvent >= event.maximumAttendees
      ) {
        throw new BadRequest('Event is fully booked')
      }

      const attendeeFromEmail = await prisma.attendee.findUnique({
        where: {
          eventId_email: {
            eventId,
            email,
          },
        },
      })

      if (attendeeFromEmail !== null) {
        throw new BadRequest('Attendee already registered with this email')
      }

      const attendee = await prisma.attendee.create({
        data: {
          name,
          email,
          eventId,
        },
      })

      reply.status(201).send({ attendeeId: attendee.id })
    },
  )
}
