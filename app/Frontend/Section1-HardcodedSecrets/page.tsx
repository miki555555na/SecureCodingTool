'use client';

import React from 'react';
import SectionLayout from '../../Framework/SectionLayout';
import { styles } from '../../Framework/SectionStyles';
import { HardCordDemo } from './HardCordDemo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HardCordPage() {
  const description = (
    <p className="text-sm text-slate-600">
      クライアントに API キーなどの秘密情報をハードコードしてしまうのは危険です。ブラウザからソースやバンドルを確認されると簡単に漏洩します。
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
        <section style={styles.section}>
          <h2 style={styles.h2}>フロントエンド実装の注意：良い例 / よくない例</h2>
          <p style={{ marginTop: 0 }}>
            下は「やってはいけない例（NG）」と「推奨例（OK）」のまとめです。クライアントに秘密を置かない、環境変数はサーバーで管理する等を徹底してください。
          </p>
          
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 18, marginTop: 0 }}>コード例：よくない例（NG） / 推奨例（OK）</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div style={{ ...styles.comparison, alignItems: 'flex-start' }}>
                <div style={{ ...styles.comparisonColumn, display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontSize: 15, marginBottom: 8, lineHeight: 1.6, minHeight: 72 }}>
                    <span style={{ color:'#dc2626', fontWeight: 600 }}>⚠️ よくない例（NG）</span>
                    <br />
                    <span style={{ fontSize: 13 }}>フロントエンドに直接キーを置くと、ソースやバンドルから簡単に漏洩します。</span>
                  </p>

                  <div
                    style={{
                      ...containerStyle,
                      background: '#fef2f2',
                      border: '3px solid #fca5a5'
                    }}
                  >
                    <div style={{ ...styles.codeLabel, color: '#dc2626' }}>⚠️ 脆弱な実装</div>
                    <pre style={compactCodeStyle}>
{`// BAD: クライアント直書き（誰でも見える）
export const API_KEY = 
  '`}<span style={{ background: '#ef4444', color: '#fff', padding: '1px 3px', borderRadius: 2 }}>sk_test_XXXXXXXXXXXXXXXXXXXX</span>{`';

// BAD: NEXT_PUBLIC_ で公開される環境変数はクライアントで見える
const key = process.env.NEXT_PUBLIC_SECRET_API_KEY;`}
                    </pre>
                  </div>
                </div>
                <div style={styles.divider} />

                <div style={{ ...styles.comparisonColumn, display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontSize: 15, marginBottom: 8, lineHeight: 1.6, minHeight: 72 }}>
                    <span style={{ color:'#138c40ff', fontWeight: 600 }}>✓ 推奨例（OK）</span>
                    <br />
                    <span style={{ fontSize: 13 }}>サーバー側で秘密を管理し、クライアントは自分のバックエンド経由でアクセスしてください。</span>
                  </p>

                  <div
                    style={{
                      ...containerStyle,
                      background: '#f0fdf4',
                      border: '3px solid #86efac'
                    }}
                  >
                    <div style={{ ...styles.codeLabel, color: '#16a34a' }}>✓ 安全な実装</div>
                    <pre style={compactCodeStyle}>
{`// pages/api/proxy.ts
export default async function handler(req, res) {
  // サーバー環境変数からキーを読み込む
  const key = `}<span style={{ background: '#16a34a', color: '#fff', padding: '1px 3px', borderRadius: 2 }}>process.env.SECRET_KEY</span>{`;
  
  // サーバーから外部APIを叩く
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
        </section>

        <section style={{ ...styles.section, marginTop: 24 }}>
          <Card>
            <CardHeader>
              <CardTitle>シンプルデモ：ハードコードされたテストキーを探してみる</CardTitle>
            </CardHeader>
            <hr style={{ border: 'none', height: 1, background: '#e5e7eb', margin: '3px 0' }} />
            <CardContent className="space-y-4">
              
              <h3 style={{ ...styles.h3, marginTop: 2, color: '#0f172a' }}>
                 開発者ツールでの探し方（例）
              </h3>
              
              <ol className="ml-4 space-y-4" style={{ fontSize: 15, lineHeight: 1.6 }}>
                 <li>
                   <div style={{ fontWeight: 700 }}>
                     1. ブラウザで F12 を押して開発者ツールを開く
                   </div>
                 </li>
                 <li>
                   <div style={{ fontWeight: 700 }}>
                     2. Sources タブでプロジェクト内のファイルを探す
                   </div>
                   <div style={{ color: '#475569', marginTop: 2, fontSize: 14 }}>
                     開発者ツール（F12）の Sources や 検索（Ctrl+F）を使ってこのファイルを探します。
                   </div>
                 </li>
                 <li>
                   <div style={{ fontWeight: 700 }}>
                     3. ソース内のTEST API KEYを見つける
                   </div>
                   <div style={{ color: '#475569', marginTop: 2, fontSize: 14 }}>
                     コメントに埋め込まれたテストキーが見つかります。
                   </div>
                 </li>
                 <li>
                   <div style={{ fontWeight: 700 }}>
                     4. そのキーをコピーして左の入力欄に貼り付け、API を叩く
                   </div>
                 </li>
              </ol>

              <div style={{ marginTop: 24 }}>
                <HardCordDemo />
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </SectionLayout>
  );
}