import alfy from 'alfy';
import { applyTemplate, createNote, getExistingNote, getUrl } from './utils.js';


const type = process.argv[2];
const title = process.argv.length > 3 ? process.argv[3].length ? process.argv[3] : null : null;
const dateTitle = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

const types = {
  work: {
    databaseId: '7785176a361d4717b4978509d9f167b1',
    templateId: 'c21bd59b18204fa9942b1bc4050d63fe',
    title: dateTitle
  },
  bishop: {
    databaseId: '6a4f1ca58b6245fa9492ca76381f6a07',
    templateId: '024f3724e6eb44629fe49587b7926152',
    title
  },
  scratch: {
    databaseId: 'cb3083c874054a9b930a6233edd6a535',
    templateId: null,
    title: title || dateTitle
  },
  journal: {
    databaseId: '',
    templateId: null
  }
};

const { databaseId, templateId, title: newTitle} = types[type];
try {
  const existingNote = await getExistingNote(databaseId, newTitle);

  if (existingNote) {
    console.log(getUrl(existingNote));
  } else {
    const newNote = await createNote(databaseId, newTitle);

    if (templateId) {
      await applyTemplate(templateId, newNote.id);
    }

    console.log(getUrl(newNote));
  }
} catch (error) {
  alfy.error(error);
}
