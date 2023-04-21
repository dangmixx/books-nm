import express from 'express';
import controller from '../controllers/author';

const router = express.Router();

router.post('/create', controller.createAuthor);
router.get('/get/:authorId', controller.readAuthor);
router.get('/getAll', controller.readAllAuthor);
router.put('/update/:authorId', controller.updateAuthor);
router.delete('/delete/:authorId', controller.deleteAuthor);

export = router;
