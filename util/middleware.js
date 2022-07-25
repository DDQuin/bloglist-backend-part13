const jwt = require('jsonwebtoken')
const { SECRET } = require('./config.js')
const { User, Session } = require('../models')


const errorHandler = (error, request, response, next) => {
    
    console.log(error.name, "current error by middleware")
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'SequelizeValidationError') {
      return response.status(400).json({ error: error.message})
    } else if (error.name === 'SequelizeDatabaseError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'TypeError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'SequelizeForeignKeyConstraintError') {
      return response.status(400).json({ error: error.message })
  }
  
    next(error)
  }

  const tokenExtractor = async (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      try {
        const tokenRaw = authorization.substring(7)
        req.tokenRaw = tokenRaw
        req.decodedToken = jwt.verify(tokenRaw, SECRET)
        //check if token is revoked,
        const session = await Session.findAll({
          where: {
            token: tokenRaw
          }
        })
        if (session.length === 0) {
          return res.status(401).json({ error: 'session has expired!' }).end()
        }
        //check if user is disabled
        const user = await User.findByPk(req.decodedToken.id)
        if (!user.access) {
          return res.status(401).json({ error: 'user is disabled!' }).end()
        }
      } catch(error) {
        console.log(error)
        return res.status(401).json({ error: 'token invalid' })
      }
    }  else {
      return res.status(401).json({ error: 'token missing' })
    }
    next()
  }




  module.exports = {
    errorHandler, tokenExtractor
  }