import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import author from '../models/author';

const createAuthor = (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const au = new author({
        _id: new mongoose.Types.ObjectId(),
        name,
    });
    return author.findOne({ name: name }).then((existAu) => {
        if (existAu) {
            res.status(500).json({ message: 'Existed' });
        } else {
            return au
                .save()
                .then((aut) => res.status(200).json({ aut }))
                .catch((err) => res.status(500).json(err));
        }
    });
};
const readAuthor = (req: Request, res: Response, next: NextFunction) => {
    const auId = req.params.authorId;
    return author
        .findById(auId)
        .then((au) => (au ? res.status(200).json({ au }) : res.status(404).json({ message: 'Not found' })))
        .catch((err) => res.status(500).json(err));
};
const readAllAuthor = (req: Request, res: Response, next: NextFunction) => {
    return author
        .find()
        .then((authors) => res.status(200).json({ authors }))
        .catch((err) => res.status(500).json(err));
};
const updateAuthor = (req: Request, res: Response, next: NextFunction) => {
    const auId = req.params.authorId;
    return author
        .findById(auId)
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

const deleteAuthor = (req: Request, res: Response, next: NextFunction) => {
    const auId = req.params.authorId;
    return author
        .findByIdAndDelete(auId)
        .then((au) => (au ? res.status(201).json({ message: 'deleted' }) : res.status(404).json({ message: 'Not found' })))
        .catch((err) => res.status(500).json(err));
};

export default { createAuthor, readAuthor, readAllAuthor, updateAuthor, deleteAuthor };
