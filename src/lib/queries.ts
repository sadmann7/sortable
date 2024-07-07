import { faker } from "@faker-js/faker"

export function getItems() {
  return Array.from({ length: 10 }, () => ({
    id: faker.string.uuid(),
    name: faker.lorem.words(),
    description: faker.lorem.sentence(),
    price: faker.finance.amount(),
    stock: faker.number.int({ min: 0, max: 100 }),
  }))
}
