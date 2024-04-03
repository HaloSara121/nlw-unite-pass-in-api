import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequest } from '../../_erros/bad-request'
import { prisma } from '../../lib/prisma'
import { slugify } from '../../utils/slugify'

export const createEvent = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/events',

    {
      schema: {
        summary: 'Create a new event',
        tags: ['events'],
        body: z.object({
          title: z.string().min(4),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable(),
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid(),
          }),
        },
      },
    },

    async (req, reply) => {
      const { title, details, maximumAttendees } = req.body

      const slug = slugify(title)

      const eventWithSameSlug = await prisma.event.findUnique({
        where: {
          slug,
        },
      })

      if (eventWithSameSlug !== null) {
        throw new BadRequest('Another event with same title already exists.')
      }

      const event = await prisma.event.create({
        data: {
          title,
          details,
          maximumAttendees,
          slug,
        },
      })

      if (event === null) {
        throw new Error('Failed to create event')
      }

      reply.status(201).send({ eventId: event.id })
    },
  )
}
