import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";
import {
  BadRequest
} from "./chunk-A42IFF2V.mjs";

// src/routes/attendee/get-attendee-badge.ts
import z from "zod";
var getAttendeeBadge = async (app) => {
  app.withTypeProvider().get(
    "/attendees/:attendeeId/badge",
    {
      schema: {
        summary: "Get attendee badge",
        tags: ["attendees"],
        params: z.object({
          attendeeId: z.coerce.number().int()
        }),
        response: {
          200: z.object({
            badge: z.object({
              name: z.string(),
              email: z.string().email(),
              eventTitle: z.string(),
              checkInURL: z.string().url()
            })
          })
        }
      }
    },
    async (req, reply) => {
      const { attendeeId } = req.params;
      const attendee = await prisma.attendee.findUnique({
        where: {
          id: attendeeId
        },
        select: {
          name: true,
          email: true,
          event: {
            select: {
              title: true
            }
          }
        }
      });
      if (attendee === null) {
        throw new BadRequest("Attendee does not exist");
      }
      const baseURL = `${req.protocol}://${req.hostname}`;
      const checkInURL = new URL(`/attendees/${attendeeId}/check-in`, baseURL);
      reply.send({
        badge: {
          name: attendee.name,
          email: attendee.email,
          eventTitle: attendee.event.title,
          checkInURL: checkInURL.toString()
        }
      });
    }
  );
};

export {
  getAttendeeBadge
};
