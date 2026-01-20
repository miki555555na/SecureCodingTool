'use client';

import React, {useMemo,useState} from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import SectionLayout from '../../Framework/SectionLayout';
import { styles } from '../../Framework/SectionStyles';
import { 
  Unlock 
} from 'lucide-react'

const vulnerableCode = `// 脆弱な実装
function render(input) {
  // ユーザー入力をそのままHTMLに埋め込む（危険）
  document.getElementById('output').innerHTML = input;
}`;

const secureCode = `// 安全な実装
function render(input) {
  // テキストとして挿入してエスケープする
  document.getElementById('output').textContent = input;
}`;
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




export default function XSSDemoPage() {
  const [mode, setMode] = useState<'vulnerable' | 'secure'>('vulnerable');
  const [input, setInput] = useState('');
  const literalInput = JSON.stringify(input);
  //checklist
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
            📝 2章の見どころ
          </CardTitle>
        </CardHeader>

        <CardContent style={{ paddingTop: 0 }}>
          <ul style={{ fontSize: 15, marginLeft: 18, marginBottom: 0 }}>
            <li>
              ・XSS脆弱性はどのように生まれる？
            </li>
            <li>
              ・入力者のHTMLをそのまま使用する際のリスクとは？
            </li>
            <li>
              ・XSS攻撃を防ぐにはどうすれば良い？
            </li>
            <br />
            <ul style={{ fontSize: 16, marginTop: 5 }}>
              <b>→ 実際に動かしながら確認します</b>
            </ul>
          </ul>
        </CardContent>
      </Card>
    );
    
    //description
    const description = (
      <p className="text-lg font-medium">
        ユーザーからの入力をそのままウェブページに表示する際、適切な対策を講じないと<b>クロスサイトスクリプティング（XSS）攻撃</b>のリスクがあります。<br />
        例えば、<code>&lt;script&gt;</code>タグや<code>onerror</code>属性を含む悪意のあるスクリプトが実行される可能性があります。<br />
        この章では、脆弱な実装例と安全な実装例を比較しながら、XSS攻撃の仕組みと防止方法について学びます。
      </p>
    );

    //summary
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
              border: '2px solid #fed7aeff',
              background: '#fbf1e2ff'
            }}
          >
            <p className="font-semibold mb-3 text-slate-800" style={{ fontSize: 16 }}>
              この章のはじめに投げた問い、答えはこうでした
            </p>

            <ul className="space-y-2 text-gray-700">
              <li>
                <b>Q.</b> XSS脆弱性はどのように生まれる？<br />
                <span className="ml-4">
                  <b>→ </b>
                  ユーザー入力をそのままHTMLとして扱うことで、<code>&lt;script&gt;</code>タグや<code>onerror</code>属性を含むスクリプトが実行されるため。
                </span>
              </li>

              <li>
                <b>Q.</b> 入力者のHTMLをそのまま使用する際のリスクとは？<br />
                <span className="ml-4">
                  <b>→ </b>
                  攻撃者が悪意のあるスクリプトを埋め込むことで、<b>任意のJavaScriptが実行される</b>可能性がある。
                </span>
              </li>

              <li>
                <b>Q.</b> XSS攻撃を防ぐにはどうすれば良い？<br />
                <span className="ml-4">
                  <b>→ </b>
                  <code>innerHTML</code>の使用を避け、<code>textContent</code>を使って<b>エスケープ処理</b>を行う。また、Reactの<code>dangerouslySetInnerHTML</code>を使用する場合は、信頼できるデータのみを扱う。
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
              この章では、XSS攻撃の仕組みとそのリスクについて学びました。
              <b>ユーザー入力をそのままHTMLとして扱うことの危険性</b>を理解し、適切なエスケープ処理を行う重要性を確認しました。
            </p>

            <p style={{ fontSize: 16, marginTop: 12 }}>
              Reactのようなモダンなフレームワークは、デフォルトでエスケープ処理を行うため、XSSリスクを軽減できます。<br />
              ただし、<code>dangerouslySetInnerHTML</code>を使用する場合は、信頼できるデータのみを扱うように注意が必要です。
            </p>

            {/* 締め */}
            <div className="mt-4 pt-3 border-t text-gray-700 font-medium">
              「想定内の利用をすれば正しく動くコード」でも、<b>タグの埋め込みなど想定外の利用をされる</b>と、XSS攻撃のリスクが生じます。
              <br />
            </div>
          </div>
        </CardContent>
      </Card>
    );

    //デモ
    
    


    const shownCode =
  mode === 'vulnerable'
    ? `// 脆弱な実装
function render(input) {
  // ユーザー入力をそのままHTMLとして表示してしまう（危険）
  document.getElementById('output').innerHTML = input;
}

// 入力例
render(${literalInput});`
    : `// 安全な実装
function render(input) {
  // テキストとして表示する（HTMLとして解釈しない）
  document.getElementById('output').textContent = input;
}

// 入力例
render(${literalInput});`;



    const [rendered, setRendered] = useState(''); // 出力に反映する値（実行ボタンで更新）

    const resetFlag = () => {
      const el = document.getElementById('xss-flag');
      if (el) el.textContent = 'まだ何も起きていません';
    };

    const run = () => {
      resetFlag();
      setRendered(input);
    };

    const clearOutput = () => {
      resetFlag();
      setInput('');      // ← 入力欄も消す
      setRendered('');   // ← 出力も消す
    };



    const children = (<>
      <div style={{ background: '#fff', padding: 20, borderRadius: 8, border: '1px solid #e5e7eb' }}>
        <h3 style={{ ...styles.h3, marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Unlock size={20} color="#b91c1c" />
          攻撃者は、何を見ている？
        </h3>
        <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7 }}>
          攻撃者は、ウェブページに表示される内容だけでなく、<b>その裏で動いている仕組み</b>や、<b>入力がどのように処理されるか</b>を観察しています。
          <br />
          例えば、ユーザー入力がそのままHTMLとして扱われている場合、攻撃者は
          <code>&lt;script&gt;</code>タグや<code>onerror</code>属性を利用して、悪意のあるスクリプトを実行することができます。
        </p>

        <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, marginTop: 12 }}>
          また、攻撃者は、<b>どのようなデータがどのように表示されるか</b>を観察し、脆弱性を探します。
          例えば、<b>エラーメッセージや出力内容</b>に含まれる情報が、攻撃の手がかりになることがあります。
        </p>
        <div
          style={{
            marginTop: 14,
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: 8,
            padding: 12,
            fontSize: 14,
            color: '#7f1d1d'
          }}
        >
          <b>ポイント：</b><br />
          ・ユーザー入力をそのままHTMLとして扱うと、<b>意図しないスクリプトが実行される</b>可能性がある。<br />
          ・<code>innerHTML</code>のような危険なAPIを使う場合は、特に注意が必要。<br />
          ・Reactの<code>dangerouslySetInnerHTML</code>は、名前の通り<b>危険</b>であり、信頼できるデータ以外には使用しない。
        </div>
      </div>
      <br />

      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            background: '#eef2ff',
            borderLeft: '4px solid #6366f1',
            borderRadius: 6,
            padding: 12
          }}
        >
          <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>
            よくある勘違い
          </p>
          <p style={{ marginTop: 6, fontSize: 14, lineHeight: 1.6 }}>
            「ユーザー入力をそのまま表示しても、問題ないのでは？」<br />
            → <b>実際には、HTMLとして解釈されるとスクリプトが実行される可能性があります。</b>
          </p>
          <p style={{ marginTop: 6, fontSize: 14, lineHeight: 1.6 }}>
            「Reactを使っているから安全？」<br />
            → <b>Reactはデフォルトでエスケープ処理を行いますが、<code>dangerouslySetInnerHTML</code>を使うとリスクが発生します。</b>
          </p>
          <p style={{ marginTop: 6, fontSize: 14, lineHeight: 1.6 }}>
            「エスケープ処理をすれば完全に安全？」<br />
            → <b>エスケープ処理が不十分だったり、ライブラリの脆弱性がある場合は、攻撃を防ぎきれない可能性があります。</b>
          </p>
        </div>
      </div>

      <Card style={{ marginBottom: 12 }}>
        <CardHeader>
          <CardTitle style={{ marginBottom: 10 }}>
            XSSの脆弱性があるとどんなことが出来るの？
          </CardTitle>
          <CardDescription>
            <p>
              このデモでは、入力した文字がページにどう表示されるかを比べます。
              <br />
              「⚠️ 脆弱な実装」では入力が<b>そのままHTMLとして扱われる</b>ため、
              見た目が変わったり、勝手に動くものを仕込めてしまうことがあります。
              <br />
              「✓ 安全な実装」では入力を<b>文字として表示</b>するので、同じことが起きません。
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
      【ステップ1】まずは「見た目が変わる」入力で試す（確実に分かる）
    </div>
    <div style={{ color: '#475569', marginTop: 6 }}>
      「⚠️ 脆弱な実装」を選び、次を入力してみてください：
      <br />
      <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>
        &lt;b style="color:red"&gt;赤くなったら成功&lt;/b&gt;
      </code>
      <br />
      出力が<b>赤い太字</b>になれば、「入力がそのままHTMLとして解釈されている」状態です。
    </div>
  </li>

  <li>
    <div style={{ fontWeight: 700 }}>
      【ステップ2】次に「勝手に動く」入力で試す（危険さが分かる）
    </div>
    <div style={{ color: '#475569', marginTop: 6 }}>
      つづけて次を入力してみてください：
      <br />
      <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>
        &lt;img src=x onerror="document.getElementById('xss-flag').textContent='✅ スクリプトが動いた'"&gt;
      </code>
      <br />
      出力の下にある<b>「実行結果」</b>が変われば成功です。
    </div>
  </li>

  <li>
    <div style={{ fontWeight: 700 }}>
      【ステップ3】「✓ 安全な実装」に切り替えて比べる
    </div>
    <div style={{ color: '#475569', marginTop: 6 }}>
      同じ入力を「✓ 安全な実装」で試してください。
      <br />
      今度は<b>赤字にならず</b>、<b>実行結果も変わらない</b>ことを確認しましょう。
      <br />
      つまり「入力を文字として扱う」と、勝手に動かせなくなります。
    </div>
  </li>
</ol>
        </CardContent>
      </Card>
      <br />

      <div className="flex flex-col md:flex-row gap-6">
        {/* 左: コード例 */}
        <aside className="md:w-1/2 bg-gray-50 p-4 rounded border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">コード例</h2>
            <div className="flex gap-2">
              <button
              type='button'
                aria-pressed={mode === 'vulnerable'}
                onClick={() => { setMode('vulnerable');
                    const el = document.getElementById('xss-flag');
                    if (el) el.textContent = 'まだ何も起きていません';
                    resetFlag();
                    setRendered('');
                }}
                
                style={{
                  ...btnBase,
                  border: mode === 'vulnerable' ? '2px solid #ef4444' : '1px solid #cbd5e1',
                  background: mode === 'vulnerable' ? '#fef2f2' : '#fff',
                }}
                >
                  ⚠️ 脆弱な実装
              </button>
              <button
                type="button"
                onClick={() => {setMode('secure');
                    const el = document.getElementById('xss-flag');
                    if (el) el.textContent = 'まだ何も起きていません';
                    resetFlag();
                    setRendered('');
                }}
                style={{
                  ...btnBase,
                  border: mode === 'secure' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                  background: mode === 'secure' ? '#f0fdf4' : '#fff'
                }}
              >
                ✓ 安全な実装
              </button>
            </div>
          </div>

          <div className={`whitespace-pre-wrap text-sm p-3 rounded}`}>
            <pre style={styles.code} className="p-3 bg-white rounded min-h-[120px] break-words text-gray-800 overflow-auto"><code>{shownCode}</code></pre>
          </div>
        </aside>

        {/* 右: デモ */}
        <section className="md:w-1/2 bg-white p-4 rounded border">
          <h2 className="font-semibold mb-2">入力</h2>

          <label className="sr-only" htmlFor="xss-input">入力</label>
          <div className="flex gap-2 mb-3">
  <input
    id="xss-input"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    className="flex-1 border p-2 rounded"
    placeholder="ここに入力... (例: <img src=x onerror=...>)"
    aria-label="ユーザー入力"
  />

  <button
    type="button"
    onClick={run}
    style={{
      ...btnBase,
      background: '#2563eb',
      color: '#fff',
      border: 'none',
      fontWeight: 700
    }}
  >
    実行
  </button>

  <button
    type="button"
    onClick={clearOutput}
    style={{
      ...btnBase,
      background: '#fff',
      border: '1px solid #cbd5e1',
      color: '#334155'
    }}
  >
    クリア
  </button>
</div>

          <div>
  <h3 className="font-medium">出力</h3>

  {/* ここが実際の出力 */}
  <div id="output" className="mt-2 p-3 border rounded min-h-[80px] bg-gray-50">
    {mode === 'vulnerable' ? (
      <div dangerouslySetInnerHTML={{ __html: rendered }} />
    ) : (
      <div>{rendered}</div>
    )}
  </div>

  {/* 実行結果 */}
  <div className="mt-3 rounded border bg-white p-3 text-sm text-gray-700">
    <div className="font-semibold mb-1">実行結果</div>
    <div id="xss-flag" className="text-gray-600">
      まだ何も起きていません
    </div>
  </div>
</div>


          <p className="mt-3 text-sm text-gray-600">モード: {mode === 'vulnerable' ? '脆弱（dangerous: innerHTML を使用）' : '安全（textContent / React の自動エスケープ）'}</p>
        </section>
      </div>
      </>);
  
  return (
        <SectionLayout
            title1="2.入力しただけで、何か動いていませんか？"
            title2="〜 HTML書式の危険性  〜"
            description={description}
            checklist={checklist}
            summary={summary}
        >
            {children}
        </SectionLayout>
  );
}