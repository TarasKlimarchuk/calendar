export const downloadFile = ({
  content,
  name,
  type,
}: {
  content: BlobPart;
  type: string;
  name: string;
}) => {
  const blob = new Blob([content], { type });

  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = name;

  downloadLink.click();
};

export const downloadJsonFile = ({
  content,
  name,
}: {
  content: string;
  name: string;
}) => {
  downloadFile({ content, name: name + '.json', type: 'application/json' });
};
