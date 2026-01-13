"use client"

import React, { useState } from 'react'
import { Globe, Server, AlertTriangle, CheckCircle, Lock, ShieldAlert, ArrowRight, Terminal } from 'lucide-react'

type Scenario = 'IDOR' | 'AdminBypass'

export default function LogicDemo() {
  const [scenario, setScenario] = useState<Scenario>('IDOR')
  const [fixed, setFixed] = useState(false)
  
  const [idorId, setIdorId] = useState('1001')
  const [idorResult, setIdorResult] = useState<any>(null)

  const [adminResult, setAdminResult] = useState<any>(null)


  const runIdorAttack = () => {
    const myId = '1001'
    
    if (fixed) {
      if (idorId === myId) {
        setIdorResult({ status: 200, data: { id: 1001, name: "自分 (Yamada)", email: "me@example.com" } })
      } else {
        setIdorResult({ status: 403, error: "Forbidden: Resource ownership validation failed." })
      }
    } else {
      if (idorId === '1001') {
        setIdorResult({ status: 200, data: { id: 1001, name: "自分 (Yamada)", email: "me@example.com" } })
      } else if (idorId === '1002') {
        setIdorResult({ status: 200, data: { id: 1002, name: "佐藤 太郎", email: "sato@target.com", address: "東京都..." } })
      } else {
        setIdorResult({ status: 404, error: "User Not Found" })
      }
    }
  }

  const runAdminAttack = () => {
    const userRole: string = 'member'

    if (fixed) {
      if (userRole !== 'admin') {
        setAdminResult({ status: 403, error: "Forbidden: Insufficient privileges (Role: Member)." })
      } else {
        setAdminResult({ status: 200, message: "Success: User deleted." })
      }
    } else {
      setAdminResult({ status: 200, message: "Success: User deleted." })
    }
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

  const btnBase: React.CSSProperties = {
    padding: '6px 12px',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none'
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
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
        <button
          onClick={() => { setScenario('IDOR'); setFixed(false); setIdorResult(null); setIdorId('1001'); }}
          style={{ 
            ...btnBase, 
            background: scenario === 'IDOR' ? '#eff6ff' : 'transparent', 
            color: scenario === 'IDOR' ? '#2563eb' : '#64748b' 
          }}
        >
          Case A: IDOR (Insecure Direct Object Reference)
        </button>
        <button
          onClick={() => { setScenario('AdminBypass'); setFixed(false); setAdminResult(null); }}
          style={{ 
            ...btnBase, 
            background: scenario === 'AdminBypass' ? '#eff6ff' : 'transparent', 
            color: scenario === 'AdminBypass' ? '#2563eb' : '#64748b' 
          }}
        >
          Case B: Broken Function Level Authorization
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, height: 400 }}>
        <div style={panelBase}>
          <div style={{ padding: '8px 12px', background: '#334155', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Terminal size={14} /> HTTP Request Simulator
          </div>

          {scenario === 'IDOR' ? (
            <>
              <div style={urlBarBase}>
                <span style={{ color: '#94a3b8', fontSize: 12 }}>GET</span>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, background: '#334155', borderRadius: 4, paddingRight: 4 }}>
                   <span style={{ color: '#94a3b8', paddingLeft: 8, fontSize: 13 }}>/api/profile?user_id=</span>
                   <input 
                     value={idorId}
                     onChange={(e) => setIdorId(e.target.value)}
                     style={{ ...inputBase, background: 'transparent', paddingLeft: 0 }}
                   />
                </div>
                <button 
                  onClick={runIdorAttack}
                  style={{ ...btnBase, background: '#2563eb', color: '#fff' }}
                >
                  Send
                </button>
              </div>
              <div style={{ padding: 20, flex: 1, background: '#fff', color: '#0f172a', fontFamily: 'monospace', fontSize: 13 }}>
                {!idorResult ? (
                  <div style={{ color: '#64748b', textAlign: 'center', marginTop: 40, fontFamily: 'sans-serif' }}>
                    Send request to API endpoint.<br/>
                    <small>Try accessing ID: 1002</small>
                  </div>
                ) : (
                  <div>
                    {idorResult.status === 200 ? (
                      <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, background: '#f8fafc' }}>
                        <div style={{ color: '#16a34a', fontWeight: 700, marginBottom: 8 }}>HTTP/1.1 200 OK</div>
                        <div>{`{`}</div>
                        <div style={{ paddingLeft: 12 }}>"id": {idorResult.data.id},</div>
                        <div style={{ paddingLeft: 12 }}>"name": "{idorResult.data.name}",</div>
                        <div style={{ paddingLeft: 12 }}>"email": "{idorResult.data.email}"</div>
                        <div>{`}`}</div>
                        
                        {idorResult.data.id === 1002 && (
                          <div style={{ marginTop: 12, padding: 8, background: '#fff1f2', color: '#be123c', borderRadius: 4, fontSize: 12, fontFamily: 'sans-serif' }}>
                            ⚠️ 想定外のリソース（他人）へアクセスできています
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ color: '#dc2626', fontWeight: 700, textAlign: 'center', marginTop: 40 }}>
                        HTTP/1.1 {idorResult.status} <br/>
                        {idorResult.error}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div style={urlBarBase}>
                <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: 12 }}>POST</span>
                <input readOnly value="/api/admin/delete_user" style={inputBase} />
                <button 
                  onClick={runAdminAttack}
                  style={{ ...btnBase, background: '#dc2626', color: '#fff' }}
                >
                  Execute
                </button>
              </div>
              <div style={{ padding: '8px 12px', background: '#1e293b', borderBottom: '1px solid #334155', fontSize: 11, color: '#94a3b8' }}>
                Payload: {`{ "target_id": 999 }`} <span style={{ marginLeft: 10, color: '#e2e8f0' }}>Context: Role=Member</span>
              </div>

              <div style={{ padding: 15, flex: 1, fontFamily: 'monospace', fontSize: 13, background: '#fff', color: '#0f172a' }}>
                {!adminResult ? (
                   <div style={{ color: '#64748b' }}>// Waiting for response...</div>
                ) : (
                  <div style={{ color: adminResult.status === 200 ? '#16a34a' : '#dc2626' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Server size={14} /> Backend Logic (Controller)</div>
            
            <button 
              onClick={() => setFixed(!fixed)}
              style={{ 
                ...btnBase, 
                background: fixed ? '#16a34a' : '#ef4444', 
                color: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 4 
              }}
            >
              {fixed ? <><CheckCircle size={12}/> Patched (Secure)</> : <><AlertTriangle size={12}/> Vulnerable</>}
            </button>
          </div>

          <div style={{ flex: 1, background: '#0f172a', overflow: 'auto' }}>
            <pre style={codeBase}>
{scenario === 'IDOR' ? (
fixed ? 
`# GET /profile
def get_profile(request):
    target_id = request.params.user_id
    
    # 【Secure Implementation】
    # クライアントからのIDを信頼せず、
    # セッション(認証情報)を用いて所有権を確認する
    current_user_id = request.session.user_id
    
    data = db.find_one(
        id=target_id, 
        owner_id=current_user_id # 所有者条件を強制
    )
    
    if not data:
        # 存在しないか、権限がない場合は404/403
        return error("Not Found", 404)
        
    return json(data)`
:
`# GET /profile
def get_profile(request):
    target_id = request.params.user_id
    
    # 【Vulnerable Implementation】
    # パラメータで指定されたIDでそのまま検索を実行
    # 「誰が」アクセスしているかの認可チェックが漏れている
    
    data = db.find_by_id(target_id)
    
    
    if not data:
        return error("Not Found", 404)
        
    return json(data)`
) : (
fixed ?
`# POST /api/admin/delete_user
def delete_user(request):
    # 【Secure Implementation】
    # エンドポイントの実行に必要なロールを明示的に検証
    # @RequiresRole('ADMIN') などのデコレータでも可
    if request.session.role != 'ADMIN':
        return error("Forbidden: Insufficient Role", 403)


    target_id = request.data.target_id
    db.delete_user(target_id)
    
    return success("User deleted")`
:
`# POST /api/admin/delete_user
def delete_user(request):
    # 【Vulnerable Implementation】
    # 認証済み(ログイン中)であることのみに依存し、
    # この機能の実行権限(管理者ロール)の確認がない
    
    
    
    target_id = request.data.target_id
    db.delete_user(target_id)
    
    return success("User deleted")`
)}
            </pre>
          </div>
          <div style={{ padding: 10, background: '#1e293b', borderTop: '1px solid #334155', fontSize: 12, color: '#94a3b8' }}>
            {fixed ? "✅ 対策済み: 信頼できるサーバーサイド情報（セッション等）に基づき認可を制御しています。" : "⚠️ 警告: クライアントからの入力値を過信し、認可制御が不十分です。"}
          </div>
        </div>

      </div>
    </div>
  )
}