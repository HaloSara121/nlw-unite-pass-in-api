import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";
import {
  BadRequest
} from "./chunk-A42IFF2V.mjs";

// src/routes/check-in/check-in.ts
import z from "zod";
var checkIn = async (app) => {
  app.withTypeProvider().get(
    "/attendees/:attendeeId/check-in",
    {
      schema: {
        summary: "Check in an attendee",
        tags: ["check-in"],
        params: z.object({
          attendeeId: z.coerce.number().int()
        }),
        response: {
          201: z.null()
        }
      }
    },
    async (req, reply) => {
      const { attendeeId } = req.params;
      const attendeeCheckIn = await prisma.checkIn.findUnique({
        where: {
          attendeeId
        }
      });
      if (attendeeCheckIn !== null) {
        throw new BadRequest("Attendee already checked in");
      }
      const checkIn2 = await prisma.checkIn.create({
        data: {
          attendeeId
        }
      });
      if (checkIn2 === null) {
        throw new Error("Error on creating check in, try again later");
      }
      reply.status(201);
    }
  );
};

export {
  checkIn
};
