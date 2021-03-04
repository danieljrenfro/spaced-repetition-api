const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');

const languageRouter = express.Router();
const jsonBodyParser = express.json();

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      );

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        });

      req.language = language;
      next();
    } catch (error) {
      next(error);
    }
  });

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      );

      res.json({
        language: req.language,
        words,
      });
      next();
    } catch (error) {
      next(error);
    }
  });

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id
      );

      const headWord = words.find(word => word.id === req.language.head);

      res.json({
        nextWord: headWord.original,
        wordCorrectCount: headWord.correct_count,
        wordIncorrectCount: headWord.incorrect_count,
        totalScore: req.language.total_score
      });
      next();
    } catch (error) {
      next(error);
    }
  });

languageRouter
  .post('/guess', jsonBodyParser, async (req, res, next) => {
    const { guess } = req.body;



    if (!guess) {
      return res.status(400).send({
        error: `Missing 'guess' in request body`
      });
    }

    const wordsList = await LanguageService.fillLinkedList(
      req.app.get('db'),
      req.language
    );

    const head = wordsList.head.value;

    if (guess.toLowerCase() !== head.translation) {
      try {
        wordsList.incorrect();
        
        const allWords = wordsList.all();
        
        await allWords.forEach(async word => {
          await LanguageService.updateLanguageWords(
            req.app.get('db'),
            word.id,
            word
          );
        });

        await LanguageService.updateUsersLanguageHead(
          req.app.get('db'),
          req.user.id,
          wordsList.head.value.id
        );

        return res.json({
          nextWord: wordsList.head.value.original,
          totalScore: req.language.total_score,
          wordCorrectCount: head.correct_count,
          wordIncorrectCount: head.incorrect_count,
          answer: head.translation,
          isCorrect: false
        });
      } catch(error) {
        next(error);
      }
    } else {
      try {
        wordsList.correct();
  
        const allWords = wordsList.all();
  
        await allWords.forEach(async word => {
          await LanguageService.updateLanguageWords(
            req.app.get('db'),
            word.id,
            word
          );
        });
  
        await LanguageService.updateUsersLanguageHead(
          req.app.get('db'),
          req.user.id,
          wordsList.head.value.id
        );
  
        await LanguageService.updateUsersTotalScore(
          req.app.get('db'), 
          req.user.id, 
          req.language.total_score + 1
        );

        return res.json({
          nextWord: wordsList.head.value.original,
          totalScore: req.language.total_score + 1,
          wordCorrectCount: head.correct_count,
          wordIncorrectCount: head.incorrect_count,
          answer: head.translation,
          isCorrect: true
        });
      } catch (error) {
        next(error);
      }
    }
  });

module.exports = languageRouter;