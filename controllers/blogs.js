const router = require('express').Router()

const e = require('express')
const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}


router.get('/', async (req, res) => {
    const blogs = await Blog.findAll()
    res.json(blogs)
  })
  
router.post('/', async (req, res, next) => {
    try {
        const blog = await Blog.build(req.body)
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
  
router.delete('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
      await req.blog.destroy()
    } else {
      res.status(204).end()
    }
})

module.exports = router