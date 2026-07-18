export default function Loader({ fullScreen = false }) {
  return (
    <div className={fullScreen
      ? 'fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50'
      : 'flex flex-col items-center justify-center py-20 gap-3'}>
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-2 border-primary-100 border-t-primary-500 animate-spin" />
      </div>
      {!fullScreen && <p className="text-sm text-gray-400 font-medium">Loading...</p>}
    </div>
  )
}
