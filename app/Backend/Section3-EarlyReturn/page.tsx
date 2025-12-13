//BackendModule/Part1/page.tsx
'use client';

import React, { useState, useRef} from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SectionLayout from '../../Framework/SectionLayout';
import { styles } from '../../Framework/SectionStyles';
import {InsecureDemo, DemoRef} from './InsecureDemo';
import {SecureDemo} from './SecureDemo';


// export const metadata = {
//   title: '実装の実行時間がパスワードを漏らす！',
//   description1: '早期リターンとタイミング攻撃対策'
// };

export default function TimingAttackPage() {
    const [input, setInput] = useState('xxxxx');
    const insecureRef = useRef<DemoRef | null>(null);
    const secureRef = useRef<DemoRef | null>(null);
     const [variant, setVariant] = useState<'insecure' | 'secure'>('insecure');

    const handleRunInsecure = () => {
        if (insecureRef.current) {
            insecureRef.current.run();
        }
    };

    const handleRunSecure = () => {
        if (secureRef.current) {
            secureRef.current.run();
        }
    };
    const description = (
        <>
            <>
                <b>一見すると正しそうなコード</b>でも、<b>処理にかかる「時間」</b>が違うだけで、
                <span style={{ background: '#fef9c3', fontWeight: 500 }}>
                「どこまでパスワードが合っているか」
                </span>
                が外部から推測されてしまうことがあります。
                <br /><br />
                特に、<b>文字が違った時点で処理をやめる実装（早期リターン）</b>は要注意です。
                攻撃者は<b>処理時間のわずかな差</b>を測ることで、
                <span style={{ color: '#ff0000ff', fontWeight: 600 }}>
                1文字ずつパスワードを当てていく
                </span>
                ことができます。
                <br /><br />
                このページでは、
                <span style={{ color: '#2563eb', fontWeight: 600 }}>「なぜ時間差が生まれるのか」</span>と
                <span style={{ color: '#2563eb', fontWeight: 600 }}>「どうすれば防げるのか」</span>
                を、実際のデモで体感します。
            </>
        </>       
    );
    const checklist = (
        <Card style={{ border: '2px solid #aee2feff', boxShadow: '0 2px 8px #0001',background: '#f5faffff',}}>
            <CardHeader style={{ paddingBottom: 3}}>
                <CardTitle style={{ fontSize: 19, marginTop: 0 }}>📝 3章の見どころ</CardTitle>
            </CardHeader>
            <CardContent style={{ paddingTop: 0 }}>
                <ul style={{ fontSize: 17, marginLeft: 18, marginBottom: 0 }}>
                    <li>「なぜ一致文字数が分かってしまうのか」を、時間の変化で確認します</li>
                    <li>一見正しそうな実装が、どこで危険になるのかをコードで見比べます</li>
                    <li>安全な実装に変えると、何がどう変わるのかを実行結果で確かめます</li>
                </ul>
            </CardContent>
        </Card>
    );

    const children = (
        <>
            
            <Card>
                <CardHeader>
                    <CardTitle>シミュレーション：時間差を利用したパスワード推測</CardTitle>
                    <CardDescription>
                        <p>時間差が生まれる脆弱な実装と、安全な実装を比較しながら、機密情報が漏洩するリスクを体感しましょう。</p>
                    </CardDescription> 
                </CardHeader>

                <CardContent>
                    <CardAction>
                        <span style={{ color:'#dc2626', fontWeight: 600 }}>脆弱な実装</span>では、
                        <b>文字が違った瞬間に処理を終了</b>するため、
                        「どこまで一致しているか」が
                        <b>実行時間として外に漏れます</b>。
                        <br /><br />
                        一方、
                        <span style={{color:'#138c40ff', fontWeight: 600}}>安全な実装</span>では、
                        <b>必ず同じ回数の比較</b>を行い、途中で処理をやめません。
                        その結果、<b>入力が何であっても処理時間がほぼ一定</b>になり、
                        攻撃の手がかりを与えません。
                    </CardAction>

                    



            

        <div style={styles.comparison}>
            <div style={styles.comparisonColumn}>
                <div style={{ ...styles.codeContainer, background: '#fef2f2', border: '3px solid #fca5a5' }}>   
                    <div style={{ ...styles.codeLabel, color: '#dc2626' }}>⚠️ 脆弱な実装</div>
                    <pre style={styles.code}>
                        {`function insecureCompare(a: string, b: string): boolean {
    const len = Math.max(a.length, b.length);
    const noise = randomInt(-100, 101) * 0.005;
    const perCharDelayMs = cfg.perCharDelayMs + noise;
    `}<span style={{ background: '#ef4444', color: '#fff', padding: '2px 4px', borderRadius: '3px', fontWeight: 'bold' }}>{`for (let i = 0; i < len; i++)`}</span>{` { `}<span style={{ color: '#fca5a5' }}>// ⚠️ 可変長ループ</span>{`
        if (i >= a.length || i >= b.length) return false;
        `}<span style={{ background: '#ef4444', color: '#fff', padding: '2px 4px', borderRadius: '3px', fontWeight: 'bold' }}>{`if (a[i] !== b[i]) return false;`}</span>{` `}<span style={{ color: '#fca5a5' }}>// ⚠️ 早期リターン</span>{`
    }
    return true;
}`}
                    </pre>
                </div>
            </div>

            <div style={styles.comparisonColumn}>
                <div style={{ ...styles.codeContainer, background: '#f0fdf4', border: '3px solid #86efac' }}>
                    <div style={{ ...styles.codeLabel, color: '#16a34a' }}>✓ 安全な実装</div>
                        <pre style={styles.code}>
                        {`function secureCompare(a: string, b: string): boolean {
    let result = true;
    const len = Math.max(a.length, b.length);
    const noise = randomInt(-100, 101) * 0.005;
    const perCharDelayMs = cfg.perCharDelayMs + noise;
    `}<span style={{ background: '#429460ff', color: '#fff', padding: '2px 4px', borderRadius: '3px', fontWeight: 'bold' }}>{`for (let i = 0; i < 10; i++)`}</span>{` { `}<span style={{ color: '#7ad89dff' }}>// ✓ 固定長ループ</span>{`
        if (i >= a.length || i >= b.length) result = false;
        `}<span style={{ background: '#429460ff', color: '#fff', padding: '2px 4px', borderRadius: '3px', fontWeight: 'bold' }}>{`if (a[i] !== b[i]) result = false;`}</span>{` `}<span style={{ color: '#7ad89dff' }}>// ✓ 早期リターンなし</span>{`
    }
    return result;
}`}
                        </pre>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>

    <Card style={{ marginTop: 24 }}>
        <CardHeader>
            <CardTitle>パスワード比較デモ：実行時間の差を体感しよう</CardTitle>
            <CardDescription>
                <span style={{ fontWeight: 700 }}>正解パスワード：</span>
                <span style={{ background: '#fca5a5', color: '#fff', padding: '2px 8px', borderRadius: 4, fontWeight: 700, fontSize: 18, letterSpacing: 2 }}>S3CR3T</span>
                <span style={{ marginLeft: 18, fontWeight: 700 }}>PW最大文字数：</span>
                <span style={{ background: '#bae6fd', color: '#0369a1', padding: '2px 8px', borderRadius: 4, fontWeight: 700, fontSize: 18 }}>10文字</span>
                <p>デモでは、実行ボタンを押すと選択した実装でパスワード比較が行われます。ここでは、処理時間の平均を取るために、比較を100回実行しています。</p>
            </CardDescription>
        </CardHeader>
                <CardContent className="space-y-4">
                    {/* 2. 実行ガイド（見た目改善） */}
                    <h3 style={{ ...styles.h3, marginTop: 10, color: '#0f172a' }}>🚀 試してみよう！</h3>

                    <ol className="ml-4 space-y-3" style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 6 }}>
                        <li>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <div>
                            <div style={{ fontWeight: 700 }}>【ステップ1】脆弱な実装の体感</div>
                            <div style={{ color: '#475569', marginTop: 6 }}>まずタブで「⚠️ 脆弱な実装」を選択し、実行ボタンを押して挙動を確認します。</div>
                            </div>
                        </div>
                        </li>

                        <li>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <div>
                            <div style={{ fontWeight: 700 }}>【ステップ2】実行時間を比較</div>
                            <div style={{ color: '#475569', marginTop: 6 }}>
                                以下の入力を順に試すと、
「どこまで合っているか」が
<b>時間として見えてくる</b>ことが分かります。
<br />
                                <div style={{ marginTop: 8 }}>
                                <pre style={{ background: '#f1f5f9', padding: '8px 10px', borderRadius: 6, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace', fontSize: 13, margin: 0 }}>
                    Axxxxx  // 先頭が不一致（早く終わる）
                    S3xxxx  // 先頭が部分一致（時間が少し長い）
                    S3CR3T  // 完全一致（最長）
                                </pre>
                                </div>
                            </div>
                            </div>
                        </div>
                        </li>

                        <li>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <div>
                            <div style={{ fontWeight: 700 }}>【ステップ3】安全な実装の体感</div>
                            <div style={{ color: '#475569', marginTop: 6 }}>「✓ 安全な実装」に切り替えて、同じ入力で再実行。実行時間がほぼ一定になるか確認します。</div>
                            </div>
                        </div>
                        </li>
                    </ol>

                    {/* 確認ポイント（カード風） */}
                    <div style={{ borderRadius: 8, border: '1px solid #e6f4ea', background: '#cfddf9ff', padding: 12, marginBottom: 6 }}>
                        <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#4447d9ff' }}>🔍 確認ポイント</h4>
                        <ul style={{ marginTop: 8, marginLeft: 18, fontSize: 16 }}>
                        <li style={{ marginBottom: 8 }}>
                            <span style={{ color: '#5f61d8ff', fontWeight: 800, marginRight: 8 }}>☑</span>
                            <b>脆弱な実装</b>では、「1文字多く合うごとに処理時間が伸びる」
                            → 攻撃者にヒントを与える
                        </li>
                        <li>
                            <span style={{ color: '#5f61d8ff', fontWeight: 800, marginRight: 8 }}>☑</span>
                            <b>安全な実装</b>では、「何を入れても処理時間がほぼ同じ」
→ 推測に使える情報が出ない
                        </li>
                        </ul>
                    </div>

                    {/* 入力フォーム（見た目改善） */}
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 700, marginBottom: 8, fontSize: 15, color: '#0f172a' }}>
                            入力パスワード（最大10文字）
                        </label>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value.slice(0, 10))}
                            maxLength={10}
                            placeholder="例: S3xxxx"
                            style={{
                            width: '100%',
                            padding: '10px 14px',
                            fontSize: 15,
                            border: '1px solid #cbd5e1',
                            borderRadius: 8,
                            boxSizing: 'border-box',
                            background: '#ffffff',
                            outline: 'none'
                            }}
                        />
                        <div style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>Tip: まずは <b>A</b> → <b>S3</b> → <b>S3CR3T</b> を試してみてください。</div>
                    </div>
                    </div>

    {/* タブ */}
                    <Tabs value={variant} onValueChange={(val) => setVariant(val as 'insecure' | 'secure')} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger 
                                value="insecure" 
                                className="flex items-center gap-2"
                                style={{ 
                                    background: variant === 'insecure' ? '#fef2f2' : '#fff',
                                    borderBottom: variant === 'insecure' ? '2px solid #ef4444' : '1px solid #e5e7eb',
                                    color: variant === 'insecure' ? '#dc2626' : '#64748b'
                                }}
                            >
                                ⚠️ 脆弱な実装
                            </TabsTrigger>
                            <TabsTrigger 
                                value="secure" 
                                className="flex items-center gap-2"
                                style={{ 
                                    background: variant === 'secure' ? '#f0fdf4' : '#fff',
                                    borderBottom: variant === 'secure' ? '2px solid #16a34a' : '1px solid #e5e7eb',
                                    color: variant === 'secure' ? '#16a34a' : '#64748b'
                                }}
                            >
                                ✓ 安全な実装
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="insecure" className="mt-4">
                            
                            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                                <Button
                                    onClick={handleRunInsecure}
                                    style={{
                                        padding: '10px 24px',
                                        fontSize: 16,
                                        background: '#ef4444',
                                        color: '#fff'
                                    }}
                                >
                                    実行（100回）
                                </Button>
                            </div>
                            <InsecureDemo ref={insecureRef} input={input} />
                        </TabsContent>
                        <TabsContent value="secure" className="mt-4">
                            
                            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                                <Button
                                    onClick={handleRunSecure}
                                    style={{
                                        padding: '10px 24px',
                                        fontSize: 16,
                                        background: '#16a34a',
                                        color: '#fff'
                                    }}
                                >
                                    実行（100回）
                                </Button>
                            </div>
                            <SecureDemo ref={secureRef} input={input} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </>
    );

    const summary = (
        <Card className="border-gray-300 bg-gray-50">
            <CardHeader>
                <CardTitle className="text-lg">🔎 まとめ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <p>
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded font-bold mr-2">危険</span>
                    パスワードやトークンの比較で、
                    一致しなかった時点で処理を終了する実装。
                    </p>
                    <p>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-bold mr-2">安全</span>
                    最後まで必ず比較を行い、
                    入力内容によって処理時間が変わらない実装。
                </p>

            </CardContent>
        </Card>
    );


    return(
    <SectionLayout
        title1="3. パスワードは“速さ”で盗まれる"
        title2="〜 早期リターンが引き起こすタイミング攻撃 〜"
        description={description}
        checklist={checklist}
        summary={summary}
    >
        {children}
    </SectionLayout>
    );
}