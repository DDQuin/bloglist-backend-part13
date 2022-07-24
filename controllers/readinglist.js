const router = require('express').Router()

const e = require('express')
const { ReadingList, User, Blog } = require('../models')
const { Op, fn, col } = require('sequelize')

router.post('/', async (req, res, next) => {
    try {
        const readlingList = await ReadingList.create({...req.body, read: false})
        return res.json(readlingList)
    } catch (error) {
        next(error)
    }
})

module.exports = router