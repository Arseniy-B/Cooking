export default function DottedRow({ label, value }: { label: string; value: string }){
  return (
    <div className="flex items-baseline gap-2 w-full">
      <span className="text-sm font-medium whitespace-nowrap">{label}</span>

      <div className="flex-1 h-0.5
        bg-[radial-gradient(circle,#1f2937_1.5px,transparent_1.5px)]
        bg-size-[6px_2px] -translate-y-0.5" 
      />

      <span className="text-sm font-semibold whitespace-nowrap">{value}</span>
    </div>
  )
}
