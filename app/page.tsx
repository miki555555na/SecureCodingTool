'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '60px 20px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* タイトル */}
        <h1 style={{ fontSize: 48, fontWeight: 900, color: '#fff', textAlign: 'center', margin: '0 0 24px 0' }}>
          🔒 セキュアコーディング道場
        </h1>
        <p style={{ fontSize: 20, color: '#e0e7ff', textAlign: 'center', marginBottom: 40 }}>
          「セキュアコーディング？コーディング規約？必要なの？」<br />
          実際の脆弱性を体験して、セキュリティの重要性を学ぼう
        </p>

        {/* 導入セクション */}
        <Card style={{ marginBottom: 32, background: '#fff', border: 'none', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <CardHeader>
            <CardTitle style={{ fontSize: 28 }}>なぜこのツールが必要？</CardTitle>
            <CardDescription style={{ fontSize: 16 }}>
              新卒エンジニアが直面する現実
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div style={{ padding: 16, background: '#fee2e2', borderRadius: 8, borderLeft: '4px solid #ef4444' }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#dc2626' }}>❌ よくある思い込み</p>
              <p style={{ margin: '8px 0 0 0', color: '#991b1b' }}>
                「セキュアコーディングなんて、できるようになってから考えればいいだろう」<br />
                「コーディング規約？web設計では起きないだろう」
              </p>
            </div>

            <div style={{ padding: 16, background: '#dcfce7', borderRadius: 8, borderLeft: '4px solid #16a34a' }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#15803d' }}>✅ 実際の危険性</p>
              <p style={{ margin: '8px 0 0 0', color: '#166534' }}>
                たった1行のコードの間違いが、全社のデータを流出させる脆弱性になることも。<br />
                実例を通じて、セキュリティの重要性を「体験」することができます。
              </p>
            </div>
          </CardContent>
        </Card>
        <Card style={{ marginBottom: 32, background: '#fff', border: 'none', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
  <CardHeader>
    <CardTitle style={{ fontSize: 28 }}>学習のゴール</CardTitle>
    <CardDescription style={{ fontSize: 16 }}>
      セキュリティに詳しくない Web エンジニアが、実践的に「なぜ脆弱性が起きるのか」と「どう対策するか」を理解できるようにする
    </CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 16, lineHeight: 1.8 }}>
      <li><b>対象：</b>セキュリティに詳しくない新卒〜若手 Web エンジニア</li>
      <li><b>到達目標：</b>脆弱なコードを見分け、原因を説明し、基本的な対策を自力で適用できる</li>
      <li><b>学習で得られること：</b>実行ベースのデモで脆弱性を体感→差分を理解→安全実装で検証することで“感覚”と“知識”を同時に定着</li>
      <li><b>学習フロー：</b>①脆弱版を実行 → ②観察（時間差・挙動）→ ③安全版で比較 → ④ポイント確認</li>
    </ul>
  </CardContent>
</Card>

        {/* バックエンド・フロントエンド選択 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* バックエンド */}
          <Card style={{ background: '#f8fafc', border: '2px solid #3b82f6' }}>
            <CardHeader>
              <CardTitle style={{ fontSize: 24, color: '#1e40af' }}>🔧 バックエンド脆弱性</CardTitle>
              <CardDescription>
                サーバーサイドエンジニア向け
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul style={{ fontSize: 15, marginLeft: 18, lineHeight: 1.8 }}>
                <li>認可チェックの不備</li>
                <li>SQLインジェクション</li>
                <li>パスワード検証時の早期リターン</li>
                <li>HMAC検証時の早期リターン</li>
                <li>ユーザー存在確認の時間差</li>
              </ul>
              <Link href="/Backend">
                <Button style={{ width: '100%', background: '#3b82f6', color: '#fff', marginTop: 16 }}>
                  バックエンドコースを始める →
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* フロントエンド */}
          <Card style={{ background: '#faf8f3', border: '2px solid #f59e0b' }}>
            <CardHeader>
              <CardTitle style={{ fontSize: 24, color: '#92400e' }}>🎨 フロントエンド脆弱性</CardTitle>
              <CardDescription>
                クライアントサイドエンジニア向け
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul style={{ fontSize: 15, marginLeft: 18, lineHeight: 1.8 }}>
                <li>ハードコードされた秘密鍵</li>
                <li>XSS（クロスサイトスクリプティング）</li>
                <li>ブラウザキャッシュの時間差</li>
                <li>リソース読み込み時間差</li>
              </ul>
              <Link href="/Frontend">
                <Button style={{ width: '100%', background: '#f59e0b', color: '#fff', marginTop: 16 }}>
                  フロントエンドコースを始める →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}