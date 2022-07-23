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
    }
  
    next(error)
  }


  module.exports = {
    errorHandler
  }