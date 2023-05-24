import { JSDOM } from 'jsdom';

export const parseHTML = (html: string) => {
  const dom = new JSDOM(html);
  const { window } = dom;
  const { document } = window;
  return { window, document };
};
