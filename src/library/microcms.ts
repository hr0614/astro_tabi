// SDK利用準備
import type { MicroCMSQueries, MicroCMSListContent } from "microcms-js-sdk";
import { createClient } from "microcms-js-sdk";

const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.PUBLIC_MICROCMS_API_KEY,
});

//IllustAPI
// 型定義
export type Illust = {
  image?: {
    url: string
  },
  category: string[],
  comment: string[],
} & MicroCMSListContent;

// APIの呼び出し
export const getIllust = async (queries?: MicroCMSQueries) => {
  return await client.getList<Illust[]>({ endpoint: "gallery", queries });
};

//InfoAPI
type Article = {
  title: string,
  thumbnail?: {
    url: string
  },
  publishedAt: string,
  category: string[],
}

export const getArticles = async (queries?: MicroCMSQueries) => {
  return await client.getList<Article[]>({ endpoint: "info", queries });
};
