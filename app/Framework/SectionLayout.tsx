"use client";
import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { styles } from './SectionStyles';

type Props = {
  title1: React.ReactNode;        // ページタイトル
  title2?: React.ReactNode;       // サブタイトル
  description?: React.ReactNode;  // ページ説明
  checklist?: React.ReactNode;    // やることリスト
  children: React.ReactNode;      // Section 内のコンテンツ
  summary?: React.ReactNode;      // まとめ
  framed?: boolean;               // children を枠で囲むか
  nav?: React.ReactNode;          // ナビゲーション要素
};

export default function SectionLayout({
  title1,
  title2,
  description,
  checklist,
  children,
  summary,
  framed = true,
  nav,
}: Props) {
  const containerRef = useRef<HTMLElement | null>(null);

  const pathname = usePathname();
  const segments = pathname ? pathname.split('/').filter(Boolean) : [];

  const topSegment = segments[0] || '';
  const isTopOfSegment = segments.length === 1;

  let backHref = '/';
  let backLabel = '章一覧に戻る';
  if (topSegment === 'Backend') {
    backHref = isTopOfSegment ? '/' : '/Backend';
    backLabel = isTopOfSegment ? 'トップページに戻る' : '章一覧に戻る';
  } else if (topSegment === 'Frontend') {
    backHref = isTopOfSegment ? '/' : '/Frontend';
    backLabel = isTopOfSegment ? 'トップページに戻る' : '章一覧に戻る';
  }

  return (
    <main style={styles.page} ref={containerRef}>
      {/* ▼ やることリスト */}
        {checklist && (
          <div style={styles.todoWrapper}>
          <section
            style={{
              ...styles.section,
              background: 'transparent',
              border: 'none',
              marginBottom: 0,
              marginTop: 0,
              padding: 0,
            }}
          >
            {checklist}
          </section>
        </div>
      )}
      {/* ▲ やることリスト */}

      <header style={styles.header}>
        <div style={{ padding: 24 }}>
          {/* ★ 戻るボタン：左寄せ固定（親が中央寄せでも影響を受けにくい） */}
          {nav && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: 10,
              }}
            >
              {nav}
            </div>
          )}

          {/* タイトル類（ここは styles.h1/h2 の方針に従う） */}
          <h1 style={styles.h1}>{title1}</h1>
          {title2 && <h2 style={styles.h2}>{title2}</h2>}
        </div>
      </header>

      {description && <div style={styles.description}>{description}</div>}

      {/* ▼ 各 Section の本体 */}
        <section
          style={
            framed
            ? { ...styles.section }
            : { marginBottom: 26, padding: 0, border: 'none', background: 'transparent' }
          }
        >
          {children}
        </section>
      {/* ▲ Section内容 */}

      <br />

      {/* ▼ まとめセクション */}
      {summary && <div style={{ ...styles.summary }}>{summary}</div>}
      {/* ▲ まとめここまで */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
        <Link href={backHref}>
          <Button variant="outline" size="sm" className="font-mono">
            {backLabel}
          </Button>
        </Link>
      </div>
    </main>
  );
}

