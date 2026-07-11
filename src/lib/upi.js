// Real UPI payment helpers.
// buildUpiUri() produces a standard `upi://pay` deep link that GPay / PhonePe /
// Paytm / any BHIM-UPI app can open or scan. renderQr() paints that link as a
// scannable QR onto a <canvas> using the `qrcode` package (fully offline).

import QRCode from 'qrcode'

const MERCHANT_KEY = 'growgram.merchant.v1'

const DEFAULT_MERCHANT = {
  upiId: '',            // e.g. yourname@okhdfcbank — set by admin in Wallet/Admin
  payeeName: 'GrowGram',
}

export const getMerchant = () => {
  try { return { ...DEFAULT_MERCHANT, ...JSON.parse(localStorage.getItem(MERCHANT_KEY) || '{}') } }
  catch { return { ...DEFAULT_MERCHANT } }
}
export const setMerchant = (m) => localStorage.setItem(MERCHANT_KEY, JSON.stringify({ ...getMerchant(), ...m }))

export function buildUpiUri({ upiId, payeeName, amount, note }) {
  const params = new URLSearchParams()
  params.set('pa', upiId)
  params.set('pn', payeeName || 'GrowGram')
  if (amount) params.set('am', Number(amount).toFixed(2))
  params.set('cu', 'INR')
  if (note) params.set('tn', note)
  return 'upi://pay?' + params.toString()
}

export async function renderQr(canvas, text) {
  if (!canvas) return
  await QRCode.toCanvas(canvas, text, {
    width: 240,
    margin: 1,
    color: { dark: '#0b0713', light: '#ffffff' },
    errorCorrectionLevel: 'M',
  })
}
