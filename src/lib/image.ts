import axios from 'axios';
import mime from 'mime';

/**
 * Fetch image data with metadata
 */
export const fetchImageWithMetadata = async (url: string): Promise<[Buffer, string, string]> => {
  const { headers, data } = await axios.get<string>(url, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(data, 'binary');
  const mimeType: string = headers['Content-Type'] || headers['content-type'];
  const extension = mime.getExtension(mimeType) || 'jpg';
  return [buffer, mimeType, extension];
};
