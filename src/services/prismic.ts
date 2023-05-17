import * as prismic from "@prismicio/client";

export const createClient = (config = {}) => {
  const client = prismic.createClient('ignews1315', {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });

  return client;
}
