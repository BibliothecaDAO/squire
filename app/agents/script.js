const fs = require('fs');
const path = require('path');
const frontMatter = require('front-matter');

const mdDirPath = '/home/os/Documents/dojo/dojo/lib/src'; // Replace this with your desired markdown files directory
// const outputPath = './output.json'; // Replace this with your desired output file path

function readDir(dirPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, { withFileTypes: true }, (err, entries) => {
      if (err) {
        reject(err);
      } else {
        resolve(entries);
      }
    });
  });
}

function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        reject(err);
      } else {
        resolve(content);
      }
    });
  });
}

function writeFile(filePath, content) {
  if (!filePath.endsWith('.md')) {
    filePath += '.md';
  }

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, 'utf8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function crawlMdFiles(dirPath) {
  const { OpenAI } = await import('langchain');
  const model = new OpenAI({ modelName: "gpt-3.5-turbo", openAIApiKey: "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" });

  const entries = await readDir(dirPath);
  const mdObjects = [];

  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      const nestedMdObjects = await crawlMdFiles(entryPath);
      mdObjects.push(...nestedMdObjects);
    } else if (entry.isFile() && path.extname(entry.name) === '.cairo') {

      console.log(entry.name.split(".cairo")[0])
      const content = await readFile(entryPath);

      console.log(content)

      const finalResponse = await model.call("Cairo is a new programming language for writing smart contracts for the starknet blockchain. It has similar semantics to rust but has a simpler, more limited feature set. Some important differences are: - Rust lifetime syntax are not supported. - Cairo does not support for loops. For example for i in 0..10 is not supported. - Only recursion is supported. No for loops and no while loops. - Functional operators such as map, filter, and iter are not supported. Write rustdoc for these functions and return formatted:" + content)

    
      // const parsedContent = frontMatter(content);

      await writeFile("./" + entry.name.split(".cairo")[0] + '.md', finalResponse);

      // mdObjects.push({
      //   pageContent: parsedContent.body,
      //   metadata: {name: entry.name},
      // });
    }
  }

  return mdObjects;
}

(async () => {
  try {
    const mdObjects = await crawlMdFiles(mdDirPath);
    const jsonContent = JSON.stringify(mdObjects, null, 2);
    await writeFile(outputPath, jsonContent);
    console.log(`Output written to ${outputPath}`);
  } catch (err) {
    console.error('Error:', err);
  }
})();