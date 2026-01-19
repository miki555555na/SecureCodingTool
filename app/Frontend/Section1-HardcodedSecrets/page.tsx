'use client';

import React from 'react';
import SectionLayout from '../../Framework/SectionLayout';
import { styles } from '../../Framework/SectionStyles';
import { HardCordDemo } from './HardCordDemo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HardCordPage() {

  const description = (
  <p className="text-lg font-medium">
    フロントエンドの実装では、
    <b>「ちょっとしたつもり」で秘密情報をコードに書いてしまう</b>ことがあります。
    <br />
    しかしブラウザで動くコードは、
    <span className="bg-yellow-100 px-1 rounded">誰でも中身を見られる</span>という前提を忘れてはいけません。
    <br />
    この章では、
    「うっかり書いたキーがどうやって見つかるのか」を
    実際に体験します。
  </p>
);


  const checklist = (
    <Card
      style={{
        border: '2px solid #fed7aeff',
        boxShadow: '0 2px 8px #0001',
        background: '#fbf1e2ff',
      }}
    >
      <CardHeader style={{ paddingBottom: 3 }}>
        <CardTitle style={{ fontSize: 17, marginTop: 0 }}>
          📝 1章の見どころ
        </CardTitle>
      </CardHeader>
      <CardContent style={{ paddingTop: 0 }}>
        <ul style={{ fontSize: 15, marginLeft: 18, marginBottom: 0 }}>
          <li>
            ・なぜ、コードに書いただけで秘密情報がバレてしまう？
          </li>
          <li>
            ・「隠したつもり」の環境変数は、本当に安全？
          </li>
          <li>
            ・ブラウザの開発者ツールを使って、隠されたキーを探してみよう
          </li>
          <br />
          <ul style={{ fontSize: 16, marginTop: 5 }}>
            <b>→ 実際に動かしながら確認します</b>
          </ul>
        </ul>
      </CardContent>
    </Card>
  );

  const summary = (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          1章のまとめ
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 text-sm">
        <div
          className="rounded-md border p-4"
          style={{
            border: '2px solid #fed7aeff',
            background: '#fbf1e2ff'
          }}
        >
          <p className="font-semibold mb-3 text-slate-800" style={{ fontSize: 16 }}>
            この章のポイントを振り返りましょう
          </p>

          <ul className="space-y-2 text-gray-700">
            <li>
              <b>Q.</b> フロントエンドのコードにAPIキーを書いてもいい？
              <br />
              <span className="ml-4">
                <b>→ No.</b> ブラウザに配信されるコードは全て公開情報です。必ず漏洩します。
              </span>
            </li>

            <li>
              <b>Q.</b> 環境変数 (NEXT_PUBLIC_...) なら安全？
              <br />
              <span className="ml-4">
                <b>→ No.</b> 接頭辞がついた環境変数はビルド時にコードに埋め込まれるため、やはり丸見えです。
              </span>
            </li>

            <li>
              <b>Q.</b> どう管理すべき？
              <br />
              <span className="ml-4">
                <b>→ </b> 秘密情報は<b>サーバー側（バックエンド）</b>だけで管理し、フロントエンドからはプロキシ経由でアクセスさせます。
              </span>
            </li>
          </ul>
        </div>

        <div
          className="rounded-md bg-white p-4 text-gray-800"
          style={{ lineHeight: 1.8 }}
        >
          <p style={{ fontSize: 16 }}>
            この章で体験したように、
            <b>「ブラウザで動くコード」＝「世界中に公開しているコード」</b>
            という認識を持つことが重要です。
          </p>

          <p style={{ fontSize: 16, marginTop: 12 }}>
            コメントアウトしたつもりでも、難読化したつもりでも、
            攻撃者はツールを使って簡単に元の情報を取り出せます。
          </p>

          <div className="mt-4 pt-3 border-t text-gray-700 font-medium">
            秘密情報は、絶対に
            <b>クライアント（ユーザーの手元）</b>
            には渡さない。
            <br />
            これがフロントエンドセキュリティの鉄則です。
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const compactCodeStyle: React.CSSProperties = {
    ...styles.code,
    fontSize: '16px',
    lineHeight: '1.6',
    padding: '14px',
    overflowX: 'hidden',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  };

  const containerStyle: React.CSSProperties = {
    ...styles.codeContainer,
    marginBottom: '8px',
    width: '100%',
    maxWidth: '1600px',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  return (
    <SectionLayout
      title1="1. その情報、コードに書いて大丈夫？"
      title2="〜 ハードコードの危険性 〜"
      description={description}
      checklist={checklist}
      summary={summary}
    >
      <div>
          <Card>
            <CardHeader>
              <CardTitle>
                ハードコードの危険性
              </CardTitle>
              <CardDescription>
                フロントエンドに書いた秘密情報は、
                意図せずユーザーに配られてしまいます。
                <br />
                ここでは、「脆弱な実装」と「安全な実装」の「見え方の違い」を見てみましょう。
              </CardDescription>
            </CardHeader>
            <hr style={{ border: 'none', height: 0.1, background: '#e5e7eb', margin: '3px 0' }} />
            <CardContent>
                  <div style={styles.comparison}>
                    {/* 脆弱な実装 */}
                    <div style={styles.comparisonColumn}>
                      <p style={{ fontSize: 16, marginBottom: 20, lineHeight: 1.6 }}>
                        <span style={{ color: '#dc2626', fontWeight: 600 }}>脆弱な実装</span>では、
                        APIキーをフロントエンドのコードに置いてしまっています。
                        <br />
                        ブラウザに配信されたコードはユーザーの手元に届くため、
                        <b>ソースやバンドルを見られるとキーも一緒に見えてしまいます</b>。
                      </p>
                  <div
                    style={{
                      ...containerStyle,
                      background: '#fef2f2',
                      border: '3px solid #fca5a5'
                    }}
                  >
                    <div style={{ ...styles.codeLabel, color: '#dc2626' }}>⚠️ 脆弱な実装</div>
                    <pre style={styles.code}>
{`⚠️ 1. フロントエンドに直接書くと、ブラウザで見られる
export const API_KEY =
  '`}<span style={{ background: '#ef4444', color: '#fff', padding: '1px 3px', borderRadius: 2 }}>sk_test_XXXXXXXXXXXXXXXXXXXX</span>{`';

⚠️ 2. NEXT_PUBLIC_ 付きの環境変数は、ビルド時にコードへ埋め込まれる
const key = process.env.NEXT_PUBLIC_SECRET_API_KEY;`}
                    </pre>
                  </div>
                </div>
                  <div style={styles.divider} />
                    {/* 安全な実装 */}
                    <div style={styles.comparisonColumn}>
                      <p style={{ fontSize: 16, marginBottom: 20, lineHeight: 1.6 }}>
                        <span style={{ color: '#16a34a', fontWeight: 600 }}>安全な実装</span>では、
                        秘密情報（APIキー）を<b>サーバー側だけ</b>で扱います。
                        <br />
                        フロントエンドは直接キーを持たず、
                        <b>自分のバックエンド（プロキシ）経由</b>で外部APIにアクセスします。
                      </p>
                  <div
                    style={{
                      ...containerStyle,
                      background: '#f0fdf4',
                      border: '3px solid #86efac'
                    }}
                  >
                    <div style={{ ...styles.codeLabel, color: '#16a34a' }}>✓ 安全な実装</div>
                    <pre style={styles.code}>
{`// pages/api/proxy.ts（サーバー側）
export default async function handler(req, res) {
  ✓ サーバー環境変数からキーを読む（クライアントには渡さない）
  const key = `}<span style={{ background: '#16a34a', color: '#fff', padding: '1px 3px', borderRadius: 2 }}>process.env.SECRET_KEY</span>{`;
  
  ✓ サーバーが外部APIを呼ぶ
  const data = await fetch(..., {
    headers: { Authorization: key }
  });

  res.json(data);
}`}
                    </pre>
                  </div>
                  
                  <div
                    style={{
                      ...containerStyle,
                      background: '#f0fdf4',
                      border: '3px solid #86efac',
                      marginTop: '4px'
                    }}
                  >
                     <pre style={compactCodeStyle}>
{`// クライアント例
await fetch('/api/proxy', { method: 'POST', ... });`}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <br />
          <Card>
  <CardHeader>
    <CardTitle>🔍 まずは探してみよう</CardTitle>
    <CardDescription>
      ブラウザに配信されたコードは、ユーザーの手元で確認できます。
      <br />
      ここでは「コードに書かれたテストキーが見つかる」ことを体験します。
    </CardDescription>
  </CardHeader>

  <hr style={{ border: 'none', height: 1, background: '#e5e7eb' }} />

  <CardContent className="space-y-4">

    <h3 style={{ ...styles.h3, marginTop: 2 }}>
      開発者ツールの開き方
    </h3>

    <div
      style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: 12,
        fontSize: 13.5,
        lineHeight: 1.7
      }}
    >
      <b>ショートカット：</b><br />
      ・Windows / Linux：<b>F12</b> または <b>Ctrl + Shift + I</b><br />
      ・Mac：<b>⌥ Option + ⌘ Command + I</b><br />
      ・うまく開けない場合は、ブラウザのメニューから
      「表示 → 開発 / 開発者ツール」を探してください
    </div>

    <ol className="ml-4 space-y-3" style={{ fontSize: 15 }}>
      <li>
        <b>1.</b> 開発者ツールを開く
      </li>
      <li>
        <b>2.</b> 「Sources」「Debugger」など、<br />
        読み込まれたファイルが見られるタブを開く
      </li>
      <li>
        <b>3.</b> 検索で <code>TEST API KEY</code> を探す
        <br />
        <span style={{ fontSize: 14, color: '#64748b' }}>
          （Mac：⌘ + F / 全体検索は ⌘ + Shift + F）
        </span>
      </li>
      <li>
        <b>4.</b> 見つけた文字列をコピーする
      </li>
    </ol>

    <div
                      style={{
                        marginTop: 16,
                        background: '#eef2ff',
                        borderLeft: '4px solid #6366f1',
                        borderRadius: 6,
                        padding: 12
                      }}
                    >
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>ポイント</p>
                      <p style={{ marginTop: 6, fontSize: 14, lineHeight: 1.6 }}>
      ファイル名や場所が分からなくても大丈夫です。
      <br />
      「検索できる」という事実そのものが重要です。
      </p>
    </div>

  </CardContent>
</Card>
<br />
<Card>
  <CardHeader>
    <CardTitle>🧪 デモ：見つけたキーで API を叩いてみる</CardTitle>
    <CardDescription>
      さきほど見つけたテストキーを貼り付けて、
      実際に API が呼べてしまうことを確認します。
    </CardDescription>
  </CardHeader>

  <hr style={{ border: 'none', height: 1, background: '#e5e7eb' }} />

  <CardContent>
    <HardCordDemo />
  </CardContent>
</Card>


      </div>
    </SectionLayout>
  );
}