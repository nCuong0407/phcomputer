const imageTobase64 = async (image) => {
  if (!image || !(image instanceof Blob)) {
    throw new Error("Tham số không phải là một file hợp lệ");
  }

  const reader = new FileReader();
  reader.readAsDataURL(image);

  const data = await new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

  return data;
};

export default imageTobase64;
