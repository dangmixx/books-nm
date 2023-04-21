import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import book from '../models/book';

const createBook = (req: Request, res: Response, next: NextFunction) => {
    const { title, author } = req.body;
    const au = new book({
        _id: new mongoose.Types.ObjectId(),
        title,
        author,
    });
    return book
        .findOne({ title: title, author: author })
        .then((existAu) => {
            if (existAu) {
                res.status(500).json({ message: 'Existed' });
            } else {
                return au
                    .save()
                    .then((aut) => res.status(200).json({ au }))
                    .catch((err) => res.status(500).json(err));
            }
        })
        .catch((err) => res.status(500).json(err));
};
const readBook = (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;
    return book
        .findById(bookId)
        .populate('author')
        .select('-__v')
        .then((au) => (au ? res.status(200).json({ au }) : res.status(404).json({ message: 'Not found' })))
        .catch((err) => res.status(500).json(err));
};
const readAllBook = (req: Request, res: Response, next: NextFunction) => {
    return book
        .find()
        .populate('author')
        .select('-__v')
        .then((Books) => res.status(200).json({ Books }))
        .catch((err) => res.status(500).json(err));
};
const updateBook = (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;
    return book
        .findById(bookId)
        .then((au) => {
            if (au) {
                au.set(req.body);
                return au
                    .save()
                    .then((a) => res.status(200).json({ a }))
                    .catch((err) => res.status(500).json(err));
            } else {
                res.status(404).json({ message: 'Not Found' });
            }
        })
        .catch((err) => res.status(500).json(err));
};

const deleteBook = (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;
    return book
        .findByIdAndDelete(bookId)
        .then((au) => (au ? res.status(201).json({ message: 'deleted' }) : res.status(404).json({ message: 'Not found' })))
        .catch((err) => res.status(500).json(err));
};

export default { createBook, readBook, readAllBook, updateBook, deleteBook };
