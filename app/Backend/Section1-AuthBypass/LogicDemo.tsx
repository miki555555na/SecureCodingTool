"use client"

import React, { useState } from 'react'
import { 
  Globe, 
  Server, 
  AlertTriangle, 
  CheckCircle, 
  Terminal, 
  User, 
  MapPin, 
  Mail, 
  Briefcase,
  ShieldAlert,
  Lock
} from 'lucide-react'

type Scenario = 'IDOR' | 'AdminBypass'

const btnBase: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 6,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: '#d1d5db',
  background: '#fff',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 13,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6
}

export default function LogicDemo() {
  const [scenario, setScenario] = useState<Scenario>('IDOR')
  const [fixed, setFixed] = useState(false)
  
  const [idorId, setIdorId] = useState('1001')
  const [idorResult, setIdorResult] = useState<any>(null)

  const [adminResult, setAdminResult] = useState<any>(null)

  const runIdorAttack = () => {
    const myId = '1001'
    
    setIdorResult(null)
    setTimeout(() => {
        if (fixed) {
          if (idorId === myId) {
            setIdorResult({ status: 200, data: { id: 1001, name: "Yamada Taro", role: "Member", email: "me@example.com", bio: "こんにちは、山田です。Web開発を勉強中です。" } })
          } else {
            setIdorResult({ status: 403, error: "Access Denied" })
          }
        } else {
          if (idorId === '1001') {
            setIdorResult({ status: 200, data: { id: 1001, name: "Yamada Taro", role: "Member", email: "me@example.com", bio: "こんにちは、山田です。Web開発を勉強中です。" } })
          } else if (idorId === '1002') {
            setIdorResult({ status: 200, data: { id: 1002, name: "Suzuki Jiro", role: "Manager", email: "suzuki@corp.com", bio: "営業部の鈴木です。", address: "東京都千代田区1-1-1 (非公開)", phone: "090-xxxx-xxxx" } })
          } else {
            setIdorResult({ status: 404, error: "User Not Found" })
          }
        }
    }, 400)
  }

  const runAdminAttack = () => {
    const userRole = 'member'
    setAdminResult(null)
    
    setTimeout(() => {
        if (fixed) {
          if (userRole.toUpperCase() !== 'ADMIN') {
            setAdminResult({ status: 403, error: "Forbidden: Insufficient privileges (Role: Member)." })
          } else {
            setAdminResult({ status: 200, message: "Success: User deleted." })
          }
        } else {
          setAdminResult({ status: 200, message: "Success: User deleted." })
        }
    }, 400)
  }

  const panelBase: React.CSSProperties = {
    background: '#1e293b',
    borderRadius: 8,
    border: '1px solid #334155',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  }

  const urlBarBase: React.CSSProperties = {
    background: '#0f172a',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    borderBottom: '1px solid #334155'
  }

  const inputBase: React.CSSProperties = {
    background: '#334155',
    border: 'none',
    color: '#e2e8f0',
    padding: '4px 8px',
    borderRadius: 4,
    fontFamily: 'monospace',
    fontSize: 13,
    flex: 1
  }

  const codeBase: React.CSSProperties = {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 1.5,
    padding: 15,
    color: '#e2e8f0',
    overflowX: 'auto'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
        <button
          onClick={() => { setFixed(false); setIdorResult(null); setAdminResult(null); }}
          style={{ 
            ...btnBase, 
            ...( !fixed ? { borderColor: '#ef4444', background: '#fff7f7', color: '#b91c1c' } : { color: '#6b7280' } )
          }}
        >
          ⚠️ 脆弱な実装 (Vulnerable)
        </button>
        <button
          onClick={() => { setFixed(true); setIdorResult(null); setAdminResult(null); }}
          style={{ 
            ...btnBase, 
            ...( fixed ? { borderColor: '#16a34a', background: '#f7fffb', color: '#15803d' } : { color: '#6b7280' } )
          }}
        >
          ✓ 安全な実装 (Secure)
        </button>
      </div>

      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #e5e7eb', paddingBottom: 0 }}>
        <button
          onClick={() => { setScenario('IDOR'); setIdorResult(null); setIdorId('1001'); }}
          style={{ 
            padding: '8px 16px',
            fontSize: 14,
            fontWeight: 600,
            borderBottom: scenario === 'IDOR' ? '2px solid #2563eb' : '2px solid transparent',
            color: scenario === 'IDOR' ? '#2563eb' : '#64748b',
            background: 'none',
            border: 'none',
            borderBottomWidth: 2,
            borderBottomStyle: 'solid',
            cursor: 'pointer'
          }}
        >
          Case A：他の人のページが見えてしまう
        </button>
        <button
          onClick={() => { setScenario('AdminBypass'); setAdminResult(null); }}
          style={{ 
            padding: '8px 16px',
            fontSize: 14,
            fontWeight: 600,
            borderBottom: scenario === 'AdminBypass' ? '2px solid #2563eb' : '2px solid transparent',
            color: scenario === 'AdminBypass' ? '#2563eb' : '#64748b',
            background: 'none',
            border: 'none',
            borderBottomWidth: 2,
            borderBottomStyle: 'solid',
            cursor: 'pointer'
          }}
        >
          Case B：画面にない操作が動いてしまう
        </button>
      </div>
      <div style={{
        padding: '8px 12px',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        fontSize: 13.5,
        color: '#475569'
      }}>
        {scenario === 'IDOR'
          ? '目標：IDを 1001 → 1002 に変えて、見える内容が変わるか確かめる'
          : '目標：画面にない「削除」を直接送って、止められるか確かめる'}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, height: 440 }}>
        <div style={panelBase}>
          
          {scenario === 'IDOR' ? (
            <>
              <div style={{ padding: '8px 12px', background: '#cbd5e1', color: '#334155', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid #94a3b8' }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }}></div>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#eab308' }}></div>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }}></div>
                </div>
                <div style={{ flex: 1, textAlign: 'center', color: '#475569' }}>Vulnerable App - Profile</div>
              </div>

              <div style={{ ...urlBarBase, background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                <Globe size={14} color="#64748b" />
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, background: '#fff', borderRadius: 4, border: '1px solid #cbd5e1', paddingRight: 4, boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)' }}>
                   <span style={{ color: '#94a3b8', paddingLeft: 8, fontSize: 13 }}>example.com/profile?id=</span>
                   <input 
                     value={idorId}
                     onChange={(e) => setIdorId(e.target.value)}
                     style={{ ...inputBase, background: 'transparent', paddingLeft: 0, color: '#334155' }}
                   />
                </div>
                <button 
                  onClick={runIdorAttack}
                  style={{ ...btnBase, background: '#2563eb', color: '#fff', padding: '4px 12px', height: 28, fontSize: 12, border: 'none' }}
                >
                  Go
                </button>
              </div>
              <div style={{ flex: 1, background: '#fff', color: '#0f172a', position: 'relative', overflowY: 'auto' }}>
                {!idorResult ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', gap: 10 }}>
                    <Globe size={48} strokeWidth={1} opacity={0.5} />
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#64748b' }}>
  まずは「1001」のまま Go を押してみてください
</div>
<div style={{ fontSize: 12, background: '#f1f5f9', padding: '6px 10px', borderRadius: 8 }}>
  次に、URLの数字を 1002 に変えて Go（何が見えるか比べてみよう）
</div>

                  </div>
                ) : (
                  <>
                    {idorResult.status === 200 ? (
                      <div style={{ padding: 24 }}>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
                          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={32} color="#64748b" />
                          </div>
                          <div>
                            <h2 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 700, color: '#1e293b' }}>{idorResult.data.name}</h2>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <span style={{ fontSize: 12, background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: 10 }}>{idorResult.data.role}</span>
                                <span style={{ fontSize: 12, color: '#64748b' }}>ID: {idorResult.data.id}</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: '#334155' }}>
                            <Mail size={16} color="#94a3b8" /> {idorResult.data.email}
                          </div>
                          <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: '#334155' }}>
                            <Briefcase size={16} color="#94a3b8" /> {idorResult.data.bio}
                          </div>

                          <hr style={{ border: 'none', height: 1, background: '#e2e8f0', margin: '8px 0' }} />

                          {idorResult.data.address ? (
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: 12 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#b91c1c', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
  <ShieldAlert size={16} /> 本来は見えないはずの情報
</div>
<div style={{ fontSize: 12, color: '#991b1b', marginTop: 2 }}>
  「URLの数字を変えただけ」で見えてしまっています
</div>
<br />
                              <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: '#7f1d1d', marginBottom: 4 }}>
                                <MapPin size={16} /> {idorResult.data.address}
                              </div>
                              <div style={{ fontSize: 12, color: '#991b1b', marginLeft: 26 }}>
                                Phone: {idorResult.data.phone}
                              </div>
                            </div>
                          ) : (
                             <div style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>Private information is hidden.</div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
                        <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <Lock size={24} color="#64748b" />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>{idorResult.status === 403 ? "Access Denied" : "Page Not Found"}</div>
                            <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{idorResult.error}</div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <div style={{ padding: '8px 12px', background: '#334155', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Terminal size={14} />  画面にない操作を直接呼ぶ
              </div>
              <div style={urlBarBase}>
                <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: 12 }}>POST</span>
                <input readOnly value="/api/admin/delete_user" style={inputBase} />
                <button 
                  onClick={runAdminAttack}
                  style={{ ...btnBase, background: '#dc2626', color: '#fff', padding: '4px 12px', height: 28, fontSize: 12, border: 'none' }}
                >
                  送信
                </button>
              </div>
              <div style={{ padding: '8px 12px', background: '#1e293b', borderBottom: '1px solid #334155', fontSize: 11, color: '#94a3b8' }}>
  送信データ: {`{ "target_id": 999 }`}
  <span style={{ marginLeft: 10, color: '#e2e8f0' }}>あなたの状態：一般ユーザー</span>
</div>

              <div style={{ padding: 15, flex: 1, fontFamily: 'monospace', fontSize: 13, background: '#0f172a', color: '#e2e8f0' }}>
                {!adminResult ? (
                   <div style={{ color: '#64748b' }}>// 準備完了。リクエスト待ち...</div>
                ) : (
                  <div style={{ color: adminResult.status === 200 ? '#4ade80' : '#f87171' }}>
                    HTTP/1.1 {adminResult.status} {adminResult.status === 200 ? 'OK' : 'Forbidden'} <br/>
                    Date: {new Date().toTimeString().split(' ')[0]} <br/>
                    Content-Type: application/json <br/>
                    <br/>
                    {JSON.stringify(adminResult, null, 2)}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div style={panelBase}>
          <div style={{ padding: '8px 12px', background: '#334155', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Server size={14} /> バックエンド処理 (Controller)</div>
          </div>

          <div style={{ flex: 1, background: '#0f172a', overflow: 'auto' }}>
            <pre style={codeBase}>
{scenario === 'IDOR' ? (
fixed ? 
`# GET /profile
def get_profile(request):
    target_id = request.params.user_id
    
    # セッション(認証情報)からIDを取得
    current_user_id = request.session.user_id
    
    # ログイン中のユーザーID（サーバー側の情報）を使う
    # → 「自分のデータだけ」に絞って探す
    data = db.find_one(id=target_id, owner_id=current_user_id)

    if not data:
        # 他人のデータなら「存在しない」か「拒否」
        return error("Access Denied", 403)
        
    return render("profile", data)`
:
`# GET /profile
def get_profile(request):
    target_id = request.params.user_id
    
    # URLで渡されたIDをそのまま使う
    # → 「誰のページを見ていいか」を見ていない
    data = db.find_by_id(target_id)

    if not data:
        return error("Not Found", 404)
        
    # 他人のデータでもそのまま表示してしまう
    return render("profile", data)`
) : (
fixed ?
`# POST /api/admin/delete_user
def delete_user(request):    
    # 先に「この操作をしていい人か」を確認する
    if request.session.role != 'ADMIN':
        return error("Forbidden", 403)

    target_id = request.data.target_id
    db.delete_user(target_id)
    
    return success("User deleted")`
:
`# POST /api/admin/delete_user
def delete_user(request):
    target_id = request.data.target_id

    # ログイン中かは見ているが、
    # 「この操作をしていい人か」を見ていない
    db.delete_user(target_id)

    return success("User deleted")`
)}
            </pre>
          </div>
          <div style={{ padding: 10, background: '#1e293b', borderTop: '1px solid #334155', fontSize: 12, color: '#94a3b8' }}>
            {fixed
              ? "✅ 安全：サーバー側の情報（ログイン中のユーザー情報）を使って、できる操作を決めています。"
              : "⚠️ 危険：URLや入力をそのまま信じると、本来できない操作が通ってしまいます。"}
          </div>
        </div>
      </div>
    </div>
  )
}