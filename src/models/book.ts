import mongoose, { Document, Schema } from 'mongoose';
export interface IBook {
    title: string;
    author: string;
}

export interface IAuthorModel extends IBook, Document {}

const BookSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        author: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Author',
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IAuthorModel>('Book', BookSchema);
