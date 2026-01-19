'use client';

import React, { useState, useRef} from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import SectionLayout from '../../Framework/SectionLayout';
import { styles } from '../../Framework/SectionStyles';
import { CacheDemo } from './CacheDemo';
import { 
  Shield, 
  Unlock, 
  Activity, 
  Terminal, 
  CheckCircle,
  ArrowRight,
  FileDigit,
  KeyRound,
  Layers,
  Code2,
  ArrowDown,
  Underline,
  BadgeCheck,
  User,
  Database,
  Server,
  Clock,
  HardDrive,
  Zap,
  Code,
  AlertTriangle,
  ArrowLeft,
  Laptop,
  Globe,
  X,
  CornerUpLeft,
  CornerDownLeft
} from 'lucide-react'


export default function CacheTimingPage(){
  const Box: React.FC<{ title: string; icon: React.ReactNode; subtitle?: string }> = ({
    title,
    icon,
    subtitle,
  }) => (
    <div
      style={{
        width: 160,
        textAlign: "center",
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        padding: 12,
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>{icon}</div>
      <div style={{ fontWeight: 800, fontSize: 14, color: "#0f172a" }}>{title}</div>
      {subtitle && (
        <div style={{ marginTop: 4, fontSize: 12, color: "#64748b", lineHeight: 1.4 }}>
          {subtitle}
        </div>
      )}
    </div>
  );

  const StepLabel: React.FC<{ text: string; color: string }> = ({ text, color }) => (
    <div style={{ fontSize: 12, fontWeight: 800, color }}>{text}</div>
  );

  const ArrowWithLabel: React.FC<{
    dir: "right" | "left";
    label: string;
    color: string;
  }> = ({ dir, label, color }) => (
    <div style={{ width: 140, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <StepLabel text={label} color={color} />
      <div style={{ marginTop: 4 }}>
        {dir === "right" ? <ArrowRight size={22} color={color} /> : <ArrowLeft size={22} color={color} />}
      </div>
    </div>
  );

  const Row: React.FC<{ leftLabel: string; children: React.ReactNode }> = ({ leftLabel, children }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 90, fontWeight: 900, color: "#0f172a", fontSize: 13 }}>{leftLabel}</div>
      {children}
    </div>
  );
  const nodeBox: React.CSSProperties = {
  width: 130,
  minHeight: 110,            // ← 高さを固定 or 最小値指定
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  padding: 10,
  textAlign: 'center'
};

  const description = (
  <>
    <p className="text-lg font-medium">
      フロントエンド開発では、
      <b>表示を速くするための工夫</b>として、
      画像やAPIの結果を再利用し、
      「毎回取りに行かなくてもいい」と判断することがよくあります。
    </p>

    <p className="mt-3 text-gray-700">
      しかし、その
      <span className="bg-yellow-100 px-1 rounded">
        「速くするための設定」
      </span>
      が、
      <b>意図せず情報の違いを生んでしまう</b>ことがあります。
      <br />
      見た目が同じでも、
      <b>返事の速さだけで「何が起きたか」</b>が伝わってしまいます。
      <br />
      これは特に
      <b>共有端末で複数人が使うサービス</b>では注意が必要です。
    </p>
    <p className="mt-3 text-gray-700">
      この章では、フロントエンド側の設定ひとつで、
      <b>過去のアクセスや状態が推測されてしまう</b>場面を体験します。
    </p>
  </>
);
  const children = (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* ①キャッシュの概念 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {/* キャッシュとは） */}
                  <div style={{ background: '#fff', padding: 20, borderRadius: 8, border: '1px solid #e5e7eb' }}>
                    <h3 style={{ ...styles.h3, marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <HardDrive size={20} color="#2563eb" />キャッシュとは？
                    </h3>
                    {/* 一言まとめ */}
                    <p style={{ fontSize: 17, fontWeight: 600, color: '#1f2937', marginBottom: 10 }}>
                      キャッシュとは
                      <span className="text-indigo-600">サーバーから取得したデータを、あとで使えるように保存しておく</span>仕組みです。
                    </p>
                    {/* やさしい説明 */}
                    <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7 }}>
                      同じページに何度もアクセスする場合、
                      毎回サーバーに取りに行かなくても済むため、
                      表示を速くできます。<br ></br>
                      ポイントは、
                      <b>「2回目以降は、ブラウザとサーバー間の通信が不要になる」</b>
                      という点です。
                    </p>
                    <br />
                    <div
                      style={{
                        background: "#f3f4f6",
                        borderRadius: 10,
                        padding: 18,
                        alignItems: 'stretch',
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      {/* 1回目 */}
                      <Row leftLabel="1回目">
                        <div style={nodeBox}>
                          <Laptop size={24} />
                          <div style={{ fontWeight: 700 }}>デバイス</div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10,  alignItems: 'stretch'}}>
                          <ArrowWithLabel dir="right" label="① アドレスを入力" color="#16a34a" />
                          <ArrowWithLabel dir="left" label="④ 表示" color="#b625ebff" />
                        </div>
                        <div style={nodeBox }>
                          <Globe size={24} />
                          <div style={{ fontWeight: 700 }}>ブラウザ</div>
                          <div style={{ fontSize: 12, color: '#64748b' }}>
                            キャッシュを確認
                          </div>
                        </div>                     
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: 'stretch' }}>
                          <ArrowWithLabel dir="right" label="② データの要求" color="#ef4444" />
                          <ArrowWithLabel dir="left" label="③ データを送信" color="#2563eb" />
                        </div>
                        <div style={nodeBox}>
                          <Server size={24} />
                          <div style={{ fontWeight: 700 }}>サーバー</div>
                          <div style={{ fontSize: 12, color: '#64748b' }}>
                            データを管理
                          </div>
                        </div>
                      </Row>
                      <div style={{ height: 40 }} />
                      {/* 2回目以降 */}
                      <Row leftLabel="2回目以降">
                        <div style={nodeBox}>
                          <Laptop size={24} />
                          <div style={{ fontWeight: 700 }}>デバイス</div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: 'stretch' }}>
                          <ArrowWithLabel dir="right" label="① アドレスを入力" color="#16a34a" />
                          <ArrowWithLabel dir="left" label="③ 表示" color="#b625ebff" />
                        </div>
                        <div style={nodeBox}>
                        <Globe size={24} />
                        <div style={{ fontWeight: 700 }}>ブラウザ</div>
                        <div style={{ fontSize: 10, color: '#64748b' }}>
                          キャッシュを確認
                        </div>
                      </div>
                        {/* ② キャッシュを発見（ブラウザ右側） */}
                        <div style={{ width: 140, display: "flex", flexDirection: "column", alignItems: 'stretch' }}>
                          <div style={{ fontSize: 12, fontWeight: 800, color: "#eb25a6ff" }}>
                            ② キャッシュを
                            発見
                          </div>
                          <div style={{ marginTop: 4 }}>
                            <CornerDownLeft size={20} color="#eb25a6ff" />
                          </div>
                        </div>
                        {/* 通信不要を×で表現 */}
                    
                        <div
                          style={{
                            width: 180,
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                            alignItems: 'stretch',
                          }}
                        >
                          {/* 点線ボックス：通信の矢印だけを見せる */}
                          <div
                            style={{
                              width: "100%",
                              position: "relative",
                              borderRadius: 10,
                              border: "1px dashed #cbd5e1",
                              background: "#fff",
                              padding: 12,
                              overflow: "hidden",
                            }}
                          >
                            {/* 背景の×（情報にかぶせない） */}
                            <div
                              style={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                alignItems: 'stretch',
                                justifyContent: "center",
                                pointerEvents: "none",
                                zIndex: 0,
                              }}
                            >
                              <X size={92} color="#111827" style={{ opacity: 0.10 }} />
                            </div>
                            {/* 矢印＋ラベル（前面） */}
                            <div style={{ position: "relative", zIndex: 1, display: "grid", gap: 10 }}>
                              <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "center" }}>
                                <ArrowRight size={20} color="#ef4444" />
                                <span style={{ fontSize: 10, fontWeight: 800, color: "#ef4444" }}>
                                  データの要求
                                </span>
                              </div>
                              <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "center" }}>
                                <ArrowLeft size={20} color="#2563eb" />
                                <span style={{ fontSize: 10, fontWeight: 800, color: "#2563eb" }}>
                                  データを送信
                                </span>
                              </div>
                            </div>
                          </div>
                          {/* 下のラベルを独立させて見やすく */}
                          <div style={{ fontSize: 11, color: "#64748b", fontWeight: 800 }}>
                            ブラウザとサーバー間の通信が要らなくなる
                          </div>
                        </div>               
                        <div style={nodeBox}>
                          <Server size={24} />
                          <div style={{ fontWeight: 700 }}>サーバー</div>
                          <div style={{ fontSize: 12, color: '#64748b' }}>
                            データを生成
                          </div>
                        </div>
                      </Row>                      
                    </div>
                  </div>
                  <div style={{ background: '#fff', padding: 24, borderRadius: 10, border: '1px solid #e5e7eb' }}>
                    <h3 style={{ ...styles.h3, marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Unlock size={20} color="#b91c1c" />
                      攻撃者は、何を見ている？
                    </h3>
                    <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7 }}>
                      開発者にとってキャッシュは、
                      <b>表示を速くし、サーバー負荷を下げるための便利な仕組み</b>です。
                      <br />
                      「一度取得したデータを再利用する」のは、
                      ごく自然で、よくある判断でしょう。
                    </p>

                    <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, marginTop: 12 }}>
                      しかし、攻撃者の視点は少し違います。
                      <br />
                      攻撃者は、
                      <span className="bg-yellow-100 px-1 rounded">
                        「その速さは、なぜ速いのか？」
                      </span>
                      を見ています。
                    </p>

                    <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, marginTop: 12 }}>
                      もしログイン後の情報や、
                      ユーザーごとに異なるデータが
                      <b>キャッシュに残る設定</b>になっていた場合、
                      <br />
                      <b>
                        　・この端末で誰かがログインしたことがあるか  <br />
                        　・どんな画面を開いたことがあるか  <br />
                        　・どのサービスを使っていたか<br />
                      </b>
                      といった情報が、
                      <b>表示の速さや挙動の違い</b>から推測できてしまいます。
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
                      攻撃者は「画面の中身」ではなく、
                      <b>キャッシュに残っていそうな情報があるかどうか</b>を確かめています。
                      <br />
                      表示が同じでも、<b>速さが違えばヒントになります。</b>
                    </div>
                    <div
                      style={{
                        marginTop: 16,
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
                        「表示される内容が同じなら、問題は起きない」
                        <br />
                        → <b>実際には、表示の速さそのものが手がかりになることがあります。</b>
                      </p>
                      <p style={{ marginTop: 6, fontSize: 14, lineHeight: 1.6 }}>
                        「速さが情報になるなら、キャッシュは使わない方がいい？」
                        <br />
                        → <b>キャッシュ自体が悪いわけではありません。</b>
                        <br />
                        大切なのは、
                        <span className="bg-yellow-100 px-1 rounded">
                          何をキャッシュしてよいか・いけないかを分けて考える
                        </span>
                        ことです。
                      </p>
                    </div>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle style={{ marginBottom: 10 }}>
                        キャッシュ設定の実装比較
                      </CardTitle>
                      <CardDescription>
                        キャッシュは表示を速くするために役立ちます。<br />
                        ただし、<b>ログイン後の情報や履歴</b>を「残す」扱いにすると、
                        <b>速さの違い</b>から推測されることがあります。
                      </CardDescription>
                    </CardHeader>
                    <hr style={{ border: 'none', height: 0.1, background: '#e5e7eb', margin: '3px 0' }} />
                    <CardContent>
                      <div style={styles.comparison}>
                        {/* 脆弱な実装 */}
                        <div style={styles.comparisonColumn}>
                          <p style={{ fontSize: 16, marginBottom: 20, lineHeight: 1.6 }}>
                            <span style={{ color: '#dc2626', fontWeight: 600 }}>脆弱な実装</span>は、
                            「速くするために」<b>ログイン後の情報などの機密情報をブラウザ側に残してしまう</b>例です。
                            <br />
                            表示内容が同じでも、<b>残っている / いない</b>で速さが変わると、
                            行動履歴のヒントになり得ます。
                          </p>
                          <div style={{ ...styles.codeContainer, background: '#fff7f6', border: '3px solid #fca5a5' }}>
                            <div style={{ ...styles.codeLabel, color: '#dc2626' }}>
                              ⚠️ 脆弱な実装
                              <p style={{fontSize:14}}>（全ての情報を「残す」ことで速くしてしまう）</p>
                            </div>
                            <pre style={styles.code}>
{`⚠️ 例1) 速さ優先でキャッシュを強制（毎回、残っている可能性がある）
fetch('/api/user/history', { cache: 'force-cache' })
  .then(r => r.json());

⚠️ 例2) 履歴データをブラウザに保存（次回以降ずっと残る）
localStorage.setItem('user_history', JSON.stringify(resp));`}
                            </pre>
                            <div style={{ fontSize: 12, color: '#7f1d1d', marginTop: 8 }}>
                              ※「ログイン後の履歴」などを残すと、別ユーザーや共有端末で問題になりやすい
                            </div>
                          </div>
                        </div>
                        <div style={styles.divider} />
                        {/* 安全な実装 */}
                        <div style={styles.comparisonColumn}>
                          <p style={{ fontSize: 16, marginBottom: 20, lineHeight: 1.6 }}>
                            <span style={{ color: '#16a34a', fontWeight: 600 }}>安全な実装</span>は、
                            <b>機密情報はキャッシュに残さない</b>ことを徹底しつつ、
                            速さが必要な部分だけを最適化する考え方です。
                            「残す / 残さない」を分けると、推測されにくくなります。
                          </p>
                          <div style={{ ...styles.codeContainer, background: '#f7fffa', border: '3px solid #86efac' }}>
                            <div style={{ ...styles.codeLabel, color: '#16a34a' }}>
                              ✓ 安全な実装<p style = {{fontSize:14}}>(機密情報は残さず、その場で使う)</p>
                            </div>
                            <pre style={styles.code}>
{`✓例1) 毎回取りに行く（ブラウザに残さない）
fetch('/api/user/history', { cache: 'no-store', credentials: 'include' })
  .then(r => r.json());

✓例2) 永続化しない（必要ならメモリに一時保持して破棄）
let temp = resp; // 画面表示に使ったら破棄する`}
                            </pre>
                            <div style={{ fontSize: 12, color: '#14532d', marginTop: 8 }}>
                              ※ 画像ロゴなど「公開してよいもの」はキャッシュしてOK。問題は「個人に紐づく情報」を残すこと。
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* 上級向け補足（最小） */}
                      <div
                        style={{
                          marginTop: 14,
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: 8,
                          padding: 12,
                          fontSize: 13,
                          color: '#475569'
                        }}
                      >
                        <b>補足（上級）：</b> Service Worker などでキャッシュを扱う場合も同じで、
                        「残してよいもの」だけを対象にし、個人情報が混ざるレスポンスは残さない方針にします。
                      </div>
                    </CardContent>
                  </Card>
                  {/* <Card>
                    <CardHeader>
                      <CardTitle style={{ marginBottom: 10 }}>
                        キャッシュ設定の比較
                      </CardTitle>
                      <CardDescription>
                        キャッシュ設定の際の  
                        <b>時間差が生まれる実装</b>と
                        <b>時間差を防ぐ安全な実装</b>を
                        比較して見てみましょう。
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
          <div style={styles.comparison}>
            <div style={styles.comparisonColumn}>
              <h3 style={styles.h3}>⚠️ 脆弱な実装</h3>
              <p style={{ fontSize: 15, marginBottom: 8 }}>
                クライアントで強制的にキャッシュを利用したり、敏感なデータを永続ストレージに残す例。
              </p>
              <div style={{ ...styles.codeContainer, background: '#fff7f6', border: '3px solid #fca5a5' }}>
                <div style={{ ...styles.codeLabel, color: '#dc2626' }}>✗ NG: fetch でキャッシュを強制</div>
                <pre style={styles.code}>
{`// fetch で force-cache を使うと、共有キャッシュや古いレスポンスを参照してしまう可能性がある
fetch('/api/user/history', { cache: 'force-cache' })
  .then(r => r.json())
  .then(data => console.log(data));`}
                </pre>

                <div style={{ ...styles.codeLabel, color: '#dc2626', marginTop: 10 }}>✗ NG: localStorage に機微データを保存</div>
                <pre style={styles.code}>
{`// localStorage はブラウザに永続的に残り、他のスクリプトから参照されるリスクがある
localStorage.setItem('user_history', JSON.stringify(resp));
const saved = JSON.parse(localStorage.getItem('user_history'));`}
                </pre>

                <div style={{ ...styles.codeLabel, color: '#dc2626', marginTop: 10 }}>✗ NG: Service Worker が検証なしにキャッシュ</div>
                <pre style={styles.code}>
{`// Service Worker で検証せずにレスポンスをキャッシュすると機微情報が共有キャッシュ層に残る
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open('v1').then(cache =>
      cache.match(event.request).then(resp => resp || fetch(event.request).then(r => { cache.put(event.request, r.clone()); return r; }))
    )
  );
});
`}
                </pre>
              </div>
            </div>
            <div style={styles.divider} />
            <div style={styles.comparisonColumn}>
              <h3 style={styles.h3}>✓ 安全な実装</h3>
              <p style={{ fontSize: 15, marginBottom: 8 }}>
                クライアント側で明示的にキャッシュを無効化し、機微な情報はブラウザ永続ストレージに残さないことを推奨します。Service Worker はヘッダを検査してからキャッシュ。
              </p>
              <div style={{ ...styles.codeContainer, background: '#f7fffa', border: '3px solid #86efac' }}>
                <div style={{ ...styles.codeLabel, color: '#16a34a' }}>✓ OK: fetch でキャッシュを無効化</div>
                <pre style={styles.code}>
{`// 即時の最新データが必要な場合は no-store を指定（中間キャッシュも使わせない）
fetch('/api/user/history', { cache: 'no-store', credentials: 'include' })
  .then(r => r.json())
  .then(data => console.log(data));`}
                </pre>

                <div style={{ ...styles.codeLabel, color: '#16a34a', marginTop: 10 }}>✓ OK: 機微データを永続化しない</div>
                <pre style={styles.code}>
{`// 永続化は避ける。必要なら短時間のメモリ保持のみ。
let temp = resp; // メモリ内で一時利用して破棄する
// 不要なフィールドはサーバ側で除去して返す（例: full logs -> count のみ）`}
                </pre>

                <div style={{ ...styles.codeLabel, color: '#16a34a', marginTop: 10 }}>✓ OK: Service Worker はヘッダを確認してキャッシュ</div>
                <pre style={styles.code}>
{`// Service Worker 側で Cache-Control を確認してからキャッシュする
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request).then(resp => {
    const cc = resp.headers.get('Cache-Control') || '';
    if (cc.includes('no-store')) return resp;
    // 条件を満たす場合のみキャッシュする（検証した上で）
    const copy = resp.clone();
    caches.open('v1').then(cache => cache.put(event.request, copy));
    return resp;
  }));
});
`}
                </pre>
              </div>
            </div>
          </div>
          </CardContent>
                  </Card> */}
        <Card>
          <CardHeader>
            <CardTitle style={{ marginBottom: 10 }}>
              キャッシュ設定による処理時間の比較：キャッシュがあると「返事の速さ」はどう変わる？
            </CardTitle>
            <CardDescription>
              <p>
                このデモでは、
                <b>同じ画面・同じ操作でも</b>、
                「前にアクセスしたことがあるかどうか」で
                <b>返事の速さが変わる</b>様子を体験します。
                <br />
                速さの違いが、
                <b>ログイン状況や利用履歴の推測</b>につながる点に注目してください。
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
                  【ステップ1】脆弱な実装で試す
                </div>
                <div style={{ color: '#475569', marginTop: 6 }}>
                  まず「⚠️ 脆弱な実装」を選択し、
                  <b>「全キャッシュをクリア」</b>を押してください。<br ></br>
                  その後、次の順にボタンを押します。
                  <br />
                  　・「ロゴ取得時間を2回計測」<br />
                  　・「ログイン状態取得時間を2回計測」<br />
                  　・「過去ログ取得時間を2回計測」<br />
                </div>
              </li>
              <li>
                <div style={{ fontWeight: 700 }}>
                  【ステップ2】キャッシュ状況とアクセス時間を確認する
                </div>
                <div style={{ color: '#475569', marginTop: 6 }}>
                  現在のキャッシュ状況が<b>「なし」→「あり」</b>に変わることを確認し、結果のテーブルで<b>2回目のアクセスが速くなる</b>ことを見てみましょう。
                </div>
              </li>
              <li>
                <div style={{ fontWeight: 700 }}>
                  【ステップ3】安全な実装でも試す
                </div>
                <div style={{ color: '#475569', marginTop: 6 }}>
                  「✓安全な実装」に切り替えて、同じように実行してみましょう。<br ></br>
                  特に、<b>「ログイン状態取得」</b>と<b>「過去ログ」</b>で時弱な実装と違いが出る点に注目しましょう。<br />
                  安全な実装では、<span style={{ background: '#fef9c3', padding: '2px 6px', borderRadius: 4 }}>サインイン情報（ログイン状態）や過去ログのような機密情報はキャッシュに残らない</span> ため、キャッシュ状況や速度の変化が起きにくいはずです。
                </div>
              </li>
            </ol>

<div style={{ marginTop: 12 }}>
  <CacheDemo />
</div>

              {/* <h3 style={{ ...styles.h3, marginTop: 2, color: '#0f172a' }}>
  🚀 試してみよう
</h3>

<ol className="ml-4 space-y-4" style={{ fontSize: 16, lineHeight: 1.8 }}>
  <li>
    <div style={{ fontWeight: 700 }}>
      【ステップ1】脆弱な実装を選ぶ
    </div>
    <div style={{ color: '#475569', marginTop: 6 }}>
      まず <b>「⚠️ 脆弱な実装」</b> を選びます。
      <br />
      このモードでは、ログイン後の情報や履歴が
      <b>キャッシュに残る</b>前提です。
    </div>
  </li>

  <li>
    <div style={{ fontWeight: 700 }}>
      【ステップ2】同じ操作を2回くり返す
    </div>
    <div style={{ color: '#475569', marginTop: 6 }}>
      <b>「全キャッシュをクリア」</b>を押してから、
      <br />
      右側の「ロゴにアクセス」や「過去ログAPIにアクセス」を
      <b>同じボタンで2回続けて</b>押してください。
      <br />
      2回目が速くなれば、<b>「前に見た（残っている）」</b>ことが推測できます。
    </div>
  </li>

  <li>
    <div style={{ fontWeight: 700 }}>
      【ステップ3】何が“ヒント”になっているかを見る
    </div>
    <div style={{ color: '#475569', marginTop: 6 }}>
      画面の見た目ではなく、
      <span style={{ background: '#fef9c3', padding: '2px 6px', borderRadius: 4 }}>
        左側の時間（ms）と「キャッシュあり/なし」
      </span>
      に注目してください。
      <br />
      ここが変わると、外から「ログイン済み」「履歴を見た」などが推測されることがあります。
    </div>
  </li>

  <li>
    <div style={{ fontWeight: 700 }}>
      【ステップ4】安全な実装と比べてみる
    </div>
    <div style={{ color: '#475569', marginTop: 6 }}>
      次に <b>「✓ 安全な実装」</b> に切り替えて、
      同じボタンを2回押してください。
      <br />
      今度は、ログイン後の情報（サインイン画像・過去ログAPI）が
      <b>2回目でも速くならない</b>ことを確認します。
    </div>
  </li>
</ol>

<div
  style={{
    marginTop: 12,
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#475569',
    lineHeight: 1.7
  }}
>
  <b>見るポイント：</b>
  「表示が同じ」でも、
  <b>速さが違う</b>と情報のヒントになります。
  <br />
  キャッシュは便利ですが、
  <b>個人に紐づく情報を“残す”扱いにしない</b>ことが重要です。
</div> */}


            {/* <div style={{ marginTop: 12 }}>
            <CacheDemo />
          </div> */}
          </CardContent>
        </Card>
      </div>
      </div>
  )
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
                      📝 3章の見どころ
                    </CardTitle>
                  </CardHeader>
          <CardContent style={{ paddingTop: 0 }}>
            <ul style={{ fontSize: 15, marginLeft: 18, marginBottom: 0 }}>
              <li>
                ・「前に見たページかどうか」は、どうやって分かる？
              </li>
              <li>
                ・なぜ表示されている内容が同じでも、速さが変わるの？
              </li>
              <li>
                ・フロントエンドの実装で、どこに気をつければいい？
              </li>
              <br />
              <ul style={{ fontSize: 16, marginTop: 5 }}>
                <b>→ 実際に動かしながら確認します</b>
              </ul>
            </ul>
          </CardContent>
        </Card>
      );
    const summary = (
      <Card>
  <CardHeader>
    <CardTitle className="text-lg font-bold">
      3章のまとめ
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
          <b>Q.</b> 「前に見たページかどうか」は、どうやって分かる？
          <br />
          <span className="ml-4">
            <b>→ </b>
            ブラウザが<b>過去のデータを手元に残しているかどうか</b>で分かることがある
          </span>
        </li>

        <li>
          <b>Q.</b> なぜ表示されている内容が同じでも、速さが変わるの？
          <br />
          <span className="ml-4">
            <b>→ </b>
            サーバーに取りに行くか、<b>キャッシュから即座に返るか</b>で処理時間が変わる
          </span>
        </li>

        <li>
          <b>Q.</b> フロントエンドの実装で、どこに気をつければいい？
          <br />
          <span className="ml-4">
            <b>→ </b>
            <b>個人にひもづく情報をキャッシュに残していないか</b>を意識すること
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
        この章で見たように、
        フロントエンドでは
        <b>「何を表示するか」</b>だけでなく、
        <b>「どれくらいの速さで返すか」</b>も、
        外から観測できる情報になります。
      </p>

      <p style={{ fontSize: 16, marginTop: 12 }}>
        キャッシュそのものが悪いわけではありません。
        むしろ、パフォーマンスやユーザー体験のために
        <b>欠かせない仕組み</b>です。
        <br />
        ただし、
        <span style={{ color: '#4f46e5', fontWeight: 600 }}>
          「何を残して、何を残さないか」
        </span>
        を考えずに使うと、
        意図しない情報漏えいにつながることがあります。
      </p>

      {/* 締め */}
      <div className="mt-4 pt-3 border-t text-gray-700 font-medium">
        「正しく動いているように見える実装」でも、
        <b>処理時間や速さの違い</b>が
        ヒントになってしまうことがあります。
        <br />
        次の章では、
        この考え方が
        <b>ログインや認証の処理</b>では
        どのような問題につながるのかを見ていきます。
      </div>
    </div>
  </CardContent>
</Card>

);

  return (
    <SectionLayout
      title1="3. 速さの違い、見られています"
      title2="〜 キャッシュのヒット／ミス 〜"
      description={description}
      checklist={checklist}
      summary={summary}
    >
      {children}
      </SectionLayout>
  );
}
