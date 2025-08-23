import mongoose from 'mongoose';
const { Schema } = mongoose;

const AddressSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    country: String,
    fullName: String,
    streetAddress: String,
    city: String,
    state: String,
    zipCode: String,
    phoneNumber: String,
    deliveryInstructions: String,
    securityCode: String,
});

const Address = mongoose.model('Address', AddressSchema)

export default Address;