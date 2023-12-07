export const uploadFile = (accept: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = accept;

    fileInput.addEventListener('change', (event) => {
      handleFileSelect(event).then(resolve).catch(reject);
    });

    fileInput.click();
  });
};

const handleFileSelect = (event: Event): Promise<any> => {
  return new Promise((resolve, reject) => {
    const target = event.target as HTMLInputElement;

    if (target.files && target.files.length > 0) {
      const file = target.files[0];

      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const fileContent = event.target?.result as string;

          const jsonData = JSON.parse(fileContent);

          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };

      reader.readAsText(file);
    } else {
      reject(new Error('Please select a file before uploading.'));
    }
  });
};
