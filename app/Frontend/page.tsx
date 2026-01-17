'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import Link from 'next/link';

export default function FrontendPage() {
  const sections = [
    {
      number: 1,
      title: 'その情報、コードに書いて大丈夫？',
      description: 'ソースコードに直接書いた値が、誰にどこまで見えてしまうのかを確認します。',
      href: '/Frontend/Section1-HardcodedSecrets'
    },
    {
      number: 2,
      title: '入力しただけで、何か動いていませんか？',
      description: 'ユーザー入力の扱い方ひとつで、意図しないスクリプトが実行されてしまう仕組みを体験します。',
      href: '/Frontend/Section2-XSS'
    },
    {
      number: 3,
      title: '速さの違い、見られています',
      description: 'ブラウザのキャッシュによる処理時間の差が、どのように情報として利用されるかを見ていきます。',
      href: '/Frontend/Section3-BrowserCache'
    }
  ];
  return (
    <div className="space-y-6">
      <p className="text-base text-slate-600">
        このセクションでは、フロントエンド実装で起こりやすい代表的なセキュリティ上の<b>落とし穴</b>を、
        <b>「脆弱な実装」と「改善後の安全な実装」</b>を見比べながら学びます。<br></br>
        各章はどこからでも選んで学習できますが、上から順に進めることで、より理解しやすい構成になっています。
      </p>

      <div className="grid gap-4">
        {sections.map((section) => (
          <Card key={section.number}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span
                  className="flex items-center justify-center font-bold text-white"
                  style={{
                    background: '#f59e0b',
                    width: 40,
                    height: 40,
                    borderRadius: '9999px'
                  }}
                >
                  {section.number}
                </span>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-slate-500">
                {section.description}
              </p>
              <Link href={section.href}>
                <Button className="bg-amber-500 text-white">
                  {section.number}章を見る →
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
