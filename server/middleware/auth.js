import _ from 'lodash'
import User from '../models/user.js'

const NO_AUTH_ROUTES = [
  '/api/auth/check',
  '/api/auth/login'
]

export default async function (req, res, next) {
  if (!_.startsWith(req.path, '/api')) {
    return next()
  }

  const user = await User.findByPk(req.session.userId)

  if (user || _.includes(NO_AUTH_ROUTES, req.path)) {
    return next()
  } else {
    const err = new Error("Not authorized! Go back!");
    return next(err)
  }
}