import { RowslintTemplateConfig, RowslintConfig, RowslintImportResult } from './models';

class RowslintElement extends HTMLElement {
  apiKey!: string;
  config!: RowslintTemplateConfig;
  file?: File | null;
  showButton?: boolean;
  onImport?: (result: RowslintImportResult) => void;
}

export const launch = (configWrapper: RowslintConfig) => {
  if (!configWrapper.apiKey) {
    throw new Error(
      'No API key provided to Rowslint. You may have forgotten to provide a valid API key to finish initializing Rowslint.',
    );
  }

  const rowslintElement = document.createElement('rowslint-element') as RowslintElement;
  rowslintElement.apiKey = configWrapper.apiKey;
  rowslintElement.config = configWrapper.config;
  rowslintElement.file = configWrapper.file ?? null;
  rowslintElement.showButton = false;
  rowslintElement.addEventListener('import', function handler(event) {
    const customEvent = event as CustomEvent<RowslintImportResult>;
    configWrapper.onImport?.(customEvent.detail);
    destroy();
    window.removeEventListener('import', handler, false);
  });

  document.body.appendChild(rowslintElement);
};

const destroy = () => {
  const rowslintElement = document.querySelector('rowslint-button');
  rowslintElement?.remove();
};
