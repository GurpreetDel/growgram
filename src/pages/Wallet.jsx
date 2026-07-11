import { useEffect, useRef, useState } from 'react'
import { useStore } from '../context/StoreContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Topbar from '../components/Topbar.jsx'
import { money, timeAgo } from '../lib/helpers'
import { getMerchant, setMerchant, buildUpiUri, renderQr } from '../lib/upi'
import { myTopups } from '../lib/accountData'

const PRESETS = [100, 500, 1000, 2500, 5000, 10000]

export default function Wallet() {
  const { balance, transactions, isAdmin, account, adminAddFunds, requestTopup } = useStore()
  const toast = useToast()
  const [amount, setAmount] = useState(500)

  if (isAdmin) return <AdminWallet {...{ balance, transactions, amount, setAmount, adminAddFunds, toast }} />
  return <UserWallet {...{ balance, transactions, amount, setAmount, requestTopup, account, toast }} />
}

/* ---------------- ADMIN: unlimited instant treasury ---------------- */
function AdminWallet({ balance, transactions, amount, setAmount, adminAddFunds, toast }) {
  const [merchant, setM] = useState(getMerchant())
  const saveMerchant = () => { setMerchant(merchant); toast('Merchant UPI saved — users can now pay you ✅', 'ok') }
  const add = () => {
    const res = adminAddFunds(amount)
    if (res.ok) toast(`₹${Number(amount).toLocaleString('en-IN')} added to treasury 👑`, 'ok')
    else toast(res.error, 'err')
  }
  return (
    <>
      <Topbar title="Wallet · Owner" sub="Unlimited treasury — add any amount instantly, no payment required." />
      <div className="grid" style={{ gridTemplateColumns: '1fr 1.2fr', gap: 16, alignItems: 'start' }}>
        <div className="grid" style={{ gap: 16 }}>
          <div className="card pad">
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>Treasury balance</div>
            <div className="gradient-text" style={{ fontSize: 42, fontWeight: 800, margin: '4px 0 18px' }}>{money(balance)}</div>
            <div className="field">
              <label>Add any amount (₹)</label>
              <input className="input" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
              <div className="row wrap" style={{ gap: 6, marginTop: 8 }}>
                {[1000, 10000, 100000, 1000000].map((p) => (
                  <button key={p} className="btn sm ghost" onClick={() => setAmount(p)}>+{p.toLocaleString('en-IN')}</button>
                ))}
              </div>
            </div>
            <button className="btn primary block" onClick={add}>👑 Add {money(amount || 0)} instantly</button>
          </div>

          <div className="card pad">
            <span className="badge grad" style={{ marginBottom: 10 }}>💳 Merchant payment settings</span>
            <p style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 0 }}>
              Paste your <b style={{ color: 'var(--text)' }}>GPay / UPI ID</b> — members see a live scannable QR that pays you directly.
            </p>
            <div className="field">
              <label>Your UPI ID</label>
              <input className="input" value={merchant.upiId} onChange={(e) => setM({ ...merchant, upiId: e.target.value.trim() })} placeholder="yourname@okhdfcbank" />
            </div>
            <div className="field">
              <label>Payee name (shown in UPI app)</label>
              <input className="input" value={merchant.payeeName} onChange={(e) => setM({ ...merchant, payeeName: e.target.value })} placeholder="GrowGram" />
            </div>
            <div className="field">
              <label>QR image URL (optional — your GPay QR photo)</label>
              <input className="input" value={merchant.qrImage || ''} onChange={(e) => setM({ ...merchant, qrImage: e.target.value.trim() })} placeholder="/upi-qr.png or https://…" />
            </div>
            <button className="btn primary block" onClick={saveMerchant}>Save merchant details</button>
          </div>
        </div>

        <div className="card pad">
          <h3 style={{ margin: '0 0 12px', fontSize: 17 }}>Treasury history</h3>
          <TxTable transactions={transactions} />
        </div>
      </div>
    </>
  )
}

/* ---------------- USER: real UPI payment -> pending approval ---------------- */
function UserWallet({ balance, transactions, amount, setAmount, requestTopup, account, toast }) {
  const merchant = getMerchant()
  const canvasRef = useRef(null)
  const [ref, setRef] = useState('')
  const [tick, setTick] = useState(0) // refresh pending list after submit
  const upiUri = merchant.upiId ? buildUpiUri({ ...merchant, amount, note: `GrowGram ${account?.email || ''}` }) : ''
  const pending = myTopups(account?.id).slice(0, 6)

  useEffect(() => {
    if (upiUri && canvasRef.current) renderQr(canvasRef.current, upiUri).catch(() => {})
  }, [upiUri])

  const submit = () => {
    if (!amount || amount <= 0) return toast('Enter a valid amount', 'err')
    if (!ref.trim()) return toast('Enter the UPI reference / UTR number from your payment app', 'err')
    const res = requestTopup({ amount, method: 'UPI', ref: ref.trim() })
    if (res.ok) {
      toast(`Payment of ${money(amount)} submitted — admin will confirm shortly ⏳`, 'ok')
      setRef(''); setTick((t) => t + 1)
    } else toast(res.error, 'err')
  }

  return (
    <>
      <Topbar title="Wallet" sub="Add funds with UPI, then order any service. You only pay for what you use." />
      <div className="grid" style={{ gridTemplateColumns: '1fr 1.2fr', gap: 16, alignItems: 'start' }}>
        <div className="card pad">
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>Your balance</div>
          <div className="gradient-text" style={{ fontSize: 42, fontWeight: 800, margin: '4px 0 16px' }}>{money(balance)}</div>

          <div className="field">
            <label>Amount to add (₹)</label>
            <input className="input" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            <div className="row wrap" style={{ gap: 6, marginTop: 8 }}>
              {PRESETS.map((p) => (
                <button key={p} className={'btn sm' + (amount === p ? ' primary' : ' ghost')} onClick={() => setAmount(p)}>₹{p.toLocaleString('en-IN')}</button>
              ))}
            </div>
          </div>

          {merchant.upiId ? (
            <div className="pay-box">
              <div className="row between" style={{ marginBottom: 10 }}>
                <b style={{ fontSize: 14 }}>Pay ₹{Number(amount || 0).toLocaleString('en-IN')} via UPI</b>
                <span className="badge">🔒 Direct to owner</span>
              </div>
              <div className="qr-holder">
                {merchant.qrImage
                  ? <img src={merchant.qrImage} alt="UPI QR" className="qr-img" />
                  : <canvas ref={canvasRef} className="qr-img" />}
              </div>
              <div style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--muted)', margin: '10px 0' }}>
                Scan with any UPI app · <b style={{ color: 'var(--text)' }}>{merchant.upiId}</b>
              </div>
              <a className="btn block" href={upiUri}>📱 Open in GPay / PhonePe / Paytm</a>

              <div className="field" style={{ marginTop: 16 }}>
                <label>After paying, enter your UPI reference / UTR number</label>
                <input className="input" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="e.g. 4429••••1207" />
              </div>
              <button className="btn primary block" onClick={submit}>Submit payment for approval</button>
              <p style={{ fontSize: 11.5, color: 'var(--muted-2)', textAlign: 'center', marginTop: 10 }}>
                Funds appear once the panel owner confirms your payment.
              </p>
            </div>
          ) : (
            <div className="badge" style={{ width: '100%', justifyContent: 'center', color: 'var(--amber)', padding: 14 }}>
              ⚠️ Payments not configured yet — ask the admin to add a UPI ID.
            </div>
          )}
        </div>

        <div className="grid" style={{ gap: 16 }}>
          <div className="card pad">
            <h3 style={{ margin: '0 0 12px', fontSize: 17 }}>Your top-up requests</h3>
            {pending.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: 13.5 }}>No top-ups yet. Pay via UPI above to add funds.</p>
            ) : (
              <table className="table">
                <thead><tr><th>Ref</th><th>Amount</th><th>When</th><th style={{ textAlign: 'right' }}>Status</th></tr></thead>
                <tbody>
                  {pending.map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{t.id}</td>
                      <td style={{ fontWeight: 700 }}>{money(t.amount)}</td>
                      <td style={{ color: 'var(--muted)', fontSize: 12 }}>{timeAgo(t.at)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={'badge ' + (t.status === 'Approved' ? 'ok-badge' : t.status === 'Rejected' ? 'err-badge' : '')}>
                          {t.status === 'Approved' ? '✅' : t.status === 'Rejected' ? '❌' : '⏳'} {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="card pad">
            <h3 style={{ margin: '0 0 12px', fontSize: 17 }}>Transaction history</h3>
            <TxTable transactions={transactions} />
          </div>
        </div>
      </div>
    </>
  )
}

function TxTable({ transactions }) {
  if (!transactions?.length) return <p style={{ color: 'var(--muted)' }}>No transactions yet.</p>
  return (
    <table className="table">
      <thead><tr><th>Type</th><th className="hide-mobile">Note</th><th>When</th><th style={{ textAlign: 'right' }}>Amount</th></tr></thead>
      <tbody>
        {transactions.map((t) => (
          <tr key={t.id}>
            <td style={{ fontWeight: 600 }}>{t.type}</td>
            <td className="hide-mobile" style={{ color: 'var(--muted)', fontFamily: t.type === 'Order' ? 'monospace' : 'inherit', fontSize: 12 }}>{t.note}</td>
            <td style={{ color: 'var(--muted)', fontSize: 12 }}>{timeAgo(t.at)}</td>
            <td style={{ textAlign: 'right', fontWeight: 700, color: t.amount >= 0 ? 'var(--green)' : 'var(--text)' }}>
              {t.amount >= 0 ? '+' : '−'}{money(Math.abs(t.amount))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
