import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { getAttendeeBadge } from './routes/attendee/get-attendee-badge'
import { registerForEvent } from './routes/attendee/register-for-event'
import { checkIn } from './routes/check-in/check-in'
import { createEvent } from './routes/event/create-event'
import { getEvent } from './routes/event/get-event'
import { getEventAttendees } from './routes/event/get-event-attendees'

const app = fastify()

/* Setup cors */
app.register(fastifyCors, {
  origin: '*',
})

/* Setup swagger */
app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],

    info: {
      title: 'Pass.in API',
      description:
        'Especificações da API para o back-end da aplicação pass.in construida durante o evento NLW Unite da Rocketseat.',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})
app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

/* Setup validators ans serializers */
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

/* Events routes */
app.register(getEvent)
app.register(getEventAttendees)
app.register(createEvent)

/* Attendees routes */
app.register(getAttendeeBadge)
app.register(registerForEvent)

/* Check-in routes */
app.register(checkIn)

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('Server is running')
})
