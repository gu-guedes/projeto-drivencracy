import joi from "joi"

export const pollSchema = joi.object({
    tittle: joi.string().required()
})