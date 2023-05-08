import { db } from "../database/database.config.js"
import dayjs from "dayjs"


export async function createPoll(req, res) {
    const { tittle, expireAt } = req.body
    let dateExpire 
    if(!expireAt){
         dateExpire = dayjs().add(30, "day").format("YYYY-MM-DD HH:mm")
    }else{
        dateExpire = expireAt
    }
    try{
      
        const poll = {tittle, expireAt: dateExpire}
        await db.collection("polls").insertOne(poll)
        res.sendStatus(201)
    } catch (err) {
      res.status(500).send(err.message)
    }
}

export async function getPoll(req, res) {
    try{
        const polls = await db.collection("polls").find().toArray()
        res.send(polls)
    } catch (err) {
      res.status(500).send(err.message)
    }
}

