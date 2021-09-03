import alfy from 'alfy';
import { openOrCreateWithTemplate } from './utils.js';

const databaseId = '7785176a361d4717b4978509d9f167b1';
const templateId = 'c21bd59b18204fa9942b1bc4050d63fe';

const title = new Date().toISOString().split('T')[0] + 'test'; // YYYY-MM-DD

try {
  console.log(await openOrCreateWithTemplate(databaseId, title, templateId));
} catch (error) {
  alfy.error(error);
}
