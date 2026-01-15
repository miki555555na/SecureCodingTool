'use client';

import React from 'react';
import SectionLayout from '../../Framework/SectionLayout';
import { styles } from '../../Framework/SectionStyles';
import { HardCordDemo } from './HardCordDemo';
import { InfoCard } from '@/components/educational/info-card';
import { VulnerableCard } from '@/components/educational/vulnerable-card';
import { SecureCard } from '@/components/educational/secure-card';

export default function HardCordPage() {
  const description = (
    <p className="text-sm text-slate-600">
      クライアントに API キーなどの秘密情報をハードコードしてしまうのは危険です。ブラウザからソースやバンドルを確認されると簡単に漏洩します。
    </p>
  );

  //補足としてハードコーディングをすべきではない事例とか追加

  const checklist = (
    <InfoCard title="📝 やってみよう" description="手順に沿ってデモを試してみましょう。">
      <ul className="text-sm list-disc list-inside">
        <li>開発者ツール（F12）の Sources や検索でこのファイルを探す（コメントにテストキーがある）</li>
        <li>見つけたキーをコピーして、デモの入力欄に貼り付けて「API を叩く」を押す</li>
        <li>正しいキーであれば成功メッセージが出ることを確認する</li>
      </ul>
    </InfoCard>
  );

  const summary = (
    <div className="text-sm">
      <strong>推奨</strong>
      <div className="text-sm text-slate-600 mt-2">
        秘密情報はサーバー側で管理し、クライアントは自分のバックエンド（API route）を経由してアクセスする設計にしてください。
      </div>
    </div>
  );

  return (
    <SectionLayout
      title1="1. その情報、コードに書いて大丈夫？"
      title2="ハードコードの危険性"
      description={description}
      checklist={checklist}
      summary={summary}
    >
      <div>
        <section style={{ ...styles.section, background: '#fff', border: '1px solid #e6eef8' }}>
          <h2 style={styles.h2}>フロントエンド実装の注意：良い例 / よくない例</h2>
          <p style={{ marginTop: 0 }}>
            下は「やってはいけない例（NG）」と「推奨例（OK）」のまとめです。クライアントに秘密を置かない、環境変数はサーバーで管理する等を徹底してください。
          </p>

          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            <VulnerableCard title="⚠️ よくない例（NG）" description="フロントエンドに直接キーを置くと、ソースやバンドルから簡単に漏洩します。">
              <div className="space-y-3">
                <div className="text-sm">以下は避けるべき例です。</div>
                <pre className="bg-white p-3 rounded">
{`// BAD: クライアント直書き（誰でも見える）
export const API_KEY = 'sk_test_XXXXXXXXXXXXXXXXXXXX';`}
                </pre>

                <pre className="bg-white p-3 rounded">
{`// BAD: NEXT_PUBLIC_ で公開される環境変数はクライアントで見える
process.env.NEXT_PUBLIC_SECRET_API_KEY;`}
                </pre>
              </div>
            </VulnerableCard>

            <SecureCard title="✓ 推奨例（OK）" description="サーバー側で秘密を管理し、クライアントは自分のバックエンド経由でアクセスしてください。">
              <div className="space-y-3">
                <div className="text-sm">Next.js の API route を利用したプロキシの例。</div>
                <pre className="bg-white p-3 rounded">
{`// pages/api/proxy.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const API_KEY = process.env.SECRET_API_KEY; // サーバー環境変数
  const resp = await fetch('https://third.party.api/endpoint', {
    method: 'POST',
    headers: { 'Authorization': \`Bearer \${API_KEY}\`, 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body),
  });
  const data = await resp.json();
  res.status(200).json(data);
}`}
                </pre>

                <pre className="bg-white p-3 rounded">
{`// クライアント例
await fetch('/api/proxy', { method: 'POST', body: JSON.stringify({ q: '...' }) });`}
                </pre>
              </div>
            </SecureCard>
          </div>
        </section>

        <section style={{ ...styles.section }}>
          <h2 style={styles.h2}>シンプルデモ：ハードコードされたテストキーを探してみる</h2>
          <div>
            <HardCordDemo />
          </div>
        </section>
      </div>
    </SectionLayout>
  );
}
