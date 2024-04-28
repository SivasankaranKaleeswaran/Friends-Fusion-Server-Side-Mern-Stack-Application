import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const textGenaration = async (req, res) => {
	try{
    const response = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    prompt: req.body.prompt,
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    });
	res.send(response.choices[0]).status(200);
	}
	catch(error)
	{
		res.send(`Unable to generate the content: ${error}`).status(400);
	}
  };