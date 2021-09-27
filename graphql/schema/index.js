const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Booking {
    _id: ID
    userID: User!
    scheduledTime:String!
    vin:Vehicle!
    createdAt: String
    updatedAt: String
}

type Vehicle {
  _id: ID!
  vehicleMake: String!
  vehicleModel: String!
  vin: String!
}

type User {
  _id: ID!
  email: String!
  name: String
  phone: String!
}

input BookingInput {
  userID: String!
  scheduledTime: String!
  vin: String!
}

type RootQuery {
  bookingList(scheduledTime:String!): Booking!
}

type RootMutation {
    bookings(userID: ID!,scheduledTime:String!,vin:String!): Booking!
    cancelBooking(_id: ID!): Booking!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
