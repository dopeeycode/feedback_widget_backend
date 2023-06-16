import express from 'express'
import nodemailer from 'nodemailer'
import { prisma } from './prisma'

import { FeedbacksProps } from './@types/FeedbackProps'

const app = express()
app.use(express.json())

const transport = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '69264ee9b87d18',
    pass: 'aeb53cbff77d89',
  },
})

app.post('/feedbacks', async (req, res) => {
  const { type, comment, screenshot }: FeedbacksProps = req.body

  const feedback = await prisma.feedback.create({
    data: {
      type,
      comment,
      screenshot,
    },
  })

  await transport.sendMail({
    from: 'Equipe Feedget <heroitalo76@gmail.com>',
    to: 'Italo Patricio <italodopeey@gmail.com>',
    subject: 'Novo Feedback',
    html: [
      `<div style="font-family: sans-serif; font-size: 16px; color: #222;">`,
      `<p>Tipo do feedback: ${type}</p>`,
      `<p>Comentário do feedback: ${comment}</p>`,
      `</div>`,
    ].join(''),
  })

  return res.status(201).json({ data: feedback })
})

app.listen(3333, () => {
  console.log('HTTP server running')
})
