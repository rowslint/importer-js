export interface Rowslint {
  launch: (rowslintConfig: RowslintConfig) => void;
}

export interface RowslintConfig {
  apiKey: string;
  config: RowslintTemplateConfig;
  file?: File;
  onImport?: (result: RowslintImportResult) => void;
}

export interface RowslintTemplateConfig {
  readonly templateKey: string;
  language?: 'en' | 'fr';
  returnType?: 'json' | 'xlsx' | 'csv';
  metadata?: unknown;
  customValidators?: RowslintTemplateCustomValidator;
}

export type RowslintTemplateCustomValidator = Record<
  string,
  (columnValue: unknown) =>
    | {
        message?: string;
        validationType?: 'choiceList' | 'text';
        validationOptions?: { list: Array<string | number> };
      }
    | true
>;

export interface RowslintImportResult {
  status: RowslintImportResultStatus;
  data?: {
    file?: File;
    rows?: Array<Record<string, unknown>>;
  };
  metadata?: {
    is_valid: boolean;
    file_name: string;
    sheet_name?: string;
  };
}

enum RowslintImportResultStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  CANCELLED = 'cancelled',
}
