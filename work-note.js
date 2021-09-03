import { Client } from '@notionhq/client';
import alfy from 'alfy';
import omit from 'lodash.omit';

const databaseId = '7785176a361d4717b4978509d9f167b1';
const templateId = 'c21bd59b18204fa9942b1bc4050d63fe';

const notion = new Client({ auth: process.env.SECRET });
const title = new Date().toISOString().split('T')[0];
const fixUrl = (url) => {
  return url.replace('https', 'notion');
};

const getExistingNote = async () => {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'title',
      text: {
        equals: title,
      },
    },
  });

  // console.error(JSON.stringify(response, null, 2));

  if (response?.results.length) {
    return fixUrl(response.results[0].url);
  }

  return null;
};

const getTemplateBlocks = async () => {
  const response = await notion.blocks.children.list({
    block_id: templateId,
    page_size: 100,
  });

  return response.results.map((block) => omit(block, ['id', 'created_time', 'has_children', 'last_edited_time']));
};

const createNote = async () => {
  const { url, id } = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      title: {
        title: [
          {
            text: {
              content: title,
            },
          },
        ],
      },
    },
  });

  const templateBlocks = await getTemplateBlocks();

  // console.log('blocks.......')
  // console.log(JSON.stringify(templateBlocks, null, 2));
  await notion.blocks.children.append({
    block_id: id,
    children: templateBlocks,
  });

  return fixUrl(url);
};

try {
  const existingNote = await getExistingNote();
  if (existingNote) {
    console.log(existingNote);
  } else {
    console.log(await createNote());
  }
} catch (error) {
  alfy.error(error);
}
