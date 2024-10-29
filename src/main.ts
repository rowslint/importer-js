(() => {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@rowslint/importer@latest/browser/rowslint-element.js';
  script.type = 'module';
  document.head.appendChild(script);
})();

import { RowslintTemplateConfig, RowslintConfig, RowslintImportResult } from './models';

class RowslintElement extends HTMLElement {
  apiKey!: string;
  config!: RowslintTemplateConfig;
  file?: File | null;
  onImport?: (result: RowslintImportResult) => void;
}

export const launchRowslint = (configWrapper: RowslintConfig) => {
  if (!configWrapper.apiKey) {
    throw new Error(
      'No API key provided to Rowslint. You may have forgotten to provide a valid API key to finish initializing Rowslint.',
    );
  }

  const rowslintElement = document.createElement('rowslint-element') as RowslintElement;
  rowslintElement.apiKey = configWrapper.apiKey;
  rowslintElement.config = configWrapper.config;
  rowslintElement.file = configWrapper.file ?? null;
  rowslintElement.addEventListener('import', function handler(event) {
    const customEvent = event as CustomEvent<RowslintImportResult>;
    configWrapper.onImport?.(customEvent.detail);
    destroy();
    window.removeEventListener('import', handler, false);
  });

  document.body.appendChild(rowslintElement);
};

const destroy = () => {
  const rowslintElement = document.querySelector('rowslint-element');
  rowslintElement?.remove();
};
