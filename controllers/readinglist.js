const router = require('express').Router()

const e = require('express')
const { ReadingList, User, Blog } = require('../models')
const { Op, fn, col } = require('sequelize')
const { restart } = require('nodemon')
const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config')
const { tokenExtractor } = require('../util/middleware')


router.post('/', async (req, res, next) => {
    try {
        const readlingList = await ReadingList.create({...req.body, read: false})
        return res.json(readlingList)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.decodedToken.id)
        const readlingList = await ReadingList.findByPk(req.params.id)
        if(!readlingList) {
            return res.status(404).json({error: 'reading list not found'})
        }
        if (user.id !== readlingList.userId) {
            return res.status(401).json({error: 'you cannot edit this reading list'})
        }
        if (!req.body.read) {
            return res.status(400).json({error: 'you must include read field!'})
        }
        if (typeof req.body.read !== "boolean") {
            return res.status(400).json({error: 'Must be a boolean type!'})
        }
        readlingList.read = req.body.read
        readlingList.save()
        return res.json(readlingList)
    } catch (error) {
        next(error)
    }
})

module.exports = router