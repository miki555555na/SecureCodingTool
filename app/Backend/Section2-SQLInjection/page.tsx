"use client"

import React, { useState, useRef, useEffect } from 'react'
import SectionLayout from '../../Framework/SectionLayout'
import { styles } from '../../Framework/SectionStyles'

import { 
  Shield,
  Database, 
  ShieldCheck, 
  ArrowRight,
  ArrowDown,
  User,
  ShieldAlert, 
  AlertTriangle, 
  Filter,
  Lock,
  SearchCheck,
  Code
} from 'lucide-react'
import QueryPanel from './QueryPanel'
import BackendMonitor from './BackendMonitor'
import { Card, CardHeader, CardTitle, CardContent,CardDescription } from '@/components/ui/card'

const MOCK_DB_USERS = [
  { id: 1, name: 'alice', role: 'user', email: 'alice@example.com' },
  { id: 2, name: 'bob', role: 'user', email: 'bob@example.com' },
  { id: 3, name: 'admin', role: 'admin', email: 'admin@corp.secret' },
]

  const btnBase: React.CSSProperties = {
    padding: '8px 12px',
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#d1d5db',
    background: '#fff',
    cursor: 'pointer',
    fontWeight: 600
  };

function sleep(ms: number) { return new Promise((res) => setTimeout(res, ms)) }

export default function SqlInjectionPage() {
  const [mode, setMode] = useState<'vulnerable' | 'secure'>('vulnerable')
  const [secureType, setSecureType] = useState<'prepared' | 'orm'>('prepared')
  const [enableValidation, setEnableValidation] = useState(false)
  
  const [queryInput, setQueryInput] = useState('')
  const [logs, setLogs] = useState<string[]>([])
  const [queryResult, setQueryResult] = useState<any[] | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [logs])

  function appendLog(line: string) { setLogs((s) => [...s, line].slice(-20)) }

  async function executeQuery() {
    setIsExecuting(true)
    setQueryResult(null)
    appendLog(`>> REQUEST: "${queryInput}"`)
    
    await sleep(400)

    if (enableValidation) {
      appendLog(">> [1. Validation] Checking format...")
      await sleep(300)
      const isValid = /^[a-zA-Z0-9]+$/.test(queryInput)
      if (!isValid) {
        appendLog(">> [ERROR] Validation Failed: Invalid characters.")
        setIsExecuting(false)
        return
      }
      appendLog(">> [OK] Validation passed.")
    } else {
      appendLog(">> [1. Validation] SKIPPED (No checks)")
    }

    if (mode === 'secure') {
        appendLog(">> [2. Sanitization] Auto-escaping via Placeholder...")
        await sleep(200)
        appendLog(">> [OK] Special characters neutralized.")
    } else {
        appendLog(">> [2. Sanitization] SKIPPED (Raw input used)")
    }

    appendLog(`>> [3. Execution] Running SQL... [Mode: ${mode.toUpperCase()}]`)
    await sleep(400)

    let result: any[] = []
    
    if (mode === 'vulnerable') {
      const input = queryInput
      if (input.includes("' OR '1'='1") || input.includes("' OR 1=1")) {
        appendLog(">> [WARN] Injection Successful!")
        result = MOCK_DB_USERS
      } 
      else if (input.includes("--") || input.includes("#")) {
         const cleanInput = input.split(/--|#/)[0].replace(/'/g, '').trim()
         result = MOCK_DB_USERS.filter(u => u.name === cleanInput)
         if(result.length > 0) appendLog(">> [WARN] Comment Attack Detected")
      }
      else {
        const cleanName = input.replace(/'/g, '')
        result = MOCK_DB_USERS.filter(u => u.name === cleanName)
      }
    } else {
      result = MOCK_DB_USERS.filter(u => u.name === queryInput)
    }

    if (result.length > 0) appendLog(`>> RESULT: ${result.length} records found.`)
    else appendLog(">> RESULT: No records found.")
    setQueryResult(result)
    setIsExecuting(false)
  }

  const renderSqlPreview = () => {
    const validationBlock = enableValidation ? (
      <div style={{ marginBottom: 8, padding: 8, background: '#064e3b', borderRadius: 4, border: '1px solid #059669' }}>
        <div style={{color: '#6ee7b7', fontSize: 11, marginBottom: 2, fontWeight: 'bold'}}>// 1. Validation (入力検証)</div>
        <span style={{color: '#f9a8d4'}}>if</span> (!input.<span style={{color: '#fcd34d'}}>match</span>(/^[a-zA-Z0-9]+$/)) <span style={{color: '#fca5a5'}}>throw Error</span>;
      </div>
    ) : (
      <div style={{ marginBottom: 8, padding: 8, border: '1px dashed #4b5563', borderRadius: 4, opacity: 0.5 }}>
        <div style={{color: '#9ca3af', fontSize: 11}}>// 1. Validation (検証なし)</div>
      </div>
    );

    let sqlBlock;
    const displayInput = queryInput || "(input)";

    if (mode === 'vulnerable') {
      sqlBlock = (
        <div style={{ padding: 10, background: '#450a0a', borderRadius: 4, border: '1px solid #7f1d1d' }}>
           <div style={{color: '#fca5a5', fontSize: 11, marginBottom: 4, fontWeight: 'bold'}}>// 2 & 3. No Protection (脆弱: 文字列結合)</div>
           <div style={{color: '#9ca3af', fontSize: 11, marginBottom: 4}}>※ 入力値がそのままSQLの一部になります</div>
           
           <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 1.5, color: '#e2e8f0' }}>
             <span style={{ color: '#c084fc' }}>const</span> sql = <span style={{ color: '#86efac' }}>"SELECT * FROM users WHERE name = '"</span> + <span style={{ color: '#fca5a5', fontWeight: 'bold', borderBottom: '1px solid #fca5a5' }}>input</span> + <span style={{ color: '#86efac' }}>"'"</span>;
           </div>

           <div style={{ marginTop: 10, padding: 8, background: '#1a0505', borderRadius: 4, border: '1px solid #5c1818' }}>
             <div style={{ fontSize: 10, color: '#7f1d1d', marginBottom: 2 }}>生成されるSQL:</div>
             <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#fca5a5' }}>
               SELECT * FROM users WHERE name = '<span style={{ fontWeight: 'bold', color: '#ef4444', textDecoration: 'underline' }}>{displayInput}</span>'
             </div>
           </div>
        </div>
      )
    } else if (secureType === 'prepared') {
      sqlBlock = (
        <div style={{ padding: 10, background: '#1e3a8a', borderRadius: 4, border: '1px solid #1d4ed8' }}>
           <div style={{color: '#93c5fd', fontSize: 11, marginBottom: 4, fontWeight: 'bold'}}>// 2 & 3. Placeholder (推奨: プリペアドステートメント)</div>
           <div style={{color: '#bfdbfe', fontSize: 11, marginBottom: 4, fontStyle: 'italic'}}>
             ※ 構造とデータが分離され、安全に実行されます
           </div>
           
           <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 1.5, color: '#e2e8f0' }}>
             <span style={{ color: '#c084fc' }}>const</span> sql = <span style={{ color: '#86efac' }}>"SELECT * FROM users WHERE name = <span style={{ color: '#fcd34d', fontWeight: 'bold' }}>?</span>"</span>;
             <br/>
             <span style={{ color: '#60a5fa' }}>db</span>.execute(sql, [<span style={{ color: '#86efac', fontWeight: 'bold' }}>input</span>]);
           </div>

           <div style={{ marginTop: 10, padding: 8, background: '#0f172a', borderRadius: 4, border: '1px solid #1e40af' }}>
             <div style={{ fontSize: 10, color: '#60a5fa', marginBottom: 2 }}>実行イメージ:</div>
             <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#93c5fd' }}>
               Statement: SELECT * FROM users WHERE name = ?
               <br/>
               Parameters: ["<span style={{ color: '#86efac' }}>{displayInput}</span>"]
             </div>
           </div>
        </div>
      )
    } else {
      sqlBlock = (
        <div style={{ padding: 10, background: '#1e3a8a', borderRadius: 4, border: '1px solid #1d4ed8' }}>
           <div style={{color: '#93c5fd', fontSize: 11, marginBottom: 4, fontWeight: 'bold'}}>// 2 & 3. ORM (推奨: Prisma等)</div>
           <div style={{color: '#bfdbfe', fontSize: 11, marginBottom: 4, fontStyle: 'italic'}}>
             ※ ORMが内部でプレースホルダを使用したSQLを生成します
           </div>
           
           <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 1.5, color: '#e2e8f0' }}>
             <span style={{ color: '#c084fc' }}>await</span> <span style={{ color: '#60a5fa' }}>prisma</span>.user.findMany({'{'}
             <br/>&nbsp;&nbsp;where: {'{'} name: <span style={{ color: '#86efac', fontWeight: 'bold' }}>input</span> {'}'}
             <br/>{'}'});
           </div>

           <div style={{ marginTop: 10, padding: 8, background: '#0f172a', borderRadius: 4, border: '1px solid #1e40af' }}>
             <div style={{ fontSize: 10, color: '#60a5fa', marginBottom: 2 }}>生成されるSQL (内部):</div>
             <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#93c5fd' }}>
               SELECT ... FROM "User" WHERE "name" = $1
               <br/>
               Parameters: ["<span style={{ color: '#86efac' }}>{displayInput}</span>"]
             </div>
           </div>
        </div>
      )
    }

    return (
      <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 1.5 }}>
        {validationBlock}
        <div style={{ textAlign: 'center', fontSize: 16, color: '#6b7280', margin: '4px 0' }}>↓</div>
        {sqlBlock}
      </div>
    )
  }

  const description = (
  <>
    <p className="text-lg font-medium">
      アプリやWebサービスでは、ログインIDや検索キーワードなど、
      <b>利用者から入力された文字</b>をもとに、
      サーバー側でさまざまな処理が行われています。
    </p>

    <p className="mt-3 text-lg font-medium">
      しかし、その入力をサーバー側が
      <span style={{ background: '#fef9c3', fontWeight: 500 }}>
        「そのまま信じて使ってしまう」
      </span>
      と、開発者が意図していない動作を引き起こしてしまうことがあります。
    </p>

    <p className="mt-3 text-gray-700">
      この章では、
      <b>入力がどのように処理に影響するのか</b>を実際に確かめながら、
      <b>「なぜ入力の検証や制限が必要なのか」</b>を学びます。
    </p>
  </>
);


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
              📝 2章の見どころ
            </CardTitle>
          </CardHeader>
  
          <CardContent style={{ paddingTop: 0 }}>
            <ul style={{ fontSize: 15, marginLeft: 18, marginBottom: 0 }}>
              <li>
                ・入力は、サーバー側でどのように扱われている？
              </li>

              <li>
                ・入力を検証しないと、何が起きてしまう？
              </li>

              <li>
                ・入力を制限・検証すると、結果はどう変わる？
              </li>
              <br />
              <ul style={{ fontSize: 16, marginTop: 5 }}>
                <b>→ 実際に操作しながら、違いを体験します</b>
              </ul>
            </ul>
          </CardContent>
        </Card>
      );
  const summary = (
    <Card>
  <CardHeader>
    <CardTitle className="text-lg font-bold">
      2章のまとめ
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
          <b>Q.</b> 入力は、サーバー側でどのように扱われている？
          <br />
          <span className="ml-4">
            <b>→ </b>
            データベースを検索するための
            <b>「材料」</b>として使われています。
          </span>
        </li>

        <li>
          <b>Q.</b> 入力を検証しないと、何が起きてしまう？
          <br />
          <span className="ml-4">
            <b>→ </b>
            入力がただのデータではなく、
            <b>命令の一部として解釈されてしまう</b>
            ことがあります。
          </span>
        </li>

        <li>
          <b>Q.</b> 入力を制限・検証すると、結果はどう変わる？
          <br />
          <span className="ml-4">
            <b>→ </b>
            入力は
            <b>「中身の値」</b>としてのみ扱われ、
            処理の意味が勝手に変わらなくなります。
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
        この章で見てきたSQLインジェクションの根本的な問題は、
        <b>危ない文字が入力されたことではありません</b>。
        <br />
        本当に問題なのは、
        <span style={{ color: '#4f46e5', fontWeight: 600 }}>
          「入力を、どういう役割として扱っているか」
        </span>
        です。
      </p>

      <p style={{ fontSize: 16, marginTop: 12 }}>
        入力された文字をそのまま文の一部としてつなげると、
        その中に条件やルールのような意味を持つ文字が含まれていた場合、
        <b>処理の内容そのものが書き換わってしまいます</b>。
      </p>

      <p style={{ fontSize: 16, marginTop: 12 }}>
        一方で、安全な実装では、
        最初に
        <span style={{ color: '#4f46e5', fontWeight: 600 }}>
          「どんな処理をするか」
        </span>
        を固定し、
        ユーザーの入力はあとから
        <b>「値」として当てはめる</b>
        だけにします。
        <br />
        こうすることで、
        入力がどんな内容でも、
        <b>命令として扱われることはありません</b>。
      </p>

      {/* 締め */}
      <div className="mt-4 pt-3 border-t text-gray-700 font-medium">
        「普通に検索できているから大丈夫」と思えるコードでも、
        入力の扱い方次第で
        <b>意図しない情報の流出</b>
        が起こることがあります。
      </div>
    </div>
  </CardContent>
</Card>
  );

  const children = (
      <>
        <div style={{ background: '#fff', padding: 20, borderRadius: 8, border: '1px solid #e5e7eb' }}>
          <h3 style={{ ...styles.h3, marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={20} color="#2563eb" /> SQLインジェクションとは？
          </h3>
          {/* 一言まとめ */}
          <p style={{ fontSize: 17, fontWeight: 600, color: '#1f2937', marginBottom: 10 }}>
            SQLインジェクションとは、<span className="text-indigo-600">利用者が入力した文字が、そのままデータベースへの命令として扱われてしまうことで起こる問題</span>です。
            その結果、本来は想定していないデータの取得や変更が行われてしまうことがあります。
          </p>
          {/* やさしい説明 */}
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7 }}>
            Webアプリケーションでは、利用者が入力した内容をもとに、データベースから情報を探す仕組みがよく使われています。
            <br />
            しかし、入力内容の扱い方に注意しないと、<b>開発者が意図していない動作</b>を引き起こしてしまう可能性があります。
          </p>


          <div
            style={{
              marginTop: 20,
              padding: 16,
              background: '#f3f4f6',
              borderRadius: 8,
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <div style={{ textAlign: 'center', maxWidth: 420 }}>
              
              {/* 入力 */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 700, marginTop: 4, fontSize:13, marginBottom: 3 }}>
                  ユーザーの入力
                </div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>
                  例：名前やIDを入力する
                </div>

                {/* <div
                  style={{
                    marginTop: 6,
                    background: '#fff',
                    padding: '6px 10px',
                    borderRadius: 6,
                    fontSize: 13,
                    display: 'inline-block'
                  }}
                >
                  Alice
                </div> */}
              </div>

              <ArrowDown size={18} style={{ margin: '6px auto' }} />

              {/* 本来の想定 */}
              <div
                style={{
                  background: '#ecfeff',
                  border: '1px solid #67e8f9',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontSize: 13,
                  marginBottom: 10
                }}
              >
                <div style={{ fontWeight: 700, color: '#155e75', marginBottom: 4 }}>
                  開発者の想定
                </div>
                <div>
                  入力は <b>検索条件の文字</b> として使われる
                </div>
              </div>

              <ArrowDown size={18} style={{ margin: '6px auto' }} />

              {/* 危険ポイント */}
              <div
                style={{
                  background: '#fef2f2',
                  border: '2px solid #fca5a5',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontSize: 13,
                  marginBottom: 10
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
                  <AlertTriangle size={16} color="#b91c1c" />
                  <span style={{ fontWeight: 700, color: '#991b1b' }}>
                    実際に起きること
                  </span>
                </div>
                <div>
                  入力が <b>命令の一部</b> として解釈されてしまう
                </div>
                <div style={{ fontSize: 12, color: '#7f1d1d', marginTop: 4 }}>
                  ※ 入力がそのまま処理に混ざってしまうため
                </div>
              </div>

              <ArrowDown size={18} style={{ margin: '6px auto' }} />

              {/* 結果 */}
              <div
                style={{
                  background: '#fff7ed',
                  border: '1px solid #fdba74',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontSize: 13
                }}
              >

                <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 4  }}>
                  <Database size={18} color="#9a3412" />
                  <span style={{ fontWeight: 700, color: '#9a3412', marginLeft: 6 }}>
                    データベースの結果
                  </span>
                </div>
                <div>
                  本来ユーザーに見せないはずの
                  <b>データが返る</b>
                </div>
              </div>
            </div>
          </div>
          {/* 補足（軽く） */}
          <p style={{ marginTop: 12, fontSize: 14, color: '#6b7280' }}>
            ※ 入力を<b>どのように処理しているか</b>によって、安全か危険かが変わります。
          </p>
        </div>
        <br />
        <Card>
          <CardHeader>
            <CardTitle>
              データベース検索処理の比較
            </CardTitle>
            <CardDescription>
              同じ「ユーザー検索」でも、<b>入力をSQLにどう渡すか</b>で結果が変わります。<br />
              左は<b>入力が命令として混ざる</b>例、右は<b>入力を値として分ける</b>例です。
            </CardDescription>
          </CardHeader>
          <hr style={{ border: 'none', height: 1, background: '#e5e7eb', margin: '3px 0' }} />
          <CardContent>
          <div style={styles.comparison}>
            <div style={styles.comparisonColumn}>
              <p style={{ fontSize: 16, marginBottom: 12, lineHeight: 1.7 }}>
                <span style={{ color:'#dc2626', fontWeight: 700 }}>脆弱な実装</span>では、入力を文字列としてつなげてSQLを作っています。<br />
                その結果、入力の一部が<b>命令（条件）</b>として解釈されることがあります。
              </p>
              <div
                style={{
                  background: '#fff7f7',
                  border: '1px solid #fca5a5',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                  marginBottom: 12
                }}
              >
                <span style={{ margin: 0, fontWeight: 600 }}>
                  例：入力にこれを入れると...　
                  <code style={{ fontFamily: 'monospace', fontSize: 15, color: '#991b1b' }}>
                    ' OR '1'='1
                  </code>
                </span>
              </div>
              <div
                style={{
                  ...styles.codeContainer,
                  background: '#fef2f2',
                  border: '3px solid #fca5a5'
                }}
              >
                <div style={{ ...styles.codeLabel, color: '#dc2626' }}>
                  ⚠️ 脆弱な実装例
                </div>
                <pre style={styles.code}>
{`const query =
  "SELECT * FROM users WHERE name = "'" + `} <span style={{
  background: '#ef4444',
  color: '#fff',
  padding: '2px 4px',
  borderRadius: '3px',
  fontWeight: 'bold'
}}>req.body.name</span>{` + "'";`}
                </pre>
              </div>

              {/* コード → 入力 → 結果の流れ */}
              <div style={{ textAlign: 'center', margin: '12px 0' }}>
                <ArrowDown size={18} style={{ margin: '6px auto' }} />
              </div>

              <p style={{ fontSize: 14, lineHeight: 1.7 }}>
                すると、入力された文字列がそのままつながり、SQLは次の形になります。
              </p>

              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: 12, fontFamily: 'monospace', fontSize: 14, color: '#7f1d1d', marginBottom: 12 }}>
                SELECT * FROM users WHERE name = '' OR '1'='1'
              </div>

              <p style={{ fontSize: 14, lineHeight: 1.7 }}>
                <code>'1'='1'</code> は<b>いつでも成り立つ条件</b>です。<br />
                つまりこのSQLは「名前が空文字(何も入力されていない) <b>または</b> いつでもtrue」という意味になり、<br />
                結果として<b>usersテーブルの全データを取得する</b>ことになります。
              </p>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#991b1b', marginTop: 8 }}>
                つまり、入力がSQLの「条件」として解釈されてしまったことが原因です。
              </p>

            </div>
            <div style={styles.divider} />
            <div style={styles.comparisonColumn}>
              <p style={{ fontSize: 16, marginBottom: 12, lineHeight: 1.7 }}>
                <span style={{ color:'#138c40ff', fontWeight: 700 }}>安全な実装</span>では、SQLの形を先に決め、入力は<b>値として別に渡します</b>。<br />
                そのため入力がSQLの命令部分に混ざらず、SQLの構造が変わりません。
              </p>
              <div
                style={{
                  ...styles.codeContainer,
                  background: '#f0fdf4',
                  border: '3px solid #86efac'
                }}
              >
                <div style={{ ...styles.codeLabel, color: '#16a34a' }}>
                  ✓ 安全な実装例
                </div>

                <pre style={styles.code}>
{`const query =
  "SELECT * FROM users WHERE name = ?";

db.execute(query, `}<span style={{
      background: '#429460',
      color: '#fff',
      padding: '2px 4px',
      borderRadius: '3px',
      fontWeight: 'bold'
    }}>{`[req.body.name]`}</span>{` );`}
                </pre>
              </div>
              <div style={{ textAlign: 'center', margin: '12px 0' }}>
                <ArrowDown size={18} style={{ margin: '6px auto' }} />
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.7 }}>
                ここに <b><code>' OR '1'='1</code></b> を入力しても、これは<b>ただの名前の文字列</b>として扱われます。<br />
                SQLの条件が増えたり変わったりしないので、<b>全データの取得にはつながりません</b>。
              </p>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#1b9938ff', marginTop: 8 }}>
                つまり、入力はあくまで<b>検索に使う文字</b>として扱われ、SQLの命令部分には入り込みません。

              </p>
            </div>
            </div>
          </CardContent>
        </Card>
        <br />
      <section style={styles.section}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div>
          <Card>
            <CardHeader>
              <CardTitle style={{ marginBottom: 10 }}>
                SQLインジェクションデモ：入力が「命令」になる瞬間を体験しよう
              </CardTitle>
              <CardDescription>
                <p>
                  このデモでは、<b>SQLインジェクションという攻撃手法</b>そのものではなく、
                  <b>ユーザー入力の扱い方の違い</b>によって、
                  データベースの動きがどう変わるかを体験します。
                </p>
                <p style={{ marginTop: 6 }}>
                  同じ検索入力でも、
                  <b>入力をそのままSQLに組み込む場合</b>と、
                  <b>入力を値として安全に渡す場合</b>では、
                  データベースに伝わる意味が大きく異なります。
                </p>
              </CardDescription>
            </CardHeader>
            <hr style={{ border: 'none', height: 1, background: '#e5e7eb' }} />
            <CardContent className="space-y-4">
              <h3 style={{ ...styles.h3, marginTop: 2, color: '#0f172a' }}>
                🚀 試してみよう
              </h3>
              <ol className="ml-4 space-y-4" style={{ fontSize: 15, lineHeight: 1.8 }}>
                <li>
                  <div style={{ fontWeight: 700 }}>
                    【ステップ1】まずは「普通の検索」を確認する
                  </div>
                  <div style={{ color: '#313a47ff', marginTop: 6 }}>
                    入力欄に <code>alice</code> と入力し、
                    <b>「脆弱な実装」</b>のまま実行してください。<br />
                    <b>名前が一致するユーザーだけ</b>が取得されることが確認できます。
                  </div>
                </li>
                <li>
                  <div style={{ fontWeight: 700 }}>
                    【ステップ2】攻撃用の入力を試す
                  </div>
                  <div style={{ color: '#313a47ff', marginTop: 6 }}>
                    次に、<code>' OR '1'='1</code> を入力して実行してみましょう。<br />
                    今度は、<b>本来1人だけ取得されるはずの検索が、全ユーザー取得に変わる</b>ことが確認できます。
                  </div>
                </li>
                <li>
                  <div style={{ fontWeight: 700 }}>
                    【ステップ3】「入力が命令として解釈された」ことを確認する
                  </div>
                  <div style={{ color: '#313a47ff', marginTop: 6 }}>
                    検索結果を見ると、入力した文字列が<b>SQL文の一部(条件)として組み込まれている</b>ことが分かります。
                    <br />
                    全てのユーザーデータが取得されており、
                    本来は見えるはずのない情報が見えてしまっていることが確認できます。
                  </div>
                </li>
                <li>
                  <div style={{ fontWeight: 700 }}>
                    【ステップ4】安全な実装に切り替えて比較する
                  </div>
                  <div style={{ color: '#313a47ff', marginTop: 6 }}>
                    次に<b>「安全な実装」</b>に切り替えて、
                    同じ入力をもう一度実行してみましょう。<br />
                    今度は、<b>どんな入力をしても</b>、<b>SQLに書かれた条件の形が固定されたまま</b>であることが確認できます。
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 10}}>
              {/* モード切替ボタン */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                <button
                  type="button"
                  onClick={() => {
                    setMode('vulnerable')
                    setQueryResult(null)
                  }}
                  style={{
                    ...btnBase,
                    ...(mode === 'vulnerable'
                      ? { borderColor: '#ef4444', background: '#fff7f7' }
                      : {})
                  }}
                >
                  ⚠️ 脆弱な実装
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('secure')
                    setQueryResult(null)
                  }}
                  style={{
                    ...btnBase,
                    ...(mode === 'secure'
                      ? { borderColor: '#16a34a', background: '#f7fffb' }
                      : {})
                  }}
                >
                  ✓ 安全な実装
                </button>
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: 14 }}>
                  検索入力
                </label>
                <input
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="例: alice"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 6,
                    border: '1px solid #d1d5db',
                    marginTop: 4
                  }}
                />
              </div>

              <button
                onClick={executeQuery}
                disabled={isExecuting}
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  background: '#2563eb',
                  color: '#fff',
                  fontWeight: 600
                }}
              >
                実行
              </button>
              <Card>
                <CardHeader>
                  <CardTitle style={{ fontSize: 14 }}>
                     検索結果 
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ minHeight: 120 }}>
                    {queryResult === null ? (
                      <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                        実行待ち...
                      </div>
                    ) : queryResult.length === 0 ? (
                      <div style={{ textAlign: 'center', color: '#6b7280' }}>
                        該当データなし
                      </div>
                    ) : (
                      queryResult.map(u => (
                        <div
                          key={u.id}
                          style={{
                            padding: '6px 10px',
                            borderBottom: '1px solid #e5e7eb',
                            background: u.role === 'admin' ? '#fef2f2' : '#fff',
                            color: u.role === 'admin' ? '#b91c1c' : '#111827'
                          }}
                        >
                          {u.id} / {u.name} / {u.email}
                        </div>
                      ))
                    )}
                  </div>
                  {queryResult?.some(u => u.role === 'admin') && mode === 'vulnerable' && (
                    <div
                      style={{
                        marginTop: 8,
                        padding: 8,
                        background: '#fef2f2',
                        border: '1px solid #fca5a5',
                        borderRadius: 6,
                        color: '#b91c1c',
                        fontWeight: 700,
                        display: 'flex',
                        gap: 6
                      }}
                    >
                      <ShieldAlert size={16} />
                      管理者データが漏洩しました
                    </div>
                  )}
                </CardContent>
              </Card>
              {/* <BackendMonitor
                renderSqlPreview={renderSqlPreview}
                logs={logs}
                scrollRef={scrollRef}
              /> */}
            </div>
          </div>
        </section>
      </>
  );

  return (
    <SectionLayout
      title1="2.その入力、本当にただの文字列？"
      title2="〜 SQLインジェクション入門 〜"
      description={description}
      checklist={checklist}
      summary={summary}
    >
      {children}
    </SectionLayout>
  )
}