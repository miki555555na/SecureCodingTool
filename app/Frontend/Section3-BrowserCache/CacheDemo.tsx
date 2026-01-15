'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

type Resource = { id: string; label: string; short: string; sensitive: boolean };
type AccessResult = {
  id: string;
  label: string;
  cached: boolean;
  time: number;
  message: string;
  nth: number; // 同じリソースの何回目アクセスか
};

const RESOURCES: Resource[] = [
  { id: 'page_visit', label: '画像: ロゴ（ページ訪問）', short: 'ロゴ', sensitive: false },
  { id: 'signed_in', label: '画像: サインイン成功（ログイン有無）', short: 'サインイン画像', sensitive: true },
  { id: 'api_history', label: 'API: 過去ログ', short: '過去ログAPI', sensitive: true }
];

async function simulateApiRequest(cached: boolean): Promise<number> {
  const base = cached ? randRange(20, 70) : randRange(250, 520);
  const jitter = cached ? 0 : Math.round(Math.random() * 120);
  const totalDelay = base + jitter;
  await new Promise((res) => window.setTimeout(res, totalDelay));
  return totalDelay;
}
function randRange(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}

const DISPLAY_SCALE = 4;
const MIN_DISPLAY = 300;

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

type Screen = 'SignIn' | 'SignedIn' | 'ApiResult';
type Variant = 'vulnerable' | 'secure';

export function CacheDemo() {
  const [variant, setVariant] = useState<Variant>('vulnerable');

  const [cachedMap, setCachedMap] = useState<Record<string, boolean>>({});
  const [history, setHistory] = useState<AccessResult[]>([]);
  const [running, setRunning] = useState(false);
  const timersRef = useRef<number[]>([]);
  const [screen, setScreen] = useState<Screen>('SignIn');
  const [apiData, setApiData] = useState<string | null>(null);

  const [accessCount, setAccessCount] = useState<Record<string, number>>({
    page_visit: 0,
    signed_in: 0,
    api_history: 0
  });

  useEffect(() => {
    const init: Record<string, boolean> = {};
    RESOURCES.forEach((r) => (init[r.id] = false));
    setCachedMap(init);
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const setCache = (resId: string, flag: boolean) => {
    setCachedMap((m) => ({ ...m, [resId]: flag }));
  };

  const clearAllCaches = () => {
    const cleared: Record<string, boolean> = {};
    RESOURCES.forEach((r) => (cleared[r.id] = false));
    setCachedMap(cleared);
    setHistory([]);
    setAccessCount({ page_visit: 0, signed_in: 0, api_history: 0 });
    setApiData(null);
    setScreen('SignIn');
  };

  // A：安全モードでは sensitive なリソースは絶対にキャッシュさせない
  const shouldCacheResource = (resId: string) => {
    const r = RESOURCES.find((x) => x.id === resId)!;
    if (!r.sensitive) return true; // ロゴ等はキャッシュOK
    return variant === 'vulnerable'; // 脆弱モードだけ「残ってしまう」
  };

  const access = async (resId: string) => {
    const allowCache = shouldCacheResource(resId);
    const cached = allowCache ? !!cachedMap[resId] : false; // 安全モードは常にミス扱い
    setRunning(true);

    const nth = (accessCount[resId] ?? 0) + 1;
    setAccessCount((c) => ({ ...c, [resId]: nth }));

    const label = RESOURCES.find((r) => r.id === resId)!.label;
    const pending: AccessResult = { id: resId, label, cached, time: 0, message: 'アクセス中…', nth };
    setHistory((h) => [pending, ...h].slice(0, 6));

    const start = performance.now();
    await simulateApiRequest(cached);
    const end = performance.now();
    const actualMs = Math.max(1, Math.round(end - start));
    const displayTime = Math.max(MIN_DISPLAY, actualMs * DISPLAY_SCALE);

    const t = window.setTimeout(() => {
      const result: AccessResult = {
        id: resId,
        label,
        cached,
        time: actualMs,
        message: cached ? 'キャッシュあり：速い' : 'キャッシュなし：遅い',
        nth
      };
      setHistory((h) => [result, ...h.filter((x) => x !== pending)].slice(0, 6));
      setRunning(false);
    }, displayTime);
    timersRef.current.push(t);

    // キャッシュ状態を更新
    if (allowCache) {
      // 脆弱モードの sensitive / どちらでもOKな非sensitive は、アクセス後に残る
      setCache(resId, true);
    } else {
      // 安全モードの sensitive は残さない
      setCache(resId, false);
    }
  };

  const signIn = () => {
    // UI上の状態は変えるが、キャッシュ扱いは variant で決まる
    if (shouldCacheResource('signed_in')) setCache('signed_in', true);
    setScreen('SignedIn');
  };

  const signOut = () => {
    setCache('signed_in', false);
    setScreen('SignIn');
  };

  const fetchProfileApi = async () => {
    await access('api_history');
    if (shouldCacheResource('api_history')) setCache('api_history', true);
    setApiData('ユーザー履歴データ（ダミー）');
    setScreen('ApiResult');
  };

  const statusBadge = (on: boolean) => ({
    padding: '2px 8px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    background: on ? '#e0f2fe' : '#f1f5f9',
    color: on ? '#0369a1' : '#475569',
    border: `1px solid ${on ? '#7dd3fc' : '#cbd5e1'}`
  });

  const modeHint = useMemo(() => {
    return variant === 'vulnerable'
      ? '脆弱：ログイン後の情報も“残り得る”ため、速さの差がヒントになる'
      : '安全：ログイン後の情報は“残さない”ため、同じ操作でも速さが変わりにくい';
  }, [variant]);

  return (
    <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e6eef8', padding: 14 }}>
      <div style={{ display: 'flex', gap: 16 }}>
        {/* 左カラム */}
        <div style={{ width: 420, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* モード切替（HMAC章と同じノリ） */}
          <div style={{ padding: 12, borderRadius: 8, border: '1px solid #e6eef8', background: '#fbfdff' }}>
            <div style={{ fontWeight: 900, marginBottom: 8 }}>実装モード</div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
              <button
                type="button"
                onClick={() => {
                  setVariant('vulnerable');
                }}
                style={{
                  ...btnBase,
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: variant === 'vulnerable' ? '2px solid #ef4444' : '1px solid #cbd5e1',
                  background: variant === 'vulnerable' ? '#fff7f7' : '#fff',
                  cursor: 'pointer',
                  fontWeight: 800

                }}
              >
                ⚠️ 脆弱な実装
              </button>

              <button
                type="button"
                onClick={() => {
                  setVariant('secure');
                  // 安全モードへ：sensitiveキャッシュは即OFFにして誤解を防ぐ
                  setCache('signed_in', false);
                  setCache('api_history', false);
                }}
                style={{
                  ...btnBase,
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: variant === 'secure' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                  background: variant === 'secure' ? '#f7fffb' : '#fff',
                  cursor: 'pointer',
                  fontWeight: 800
                }}
              >
                ✓ 安全な実装
              </button>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
              {modeHint}
            </div>
          </div>

          {/* 操作 */}
          <div style={{ padding: 12, borderRadius: 8, border: '1px solid #e6eef8', background: '#fbfdff' }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>操作（同じボタンを2回押して比べる）</div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
              <button
                onClick={() => access('page_visit')}
                disabled={running}
                style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
              >
                ロゴにアクセス
              </button>
              <button
                onClick={() => access('signed_in')}
                disabled={running}
                style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
              >
                サインイン画像にアクセス
              </button>
              <button
                onClick={() => access('api_history')}
                disabled={running}
                style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
              >
                過去ログAPIにアクセス
              </button>
            </div>

            <button
              onClick={clearAllCaches}
              disabled={running}
              style={{
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                background: '#fff',
                cursor: 'pointer',
                fontWeight: 800
              }}
            >
              全キャッシュをクリア
            </button>

            <div style={{ marginTop: 8, fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
              ※「安全」では、ログイン後の情報は毎回取りに行く想定（2回目でも遅い）
            </div>
          </div>

          {/* キャッシュ状況 */}
          <div style={{ padding: 12, borderRadius: 8, border: '1px solid #e6eef8', background: '#fff', flex: 1 }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>現在のキャッシュ状況</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {RESOURCES.map((r) => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 13, color: '#0f172a' }}>{r.label}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={statusBadge(!!cachedMap[r.id])}>{cachedMap[r.id] ? 'あり' : 'なし'}</span>
                    <button
                      onClick={() => setCache(r.id, false)}
                      disabled={running}
                      style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                    >
                      クリア
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 履歴 */}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>直近のアクセス結果（1回目/2回目を比較）</div>

              {history.length === 0 && <div style={{ color: '#64748b' }}>まだアクセスしていません</div>}

              {history.map((h, idx) => {
                const barWidth = Math.max(6, Math.min(100, (h.time / 600) * 100));
                const barColor = h.cached ? '#2563eb' : '#94a3b8';
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 150 }}>
                      <div style={{ fontWeight: 800, fontSize: 13 }}>{h.label}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>
                        {h.nth}回目 / {h.cached ? 'キャッシュあり' : 'キャッシュなし'}
                      </div>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ position: 'relative', background: '#f1f5f9', height: 22, borderRadius: 8, overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${barWidth}%`,
                            height: '100%',
                            background: barColor,
                            transition: 'width 300ms linear',
                            boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.06)'
                          }}
                        />
                        <div style={{ position: 'absolute', right: 8, top: 0, bottom: 0, display: 'flex', alignItems: 'center', color: '#fff', fontWeight: 800, fontSize: 12 }}>
                          {h.time > 0 ? `${h.time} ms` : h.message}
                        </div>
                      </div>
                      <div style={{ marginTop: 4, fontSize: 12, color: '#475569' }}>{h.message}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 右カラム：ブラウザ風 */}
        <div style={{ flex: 1, borderRadius: 8, border: '1px solid #e6eef8', padding: 18, background: '#f8fafc' }}>
          <div style={{ fontWeight: 900, marginBottom: 12 }}>ブラウザ風表示</div>

          {screen === 'SignIn' && (
            <div style={{ padding: 20, borderRadius: 8, background: '#fff', textAlign: 'center' }}>
              <img src="/image/logo_image.png" alt="logo" style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover' }} />
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>サインインページ</div>
              <div style={{ marginBottom: 12, color: '#64748b', lineHeight: 1.6 }}>
                ここはロゴ画像が表示される想定です（ロゴはキャッシュしてもOKな例）。
              </div>
              <button
                onClick={signIn}
                style={{ padding: '10px 14px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 800 }}
              >
                サインイン
              </button>
            </div>
          )}

          {screen === 'SignedIn' && (
            <div style={{ padding: 20, borderRadius: 8, background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>サインイン成功</div>
                  <div style={{ color: '#64748b', marginTop: 6 }}>プロフィール画像などが表示されます。</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={signOut}
                    style={{ padding: '8px 10px', borderRadius: 8, background: '#334155', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 800 }}
                  >
                    サインアウト
                  </button>
                  <button
                    onClick={fetchProfileApi}
                    disabled={running}
                    style={{ padding: '8px 10px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 800, opacity: running ? 0.6 : 1 }}
                  >
                    過去ログAPI（取得）
                  </button>
                </div>
              </div>

              <div style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                  <img src="/image/user_icon.png" alt="user" style={{ objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 800 }}>ユーザー名: demo_user</div>
                  <div style={{ color: '#64748b', fontSize: 13 }}>
                    ログイン画像のキャッシュ: <b>{cachedMap.signed_in ? 'あり' : 'なし'}</b>
                  </div>
                </div>
              </div>
            </div>
          )}

          {screen === 'ApiResult' && (
            <div style={{ padding: 20, borderRadius: 8, background: '#fff' }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>API結果</div>
              <div style={{ color: '#64748b', marginTop: 8 }}>{apiData ?? '（結果なし）'}</div>
              <div style={{ marginTop: 12 }}>
                <button
                  onClick={() => setScreen('SignedIn')}
                  style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff' }}
                >
                  戻る
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// 'use client';

// import React, { useEffect, useRef, useState } from 'react';

// type Resource = { id: string; label: string };
// type AccessResult = { id: string; label: string; cached: boolean; time: number; message: string };

// // 変更: キャッシュキーをページ訪問 / サインイン情報 / API履歴に統一
// const RESOURCES: Resource[] = [
//   { id: 'page_visit', label: '画像: ロゴ（ページ訪問）' },
//   { id: 'signed_in', label: '画像： サインイン成功（ログイン有無）' },
//   { id: 'api_history', label: 'API: 過去ログ' }
// ];

// // シンプルな遅延差（ms）
// // function simulateAccess(cached: boolean) {
// //   // キャッシュヒットは軽い（高速）、ミスは重い（遅延）
// //   if (cached) {
// //     return Math.round(20 + Math.random() * 50); // 20-70ms
// //   }
// //   return Math.round(300 + Math.random() * 220); // 300-520ms
// // }

// // --- 変更: 実際の API 呼び出しを模した非同期関数に置換 ---
// async function simulateApiRequest(resourceId: string, cached: boolean): Promise<number> {
//   const base = cached ? randRange(20, 70) : randRange(250, 520);
//   const jitter = cached ? 0 : Math.round(Math.random() * 120);
//   const totalDelay = base + jitter;
//   await new Promise((res) => {
//     const t = window.setTimeout(res, totalDelay);
//   });
//   return totalDelay;
// }
// function randRange(min: number, max: number) {
//   return Math.round(min + Math.random() * (max - min));
// }

// // 表示をゆっくりするためのスケール
// const DISPLAY_SCALE = 4;
// const MIN_DISPLAY = 300;

// // 追加: 右ペインの画面を表す型
// type Screen = 'SignIn' | 'SignedIn' | 'ApiResult';

// export function CacheDemo() {
//   // ...existing state...
//   const [cachedMap, setCachedMap] = useState<Record<string, boolean>>({});
//   const [selected, setSelected] = useState<string>(RESOURCES[0].id);
//   const [history, setHistory] = useState<AccessResult[]>([]);
//   const [running, setRunning] = useState(false);
//   const timersRef = useRef<number[]>([]);
//   // 追加: 右ペインの画面管理
//   const [screen, setScreen] = useState<Screen>('SignIn');
//   // API結果画面で表示する簡易データ
//   const [apiData, setApiData] = useState<string | null>(null);

//   useEffect(() => {
//     // 初期で何もキャッシュされていない
//     const init: Record<string, boolean> = {};
//     RESOURCES.forEach((r) => (init[r.id] = false));
//     setCachedMap(init);
//     return () => {
//       timersRef.current.forEach((t) => clearTimeout(t));
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // 右ペインが SignIn にいるとき「ページ訪問キャッシュ」を残す（サインイン前に訪れた痕跡）
//   useEffect(() => {
//     if (screen === 'SignIn') {
//       setCachedMap((m) => ({ ...m, page_visit: true }));
//     }
//   }, [screen]);

//   const access = async (resId: string) => {
//     const cached = !!cachedMap[resId];
//     setRunning(true);

//     const pending: AccessResult = { id: resId, label: RESOURCES.find((r) => r.id === resId)!.label, cached, time: 0, message: 'アクセス中…' };
//     setHistory((h) => [pending, ...h].slice(0, 6));

//     const start = performance.now();
//     const simulatedMs = await simulateApiRequest(resId, cached);
//     const end = performance.now();
//     const actualMs = Math.max(1, Math.round(end - start));

//     const displayTime = Math.max(MIN_DISPLAY, actualMs * DISPLAY_SCALE);

//     const t = window.setTimeout(() => {
//       const result: AccessResult = {
//         id: resId,
//         label: pending.label,
//         cached,
//         time: actualMs,
//         message: cached ? 'キャッシュヒット：高速に取得' : 'キャッシュミス：遅延が発生'
//       };
//       setHistory((h) => [result, ...h.filter((x) => x !== pending)].slice(0, 6));
//       setRunning(false);
//     }, displayTime);
//     timersRef.current.push(t);
//   };

//   // キャッシュ setter をラップ（外部からも呼ぶ）
//   const setCache = (resId: string, flag: boolean) => {
//     setCachedMap((m) => ({ ...m, [resId]: flag }));
//   };

//   // サインイン / サインアウトの挙動
//   const signIn = () => {
//     // サインインすると signed_in キャッシュが残る
//     setCache('signed_in', true);
//     setScreen('SignedIn');
//   };
//   const signOut = () => {
//     setCache('signed_in', false);
//     setScreen('SignIn');
//   };

//   // API取得（プロフィール等） -> キャッシュをセットし、APIResult画面へ
//   const fetchProfileApi = async () => {
//     // 実際のアクセスを模す（同時に履歴に登録）
//     await access('api_history');
//     // API が完了したらキャッシュを残し、結果表示
//     setCache('api_history', true);
//     setApiData('ユーザー履歴データ（ダミー）');
//     setScreen('ApiResult');
//   };

//   const clearAllCaches = () => {
//     const cleared: Record<string, boolean> = {};
//     RESOURCES.forEach((r) => (cleared[r.id] = false));
//     setCachedMap(cleared);
//   };

//   return (
//     <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e6eef8', padding: 14 }}>
//       {/* レイアウト: 左（操作） / 右（ブラウザ風） */}
//       <div style={{ display: 'flex', gap: 16 }}>
//         {/* 左カラム */}
//         <div style={{ width: 420, display: 'flex', flexDirection: 'column', gap: 12 }}>
//           {/* 左上: キャッシュアクセス用ボタン群 */}
//           <div style={{ padding: 12, borderRadius: 8, border: '1px solid #e6eef8', background: '#fbfdff' }}>
//             <div style={{ fontWeight: 700, marginBottom: 8 }}>キャッシュ操作</div>
//             <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
//               <button
//                 onClick={() => access('page_visit')}
//                 disabled={running}
//                 style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', cursor: 'pointer' }}
//               >
//                 アクセス: ページ訪問（ロゴ）
//               </button>
//               <button
//                 onClick={() => access('signed_in')}
//                 disabled={running}
//                 style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', cursor: 'pointer' }}
//               >
//                 アクセス: サインイン状態（サインイン画像）
//               </button>
//               <button
//                 onClick={() => access('api_history')}
//                 disabled={running}
//                 style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', cursor: 'pointer' }}
//               >
//                 アクセス: API（過去ログ）
//               </button>
//             </div>
//             <div>
//               <button
//                 onClick={clearAllCaches}
//                 style={{ padding: '8px 10px', borderRadius: 8, background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer' }}
//               >
//                 全キャッシュをクリア
//               </button>
//             </div>
//           </div>

//           {/* 左下: 現在のキャッシュ状況 */}
//           <div style={{ padding: 12, borderRadius: 8, border: '1px solid #e6eef8', background: '#fff7ed', flex: 1 }}>
//             <div style={{ fontWeight: 700, marginBottom: 8 }}>現在のキャッシュ状況</div>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <div>ページ訪問（ロゴ）</div>
//                 <div style={{ display: 'flex', gap: 8 }}>
//                   <div style={{ color: cachedMap.page_visit ? '#16a34a' : '#ef4444', fontWeight: 700 }}>
//                     {cachedMap.page_visit ? 'あり' : 'なし'}
//                   </div>
//                   <button onClick={() => setCache('page_visit', false)} style={{ padding: '4px 8px', borderRadius: 6 }}>
//                     クリア
//                   </button>
//                 </div>
//               </div>

//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <div>サインイン情報（サインイン成功）</div>
//                 <div style={{ display: 'flex', gap: 8 }}>
//                   <div style={{ color: cachedMap.signed_in ? '#16a34a' : '#ef4444', fontWeight: 700 }}>
//                     {cachedMap.signed_in ? 'あり' : 'なし'}
//                   </div>
//                   <button onClick={() => setCache('signed_in', false)} style={{ padding: '4px 8px', borderRadius: 6 }}>
//                     クリア
//                   </button>
//                 </div>
//               </div>

//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <div>API: 過去ログ</div>
//                 <div style={{ display: 'flex', gap: 8 }}>
//                   <div style={{ color: cachedMap.api_history ? '#16a34a' : '#ef4444', fontWeight: 700 }}>
//                     {cachedMap.api_history ? 'あり' : 'なし'}
//                   </div>
//                   <button onClick={() => setCache('api_history', false)} style={{ padding: '4px 8px', borderRadius: 6 }}>
//                     クリア
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* 履歴表示（直近アクセス） */}
//             <div style={{ marginTop: 12 }}>
//               <div style={{ fontWeight: 700, marginBottom: 8 }}>直近のアクセス結果</div>
//               {history.length === 0 && <div style={{ color: '#64748b' }}>まだアクセスしていません</div>}
//               {history.map((h, idx) => {
//                 const barWidth = Math.max(6, Math.min(100, (h.time / 600) * 100));
//                 const color = h.message.includes('ヒット') ? '#16a34a' : '#ef4444';
//                 return (
//                   <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
//                     <div style={{ width: 140 }}>
//                       <div style={{ fontWeight: 700 }}>{h.label}</div>
//                       <div style={{ fontSize: 13, color: '#64748b' }}>{h.cached ? 'キャッシュ: あり' : 'キャッシュ: なし'}</div>
//                     </div>
//                     <div style={{ flex: 1 }}>
//                       <div style={{ position: 'relative', background: '#f1f5f9', height: 22, borderRadius: 8, overflow: 'hidden' }}>
//                         <div
//                           style={{
//                             width: `${barWidth}%`,
//                             height: '100%',
//                             background: color,
//                             transition: 'width 300ms linear',
//                             boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.06)'
//                           }}
//                         />
//                         <div style={{ position: 'absolute', right: 8, top: 0, bottom: 0, display: 'flex', alignItems: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>
//                           {h.time > 0 ? `${h.time} ms` : h.message}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* 右カラム: ブラウザ風表示（3画面） */}
//         <div style={{ flex: 1, borderRadius: 8, border: '1px solid #e6eef8', padding: 18, background: '#f8fafc' }}>
//           <div style={{ fontWeight: 800, marginBottom: 12 }}>ブラウザ風表示</div>

//           {/* SignIn 画面 */}
//           {screen === 'SignIn' && (
//             <div style={{ padding: 20, borderRadius: 8, background: '#fff', textAlign: 'center' }}>
//                 <img src="/image/logo_image.png" alt="logo" style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover' }} />
//               <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>サインインページ</div>
//               <div style={{ marginBottom: 12, color: '#64748b' }}>このページに訪れるだけで「ページ訪問」キャッシュが残ります。</div>
//               <button
//                 onClick={signIn}
//                 style={{ padding: '10px 14px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}
//               >
//                 サインイン
//               </button>
//             </div>
//           )}

//           {/* SignedIn 画面 */}
//           {screen === 'SignedIn' && (
//             <div style={{ padding: 20, borderRadius: 8, background: '#fff' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <div>
//                   <div style={{ fontSize: 18, fontWeight: 700 }}>サインイン成功</div>
//                   <div style={{ color: '#64748b', marginTop: 6 }}>ここにプロフィール画像等が表示されます。</div>
//                 </div>
//                 <div style={{ display: 'flex', gap: 8 }}>
//                   <button
//                     onClick={signOut}
//                     style={{ padding: '8px 10px', borderRadius: 8, background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer' }}
//                   >
//                     サインアウト
//                   </button>
//                   <button
//                     onClick={fetchProfileApi}
//                     disabled={running}
//                     style={{ padding: '8px 10px', borderRadius: 8, background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}
//                   >
//                     プロフィール取得 (API)
//                   </button>
//                 </div>
//               </div>

//               {/* 簡易プロフィール表示（キャッシュがあると緑で表示） */}
//               <div style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
//                 <div style={{ width: 80, height: 80, borderRadius: 8, background: cachedMap.signed_in ? '#bbf7d0' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
//                   <img src="/image/user_icon.png" alt="logo" style={{objectFit: 'cover' }} />
//                 </div>
//                 <div>
//                   <div style={{ fontWeight: 700 }}>ユーザー名: demo_user</div>
//                   <div style={{ color: '#64748b' }}>ログイン状態のキャッシュ: {cachedMap.signed_in ? 'あり' : 'なし'}</div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* API 結果画面 */}
//           {screen === 'ApiResult' && (
//             <div style={{ padding: 20, borderRadius: 8, background: '#fff' }}>
//               <div style={{ fontSize: 18, fontWeight: 700 }}>API結果</div>
//               <div style={{ color: '#64748b', marginTop: 8 }}>{apiData ?? '（結果なし）'}</div>
//               <div style={{ marginTop: 12 }}>
//                 <button onClick={() => setScreen('SignedIn')} style={{ padding: '8px 10px', borderRadius: 8 }}>
//                   戻る
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
