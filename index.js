import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import {
	registerValidation,
	loginValidation,
	postCreateValidation,
} from './validations.js'

import { checkAuth, handleValidationErrors } from './utils/index.js'

import { UserController, PostController } from './controllers/index.js'
import cors from 'cors'
/////////////////////Connect DB/////////////////////////////////////
mongoose
	.connect(
		'mongodb+srv://gasper:220767@cluster0.xjusvnc.mongodb.net/blog?retryWrites=true&w=majority'
	)
	.then(() => console.log('DB ok'))
	.catch(err => console.log(`DB error ${err}`))
const app = express()
///////////////////Create media storage///////////////////////////
const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads')
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	},
})
const upload = multer({ storage })

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))
///////////////User endpoints//////////////////
app.post(
	'/auth/login',
	loginValidation,
	handleValidationErrors,
	UserController.login
)
app.post(
	'/auth/register',
	registerValidation,
	handleValidationErrors,
	UserController.register
)
app.get('/auth/me', checkAuth, UserController.getMe)
/////////////////Media endpoints(multer)//////////////////////////
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	})
})
//////////////////Post endpoints///////////////////////////////
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post(
	'/posts',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.create
)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch(
	'/posts/:id',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.update
)
//////////////////Tags endpoints////////////////////
app.get('/tags', PostController.getLastTags)
app.get('/posts/tags', PostController.getLastTags)
//////////////////Run server////////////////////////
app.listen(4444, err => {
	err ? console.log(err) : console.log('Server ok')
})
