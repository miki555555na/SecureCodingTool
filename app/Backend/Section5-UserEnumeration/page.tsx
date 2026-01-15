'use client';

import React, { Children, useMemo, useState } from 'react';
import SectionLayout from '../../Framework/SectionLayout';
import { styles } from '../../Framework/SectionStyles';
import { FlowDemo } from './FlowDemo';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Database

} from 'lucide-react'

export default function AuthFlowTimingPage() {
  const [variant, setVariant] = useState<'vulnerable' | 'secure'>('vulnerable');

  const variantInfo = useMemo(
    () =>
      variant === 'vulnerable'
        ? {
            title: '誤ったパターン（途中終了あり）',
            accent: '#ef4444',
            description: '存在しないユーザーは①で即終了、存在するユーザーは②以降が重くなりレスポンス時間で区別される。'
          }
        : {
            title: '正しいパターン（定数時間化）',
            accent: '#16a34a',
            description: '存在有無に関わらずダミー処理を含め全段階を通過し、最小応答時間を揃えてレスポンスを返す。'
          },
    [variant]
  );
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
   const children = (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* ① ログイン処理の概念 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                  {/* ログインの流れ（例） */}
                  <div style={{ background: '#fff', padding: 20, borderRadius: 8, border: '1px solid #e5e7eb' }}>
                    <h3 style={{ ...styles.h3, marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Shield size={20} color="#2563eb" />
                      ログイン処理は、だいたいどんな順番で動く？
                    </h3>

                    {/* 一言サマリー（短く） */}
                    <p style={{ margin: 0, fontSize: 16.5, fontWeight: 600, color: '#1f2937' }}>
                      多くのログイン処理は、
                      <span className="text-indigo-600">いくつかの段階</span>
                      を順番に通ります。
                    </p>
                    <p style={{ marginTop: 8, fontSize: 14.5, color: '#475569', lineHeight: 1.7 }}>
                      ここで大事なのは、
                      <b>「途中で止まる場所が違うと、返事の速さが変わる」</b>
                      ことがある点です。
                    </p>

                    {/* 図 */}
                    <div
                      style={{
                        marginTop: 14,
                        padding: 14,
                        background: '#f3f4f6',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                        flexWrap: 'wrap'
                      }}
                    >
                      <div style={{ width: 160, textAlign: 'center', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 10 }}>
                        <User size={22} color="#475569" />
                        <div style={{ fontWeight: 700, marginTop: 6 }}>入力</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>ユーザー名 / パスワード</div>
                      </div>

                      <ArrowRight size={20} color="#94a3b8" />

                      <div style={{ width: 160, textAlign: 'center', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 10 }}>
                        <Database size={22} color="#475569" />
                        <div style={{ fontWeight: 700, marginTop: 6 }}>存在の確認</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>このユーザーはいる？</div>
                      </div>

                      <ArrowRight size={20} color="#94a3b8" />

                      <div style={{ width: 160, textAlign: 'center', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 10 }}>
                        <KeyRound size={22} color="#475569" />
                        <div style={{ fontWeight: 700, marginTop: 6 }}>パスワード確認</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>合っている？</div>
                      </div>

                      <ArrowRight size={20} color="#94a3b8" />

                      <div style={{ width: 160, textAlign: 'center', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 10 }}>
                        <BadgeCheck size={22} color="#475569" />
                        <div style={{ fontWeight: 700, marginTop: 6 }}>完了</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>成功時の処理</div>
                      </div>
                    </div>

                    {/* 注意書き（ここは良いので短く） */}
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
                      <b>※注意：</b>実際の内部処理はサービスによって異なります。ここでは理解しやすい「よくある流れ」を例にしています。
                    </div>

                    {/* よくある誤解（この章で効くやつ） */}
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
                        「エラーメッセージを同じにしているから大丈夫」と思いがちですが、
                        <b>返事の速さ</b>もヒントになります。
                        <br />
                        見た目が同じでも、<b>速さが違う</b>と「中で何が起きたか」を推測されることがあります。
                      </p>
                    </div>
                  </div>

                  {/* ログイン処理の比較（左右） */}
                  <Card>
                    <CardHeader>
                      <CardTitle style={{ marginBottom: 10 }}>
                        ログイン処理の比較
                      </CardTitle>
                      <CardDescription>
                        同じ「ログイン失敗」でも、処理の止まり方が違うと
                        <b>返事の速さに差</b>が出ることがあります。
                        その差が「存在チェック」に使われてしまいます。
                      </CardDescription>
                    </CardHeader>

                    <hr style={{ border: 'none', height: 1, background: '#e5e7eb' }} />

                    <CardContent>
                      <div style={styles.comparison}>
                        {/* 脆弱 */}
                        <div style={styles.comparisonColumn}>
                          <p style={{ fontSize: 16, marginBottom: 14, lineHeight: 1.7 }}>
                            <span style={{ color:'#dc2626', fontWeight: 700 }}>脆弱な実装</span>は、
                            <b>「ユーザーがいない」時点で早く終わる</b>作りです。
                            <br />
                            そのため、
                            <b>速い = ユーザーなし</b>
                            のように推測される可能性があります。
                          </p>

                          <div style={{ ...styles.codeContainer, background: '#fef2f2', border: '3px solid #fca5a5' }}>
                            <div style={{ ...styles.codeLabel, color: '#dc2626' }}>
                              ⚠️ 脆弱な実装
                            </div>
          <pre style={styles.code}>
                {`function loginConstantTime(user, pass) {
    if (!db.has(user)) return fail('ユーザーなし');  // ① ここで終了（速い）
    const ok = verifyPass(db.get(user).hash, pass);  // ② ユーザーがいる場合だけ進む
    if (!ok) return fail('パスワード違い');          // 途中で終了
}`}
                          </pre>
                        </div>
                      </div>
                      <div style={styles.divider} />
                        {/* 安全 */}
                        <div style={styles.comparisonColumn}>
                          <p style={{ fontSize: 16, marginBottom: 14, lineHeight: 1.7 }}>
                            <span style={{ color:'#16a34a', fontWeight: 700 }}>安全な実装</span>は、
                            ユーザーがいてもいなくても
                            <b>なるべく同じ流れ・同じ速さ</b>になるようにします。
                            <br />
                            そのため、速さから推測されにくくなります。
                          </p>

                          <div style={{ ...styles.codeContainer, background: '#f0fdf4', border: '3px solid #86efac' }}>
                            <div style={{ ...styles.codeLabel, color: '#16a34a' }}>
                              ✓ 安全な実装
                            </div>
                            <pre style={styles.code}>
{`function loginConstantTime(user, pass) {
    const exists = db.has(user);
    const hash = exists ? db.get(user).hash : dummyHash;  // いなくても同じ処理をする
    const ok = verifyPass(hash, pass);                    // どちらでも実行する
    doTokenLikeWork();                                    // 成功/失敗に関係なく実行
    return exists && ok ? success() : fail('ログイン失敗');
}`}
                                        </pre>
                          </div>

                          <div className="text-xs text-gray-500 mt-2">
                            ※このコードは仕組みを理解するための例です（実装はサービスや言語で異なります）
                          </div>
                        </div>
                      </div>

                      {/* 次のデモへ橋渡し */}
                      <div style={{ marginTop: 14, fontSize: 14.5, color: '#374151' }}>
                        では次に、実際に入力して
                        <b>どの段階で速さが変わるのか</b>
                        をデモで確かめてみましょう。
                      </div>
                    </CardContent>
                  </Card>
                </div>     
                <br />
                <Card>
                  <CardHeader>
                    <CardTitle style={{ marginBottom: 10 }}>リアルタイムデモ：どの段階で時間差が出る？</CardTitle>
                      <CardDescription>
                        <p>
                          このデモでは、
                          <b>ログイン処理の「進み方の違い」</b>が
                          <b>返事の速さの違い</b>として表れる様子を確認します。
                        </p>
                        <p style={{ marginTop: 6 }}>
                          同じ「ログイン失敗」でも、
                          <span style={{ fontWeight: 600 }}>
                            どこで処理が止まったか
                          </span>
                          によって、
                          攻撃者から見える情報が変わってしまうことに注目してください。
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
                          【ステップ1】脆弱な実装を選ぶ
                        </div>
                        <div style={{ color: '#475569', marginTop: 6 }}>
                          まず
                          <b>「⚠️ 脆弱な実装」</b>
                          を選択してください。
                          <br />
                          この実装では、
                          <b>途中で処理が終わる</b>
                          場合があります。
                        </div>
                      </li>

                      <li>
                        <div style={{ fontWeight: 700 }}>
                          【ステップ2】条件を変えてログインを試す
                        </div>
                        <div style={{ color: '#475569', marginTop: 6 }}>
                          「正しいパスワード」
                          「誤ったパスワード」「存在しないユーザー」で、
                          <b>返事の速さ</b>
                          がどう変わるかを見てみましょう。
                        </div>
                      </li>
                      <li>
                        <div style={{ fontWeight: 700 }}>
                          【ステップ3】どこで止まったかを確認する
                        </div>
                        <div style={{ color: '#475569', marginTop: 6 }}>
                          右側の表示では、
                          <b>どの段階まで処理が進んだか</b>
                          が光って表示されます。
                          <br />
                          <span style={{ background: '#fef9c3', padding: '2px 6px', borderRadius: 4 }}>
                            途中で止まるほど、全体の時間が短くなる
                          </span>
                          ことに注目してください。
                        </div>
                      </li>
                      <li>
                        <div style={{ fontWeight: 700 }}>
                          【ステップ4】安全な実装と比べてみる
                        </div>
                        <div style={{ color: '#475569', marginTop: 6 }}>
                          次に、
                          <b>「✓ 安全な実装」</b>
                          に切り替えて、同じ操作をもう一度試してみましょう。<br />
                          今度は、
                          <b>ユーザーが存在しなくても、結果が失敗でも毎回ほぼ同じ時間</b>
                          で返ってくることが分かります。
                        </div>
                      </li>
                    </ol>

                    {/* モード切替ボタン */}
                    <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                      <button
                        type="button"
                        onClick={() => setVariant('vulnerable')}
                        style={{
                          ...btnBase,
                          border: variant === 'vulnerable' ? '2px solid #ef4444' : '1px solid #cbd5e1',
                          background: variant === 'vulnerable' ? '#fef2f2' : '#fff',
                          
                        }}
                      >
                        ⚠️ 脆弱な実装
                      </button>
                      <button
                        type="button"
                        onClick={() => setVariant('secure')}
                        style={{
                          ...btnBase,
                          border: variant === 'secure' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                          background: variant === 'secure' ? '#f0fdf4' : '#fff'
                        }}
                      >
                        ✓ 安全な実装
                      </button>
                    </div>
                    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit,minmax(360px,1fr))' }}>
                      <FlowDemo
                        variant={variant}
                        accent={variantInfo.accent}
                        title={variantInfo.title}
                        description={variantInfo.description}
                      />
                    </div>
                  </CardContent>
                </Card>
                {/* <div style={{ background: '#f8fafc', borderRadius: 10, padding: 14, border: '1px dashed #cbd5e1', color: '#475569' }}>
                  💡 パスワードリセットや登録確認 API など「存在するか／しないか」を返したくなる場面でも、レスポンス時間・メッセージ・ステータスコードを統一しよう。
                </div> */}
              </div>
            </div>
    )
    const description = (
      <>
        <p className="text-lg font-medium">
          前の章で見た
          <span className="bg-yellow-100 px-1 rounded">「処理時間がヒントになる」</span>
          という話は、実は<b>ログインのような身近な処理</b>でも起こりえます。
        </p>

        <p className="mt-3 text-gray-700">
          この章では、「入力が間違っているだけ」なのに、
          <b>返事の速さ</b>から
          「ユーザーが存在するかどうか」が分かってしまうケースを体験します。
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
            📝 5章の見どころ
          </CardTitle>
        </CardHeader>

        <CardContent style={{ paddingTop: 0 }}>
          <ul style={{ fontSize: 15, marginLeft: 18, marginBottom: 0 }}>
            <li>
              ・ログイン処理は、どんな順番で動いているの？
            </li>
            <li>
              ・なぜ「返事の速さ」だけで、ユーザーの存在が分かってしまうの？
            </li>
            <li>
              ・ログイン失敗の返し方をそろえると、何が変わるの？
            </li>
            <br />
            <ul style={{ fontSize: 16, marginTop: 5 }}>
              <b>→ 実際に動かしながら確認します</b>
            </ul>
          </ul>
        </CardContent>
      </Card>
    );

  // const summary = (
  //   <div>
  //     <b>ポイント:</b> 「途中終了」「重さの違う処理」がある段階フローは時間差を作り、存在/非存在・一致/不一致が推測される。ダミー処理や定数時間化で段階ごとの重さを揃え、さらにレート制限・監視で計測試行を抑える。
  //   </div>
  // );
  const summary = (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg font-bold">
        5章のまとめ
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
            <b>Q.</b> ログイン処理は、どんな順番で動いているの？
            <br />
            <span className="ml-4">
              <b>→</b> 入力 → ユーザー確認 → パスワード照合 → 完了、という
              <b>段階的な流れ</b>で処理されることが多い
            </span>
          </li>

          <li>
            <b>Q.</b> なぜ「返事の速さ」だけで、ユーザーの存在が分かってしまうの？
            <br />
            <span className="ml-4">
              <b>→</b> 「途中で止まる処理」と「最後まで進む処理」で
              <b>かかる時間が変わる</b>から
            </span>
          </li>

          <li>
            <b>Q.</b> ログイン失敗の返し方をそろえると、何が変わるの？
            <br />
            <span className="ml-4">
              <b>→</b> 外から見たときに
              <b>中で何が起きているか分からなくなる</b>
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
          <b>ログイン機能そのものが特別に危険</b>だから起きたわけではありません。
          <br />
          多くの人が
          <span style={{ color: '#4f46e5', fontWeight: 600 }}>
            「自然に書いてしまいがちな処理」
          </span>
          の中に、原因があります。
        </p>

        <p style={{ fontSize: 16, marginTop: 12 }}>
          「ユーザーが存在しなければすぐ返す」
          「存在したら次の処理に進む」
          <br />
          こうした
          <b>分かりやすくて正しそうな書き方</b>が、
          実は
          <b>返事の速さの違い</b>を生み出してしまいます。
        </p>

        <p style={{ fontSize: 16, marginTop: 12 }}>
          「エラーメッセージを同じにしているから大丈夫」
          と思っていても、
          <b>処理の途中で止まる位置が違えば、時間は隠せません。</b>
        </p>

        <p style={{ fontSize: 16, marginTop: 12 }}>
          ログインのように
          <b>存在するか・しないか</b>を扱う処理では、
          <span style={{ color: '#4f46e5', fontWeight: 600 }}>
            成功・失敗に関係なく、同じ流れ・同じ重さで処理する
          </span>
          ことが重要です。
        </p>

        {/* 締め */}
        <div className="mt-4 pt-3 border-t text-gray-700 font-medium">
          前の章で見たパスワードの早期リターンやHMAC検証の時間差と同じように、
          ログイン処理でも
          <b>「返事の速さ」は立派な情報</b>になります。
          <br />
          「正しく動いている」だけでなく、
          <b>どう見えているか</b>まで意識することが、
          セキュアな実装への第一歩です。
        </div>
      </div>

    </CardContent>
  </Card>
);


  return (
    <SectionLayout
      title1="5. 返事の速さで、存在がバレる？"
      title2="〜 ログイン処理にひそむ時間差の落とし穴 〜"
      description={description}
      checklist={checklist}
      summary={summary}
    >
      {children}
    </SectionLayout>
  );
}
