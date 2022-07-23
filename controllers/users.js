const router = require('express').Router()

const { User } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    next(error)
  }
})

router.put('/:username', async (req, res, next) => {
    if (!req.body.username) {
      return res.status(400).json({ error: 'Username to change to is not given!' }).end()
    }
    const user = await User.findOne({
        where: {
          username: req.params.username
        }
      })
    if (!user) {
        return res.status(404).json({error: `User ${req.params.username} cannot be found`})
    }
    try {
      user.username = req.body.username
      await user.save()
      res.json(user)
    } catch(error) {
      next(error)
    }
   
  })

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router