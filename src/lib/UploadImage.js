/**
 * ImgBB API-তে ইমেজ ফাইল আপলোড করার ফাংশন
 * @param {File} file - ইনপুট ফিল্ড থেকে পাওয়া ইমেজ ফাইল অবজেক্ট
 * @returns {Promise<string>} - আপলোড হওয়া ইমেজের সরাসরি URL
 */
export const uploadImageToImgBB = async (file) => {
  if (!file || file.size === 0) {
    throw new Error("No image file provided");
  }

  const apiKey = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!apiKey) {
    throw new Error("ImgBB API key is missing in environment variables");
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      return result.data.url; // ImgBB থেকে পাওয়া সরাসরি ইমেজ লিংক
    } else {
      throw new Error(result.error?.message || "ImgBB upload failed");
    }
  } catch (error) {
    console.error("Error uploading image to ImgBB:", error);
    throw error;
  }
};