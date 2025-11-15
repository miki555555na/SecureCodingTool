// app/page.tsx
import React from 'react';
import InsecureDemo from './InsecureDemo';
import SecureDemo from './SecureDemo';

export const metadata = {
  title: 'タイミング攻撃チュートリアル',
  description: 'タイミング攻撃の基礎・回避法・文字列比較の問題点・シミュレーションを表示するサンプルページ'
};

export default function TimingAttackPage(): JSX.Element {
  return (
    <main style={styles.page}>
      {/* ▼ やることリスト固定表示 */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: '#f8fafc',
          borderBottom: '2px solid #bae6fd',
          boxShadow: '0 2px 8px #0001',
          padding: '14px 0 10px 0',
          marginBottom: 18
        }}
      >
        <section style={{ ...styles.section, background: 'transparent', border: 'none', marginBottom: 0, marginTop: 0, padding: 0 }}>
          <h2 style={{ ...styles.h2, fontSize: 20, marginBottom: 6, marginTop: 0 }}>📝 やってみようリスト</h2>
          <ul style={{ fontSize: 17, marginLeft: 18, marginBottom: 0 }}>
            <li style={{ marginBottom: 6 }}>
              <span style={{ color: '#22c55e', fontWeight: 700, marginRight: 6 }}>☑</span>
              <b>脆弱なコード</b>で、
              <span style={{ background: '#fef9c3', padding: '2px 4px', borderRadius: 3, margin: '0 3px' }}>1文字目だけ合っているとき</span>と
              <span style={{ background: '#fef9c3', padding: '2px 4px', borderRadius: 3, margin: '0 3px' }}>パスワードがすべて合っているとき</span>
              の実行時間の違いを比べてみよう
            </li>
            <li>
              <span style={{ color: '#22c55e', fontWeight: 700, marginRight: 6 }}>☑</span>
              <b>安全なコード</b>で、同じように実行してみて、
              <span style={{ background: '#bbf7d0', padding: '2px 4px', borderRadius: 3, margin: '0 3px' }}>時間差が出ない</span>
              ことを確認しよう
            </li>
          </ul>
        </section>
      </div>
      {/* ▲ やることリストここまで */}
      <header style={styles.header}>
        <h1 style={styles.h1}>タイミング攻撃チュートリアル</h1>
        <p style={styles.lead}>
          <b>タイミング攻撃</b>とは、<span style={{ background: '#fef9c3', fontWeight: 500 }}>処理時間の違い</span>からパスワードなどの情報が漏れる攻撃手法です。<br />
          このページでは、<span style={{ color: '#2563eb', fontWeight: 600 }}>なぜ危険なのか・どう防ぐか</span>を体験できます。
        </p>
      </header>
      <section style={styles.section}>
        <h2 style={styles.h2}>シミュレーション：パスワード推測と時間差</h2>
        <p>
          <b>攻撃者</b>がパスワードを1文字ずつ推測する様子をシミュレーションします。<br />
          <span style={{ color: '#ef4444', fontWeight: 700 }}>正解文字列：</span>
          <span style={{ background: '#fca5a5', color: '#fff', padding: '2px 8px', borderRadius: 4, fontWeight: 700, fontSize: 18, letterSpacing: 2 }}>S3CR3T</span>
          <span style={{ marginLeft: 18, color: '#0ea5e9', fontWeight: 700 }}>PW最大文字数：</span>
          <span style={{ background: '#bae6fd', color: '#0369a1', padding: '2px 8px', borderRadius: 4, fontWeight: 700, fontSize: 18 }}>10文字</span>
        </p>
        <p>
          <span style={{ color: '#f59e42', fontWeight: 600 }}>※</span>
          <span>攻撃者はこの微妙な時間差を測定し、<b>先頭から順に正解文字を推測</b>できます。</span>
        </p>
        <div style={styles.comparison}>
          <div style={styles.comparisonColumn}>
            <h3 style={styles.h3}>脆弱な実装（insecureCompare）</h3>
            <p style={{ fontSize: 18, marginBottom: 12 }}>以下は早期リターン（early return）を行うため、タイミング攻撃に脆弱です。</p>
            <div style={{ ...styles.codeContainer, background: '#fef2f2', border: '3px solid #fca5a5' }}>
              <div style={{ ...styles.codeLabel, color: '#dc2626' }}>⚠️ 脆弱なコード</div>
              <pre style={styles.code}>
{`function insecureCompare(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  const noise = randomInt(-100, 101) * 0.005;
  const perCharDelayMs = cfg.perCharDelayMs + noise;
  `}<span style={{ background: '#ef4444', color: '#fff', padding: '2px 4px', borderRadius: '3px', fontWeight: 'bold' }}>{`for (let i = 0; i < len; i++)`}</span>{` { `}<span style={{ color: '#fca5a5' }}>// ⚠️ 可変長ループ</span>{`
    if (i >= a.length || i >= b.length) return false;
    `}<span style={{ background: '#ef4444', color: '#fff', padding: '2px 4px', borderRadius: '3px', fontWeight: 'bold' }}>{`if (a[i] !== b[i]) return false;`}</span>{` `}<span style={{ color: '#fca5a5' }}>// ⚠️ 早期リターン</span>{`
      /* 今回のデモでは、観測しやすくするため、
      ここに約1msの待ち時間を入れています。*/
  }
  return true;
}`}
              </pre>
            </div>

            <h4 style={styles.h4}>↓のデモは、<div style={{ ...styles.codeLabel, color: '#dc2626' }}>⚠️ 脆弱なコード</div>を実装した比較処理を<b>100回実行</b>してその分布を表示します。</h4>
            <h4>やってみようリストの<u>１つ目の項目</u>をやってみましょう。</h4>
            {/* Insert the insecure demo (client-side) */}
            <div style={{ marginTop: 18 }}>
              <InsecureDemo />
            </div>
          </div>

          <div style={styles.comparisonColumn}>
            <h3 style={styles.h3}>安全なコード（secureCompare）</h3>
            <p style={{ fontSize: 18, marginBottom: 12 }}>以下は固定回数のループを行い、タイミング情報の漏洩を軽減します。</p>
            <div style={{ ...styles.codeContainer, background: '#f0fdf4', border: '3px solid #86efac' }}>
              <div style={{ ...styles.codeLabel, color: '#16a34a' }}>✓ 安全なコード</div>
              <pre style={styles.code}>
{`function secureCompare(a: string, b: string): boolean {
  let result = true;
  const len = Math.max(a.length, b.length);
  const noise = randomInt(-100, 101) * 0.005;
  const perCharDelayMs = cfg.perCharDelayMs + noise;
  `}<span style={{ background: '#22c55e', color: '#fff', padding: '2px 4px', borderRadius: '3px', fontWeight: 'bold' }}>{`for (let i = 0; i < 10; i++)`}</span>{` { `}<span style={{ color: '#86efac' }}>// ✓ 固定長ループ</span>{`
    if (i >= a.length || i >= b.length) result = false;
    `}<span style={{ background: '#22c55e', color: '#fff', padding: '2px 4px', borderRadius: '3px', fontWeight: 'bold' }}>{`if (a[i] !== b[i]) result = false;`}</span>{` `}<span style={{ color: '#86efac' }}>// ✓ 早期リターンなし</span>{`
      /* 今回のデモでは、観測しやすくするため、
      ここに約1msの待ち時間を入れています。*/
  }
  return result;
}`}
              </pre>
            </div>

            <h4 style={styles.h4}>↓のデモは、<div style={{ ...styles.codeLabel, color: '#16a34a' }}>✓ 安全なコード</div>を実装した比較処理を<b>100回実行</b>してその分布を表示します。</h4>
            <h4>やってみようリストの<u>２つ目の項目</u>をやってみましょう。</h4>
            {/* Insert the secure demo (client-side) */}
            <div style={{ marginTop: 18 }}>
              <SecureDemo />
            </div>
          </div>
        </div>

      </section>
      {/* ▼ まとめセクション */}
      <section style={{ ...styles.section, background: '#f9fafb', border: '1.5px solid #e5e7eb', marginTop: 32 }}>
        <h2 style={{ ...styles.h2, fontSize: 22, marginBottom: 10 }}>🔎 まとめ：ここがポイント！</h2>
        <ul style={{ fontSize: 17, marginLeft: 18 }}>
          <li style={{ marginBottom: 8 }}>
            <span style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 6px', borderRadius: 4, fontWeight: 700, marginRight: 6 }}>✗ よくない例</span>
            <b>早期リターン</b>や<b>可変長ループ</b>は、<span style={{ textDecoration: 'underline' }}>タイミング情報が漏れる</span>原因になる
          </li>
          <li>
            <span style={{ background: '#bbf7d0', color: '#15803d', padding: '2px 6px', borderRadius: 4, fontWeight: 700, marginRight: 6 }}>✓ いい例</span>
            <b>固定長ループ</b>と<b>早期リターンなし</b>で、<span style={{ textDecoration: 'underline' }}>比較時間を一定にする</span>ことで安全性が高まる
          </li>
        </ul>
        <div style={{ marginTop: 18, color: '#64748b', fontSize: 16 }}>
          <b>ポイント：</b>「比較処理の時間差」は攻撃者にとって大きなヒントになるため、<span style={{ color: '#dc2626', fontWeight: 700 }}>時間差が出ない</span>ように実装しましょう。
        </div>
      </section>
      {/* ▲ まとめここまで */}
    </main>
  );
}

const styles: { [k: string]: React.CSSProperties } = {
  page: {
    maxWidth: 1400,
    margin: '32px auto',
    padding: '0 20px',
    fontFamily: '"Noto Sans JP", "ヒラギノ角ゴ ProN", "Segoe UI", Roboto, sans-serif',
    color: '#111',
    lineHeight: 1.7,
    fontSize: 17
  },
  header: {
    textAlign: 'center',
    marginBottom: 28
  },
  h1: {
    fontSize: 36,
    margin: '0 0 6px'
  },
  lead: {
    margin: 0,
    color: '#555',
    fontSize: 18
  },
  section: {
    marginBottom: 26,
    padding: 20,
    borderRadius: 8,
    background: '#fbfbfb',
    border: '1px solid #ececec'
  },
  comparison: {
    display: 'flex',
    gap: 24,
    marginTop: 20
  },
  comparisonColumn: {
    flex: 1,
    minWidth: 0
  },
  h2: {
    fontSize: 26,
    margin: '0 0 10px'
  },
  h3: {
    fontSize: 22,
    margin: '10px 0 6px'
  },
  h4: {
    fontSize: 19,
    margin: '12px 0 6px',
    color: '#333'
  },
  codeContainer: {
    borderRadius: 8,
    padding: 16,
    marginTop: 12
  },
  codeLabel: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 8,
    color: '#ff6b6b'
  },
  code: {
    display: 'block',
    background: '#1e1e1e',
    color: '#dcdcdc',
    padding: 18,
    borderRadius: 6,
    overflowX: 'auto',
    fontFamily: 'monospace',
    fontSize: 17,
    lineHeight: 1.6,
    margin: 0
  },
  tableWrap: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: 720
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    borderBottom: '2px solid #ddd',
    background: '#f7f7f7',
    fontWeight: 600,
    fontSize: 16
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
    verticalAlign: 'top',
    fontSize: 16
  },
  footer: {
    marginTop: 24,
    textAlign: 'center',
    color: '#666'
  }
};