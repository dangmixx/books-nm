import express from 'express';
import controller from '../controllers/book';

const router = express.Router();

router.post('/create', controller.createBook);
router.get('/get/:bookId', controller.readBook);
router.get('/getAll', controller.readAllBook);
router.put('/update/:bookId', controller.updateBook);
router.delete('/delete/:bookId', controller.deleteBook);

export = router;
