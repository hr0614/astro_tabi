import React, { useState, useEffect } from 'react';
import InfoItem from "../../partial/topContents/infoContents/InfoItem";
import { motion, AnimatePresence } from "framer-motion";
import s from "./articleList.module.css";

type Article = {
  id: string,
  title: string,
  thumbnail?: {
    url: string
  },
  publishedAt: string,
  category: string[],
}

export const ArticleList = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // コンポーネントマウント時に一度だけURLパラメータを取得
  useEffect(() => {
    // URLからクエリパラメータを取得
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    console.log("初期カテゴリーパラメータ:", categoryParam);
    setCategory(categoryParam);
    setInitialized(true);

    // URLパラメータが変更された時にも再取得できるように
    // popstateイベントをリッスン
    const handlePopState = () => {
      const newParams = new URLSearchParams(window.location.search);
      const newCategoryParam = newParams.get('category');
      console.log("popstate後のカテゴリーパラメータ:", newCategoryParam);
      setCategory(newCategoryParam);
    };

    window.addEventListener('popstate', handlePopState);

    // クリーンアップ関数
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // データ取得処理
  useEffect(() => {
    // 初期化前は何もしない
    if (!initialized) return;

    console.log("フェッチ開始、現在のカテゴリー:", category);

    const fetchArticles = async () => {
      setLoading(true);

      try {
        // エンドポイント構築
        let endpoint = "https://hari-test.microcms.io/api/v1/info";

        // カテゴリーフィルター適用（カテゴリーが存在し、空文字列でない場合のみ）
        if (category && category.trim() !== "") {
          endpoint += `?filters=category[contains]${category}`;
        }

        console.log("フェッチするエンドポイント:", endpoint);

        const res = await fetch(endpoint, {
          headers: {
            "X-MICROCMS-API-KEY": import.meta.env.PUBLIC_MICROCMS_API_KEY || '',
          },
        });

        if (!res.ok) {
          throw new Error(`APIエラー: ${res.status}`);
        }

        const data = await res.json();
        console.log("取得データ:", data);
        setArticles(data.contents || []);
      } catch (error) {
        console.error("記事データの取得に失敗しました", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [category, initialized]); // categoryが変更されたときだけ実行

  // アニメーションの設定
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className={s.container}>
      {loading ? (
        <div className={s.loading}>読み込み中...</div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.ul
            key={category || 'all'} // カテゴリー変更時に完全に再レンダリング
            className={s.articleList}
            variants={container}
            initial="hidden"
            animate="show"
          >
            {articles && articles.length > 0 ? (
              articles.map((article, index) => (
                <motion.li key={article.id} className={s.articleItem} variants={item}>
                  <a href={`/info/${article.id}`} className={s.articleLink}>
                    <InfoItem
                      title={article.title}
                      imageUrl={article.thumbnail?.url}
                      date={article.publishedAt}
                      category={article.category[0]}
                    />
                  </a>
                </motion.li>
              ))
            ) : (
              <div className={s.noResults}>該当する記事が見つかりませんでした</div>
            )}
          </motion.ul>
        </AnimatePresence>
      )}
    </div>
  );
}; 