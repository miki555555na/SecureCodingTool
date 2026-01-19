'use client';

import React, { useMemo, useState } from 'react';

type Variant = 'vulnerable' | 'secure';

type Resource = {
  id: string;
  label: string;
  short: string;
  sensitive: boolean;
};

type RunResult = {
  firstMs: number;
  secondMs: number;
  secondWasCached: boolean;
};

type CacheMap = Record<string, boolean>;

type HistoryRow = {
  when: string;
  variant: Variant;
  resourceId: string;
  resourceLabel: string;
  firstMs: number;
  secondMs: number;
  inference: string;
};

const RESOURCES: Resource[] = [
  { id: 'logo', label: 'ホームページのロゴ（公開情報）', short: 'ロゴ', sensitive: false },
  { id: 'signed_in', label: 'ログイン状態', short: 'ログイン状態', sensitive: true },
  { id: 'history_api', label: '利用履歴', short: '過去ログ', sensitive: true }
];

function randRange(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}

async function simulateRequest(isCached: boolean): Promise<number> {
  // キャッシュヒット = 速い / ミス = 遅い、を単純化して体感しやすくする
  const base = isCached ? randRange(25, 80) : randRange(260, 560);
  const jitter = isCached ? randRange(0, 20) : randRange(0, 140);
  const total = base + jitter;
  await new Promise((res) => window.setTimeout(res, total));
  return total;
}

function nowLabel() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

const btnBase: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid #cbd5e1',
  background: '#fff',
  cursor: 'pointer',
  fontWeight: 800
};

function statusPill(on: boolean) {
  return {
    padding: '2px 10px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 900,
    background: on ? '#e0f2fe' : '#f1f5f9',
    color: on ? '#0369a1' : '#475569',
    border: `1px solid ${on ? '#7dd3fc' : '#cbd5e1'}`
  } as const;
}

export function CacheDemo() {
  const [variant, setVariant] = useState<Variant>('vulnerable');
  const [running, setRunning] = useState(false);

  // ブラウザに「残っている」状態を表す（このデモ内だけの疑似キャッシュ）
  const [cacheMap, setCacheMap] = useState<CacheMap>(() => {
    const init: CacheMap = {};
    RESOURCES.forEach((r) => (init[r.id] = false));
    return init;
  });

  // 直近の測定結果（各リソースごとに 1回目/2回目 を保存）
  const [results, setResults] = useState<Record<string, RunResult | undefined>>({});
  const [history, setHistory] = useState<HistoryRow[]>([]);

  const modeHint = useMemo(() => {
    return variant === 'vulnerable'
      ? '⚠️ 脆弱：機密（ログイン/履歴）までキャッシュに残ってしまい、2回目が速くなりやすい'
      : '✓ 安全：機密はキャッシュしない（no-store相当）。2回目でも速さが変わりにくい';
  }, [variant]);

  const shouldAllowCache = (resId: string) => {
    const r = RESOURCES.find((x) => x.id === resId)!;
    if (!r.sensitive) return true; // 公開情報はキャッシュOK
    return variant === 'vulnerable'; // 脆弱モードだけ機密まで残ってしまう
  };

  const clearAll = () => {
    const cleared: CacheMap = {};
    RESOURCES.forEach((r) => (cleared[r.id] = false));
    setCacheMap(cleared);
    setResults({});
  };

  const runTwice = async (resId: string) => {
    if (running) return;

    const res = RESOURCES.find((r) => r.id === resId)!;
    const allowCache = shouldAllowCache(resId);

    setRunning(true);

    // 1回目：基本的にキャッシュミス（=遅い）
    const firstMs = await simulateRequest(false);

    // ここで「残る/残らない」が分かれる
    setCacheMap((m) => ({ ...m, [resId]: allowCache ? true : false }));

    // 2回目：allowCache ならキャッシュヒット扱い、そうでなければ毎回取りに行く
    const secondWasCached = allowCache ? true : false;
    const secondMs = await simulateRequest(secondWasCached);

    setResults((r) => ({
      ...r,
      [resId]: { firstMs, secondMs, secondWasCached }
    }));

    // 推測できる内容（学習者に伝えたい要点）
    const inference = (() => {
      if (!res.sensitive) {
        return secondWasCached ? '公開情報なので速くなってOK' : '（通常は速くなるはず）';
      }
      if (variant === 'vulnerable' && secondWasCached) {
        return '攻撃者は「この端末で以前アクセスがあった」と推測できる';
      }
      return '機密はキャッシュしないので推測されにくい';
    })();

    setHistory((h) =>
      [
        {
          when: nowLabel(),
          variant,
          resourceId: resId,
          resourceLabel: res.label,
          firstMs,
          secondMs,
          inference
        },
        ...h
      ].slice(0, 6)
    );

    setRunning(false);
  };

  return (
    <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e6eef8', padding: 14 }}>
      <div style={{ display: 'grid', gap: 12 }}>
        {/* モード */}
        <div style={{ padding: 12, borderRadius: 10, border: '1px solid #e6eef8', background: '#fbfdff' }}>
          <div style={{ fontWeight: 900, marginBottom: 8 }}>実装モード</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setVariant('vulnerable')}
              disabled={running}
              style={{
                ...btnBase,
                border: variant === 'vulnerable' ? '2px solid #ef4444' : btnBase.border,
                background: variant === 'vulnerable' ? '#fff7f7' : '#fff'
              }}
            >
              ⚠️ 脆弱な実装
            </button>
            <button
              type="button"
              onClick={() => {
                setVariant('secure');
                // 安全モードに切り替えた瞬間に「機密が残っている」誤解を防ぐ
                setCacheMap((m) => ({ ...m, signed_in: false, history_api: false }));
              }}
              disabled={running}
              style={{
                ...btnBase,
                border: variant === 'secure' ? '2px solid #16a34a' : btnBase.border,
                background: variant === 'secure' ? '#f7fffb' : '#fff'
              }}
            >
              ✓ 安全な実装
            </button>
            <button type="button" onClick={clearAll} disabled={running} style={{ ...btnBase, fontWeight: 900 }}>
              全キャッシュをクリア
            </button>
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: '#475569', lineHeight: 1.6 }}>{modeHint}</div>
        </div>

        {/* 実験 */}
        <div style={{ padding: 12, borderRadius: 10, border: '1px solid #e6eef8', background: '#fbfdff' }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>実験</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {RESOURCES.map((r) => (
              <button
                key={r.id}
                onClick={() => runTwice(r.id)}
                disabled={running}
                style={{
                  ...btnBase,
                  border: '1px solid #cbd5e1',
                  background:  '#fff',
                  fontSize:16
                }}
              >
                {r.short}取得を2回実行
              </button>
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
            見るポイント：<b>2回目が速い = 「この端末で以前アクセスがあった」</b>というヒントになり得ます。機密で起きると危険。
          </div>
        </div>

        {/* 現在のキャッシュ状況 */}
        <div style={{ padding: 12, borderRadius: 10, border: '1px solid #e6eef8', background: '#fff' }}>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>現在のキャッシュ状況</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {RESOURCES.map((r) => (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <div style={{ fontSize: 13, color: '#0f172a' }}>
                  {r.label}{' '}
                  {r.sensitive && (
                    <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 900, color: '#b91c1c' }}>
                      （機密）
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={statusPill(!!cacheMap[r.id])}>{cacheMap[r.id] ? 'あり' : 'なし'}</span>
                  <button
                    type="button"
                    onClick={() => setCacheMap((m) => ({ ...m, [r.id]: false }))}
                    disabled={running}
                    style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 800 }}
                  >
                    クリア
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 結果 */}
        <div style={{ padding: 12, borderRadius: 10, border: '1px solid #e6eef8', background: '#fff' }}>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>結果（1回目 / 2回目）</div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '8px 6px' }}>対象</th>
                  <th style={{ padding: '8px 6px' }}>1回目</th>
                  <th style={{ padding: '8px 6px' }}>2回目</th>
                  <th style={{ padding: '8px 6px' }}>2回目はキャッシュ？</th>
                </tr>
              </thead>
              <tbody>
                {RESOURCES.map((r) => {
                  const v = results[r.id];
                  return (
                    <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 6px', fontWeight: 900 }}>{r.short}</td>
                      <td style={{ padding: '10px 6px' }}>{v ? `${v.firstMs} ms` : '—'}</td>
                      <td style={{ padding: '10px 6px' }}>{v ? `${v.secondMs} ms` : '—'}</td>
                      <td style={{ padding: '10px 6px' }}>{v ? (v.secondWasCached ? 'はい' : 'いいえ') : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 10, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 10, fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
            <b>結論：</b>「速さ」は情報です。<b>機密（ログイン有無・履歴・個人情報）をキャッシュに入れると</b>、
            内容が見えなくても <b>2回目が速い</b> などの差から推測されることがあります。
          </div>
        </div>
      </div>
    </div>
  );
}
