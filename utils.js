import { Client } from '@notionhq/client';
import omit from 'lodash.omit';

const notion = new Client({ auth: process.env.SECRET });

export const getUrl = (note) => {
  return note.url.replace('https', 'notion');
};

export const getExistingNote = async (databaseId, title) => {
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
    return response.results[0];
  }

  return null;
};

export const createNote = async (parentId, title) => {
  const note = await notion.pages.create({
    parent: { database_id: parentId },
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

  return note;
}

const getTemplateBlocks = async (id) => {
  const response = await notion.blocks.children.list({
    block_id: id,
    page_size: 100,
  });

  return response.results.map((block) => omit(block, ['id', 'created_time', 'has_children', 'last_edited_time']));
};

export const applyTemplate = async (templateId, targetId) => {
  const templateBlocks = await getTemplateBlocks(templateId);

  // console.log('blocks.......')
  // console.log(JSON.stringify(templateBlocks, null, 2));
  await notion.blocks.children.append({
    block_id: targetId,
    children: templateBlocks,
  });

  return targetId;
};
