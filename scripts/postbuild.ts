import axios from 'axios';
import { writeFile, readFile } from 'fs/promises';

const ROWSLINT_ELEMENT_URL = 'https://cdn.jsdelivr.net/npm/@rowslint/importer@latest/browser/rowslint-element.js';

const concatRowslintElement = async () => {
  try {
    const rowslintResp = await axios.get(ROWSLINT_ELEMENT_URL);
    const rowslint = rowslintResp.data;

    const bundle = await readFile('dist/rowslint.umd.cjs', 'utf-8');
    const concatenatedBundle = `${bundle}\n${rowslint}`;
    await writeFile('dist/rowslint.js', concatenatedBundle, 'utf-8');

    console.info('Rowslint element has been successfully concatenated.');
  } catch (err) {
    console.error('An error occurred during downloading or concatenation of the Rowslint element:', err);
  }
};

concatRowslintElement();
