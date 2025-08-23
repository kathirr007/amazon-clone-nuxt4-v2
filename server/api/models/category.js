import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    type: { type: String, unique: true, required: true }
});

const Category = mongoose.model('Category', CategorySchema);

export default Category