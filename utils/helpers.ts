// Convert File to Base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// JSON parser that revives Date strings into Date objects
export const dateReviver = (key: string, value: any) => {
  const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
  if (typeof value === "string" && dateFormat.test(value)) {
    return new Date(value);
  }
  return value;
};

// Compresser une image (optionnel pour économiser localStorage)
// Pour l'instant, on utilise le base64 brut, mais on pourrait resize ici via Canvas.