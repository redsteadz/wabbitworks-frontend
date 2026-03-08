const StatCard = ({ label, value, tone = 'base' }) => {
  const toneClass = {
    base: 'bg-base-100',
    primary: 'bg-primary text-primary-content',
    accent: 'bg-accent text-accent-content',
    success: 'bg-success text-success-content',
    warning: 'bg-warning text-warning-content',
    error: 'bg-error text-error-content',
  }[tone]

  return (
    <div className={`rounded-box p-4 shadow-sm ${toneClass}`}>
      <div className="text-xs uppercase tracking-wide opacity-70">{label}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
    </div>
  )
}

export default StatCard
