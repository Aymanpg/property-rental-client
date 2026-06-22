const Loading = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-2 border-line border-t-clay rounded-full animate-spin" />
      <p className="font-mono text-xs uppercase tracking-widest text-muted">Loading...</p>
    </div>
  )
}

export default Loading