const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <div className="w-8 h-8 border-2 border-line border-t-clay rounded-full animate-spin" />
      <p className="font-mono text-xs uppercase tracking-widest text-muted">{text}</p>
    </div>
  )
}

export default LoadingSpinner