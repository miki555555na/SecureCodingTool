'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function BackendPage() {
  const sections = [
  {
    number: 1,
    title: 'そのURL、誰でも叩けていませんか？',
    description: 'アクセス制御の抜け漏れによって、本来許可されていない操作ができてしまうケースを確認します。',
    href: '/Backend/Section1-AuthBypass'
  },
  {
    number: 2,
    title: 'その入力、本当にただの文字列？',
    description: 'ユーザー入力をそのまま使ったことで、データベースの中身が漏れてしまう仕組みを見ていきます。',
    href: '/Backend/Section2-SQLInjection'
  },
  {
    number: 3,
    title: 'パスワード、もうバレているかも',
    description: 'パスワード検証時の「処理時間の差」が、攻撃に利用されてしまう理由を体感します。',
    href: '/Backend/Section3-EarlyReturn'
  },
  {
    number: 4,
    title: 'ちゃんと検証している…つもりだった',
    description: '署名を確認している処理でも、実行時間の違いから情報が漏れるリスクを確認します。',
    href: '/Backend/Section4-HMACVerification'
  },
  {
    number: 5,
    title: '返事の速さで、存在がバレる？',
    description: 'ログイン処理中の反応の違いが、ユーザーの有無を推測される原因になることを学びます。',
    href: '/Backend/Section5-UserEnumeration'
  }
];

  return (
    <div className="space-y-6">
      <p className="text-base text-slate-600">
        このセクションでは、バックエンド実装で起こりやすい代表的なセキュリティ上の<b>落とし穴</b>を、
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
                    background: '#3b82f6',
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
                <Button className="bg-blue-500 text-white">
                  {section.number} 章を見る →
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

