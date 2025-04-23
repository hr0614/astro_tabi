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
  content?: string,
  publishedAt: string,
  category: string[],
}

export const ArticleList = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // ページネーション用
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const articlesPerPage = 5; // 1ページあたりの表示件数

  // コンポーネントマウント時に一度だけURLパラメータを取得
  useEffect(() => {
    // URLからクエリパラメータを取得
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    const pageParam = params.get('page');

    console.log("初期カテゴリーパラメータ:", categoryParam);
    console.log("初期ページパラメータ:", pageParam);

    setCategory(categoryParam);
    setCurrentPage(pageParam ? parseInt(pageParam) : 1);
    setInitialized(true);

    // URLパラメータが変更された時にも再取得できるように
    // popstateイベントをリッスン
    const handlePopState = () => {
      const newParams = new URLSearchParams(window.location.search);
      const newCategoryParam = newParams.get('category');
      const newPageParam = newParams.get('page');

      console.log("popstate後のカテゴリーパラメータ:", newCategoryParam);
      console.log("popstate後のページパラメータ:", newPageParam);

      setCategory(newCategoryParam);
      setCurrentPage(newPageParam ? parseInt(newPageParam) : 1);
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

    console.log("フェッチ開始、現在のカテゴリー:", category, "現在のページ:", currentPage);

    const fetchArticles = async () => {
      setLoading(true);

      try {
        // エンドポイント構築
        let endpoint = "https://hari-test.microcms.io/api/v1/info";
        const queryParams = [];

        // カテゴリーフィルター適用
        if (category && category.trim() !== "") {
          queryParams.push(`filters=category[contains]${category}`);
        }

        // ページネーション情報を追加
        queryParams.push(`limit=${articlesPerPage}`);
        queryParams.push(`offset=${(currentPage - 1) * articlesPerPage}`);

        // クエリパラメーターがある場合は追加
        if (queryParams.length > 0) {
          endpoint += `?${queryParams.join('&')}`;
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

        // 総ページ数を計算
        const total = data.totalCount || 0;
        const pages = Math.ceil(total / articlesPerPage);
        setTotalPages(pages > 0 ? pages : 1);

      } catch (error) {
        console.error("記事データの取得に失敗しました", error);
        setArticles([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [category, currentPage, initialized]); // カテゴリーまたはページが変更されたときに実行

  // ページ変更ハンドラー
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    // URLのページパラメータを更新
    const url = new URL(window.location.href);
    url.searchParams.set('page', page.toString());
    window.history.pushState({}, '', url.toString());

    // ページ状態を更新
    setCurrentPage(page);

    // ページトップにスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // HTMLからプレーンテキストを抽出
  const getPlainTextFromHTML = (html: string) => {
    // 一時的なdiv要素を作成してHTMLを設定
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    // テキスト内容を取得
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  // 本文の抜粋を生成
  const createExcerpt = (content: string | undefined, maxLength: number = 80) => {
    if (!content) return '';

    // HTMLからプレーンテキストを抽出
    const plainText = getPlainTextFromHTML(content);

    // 指定した長さで切り詰め
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };

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

  // ページネーションコンポーネント
  const Pagination = () => {
    // 表示するページボタンの数を制限
    const maxPageButtons = 5;
    const halfMaxButtons = Math.floor(maxPageButtons / 2);

    let startPage = Math.max(1, currentPage - halfMaxButtons);
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    // ページボタンが最大数に満たない場合、範囲を調整
    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    const pageNumbers = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );

    return (
      <div className={s.pagination}>
        <button
          className={`${s.pageButton} ${s.prevNext}`}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>

        {startPage > 1 && (
          <>
            <button
              className={`${s.pageButton} ${currentPage === 1 ? s.active : ''}`}
              onClick={() => handlePageChange(1)}
            >
              1
            </button>
            {startPage > 2 && <span className={s.ellipsis}>...</span>}
          </>
        )}

        {pageNumbers.map(page => (
          <button
            key={page}
            className={`${s.pageButton} ${currentPage === page ? s.active : ''}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className={s.ellipsis}>...</span>}
            <button
              className={`${s.pageButton} ${currentPage === totalPages ? s.active : ''}`}
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          className={`${s.pageButton} ${s.prevNext}`}
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    );
  };

  return (
    <div className={s.container}>
      {loading ? (
        <div className={s.loading}>読み込み中...</div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.ul
              key={`${category || 'all'}-page-${currentPage}`} // カテゴリーまたはページ変更時に完全に再レンダリング
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
                        excerpt={createExcerpt(article.content)}
                      />
                    </a>
                  </motion.li>
                ))
              ) : (
                <div className={s.noResults}>該当する記事が見つかりませんでした</div>
              )}
            </motion.ul>
          </AnimatePresence>

          {articles.length > 0 && totalPages > 1 && <Pagination />}
        </>
      )}
    </div>
  );
}; 