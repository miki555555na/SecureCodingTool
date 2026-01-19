'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// デモ用: テストキーは DOM の hidden input に格納しています（開発者ツールで確認できます）
// 実運用ではクライアントに秘密を置かないでください。

export function HardCordDemo() {
  const [input, setInput] = useState('');
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const callApi = async () => {
    setRunning(true);
    setMessage('API にリクエスト中…');
    setSuccess(null);

    // 疑似的な遅延
    await new Promise((r) => setTimeout(r, 600));

    const expected = (document.getElementById('expected-key') as HTMLInputElement | null)?.value ?? '';
    if (input.trim() === expected) {
      setMessage('✅ 正解: 正しい API キーです（デモ成功）');
      setSuccess(true);
    } else {
      setMessage('✖️ 誤り: API キーが正しくありません');
      setSuccess(false);
    }

    setRunning(false);
  };

  const clear = () => {
    setInput('');
    setMessage(null);
    setSuccess(null);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <input type="hidden" id="expected-key" value="hardcord-testkey-xyz123" />
      
      {/* デモ用スクリプト：疑似的にハードコードされたテスト API キーを注入します。
          **デバッグ専用**で、本番に公開しないでください。 */}
      <script dangerouslySetInnerHTML={{
        __html: `
          /* デバッグ用：API キーの設定　！！！本番環境では消すこと！！！ */
          // fetch("https://example.com/api", {
          //   method: "GET",
          //   headers: {
          //     "x-api-key": "hardcord-testkey-xyz123" /* TEST API KEY */
          //   }
          // })
          //   .then(res => res.json())
          //   .then(data => console.log(data))
          //   .catch(err => console.error(err));
        `
      }} />

      <div className="flex flex-col gap-4">
        
        <div className="p-4 rounded-md border bg-slate-50">
          <h3 className="text-lg font-bold mb-2">デモ：ハードコードされた API キーの危険性</h3>
          <p className="text-sm text-slate-600 mb-3">
             開発者ツールを使ってこのファイルのソースを探すと、コメントに埋め込まれたテストキーが見つかります。
          </p>

          <label htmlFor="api-key-input" className="block text-sm font-semibold mb-1">API キー（ここに貼り付け）</label>
          <div className="flex gap-2">
            <Input
              id="api-key-input"
              value={input}
              onChange={(e) => setInput((e.target as HTMLInputElement).value)}
              placeholder="ここに API キーを入力"
              className="bg-white"
            />
            <Button onClick={callApi} disabled={running} aria-label="API を叩く" className="bg-blue-600 text-white font-bold whitespace-nowrap">
              API を叩く
            </Button>
            <Button variant="outline" onClick={clear} aria-label="入力をクリア">
              クリア
            </Button>
          </div>
        </div>

        <div 
           className={`p-4 rounded-md border flex items-center gap-3 transition-all ${
             success === true 
               ? 'bg-green-50 border-green-200 text-green-800' 
               : success === false 
                 ? 'bg-red-50 border-red-200 text-red-800' 
                 : 'bg-white border-slate-200 text-slate-600'
           }`}
           style={{ minHeight: 60 }}
           aria-live="polite"
        >
           {message ?? '結果: デモの実行結果はここに表示されます。'}
        </div>

      </div>
    </div>
  );
}
