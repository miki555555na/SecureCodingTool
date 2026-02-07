// import React from 'react';

// export default function FrontendLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div style={{ minHeight: '100vh', background: '#faf8f3' }}>
//       <nav style={{ background: '#92400e', color: '#fff', padding: '20px', textAlign: 'center' }}>
//         <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>フロントエンド編</h2>
//       </nav>
//       <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
//         {children}
//       </div>
//     </div>
//   );
// }
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // 例: /Frontend or /Frontend/Section1-AuthBypass
  const segments = pathname.split('/').filter(Boolean);

  // 戻り先と文言を決定
  const isFrontendTop = segments.length === 1; // ["Frontend"]

  const backHref = isFrontendTop ? '/' : '/Frontend';
  const backLabel = isFrontendTop
    ? 'トップページに戻る'
    : '章一覧に戻る';

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <nav style={{ background: '#92400e', color: '#fff', padding: '20px 24px', display: 'flex',alignItems: 'center', }}>
        {/* ← 戻るボタン（状況に応じて切り替え） */}
        <Link
          href={backHref}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: '#e5e7eb',
            fontSize: 14,
            fontWeight: 600,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <ArrowLeft size={16} />
          {backLabel}
        </Link>

        {/* タイトル（常に中央） */}
        <h2
          style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 700,
            flex: 1,
            textAlign: 'center',
          }}
        >
          フロントエンド編
        </h2>

        {/* 右側スペーサー（中央寄せ維持） */}
        <div style={{ width: 160 }} />
      </nav>

      <div style={{ maxWidth: 1600, margin: '0 auto', padding: '36px 28px' }}>
        {children}
      </div>
    </div>
  );
}