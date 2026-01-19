"use client"

import React from 'react'
import SectionLayout from '../../Framework/SectionLayout'
import { styles } from '../../Framework/SectionStyles'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Shield,
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
    <p className="text-lg font-medium">
      Webの裏側では、ページのボタンを押さなくても、
      <span className="bg-yellow-100 px-1 rounded">URLを直接開くだけで</span>操作が動いてしまうことがあります。
    </p>

    <p className="mt-3 text-gray-700">
      だからこそ大事なのは、「ログインしているか」だけで安心しないことです。
      <br />
      それぞれのAPIで、
      <b>「この人がこの操作をしていいか」</b>を毎回確認しないと、
      URLを少し変えただけで<b>本来できない操作</b>ができてしまうことがあります。
    </p>

    <p className="mt-3 text-gray-700">
      この章では、
      <b>URLを変えるだけで勝手に操作できてしまう</b>危ない例を体験しながら、
      どうすればそれを止められるかを学びます。
    </p>
  </>
)


  const checklist = (
    <Card
            style={{
              border: '2px solid #aee2feff',
              boxShadow: '0 2px 8px #0001',
              background: '#f5faffff',
            }}
          >
            <CardHeader style={{ paddingBottom: 3 }}>
              <CardTitle style={{ fontSize: 17, marginTop: 0 }}>
                📝 1章の見どころ
              </CardTitle>
            </CardHeader>
    
            <CardContent style={{ paddingTop: 0 }}>
              <ul style={{ fontSize: 15, marginLeft: 18, marginBottom: 0 }}>
                <li>・URLを少し変えるだけで、別の操作ができてしまうことがある？</li>
                <li>・「見えない操作」を勝手に実行できると、何が起きる？</li>
                <li>・たった1つの確認を足すだけで、危なさはどう変わる？</li>
                <br />
                <ul style={{ fontSize: 16, marginTop: 5 }}>
                  <b>→ 実際に動かしながら確認します</b>
                </ul>
              </ul>
            </CardContent>
          </Card>
  )

  const summary = (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          1章のまとめ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-sm">
      
        {/* 見どころ回収 */}
        <div
          className="rounded-md border p-4"
          style={{
            background: '#f5faff',
            borderColor: '#aee2fe',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
          }}
        >
          <p className="font-semibold mb-3 text-slate-800" style={{ fontSize: 16 }}>
            この章のはじめに投げた問い、答えはこうでした
          </p>

          <ul className="space-y-2 text-gray-700">
            <li>
              <b>Q.</b> URLを少し変えるだけで、別の操作ができてしまうことがある？
              <br />
              <span className="ml-4">
                <b>→</b> あります。URLやパラメータをそのまま信じると、想定外のデータや操作に届いてしまいます。
              </span>
            </li>

            <li>
              <b>Q.</b> 「見えない操作」を勝手に実行できると、何が起きる？
              <br />
              <span className="ml-4">
                <b>→</b> 画面にボタンがなくても、削除や更新などの重要な操作が動いてしまうことがあります。
              </span>
            </li>

            <li>
              <b>Q.</b> たった1つの確認を足すだけで、危なさはどう変わる？
              <br />
              <span className="ml-4">
                <b>→</b> 「この人がこの操作をしていいか」を毎回確認するだけで、通ってはいけないリクエストを止められます。
              </span>
            </li>
          </ul>
        </div>

        {/* 本質の説明 */}
        <div
          className="rounded-md bg-white p-4 text-gray-800"
          style={{ lineHeight: 1.8 }}
        >
          <p style={{ fontSize: 16 }}>
            この章で見た問題は、
            <b>特別なハッキング技術</b>が必要な話ではありません。
            <br />
            多くの場合、原因は
            <span style={{ color: '#4f46e5', fontWeight: 600 }}>
              「動けばOK」として自然に書いてしまいがちな設計
            </span>
            の中にあります。
          </p>

          <p style={{ fontSize: 16, marginTop: 12 }}>
            Webの裏側では、操作は<b>URLやAPI</b>として存在しています。
            <br />
            そのため、「この画面からしか押せないはず」「ボタンがないから安全」という前提は通用しません。
            <br />
            <b>URLを直接呼ばれたときにどう動くか</b>まで含めて、バックエンドは作られます。
          </p>

          <p style={{ fontSize: 16, marginTop: 12 }}>
            そして大事なのが、
            <b>「ログインしているか」</b>と<b>「その操作をしていいか」</b>は別物だということです。
            <br />
            ログインできている人でも、全てのデータを見たり、全ての操作をしてよいわけではありません。
          </p>

          <p style={{ fontSize: 16, marginTop: 12 }}>
            だからこそ、
            <span style={{ color: '#4f46e5', fontWeight: 600 }}>
              操作ごとに「この人がやっていいか」を確認する
            </span>
            ことが、基本であり最重要になります。
            <br />
            この確認が1つ抜けるだけで、URLを変えるだけの簡単な操作で、想定外のことが起きてしまいます。
          </p>

          {/* 締め */}
          <div className="mt-4 pt-3 border-t text-gray-700 font-medium">
            Webエンジニアの仕事は「機能を作る」だけでなく、
            <b>その機能がどう悪用されうるか</b>まで想像して設計することです。
            <br />
            セキュリティは特別な人の専門分野ではなく、
            <b>普段の実装の延長にある「品質」</b>です。
            <br />
            「正しく動く」だけで終わらせず、
            <b>外からどう見えるか / どう呼ばれるか</b>まで意識することが、
            安全なバックエンドへの第一歩になります。
          </div>
        </div>

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: '#fff', padding: 20, borderRadius: 8, border: '1px solid #e5e7eb' }}>
        <h3 style={{ ...styles.h3, marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={20} color="#2563eb" />
          なぜ「URLを変えるだけ」で危なくなるの？
        </h3>

        {/* 導入（少し丁寧に） */}
        <p style={{ marginTop: 8, fontSize: 14.5, color: '#475569', lineHeight: 1.7 }}>
          Webアプリのバックエンドでは、
          「ログインしているかどうか」だけを確認して処理を進めてしまうと、
          思わぬ問題につながることがあります。
          <br />
          実はもう1つ、
          <b>「この人が、この操作をしてよいか」</b>
          を確認することがとても重要です。
          <br />
          ここが抜けていると、URLを少し変えただけで
          <b>本来は許されていない操作</b>が実行できてしまうことがあります。
        </p>

        <br />

        {/* 見出し */}
        <p style={{ margin: 0, fontSize: 16.5, fontWeight: 600, color: '#1f2937' }}>
          まず押さえたい「2つの確認」
        </p>

        {/* 2カラム */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
          <div style={{ padding: 12, background: '#f0f9ff', borderRadius: 8, border: '1px solid #bae6fd' }}>
            <div style={{ fontWeight: 700, color: '#0369a1', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <UserCheck size={16} />
              ① ログインしている？
            </div>
            <div style={{ fontSize: 14, color: '#334155', lineHeight: 1.6 }}>
              「このリクエストは、ログイン済みのユーザーから来ているか？」
              を確認します。
              <br />
              ここがOKでも、それだけでは十分ではありません。
            </div>
          </div>

          <div style={{ padding: 12, background: '#fefce8', borderRadius: 8, border: '1px solid #fde047' }}>
            <div style={{ fontWeight: 700, color: '#854d0e', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Lock size={16} />
              ② この操作をしていい？
            </div>
            <div style={{ fontSize: 14, color: '#334155', lineHeight: 1.6 }}>
              「このユーザーが、このデータや操作に触ってよいか？」
              を確認します。
              <br />
              例：<b>自分のデータだけ</b> / <b>管理者だけ</b>
            </div>
          </div>
        </div>

        {/* ポイント */}
        <div
          style={{
            marginTop: 12,
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: 12,
            fontSize: 13.5,
            color: '#475569'
          }}
        >
          <b>※ポイント：</b>
          「ログインしている」ことと、
          「その操作をしてよい」ことは別です。
          操作ごとに確認する必要があります。
        </div>

        {/* よくある誤解 */}
        <div
          style={{
            marginTop: 16,
            background: '#eef2ff',
            borderLeft: '4px solid #6366f1',
            borderRadius: 6,
            padding: 12
          }}
        >
          <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>
            よくある誤解
          </p>
          <p style={{ margin: '6px 0 0', fontSize: 14, lineHeight: 1.6 }}>
            「画面にボタンがないから実行できないはず」と思いがちですが、
            <br />
            URLを直接指定されると、
            <b>バックエンドの処理はそのまま動いてしまいます</b>。
            <br />
            そのため、バックエンド側で
            <b>毎回チェックする設計</b>が必要になります。
          </p>
        </div>
      </div>

      {/* APIの説明 */}
      <div style={{ background: '#fff', padding: 20, borderRadius: 8, border: '1px solid #e5e7eb' }}>
        <h3 style={{ ...styles.h3, marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Globe size={20} color="#64748b" />
          APIは「画面のボタン」だけから来るわけじゃない
        </h3>

        <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.6 }}>
          バックエンドのAPIは、
          画面のボタンと1対1で結びついているわけではありません。
          <br />
          実際には、URL（APIの入口）を指定すれば、
          Web画面・スマホアプリ・スクリプトなど
          <b>どこからでも直接呼び出せます</b>。
        </p>

        <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.6, marginTop: 8 }}>
          そのためバックエンドでは、
          「このURLはどの画面から呼ばれたか」ではなく、
          <br />
          <b>「届いたリクエスト1つ1つが安全か」</b>
          を基準に処理を判断する必要があります。
        </p>

        {/* 図（そのまま） */}
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, background: '#f8fafc', padding: 16, borderRadius: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b' }}>
              <Globe size={16} /> Web画面
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b' }}>
              <FileCode size={16} /> スマホアプリ
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#dc2626', fontWeight: 600 }}>
              <Terminal size={16} /> URL直打ち / 自動ツール
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowRight size={24} color="#94a3b8" />
          </div>

          <div style={{ flex: 1, border: '2px solid #2563eb', background: '#fff', padding: 10, borderRadius: 6, textAlign: 'center' }}>
            <div style={{ fontWeight: 700, color: '#2563eb', marginBottom: 4 }}>
              API（バックエンド）
            </div>
            <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.5 }}>
              毎回、<b>「ログインしている？」</b>と<br />
              <b>「この操作をしていい？」</b>を確認する
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14, borderRadius: 8, padding: 12, fontSize: 14, color: '#374151', lineHeight: 1.7 }}>
          <p style={{ margin: 0 }}>
            この章では、
            URLを少し変えるだけで
            <b>本来できない操作が通ってしまう</b>例を体験し、
            それをどう防ぐかを確認していきます。
          </p>
        </div>
      </div>
    </div>

      <Card style={{ marginTop: 24 }}>
        <CardHeader>
          <CardTitle style={{ marginBottom: 10 }}>操作して体験しよう：URLやAPIを直接呼ぶと何が起きる？</CardTitle>
          <CardDescription>
            <p>
              このデモでは、
              <b>画面にボタンがなくても、URLやAPIを直接指定すると処理が動いてしまう</b>
              例を体験します。
              <br />
              「ログインしているから安心」「画面に操作がないから大丈夫」
              が通用しない理由を、実際に確かめてみましょう。
            </p>
          </CardDescription>
        </CardHeader>
        <hr style={{ border: 'none', height: 0.1, background: '#e5e7eb'}} />
        <CardContent className="space-y-4">
  <h3 style={{ ...styles.h3, marginTop: 2, color: '#0f172a' }}>
    🚀 試してみよう
  </h3>

  <ol className="ml-4 space-y-4" style={{ fontSize: 15, lineHeight: 1.8 }}>
    <li>
      <div style={{ fontWeight: 700 }}>
        【ステップ1】Case A：URLの数字を変えてみる
      </div>
      <div style={{ color: '#475569', marginTop: 4 }}>
        プロフィール画面のURLに含まれている番号
        （<code>1001</code>）を、
        隣の番号（<code>1002</code>）に書き換えて
        「Go」を押してください。
        <br />すると、
        <span style={{ background: '#fef9c3', padding: '2px 6px', borderRadius: 4 }}>
          本来は自分には関係ないはずの、他人の情報
        </span>
        が表示されてしまいます。
      </div>
    </li>

    <li>
      <div style={{ fontWeight: 700 }}>
        【ステップ2】Case B：画面にない操作を直接呼んでみる
      </div>
      <div style={{ color: '#475569', marginTop: 4 }}>
        タブを「Case B」に切り替えてください。
        <br />
        画面には「削除」ボタンはありませんが、
        ツールを使って直接
        <code>delete_user</code>
        というAPIを呼び出してみましょう。
        <br />
        <b>普通のユーザーのままでも</b>、
        本来はできないはずの操作が成功してしまいます。
      </div>
    </li>

    <li>
      <div style={{ fontWeight: 700 }}>
        【ステップ3】守った場合：安全な実装に切り替えて試す
      </div>
      <div style={{ color: '#475569', marginTop: 4 }}>
        「✓ 安全な実装」ボタンを押してから、
        もう一度同じ操作を試してください。
        <br />
        今度は、
        <b>「この人はその操作をしていいか？」</b>
        がきちんと確認され、
        処理が止められることが分かります。
      </div>
    </li>
  </ol>

  <LogicDemo />
  <p className="text-sm text-slate-600">
  ※ ここで起きている問題は、特別なテクニックではなく、
  <b>「確認が1つ足りないだけ」</b>で発生しています。
</p>

</CardContent>
</Card>

    </>
  )

  return (
    <SectionLayout
      title1="1.そのURL、誰でも実行できていませんか？"
      title2="〜 リクエスト起点の厳格なアクセス制御 〜"
      description={description}
      summary={summary}
      checklist={checklist}
    >
      {children}
    </SectionLayout>
  )
}