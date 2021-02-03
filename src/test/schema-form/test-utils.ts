import SchemaForm from './ui/schema-form/schema-form';

export function createSchemaForm({
  schema,
  formData,
  onSubmit,
}: {
  schema: Record<string, unknown>;
  formData?: unknown;
  onSubmit?: () => void;
}): { schemaForm: SchemaForm; node: Element } {
  const schemaForm = new SchemaForm(schema, 'test', 'test', formData, onSubmit);
  const node = schemaForm.render();
  return { schemaForm, node };
}

export function fireEvent(element: Element, event: string): boolean {
  const evt = document.createEvent('HTMLEvents');
  evt.initEvent(event, true, true);
  return !element.dispatchEvent(evt);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function makeUndefined(): void {}
