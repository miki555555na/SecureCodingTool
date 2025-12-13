'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e293b 0%, #312e81 100%)', padding: '60px 20px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* タイトル */}
        <h1 style={{ fontSize: 46, fontWeight: 900, color: '#fff', textAlign: 'center', margin: '0 0 20px 0' }}>
          実例で気づく セキュリティ落とし穴体験
        </h1>
        <p style={{ fontSize: 20, color: '#e0e7ff', textAlign: 'center', marginBottom: 40 }}>
          「あとで学べばいい」「規約は正直ピンとこない」<br />
          その感覚のまま書いたコードが、どう壊されるのかを先に体験しよう
        </p>

        {/* 導入セクション */}
        <Card style={{ marginBottom: 32, background: '#fff', border: 'none', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <CardHeader>
            <CardTitle style={{ fontSize: 28 }}>このツールは何のため？</CardTitle>
            <CardDescription style={{ fontSize: 16 }}>
              セキュリティ研修の「前」に使う理由
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div style={{ padding: 16, background: '#fee2e2', borderRadius: 8, borderLeft: '4px solid #ef4444' }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#dc2626' }}>❌ 研修前によくある状態</p>
              <p style={{ margin: '8px 0 0 0', color: '#991b1b' }}>
                「セキュリティは難しそう」<br />
                「とりあえず研修を受ければいい」<br />
                「規約は量が多くて、読む前に疲れる」
              </p>
            </div>

            <div style={{ padding: 16, background: '#dcfce7', borderRadius: 8, borderLeft: '4px solid #16a34a' }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#15803d' }}>✅ このツールで起きる変化</p>
              <p style={{ margin: '8px 0 0 0', color: '#166534' }}>
                自分が書きがちなコードが、実際にどう悪用されるかを目で見て体験。<br />
                セキュリティを「他人事のルール」ではなく、
                <b>「自分のコードが引き起こす現実的なリスク」</b>として理解できます。
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 学習ゴール */}
        <Card style={{ marginBottom: 32, background: '#fff', border: 'none', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <CardHeader>
            <CardTitle style={{ fontSize: 28 }}>この体験で得られること</CardTitle>
            <CardDescription style={{ fontSize: 16 }}>
              知識を学ぶ前に、危機感と納得感をつくる
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 16, lineHeight: 1.8 }}>
              <li><b>対象：</b>新卒〜若手 Web エンジニア（フロントエンド / バックエンド）</li>
              <li><b>目的：</b>「なぜ守らないと危険なのか」を説明なしでも実感できる状態になる</li>
              <li><b>学び方：</b>脆弱な実装を実行 → 悪用される様子を観察 → 安全な実装と比較</li>
              <li><b>次につながる：</b>その後のセキュリティ研修や規約が「意味のある情報」として読めるようになる</li>
            </ul>
          </CardContent>
        </Card>

        {/* バックエンド・フロントエンド選択 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* バックエンド */}
          <Card style={{ background: '#f8fafc', border: '2px solid #3b82f6' }}>
            <CardHeader>
              <CardTitle style={{ fontSize: 24, color: '#1e40af' }}>バックエンド編</CardTitle>
              <CardDescription>
                サーバー側の「やりがちミス」を体験
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul style={{ fontSize: 15, marginLeft: 18, lineHeight: 1.8 }}>
                <li>認可チェック漏れによる情報閲覧</li>
                <li>SQLインジェクションの実例</li>
                <li>パスワード比較の時間差</li>
                <li>HMAC検証の早期リターン</li>
                <li>ユーザー存在有無の推測</li>
              </ul>
              <Link href="/Backend">
                <Button style={{ width: '100%', background: '#3b82f6', color: '#fff', marginTop: 16 }}>
                  バックエンド体験を始める →
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* フロントエンド */}
          <Card style={{ background: '#faf8f3', border: '2px solid #f59e0b' }}>
            <CardHeader>
              <CardTitle style={{ fontSize: 24, color: '#92400e' }}>フロントエンド編</CardTitle>
              <CardDescription>
                クライアント側でも起きる危険
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul style={{ fontSize: 15, marginLeft: 18, lineHeight: 1.8 }}>
                <li>コードに埋め込まれた秘密情報</li>
                <li>XSS によるスクリプト実行</li>
                <li>キャッシュ挙動の悪用</li>
                <li>読み込み時間差からの情報推測</li>
              </ul>
              <Link href="/Frontend">
                <Button style={{ width: '100%', background: '#f59e0b', color: '#fff', marginTop: 16 }}>
                  フロントエンド体験を始める →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
