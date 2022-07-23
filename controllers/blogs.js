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
  
router.post('/', async (req, res) => {
    try {
        const blog = await Blog.build(req.body)
        blog.likes = 0
        await blog.save()
        return res.json(blog)
    } catch (error) {
        return res.status(400).json({ error })
      }
})

router.put('/:id', blogFinder, async (req, res) => {
  if (!req.blog) {
    res.status(404).end()
  }
  if (!req.body.likes) {
    res.status(400).end()
  }

  req.blog.likes = req.body.likes
  try {
    await req.blog.save()
    res.json(req.blog)
  } catch(error) {
    res.status(400).end()
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