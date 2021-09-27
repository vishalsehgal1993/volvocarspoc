# volvocarspoc
POC on Volvo Cars Project
# commands
Step 1:
npm install --save
Step 2:
npm start
Step 3:
Open the Link in the Terminal or Just Open the Following Link:
http://localhost:3000/api/version/1/bookings


Step 4)
Use the Following Mock Data:
mutation{
	  bookings(userID:"6150ef858d17680790b06b59",scheduledTime:"Wed Sep 28 2021 11:13:28 GMT+0530 (India Standard Time)",vin:"6150ef878d17680790b06b5c") {
		_id
		createdAt
		updatedAt
	  }
}

Step 5)
mutation{
  cancelBooking(_id:"615213208ae69017410a9713") {
    _id
    createdAt
    updatedAt
  }
}

Step 6)
query{
  bookingList(scheduledTime:"Wed Sep 28 2021 10:13:28 GMT+0530 (India Standard Time)") {
    _id
    createdAt
    updatedAt
  }
}

All Data is getting Captured on Persoanl MongoDb Instance(Dynamic) which i use on for Practice Purposes.
Thanks.