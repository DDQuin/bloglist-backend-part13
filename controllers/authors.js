const router = require('express').Router()

const e = require('express')
const { Blog, User } = require('../models')
const { Op, fn, col } = require('sequelize')

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll({
        attributes: [[fn('COUNT', col('id')), 'articles'], [fn('SUM', col('likes')), 'likes'], 'author'],
      group: [
        ['author'],
      ],
      order: [
        [fn('SUM', col('likes')), 'DESC'],
      ]
    })
      res.json(blogs)
    })

module.exports = router