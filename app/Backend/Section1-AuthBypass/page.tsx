"use client"

import React from 'react'
import SectionLayout from '../../Framework/SectionLayout'
import { styles } from '../../Framework/SectionStyles'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ShieldAlert, 
  ArrowRight, 
  Key,
  Globe,
  Server,
  FileCode,
  Terminal,
  UserCheck,
  Lock
} from 'lucide-react'
import LogicDemo from './LogicDemo' 

export default function LogicBypassPage() {


  const description = (
    <>
      <p>
        Web APIの設計において、
        <b>「認証（Authentication）」</b>と<b>「認可（Authorization）」</b>の責務分担は
        極めて重要なテーマです。
      </p>

      <p style={{ marginTop: 6 }}>
        ログイン処理（認証）が正しく実装されていても、
        個別のAPIエンドポイントで
        <b>「そのリソースに対する操作権限があるか」</b>
        のチェック（認可）が漏れていれば、
        システムは脆弱な状態となります。
      </p>

      <p style={{ marginTop: 6 }}>
        この章では、
        <b>「アクセス制御の不備 (Broken Access Control)」</b>について、
        IDORや権限昇格の実例を通じて、
        堅牢なバックエンドロジックの実装パターンを学びます。
      </p>
    </>
  )

  const checklist = (
    <Card style={{ border: '2px solid #aee2feff', boxShadow: '0 2px 8px #0001', background: '#f5faffff' }}>
      <CardHeader style={{ paddingBottom: 3 }}>
        <CardTitle style={{ fontSize: 17, marginTop: 0 }}>📝 5章の見どころ</CardTitle>
      </CardHeader>
      <CardContent style={{ paddingTop: 0 }}>
        <div style={{ fontSize: 15, marginLeft: 18, marginBottom: 0 }}>
          <ul className="list-disc list-inside space-y-1">
            <li>IDOR：リクエストパラメータの改変による水平権限昇格</li>
            <li>機能レベルのアクセス制御不備：APIの直接実行による垂直権限昇格</li>
            <li>セッション情報を起点とした正しい認可ロジックの実装</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )

  const summary = (
    <Card className="border-gray-300 bg-gray-50">
      <CardHeader>
        <CardTitle className="text-lg">🔎 この章の要点</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 rounded bg-red-100 px-2 py-1 text-xs font-bold text-red-700 whitespace-nowrap">
              リスク
            </span>
            <span>
              APIエンドポイントは本質的にパブリックなインターフェースです。
              正規のフロントエンドを経由しないリクエスト（curl等）に対しても、
              <b>サーバーサイドで独立した検証</b>が必須です。
            </span>
          </li>

          <li className="flex items-start gap-3">
            <span className="mt-0.5 rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700 whitespace-nowrap">
              対策
            </span>
            <span>
              すべてのリクエストに対し、
              <b>「誰が（Authentication）」</b>
              <b>「何をしようとしているか（Action）」</b>
              <b>「権限はあるか（Authorization）」</b>
              の3点を常に検証するミドルウェアやロジックを適用します。
            </span>
          </li>
        </ul>
      </CardContent>
    </Card>
  )
  const compactCodeStyle: React.CSSProperties = {
    ...styles.code,
    fontSize: '11px',
    lineHeight: '1.4',
    padding: '10px',
    overflowX: 'auto',
    whiteSpace: 'pre',
  };

  const containerStyle: React.CSSProperties = {
    ...styles.codeContainer,
    marginBottom: '8px'
  };

  const children = (
    <>
      <section style={styles.section}>
        <h2 style={styles.h2}>
          1. 脆弱性のメカニズム：信頼境界の認識
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div style={{ background: '#fff', padding: 20, borderRadius: 8, border: '1px solid #e5e7eb' }}>
            <h3 style={{ ...styles.h3, marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Key size={20} color="#2563eb" /> Authentication vs Authorization
            </h3>
            
            <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.6 }}>
              バックエンドエンジニアにとって、この2つの区別は基本ですが、実装漏れは頻繁に発生します。
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
              <div style={{ padding: 12, background: '#f0f9ff', borderRadius: 6, border: '1px solid #bae6fd' }}>
                <div style={{ fontWeight: 700, color: '#0369a1', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <UserCheck size={16} /> Authentication (認証)
                </div>
                <div style={{ fontSize: 14, color: '#334155' }}>
                  <b>Identity Verification</b><br/>
                  ユーザーが誰であるかを特定する。<br/>
                  (ex: Login, JWT Validation)
                </div>
              </div>
              <div style={{ padding: 12, background: '#fefce8', borderRadius: 6, border: '1px solid #fde047' }}>
                <div style={{ fontWeight: 700, color: '#854d0e', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Lock size={16} /> Authorization (認可)
                </div>
                <div style={{ fontSize: 14, color: '#334155' }}>
                  <b>Access Control</b><br/>
                  特定のリソースや操作へのアクセスを許可する。<br/>
                  (ex: Role check, Ownership check)
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: '#fff', padding: 20, borderRadius: 8, border: '1px solid #e5e7eb' }}>
            <h3 style={{ ...styles.h3, marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Globe size={20} color="#64748b" /> APIエンドポイントの特性
            </h3>

            <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.6 }}>
               REST APIやGraphQLのエンドポイントは、特定のUIコンポーネントと紐付いているわけではありません。
               バックエンドの実装においては、<b>「リクエストは常に信頼できない（Untrusted）」</b>というゼロトラストの原則に基づき、パラメータの整合性を都度検証する必要があります。
            </p>

            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, background: '#f8fafc', padding: 16, borderRadius: 8 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b' }}>
                  <Globe size={16} /> Web Frontend
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b' }}>
                  <FileCode size={16} /> Mobile App
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#dc2626', fontWeight: 600 }}>
                  <Terminal size={16} /> cURL / Script
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <ArrowRight size={24} color="#94a3b8" />
              </div>

              <div style={{ flex: 1, border: '2px solid #2563eb', background: '#fff', padding: 10, borderRadius: 6, textAlign: 'center' }}>
                <div style={{ fontWeight: 700, color: '#2563eb', marginBottom: 4 }}>API Backend</div>
                <div style={{ fontSize: 11, color: '#475569' }}>
                  Must validate <b>AuthZ</b> for<br/>
                  EVERY request.
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Card style={{ marginTop: 24 }}>
        <CardHeader>
          <CardTitle>認可制御の実装検証</CardTitle>
          <CardDescription>
            IDOR（安全でないオブジェクト直接参照）および機能レベルのアクセス制御不備について、
            脆弱な実装とセキュアな実装の挙動差異を確認します。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ marginBottom: 20, fontSize: 15, color: '#475569', lineHeight: 1.6 }}>
            <h3 style={{ ...styles.h3, marginTop: 2, color: '#0f172a' }}>
               🚀 試してみよう
            </h3>
            <ol className="ml-4 space-y-4" style={{ fontSize: 16, lineHeight: 1.8 }}>
              <li>
                <div style={{ fontWeight: 700 }}>
                  【Step 1】Case A (IDOR)：URLの数字を変えてみる
                </div>
                <div style={{ color: '#475569', marginTop: 4 }}>
                  プロフィール画面のURLにあるID（<code>1001</code>）を、隣の番号（<code>1002</code>）に書き換えて「Go」を押してください。
                  <br/>
                  <span style={{ color: '#dc2626', fontWeight: 600 }}>本来見えてはいけない他人の個人情報</span>が表示されてしまいます。
                </div>
              </li>
              
              <li>
                <div style={{ fontWeight: 700 }}>
                  【Step 2】Case B (権限昇格)：隠しAPIを叩く
                </div>
                <div style={{ color: '#475569', marginTop: 4 }}>
                  タブを「Case B」に切り替えてください。画面には削除ボタンはありませんが、
                  ツールを使って直接 <code>delete_user</code> APIを実行してみましょう。
                  <br/>
                  一般ユーザー権限（Member）なのに、削除が成功してしまいます。
                </div>
              </li>

              <li>
                <div style={{ fontWeight: 700 }}>
                  【Step 3】対策：安全な実装（Secure）にして試す
                </div>
                <div style={{ color: '#475569', marginTop: 4 }}>
                  「✅ 安全な実装」ボタンを押し、同じ攻撃を試してください。
                  <br/>
                  サーバー側で適切なチェックが行われ、エラー（Access Denied / Forbidden）になることを確認しましょう。
                </div>
              </li>
            </ol>
          </div>
          
          <LogicDemo />
          
        </CardContent>
      </Card>
    </>
  )

  return (
    <SectionLayout
      title1="5. 認可不備とロジックバイパス"
      title2="〜 リクエスト起点の厳格なアクセス制御 〜"
      description={description}
      summary={summary}
      checklist={checklist}
    >
      {children}
    </SectionLayout>
  )
}