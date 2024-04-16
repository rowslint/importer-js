# @rowslint/importer-js

The Rowslint JavaScript script provides access to the prebuilt importer component. The package interacts directly with the Rowslint APIs using your API key.

## Usage

Include a script tag with the import statement pointing to the CDN URL where the `@rowslint/importer-js` package is hosted:

```jsx
<script src="https://cdn.jsdelivr.net/npm/@rowslint/importer-js@latest/dist/rowslint.js"></script>
```

Import TypeScript interfaces from the `@rowslint/importer-js/dist/models/importer.model` path if you are using TypeScript:

```ts
import { RowslintConfig } from '@rowslint/importer-js/dist/models/importer.model';
```

Call the `launch()` method with the organization API key and the template key parameters to display the importer UI.

```jsx
<script>
  const launch = () => {
    rowslint.launch({
      // Your organization API key here.
      apiKey: "ORGANIZATION_API_KEY",
      config: {
        // Your template key here.
        templateKey: "TEMPLATE_KEY"
      }
    });
  }
</script>

<button onclick="launch()">Launch</button>
```

#### Headless UI

You can also use your custom upload UI and then use Rowslint importer only to format and validate data (this will display the import modal without the first upload step). To do so, call the `launch()` method with the uploaded XLSX or CSV file (in `File` type).

```jsx
rowslint.launch({
  apiKey: 'ORGANIZATION_API_KEY',
  config: {
    templateKey: 'TEMPLATE_KEY',
    // `inputFile` in `file` type.
    file: inputFile,
  },
});
```

### Events

The `launch()` method provide a callback parameter which is triggered on the importer modal closes. You can use it to handle the closing of the importer after the import has been completed.

```jsx
rowslint.launch({
  apiKey: 'ORGANIZATION_API_KEY',
  config: { templateKey: 'TEMPLATE_KEY' },
  onImport: (result) => {
    switch (result.status) {
      case 'success':
        // Handle spreadsheet import success.
        break;
      case 'error':
        // Handle spreadsheet import error.
        break;
      case 'cancelled':
        // Handle spreadsheet import cancel.
        break;
    }
  },
});
```

## Parameters

The `launch()` method take one object parameter with 4 properties:

| Name     | Type                                     | Required | Description                                                                                                           |
| -------- | ---------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| apiKey   | `string`                                 | required | The organization API key. Can be found in the organization page.                                                      |
| config   | `RowslintTemplateConfig`                 | required | Represents the configuration of each template importer.                                                               |
| file     | `File`                                   | optional | The uploaded XLSX or CSV file. Used to display the importer modal in the headless mode without the first upload step. |
| onImport | `(result: RowslintImportResult) => void` | optional | A callback that represents the return of the importer after the modal is closed.                                      |

### `RowslintTemplateConfig`

#### Description

Represents the configuration of each template importer.

#### Properties

| name             | type                              | required | default | description                                                                                                                                                                                            |
| ---------------- | --------------------------------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| templateKey      | `string`                          | required |         | The template key. Can be found in the template detail/edit page.                                                                                                                                       |
| language         | `'en' \| 'fr'`                    | optional | 'en'    | The language to be used in the importer.                                                                                                                                                               |
| returnType       | `'json'  \|  'xslx'  \|  'csv'`   | optional | 'json'  | the data format that the import will return.                                                                                                                                                           |
| metadata         | `unknown`                         | optional |         | Additional data if you would like to send specific data to your server according to the configuration of the destination template (e.g. logged-in user data: `user_id`...). Can hold any type of data. |
| customValidators | `RowslintTemplateCustomValidator` | optional |         | Object to handle custom validations from your code.                                                                                                                                                    |

### `RowslintImportResult`

#### Description

Represents the return of the importer after the modal is closed.

#### Properties

| name     | type                                                            | required | default | description                                                                                                                                                                     |
| -------- | --------------------------------------------------------------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| status   | `'success' \| 'error' \| 'cancelled'`                           | required |         | `'success'` if import completed successfully, else `'error'`. `'cancelled'` if the user quits without completing the import steps.                                              |
| data     | `{ file?: File; rows?: Array<Record<string, unknown>>; }`       | optional |         | Return the imported file in the `file` property or the JSON data format in the `row` property according to the `returnType` property of the `RowslintTemplateConfig` interface. |
| metadata | `{ is_valid: boolean; file_name: string; sheet_name: string; }` | optional |         | Holds the uploaded file information and the `is_valide` propperty which is `true` when the file is imported respecting all template validations, otherwise `else`.              |

## Examples

### Importer UI

This example demonstrates how to use the importer by displaying the importer UI and listening on the event when the import process is complete.

```jsx
<body>
  <script src="https://cdn.jsdelivr.net/npm/@rowslint/importer-js@latest/dist/rowslint.js"></script>
  <script>
    const launch = () => {
      rowslint.launch({
        apiKey: 'ORGANIZATION_API_KEY',
        config: {
          templateKey: 'TEMPLATE_KEY',
          returnType: 'json'
        },
        onImport: (result) => {
          if (result.status === 'success' && result.metadata?.is_valid) {
            // Continue the import process.
          }
        },
      });
    };
  </script>

  <button onclick="launch()">Launch</button>
</body>
```

### Headless importer UI

In this example, we will use the importer in the headless mode without the first upload step. To do so, we will use our custom file input field to upload the file, then we will set it to the importer.

```jsx
<body>
  <script src="https://cdn.jsdelivr.net/npm/@rowslint/importer-js@latest/dist/rowslint.js"></script>
  <script>
    const launch = () => {
      const inputFile = document.getElementById('file');
      rowslint.launch({
        apiKey: 'ORGANIZATION_API_KEY',
        config: {
          templateKey: 'TEMPLATE_KEY',
          returnType: 'xslx',
        },
        file: inputFile.files[0],
        onImport: (result) => {
          // Continue the import process.
        },
      });
    };
  </script>

  <input id="file" type="file" />
  <button onclick="launch()">Launch</button>
</body>
```

### Custom validations

We can define a custom configuration of validations from the code. Let's say our template has a "firstname" column. In this example, we will customize the validation of this column to accept only values starting with the letter "A".

```jsx
<body>
  <script src="https://cdn.jsdelivr.net/npm/@rowslint/importer-js@latest/dist/rowslint.js"></script>
  <script>
    const launch = () => {
      rowslint.launch({
        apiKey: 'ORGANIZATION_API_KEY',
        config: {
          templateKey: 'TEMPLATE_KEY'
        },
        customValidators: {
          'firstname': (columnValue) => {
            if (typeof columnValue === 'string' && columnValue.startsWith('A')) {
              // Return `true` if the value is valid.
              return true;
            }
            // Return custom message if the value is invalid.
            return {
              message: 'Must start with the letter "A".',
            };
          },
        },
        onImport: (result) => {
          // Continue the import process.
        },
      });
    };
  </script>

  <button onclick="launch()">Launch</button>
</body>
```

Note that:

- `firstname` property is the column name and must already be added to the template columns.
- By defining a column custom validation, this will override the column validation type already defined in the template edition page.

We can also return a list of valid values to be displayed in a select field.

```jsx
<body>
  <script src="https://cdn.jsdelivr.net/npm/@rowslint/importer-js@latest/dist/rowslint.js"></script>
  <script>
    const validValues = ['A', 'B'];
    const launch = () => {
      rowslint.launch({
        apiKey: 'ORGANIZATION_API_KEY',
        config: {
          templateKey: 'TEMPLATE_KEY'
        },
        customValidators: {
          'firstname': (columnValue) => {
            if (typeof columnValue === 'string' && validValues.includes(columnValue)) {
              // Return `true` if the value is valid.
              return true;
            }
            // Return custom message if the value is invalid.
            return {
              message: 'Must be "A" or "B".',
              validationType: 'choiceList',
              validationOptions: {
                list: validValues,
            },
          };
          }
        },
        onImport: (result) => {
          // Continue the import process.
        },
      });
    };
  </script>

  <button onclick="launch()">Launch</button>
</body>
```

## Documentation

To see the latest documentation, [please click here](https://docs.rowslint.dev)
