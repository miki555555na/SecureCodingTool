"use client";
import { useState } from "react";

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

export default function XSSDemoPage() {
  const [mode, setMode] = useState<'vulnerable' | 'secure'>('vulnerable');
  const [input, setInput] = useState('');
  const literalInput = JSON.stringify(input);
  const shownCode = mode === 'vulnerable'
    ? `// 脆弱な実装\nfunction render(input) {\n  // ユーザー入力をそのままHTMLに埋め込む（危険）\n  document.getElementById('output').innerHTML = ${literalInput};\n}`
    : `// 安全な実装\nfunction render(input) {\n  // テキストとして挿入してエスケープする\n  document.getElementById('output').textContent = ${literalInput};\n}`;

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">XSS デモ</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* 左: コード例 */}
        <aside className="md:w-1/2 bg-gray-50 p-4 rounded border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">コード例</h2>
            <div className="flex gap-2">
              <button
                aria-pressed={mode === 'vulnerable'}
                onClick={() => setMode('vulnerable')}
                className={`px-3 py-1 rounded ${mode === 'vulnerable' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'}`}>
                脆弱な実装
              </button>
              <button
                aria-pressed={mode === 'secure'}
                onClick={() => setMode('secure')}
                className={`px-3 py-1 rounded ${mode === 'secure' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'}`}>
                安全な実装
              </button>
            </div>
          </div>

          <div className={`whitespace-pre-wrap text-sm p-3 rounded ${mode === 'vulnerable' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            <div className="text-sm font-medium mb-2">コード例</div>
            <pre className="p-3 bg-white rounded min-h-[120px] break-words text-gray-800 overflow-auto"><code>{shownCode}</code></pre>
          </div>
        </aside>

        {/* 右: デモ */}
        <section className="md:w-1/2 bg-white p-4 rounded border">
          <h2 className="font-semibold mb-2">デモ</h2>

          <label className="sr-only" htmlFor="xss-input">入力</label>
          <div className="flex gap-2 mb-3">
            <input
              id="xss-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border p-2 rounded"
              placeholder="ここに入力... (例: &lt;img src=x onerror=alert('This is XSS')&gt;)"
              aria-label="ユーザー入力"
            />
          </div>

          <div>
            <h3 className="font-medium">出力</h3>
            <div id="output" className="mt-2 p-3 border rounded min-h-[80px] bg-gray-50">
              {mode === 'vulnerable' ? (
                <div dangerouslySetInnerHTML={{ __html: input }} />
              ) : (
                <div>{input}</div>
              )}
            </div>
          </div>

          <p className="mt-3 text-sm text-gray-600">モード: {mode === 'vulnerable' ? '脆弱（dangerous: innerHTML を使用）' : '安全（textContent / React の自動エスケープ）'}</p>
        </section>
      </div>
    </main>
  );
}
