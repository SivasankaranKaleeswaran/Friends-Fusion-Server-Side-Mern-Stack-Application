import express from "express";
import {textGenaration} from '../controllers/genText.js';
import {imageGenerate} from '../controllers/genImage.js';

const router = express.Router();

router.post("/text", textGenaration);
router.post("/image", imageGenerate);

export default router;
