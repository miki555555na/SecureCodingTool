'use client';
import React, { useState } from 'react';
import { InsecureDemo } from './InsecureDemo';
import { SecureDemo } from './SecureDemo';
import { styles } from '../../Framework/SectionStyles';

export default function DemoSwitcher() {
    const [mode, setMode] = useState<'insecure' | 'secure'>('insecure');

    const btnBase: React.CSSProperties = {
        padding: '8px 12px',
        borderRadius: 6,
        border: '1px solid #d1d5db',
        background: '#fff',
        cursor: 'pointer',
        fontWeight: 600
    };
    const active = { boxShadow: '0 0 0 3px rgba(99,102,241,0.08)' };

    return (
        <section style={{ ...styles.section, background: '#fff', border: '1px solid #e2e8f0' }}>
        <div style={{ marginTop: 20, marginBottom: 20 }}>
            <h2 style={styles.h2} >パスワードを推測デモ</h2>
            <span style={{ fontWeight: 700 }}>正解パスワード：</span>
            <span style={{ background: '#fca5a5', color: '#fff', padding: '2px 8px', borderRadius: 4, fontWeight: 700, fontSize: 18, letterSpacing: 2 }}>S3CR3T</span>
            <span style={{ marginLeft: 18, fontWeight: 700 }}>PW最大文字数：</span>
            <span style={{ background: '#bae6fd', color: '#0369a1', padding: '2px 8px', borderRadius: 4, fontWeight: 700, fontSize: 18 }}>10文字</span>

            <section style={{...styles.todoWrapper, marginTop: 18, marginBottom: 18 }}>
                <h2 style={{ ...styles.h2, fontSize: 20, marginBottom: 6, marginTop: 0 }}><b>確認ポイント</b></h2>
                <ul style={{ fontSize: 17, marginLeft: 18, marginBottom: 0 }}>
                    <li style={{ marginBottom: 6 }}>
                        <span style={{ color: '#22c55e', fontWeight: 700, marginRight: 6 }}>☑</span>
                        <b>脆弱な実装</b>で、
                        <span style={{  textDecoration: 'underline' }}>一致文字数を増やす</span>と、
                        <span style={{ background: '#f3bcbcff', padding: '2px 4px', borderRadius: 3, margin: '0 3px' }}>実行時間が段階的に長くなる</span>
                        ことを確認しよう
                    </li>
                    <li>
                        <span style={{ color: '#22c55e', fontWeight: 700, marginRight: 6 }}>☑</span>
                        <b>安全な実装</b>で、同じように、
                        <span style={{  textDecoration: 'underline' }}>一致文字数を増やし</span>、
                        <span style={{ background: '#bbf7d0', padding: '2px 4px', borderRadius: 3, margin: '0 3px' }}>実行時間がほぼ一定になる</span>
                        ことを確認しよう
                    </li>
                </ul>
            </section>
            <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                <button
                    type="button"
                    onClick={() => setMode('insecure')}
                    aria-pressed={mode === 'insecure'}
                    style={{ ...btnBase, ...(mode === 'insecure' ? { borderColor: '#ef4444', background: '#fff7f7' } : {}), ...(mode === 'insecure' ? active : {}) }}
                >
                    ⚠️ 脆弱な実装
                </button>
                <button
                    type="button"
                    onClick={() => setMode('secure')}
                    aria-pressed={mode === 'secure'}
                    style={{ ...btnBase, ...(mode === 'secure' ? { borderColor: '#16a34a', background: '#f7fffb' } : {}), ...(mode === 'secure' ? active : {}) }}
                >
                    ✓ 安全な実装
                </button>
            </div>

            <div>
                {mode === 'insecure' ? (
                    <div>
                        <InsecureDemo />
                    </div>
                ) : (
                    <div>
                        <SecureDemo />
                    </div>
                )}
            </div>
        </div>
        </section>
    );
}