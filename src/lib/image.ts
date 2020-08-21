import axios from 'axios';
import mime from 'mime';

/**
 * Fetch image data with metadata
 * 
 * @async
 * @param {string} url
 * @returns {Promise<[Buffer, string, string]>} image binary data, mime type and extension
 */
export const fetchImageWithMetadata = async (url: string): Promise<[Buffer, string, string]> => {
  const { headers, data } = await axios.get<string>(url, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(data, 'binary');
  const mimeType: string = headers['Content-Type'] || headers['content-type'];
  const extension = mime.getExtension(mimeType) || 'jpg';
  return [buffer, mimeType, extension];
};
