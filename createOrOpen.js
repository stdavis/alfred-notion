import alfy from 'alfy';
import { createNote, getExistingNote, getUrl } from './utils.js';


const type = process.argv[2];
const title = process.argv.length > 3 ? process.argv[3].length ? process.argv[3] : null : null;
const today = new Date();
const year = today.getFullYear();
let month = today.getMonth() + 1;
if (month < 10) {
  month = `0${month}`;
}
const day = today.getDate();
const dateTitle = `${year}-${month}-${day}`; // YYYY-MM-DD

const types = {
  work: {
    databaseId: 'ed1b418a5a3a4131bc96a4240478598b',
    templateId: 'c21bd59b18204fa9942b1bc4050d63fe',
    title: dateTitle
  },
  bishop: {
    databaseId: 'ecceb0c99ce74d98a5ff0fe11be87aa6',
    templateId: 'fc8ba95d00de4dddb7521d2a34a97140',
    title
  },
  scratch: {
    databaseId: '2d96dc41bcaa4232b96f05da5152eba6',
    templateId: null,
    title: title || dateTitle
  },
  journal: {
    databaseId: 'a21e4c04cea147a48ebb616106c02181',
    templateId: null,
    title: dateTitle
  }
};

const { databaseId, templateId, title: newTitle} = types[type];
try {
  const existingNote = await getExistingNote(databaseId, newTitle);

  if (existingNote) {
    console.log(getUrl(existingNote));
  } else {
    const newNote = await createNote(databaseId, newTitle, templateId);

    console.log(getUrl(newNote));
  }
} catch (error) {
  alfy.error(error);
}
