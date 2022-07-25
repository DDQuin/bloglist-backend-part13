const router = require('express').Router()

const e = require('express')
const { Blog, User } = require('../models')
const { Op } = require('sequelize')
const { SECRET } = require('../util/config')
const jwt = require('jsonwebtoken');
const { tokenExtractor } = require('../util/middleware')



const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}


router.get('/', async (req, res) => {
  let where = {}
  if (req.query.search) {
  where = {
    [Op.or]: [
      {
        title: {
          [Op.iLike]: `%${req.query.search}%`
        }
      },
      {
        author: {
          [Op.iLike]: `%${req.query.search}%`
        }
      }
    ]
  }
}
const order = [ ["likes", "DESC"]]
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order
  })

    res.json(blogs)
  })
  
router.post('/', tokenExtractor, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.decodedToken.id)
        const blog = await Blog.build({...req.body, userId: user.id})
        blog.likes = 0
        await blog.save()
        return res.json(blog)
    } catch (error) {
        next(error)
      }
})

router.put('/:id', blogFinder, async (req, res, next) => {
  if (!req.blog) {
    return res.status(404).json({ error: 'Blog not found!' }).end()
  }
  if (!req.body.likes) {
    return res.status(400).json({ error: 'Likes not included!' }).end()
  }
  try {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } catch(error) {
    next(error)
  }
 
})
  
router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
    if (req.blog) {
      if (user.id !== req.blog.userId) {
        return res.status(400).json({error: 'You do not have permission to delete this'}).end()
      }
      await req.blog.destroy()
    } else {
      return res.status(204).end()
    }
})



module.exports = router