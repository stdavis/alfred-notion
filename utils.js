import { Client } from '@notionhq/client';
import omit from 'lodash.omit';
import 'dotenv/config';

const notion = new Client({ auth: process.env.SECRET });

export const getUrl = (note) => {
  return note.url.replace('https', 'notion');
};

export const getExistingNote = async (databaseId, title) => {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'title',
      title: {
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

export const createNote = async (parentId, title, templateId) => {
  const template = templateId ? await getTemplateBlocks(templateId) : null;

  const createConfig = {
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
  };

  if (template) {
    createConfig.children = template;
  }

  const note = await notion.pages.create(createConfig);

  return note;
};

const getTemplateBlocks = async (id) => {
  const page_size = 100;
  const response = await notion.blocks.children.list({
    block_id: id,
    page_size,
  });

  const strip = (block) => {
    return omit(block, ['id', 'created_time', 'has_children', 'last_edited_time', 'created_by', 'last_edited_by']);
  };

  const promises = response.results.map(async (block) => {
    const newBlock = strip(block);

    if (block.has_children) {
      newBlock[block.type].children = await getTemplateBlocks(block.id);
    }

    return newBlock;
  });

  return await Promise.all(promises);
};
