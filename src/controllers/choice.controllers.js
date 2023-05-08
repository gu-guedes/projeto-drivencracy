import { ObjectId } from "bson"
import { db } from "../database/database.config.js"
import dayjs from "dayjs"
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js'
dayjs.extend(isSameOrAfter)


export async function addChoice(req, res) {
    const { tittle, pollId } = req.body
    try {
        const validPoll = await db.collection("polls").findOne({ _id: new ObjectId(pollId) })
        if (!validPoll) return res.sendStatus(404)
        const now = dayjs()
        if(dayjs(now).isSameOrAfter(validPoll.expireAt)) return res.sendStatus(403)
        

        const validTittle = await db.collection("choices").findOne({ tittle })
        if (validTittle) return res.sendStatus(409)

    

        await db.collection("choices").insertOne({ tittle, pollId })
        res.sendStatus(201)

    } catch (err) {
        res.status(500).send(err.message)
    }
}
export async function getIdChoice(req, res) {
    const { id } = req.params
    try {
        const validId = await db.collection("polls").findOne({ _id: new ObjectId(id) })
        if (!validId) return res.sendStatus(404)
   
        const choicesId = await db.collection("choices").find({ pollId: id }).toArray()

        res.send(choicesId)

    } catch (err) {
        res.status(500).send(err.message)

    }
}
export async function addVote(req, res) {
    const { id } = req.params
    try {
       
        const validChoice = await db.collection("choices").findOne({ _id: new ObjectId(id) })
        console.log(validChoice)
        if (!validChoice) return res.sendStatus(404)
        const validExpire = await db.collection("polls").findOne({_id:  new ObjectId(validChoice.pollId)})
        const now = dayjs()
        if(dayjs(now).isSameOrAfter(validExpire.expireAt)) return res.sendStatus(403)
        
     

        await db.collection("vote").insertOne({ createdAt: dayjs().format("YYYY-MM-DD HH:mm"), choiceId: id })
        
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }

}
export async function resultPoll(req, res) {
    const { id } = req.params
 
    try {
        const validPoll = await db.collection("polls").findOne({ _id: new ObjectId(id) })
        if (!validPoll) return res.sendStatus(404)
        const choices = await db.collection("choices").find({ pollId: id }).toArray()
        const choiceStringId = choices.map((choice) => String(choice._id))

        const winner = await db.collection("vote").aggregate([
            {$match: {choiceId: {$in:choiceStringId}}},
            {$group: {_id: "$choiceId" , voteAmount:{$sum: 1}}},
            {$sort: {voteAmount: -1}}
          ]).toArray()
  
          const choice = await db.collection("choices").findOne({_id: new ObjectId(winner[0]._id)})
          const votes = winner[0].voteAmount
          const result = {title: choice.title , votes}
          const resultFinal = {...validPoll , result}
        
        res.send(resultFinal)


    } catch (err) {
        res.status(500).send(err.message)
    }
}