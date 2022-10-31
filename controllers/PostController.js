import Post from '../models/Post.js'
import PostModel from '../models/Post.js'

export const getLastTags = async (req, res) => {
	try {
		const posts = await PostModel.find().limit(5)
		const tags = posts
			.map(obj => obj.tags)
			.flat()
			.slice(0, 5)
		res.json(tags)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Произошла ошибка при получени постов',
		})
	}
}

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find().populate('user').exec()

		res.json(posts)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Произошла ошибка при получени постов',
		})
	}
}

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id

		PostModel.findOneAndUpdate(
			{
				_id: postId,
			},
			{
				$inc: { viewsCount: 1 },
			},
			{
				returnDocument: 'after',
			},
			(err, doc) => {
				if (err) {
					console.log(err)
					return res.status(500).json({
						message: 'Произошла ошибка при получени поста',
					})
				}
				if (!doc) {
					return res.status(404).json({ message: 'Статья не найдена' })
				}

				res.json(doc)
			}
		)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Произошла ошибка при получени постов',
		})
	}
}
export const remove = async (req, res) => {
	try {
		const postId = req.params.id
		PostModel.findOneAndDelete(
			{
				_id: postId,
			},
			(err, doc) => {
				if (err) {
					console.log(err)
					return res.status(500).json({
						message: 'Произошла ошибка при удалении поста',
					})
				}
				if (!doc) {
					return res.status(404).json({ message: 'Статья не была удалена' })
				}
				res.json({
					success: true,
				})
			}
		)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Произошла ошибка при удалении поста',
		})
	}
}

export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags,
			user: req.userId,
		})
		const post = await doc.save()
		res.json(post)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Произошла ошибка при создании поста',
		})
	}
}

export const update = async (req, res) => {
	try {
		const postId = req.params.id
		await PostModel.findByIdAndUpdate(
			{
				_id: postId,
			},
			{
				title: req.body.title,
				text: req.body.text,
				imageUrl: req.body.imageUrl,
				tags: req.body.tags,
				user: req.userId,
			}
		)
		res.json({
			success: true,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json('Не удалось обновить статью')
	}
}
