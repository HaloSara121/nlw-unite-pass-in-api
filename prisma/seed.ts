import { prisma } from '../src/lib/prisma'

const seed = async () => {
  await prisma.event.create({
    data: {
      id: '45e029e7-e8b1-4e6f-9b25-d61570c789fd',
      title: 'NLW Unite',
      details: 'Um evento para devs apaixonados por programação',
      slug: 'nlw-unite',
      maximumAttendees: 120,
    },
  })
}

seed().then(() => {
  console.log('Database seeded!')
  prisma.$disconnect()
})
