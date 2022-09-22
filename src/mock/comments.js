import { getRandomInteger } from '../utils/utils.js';

const COMMENT_DATA = {
  commentText: ['Interesting setting and a good cast', 'Booooooooooring', 'Very very old. Meh', 'Almost two hours? Seriously?'],
  authors: ['Tim', 'Boris', 'John', 'Ivan'],
  emotions: ['smile', 'sleeping', 'puke', 'angry'],


};

const countIdNumber = () => {
  let counter = 0;
  return function () {
    counter += 1;
    return counter;
  };

};
const getIdNumber = countIdNumber();

export const generateComment = () => {
  const randomAuthor = COMMENT_DATA.authors[getRandomInteger(0, COMMENT_DATA.authors.length - 1)];
  const randomCommentText = COMMENT_DATA.commentText[getRandomInteger(0, COMMENT_DATA.commentText.length - 1)];
  const randomEmotion = COMMENT_DATA.emotions[getRandomInteger(0, COMMENT_DATA.emotions.length - 1)];

  return {
    id: getIdNumber(),
    author: randomAuthor,
    comment: randomCommentText,
    date: '2019-05-11T16:12:32.554Z',
    emotion: randomEmotion,

  };
};


