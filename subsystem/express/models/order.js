import mongoose from 'mongoose';
import deepPopulatePlugin from 'mongoose-deep-populate';

const deepPopulate = deepPopulatePlugin(mongoose);
const { Schema } = mongoose;

const OrderSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    products: [
        {
            productID: { type: Schema.Types.ObjectId, ref: 'Product' },
            quantity: Number,
            price: Number
        }
    ],
    estimatedDelivery: String
});

OrderSchema.plugin(deepPopulate);

const Order = mongoose.model('Order', OrderSchema);

export default Order