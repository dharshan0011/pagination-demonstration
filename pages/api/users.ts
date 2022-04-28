// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import mongoose from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'
import User, { IUser } from '../../models/userModel'

export type GetUsersResponse = {
  users?: IUser[]
  error?: string
  page?: number
  pages?: number
  count?: number
  pageSize?: number
}

type PutUsersResponse = {
  user?: IUser
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetUsersResponse | PutUsersResponse>
) {
  const { method, body } = req
  let users: IUser[] = []

  mongoose
    .connect(
      'mongodb+srv://dharshan:O0X2BnxYuMT6u6WV@cluster0.cxomx.mongodb.net/pagination?retryWrites=true&w=majority'
    )
    .catch((error) => {
      console.log('[ERROR: Error during connecting to DB', error)
      return process.exit(1)
    })

  switch (method) {
    case 'GET':
      const pageSize = Number(req.query.pageSize) || 5
      const page = Number(req.query.page) || 1
      let count = await User.count({})

      try {
        users = await User.find<IUser>({})
          .limit(pageSize)
          .skip(pageSize * (page - 1))
        res.status(200).json({
          users,
          page,
          count,
          pageSize,
          pages: Math.ceil(count / pageSize),
        })
      } catch (err: any) {
        res.status(500).json({ error: err.message })
      }
      break

    case 'PUT':
      try {
        if (
          body.id &&
          typeof body.id === 'string' &&
          body.email &&
          typeof body.email === 'string'
        ) {
          const user = await User.findByIdAndUpdate(body.id, {
            email: body.email,
          })
          res.status(200).json({ user })
        } else {
          throw Error('ID or email is invalid')
        }
      } catch (err: any) {
        res.status(500).json({ error: err.message })
      }
      break
  }
}
