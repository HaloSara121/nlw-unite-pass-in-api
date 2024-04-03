import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";
import {
  BadRequest
} from "./chunk-A42IFF2V.mjs";

// src/routes/attendee/register-for-event.ts
import { z } from "zod";
var registerForEvent = async (app) => {
  app.withTypeProvider().post(
    "/events/:eventId/attendees",
    {
      schema: {
        summary: "Register an attendee for event",
        tags: ["attendees"],
        body: z.object({
          name: z.string().min(4),
          email: z.string().email()
        }),
        params: z.object({
          eventId: z.string().uuid()
        }),
        response: {
          201: z.object({
            attendeeId: z.number()
          })
        }
      }
    },
    async (req, reply) => {
      const { name, email } = req.body;
      const { eventId } = req.params;
      const [event, amountOfAttendeesForEvent] = await Promise.all([
        prisma.event.findUnique({
          where: {
            id: eventId
          }
        }),
        prisma.attendee.count({
          where: {
            eventId
          }
        })
      ]);
      if (!event) {
        throw new BadRequest("Event does no exist");
      }
      if (event?.maximumAttendees && amountOfAttendeesForEvent >= event.maximumAttendees) {
        throw new BadRequest("Event is fully booked");
      }
      const attendeeFromEmail = await prisma.attendee.findUnique({
        where: {
          eventId_email: {
            eventId,
            email
          }
        }
      });
      if (attendeeFromEmail !== null) {
        throw new BadRequest("Attendee already registered with this email");
      }
      const attendee = await prisma.attendee.create({
        data: {
          name,
          email,
          eventId
        }
      });
      reply.status(201).send({ attendeeId: attendee.id });
    }
  );
};

export {
  registerForEvent
};
