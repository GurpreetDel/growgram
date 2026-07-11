export default function StatusBadge({ status }) {
  const key = status.replace(/\s/g, '')
  return (
    <span className="badge" style={{ background: 'transparent' }}>
      <span className={`dot bg-${key} ${status === 'In progress' || status === 'Pending' ? 'pulse' : ''}`} />
      <span className={`status-${key}`}>{status}</span>
    </span>
  )
}
