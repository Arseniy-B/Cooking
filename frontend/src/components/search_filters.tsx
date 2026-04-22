import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowUp, ArrowUpDown, ArrowDown } from "lucide-react"
import type { RecipeSearch } from "@/services/api/schemas"
import { useState, useEffect } from "react"


type PriceMode = undefined | true | false 

const config = {
  none: {
    icon: <ArrowUpDown className="h-4 w-4" />,
  },
  asc: {
    icon: <ArrowDown className="h-4 w-4" />,
  },
  desc: {
    icon: <ArrowUp className="h-4 w-4" />,
  },
}

interface PriceToggleProps {
  text: string
  value: PriceMode
  onChange: (value: PriceMode) => void
}

export function TriStateToggle({ text, value, onChange }: PriceToggleProps) {
  const cycle = () => {
    if (value === undefined) onChange(true)      
    else if (value === true) onChange(false)     
    else onChange(undefined)                     
  }

  const key = value === undefined ? "none" : value === true ? "asc" : "desc"
  const current = config[key]

  return (
    <Button
      className={cn(
        "flex h-10 items-center gap-2 px-4 text-sm font-medium transition-all",
      )}
      aria-label="Сортировка по цене"
      onClick={()=>{cycle()}}
      variant={value !== undefined ? "secondary" : "ghost"}
    >
      {current.icon}
      <span>{text}</span>
    </Button>
  )
}


interface SearchFiltersProps{
  search: RecipeSearch
  setSearch: (search: RecipeSearch) => void
}

export default function SearchFilters({search, setSearch}: SearchFiltersProps){
  const [priceMode, setPriceMode] = useState<boolean | undefined>(search.cost)
  const [viewsMode, setViewsMode] = useState<boolean | undefined>(search.popular)

  useEffect(()=>{
    setSearch({...search, cost:priceMode, popular: viewsMode})
  }, [priceMode, viewsMode])

  return (
    <div className="flex">
      <TriStateToggle
        text="Стоимость"
        value={priceMode} 
        onChange={setPriceMode}
      />
      <TriStateToggle
        text="Популярность"
        value={viewsMode} 
        onChange={setViewsMode}
      />
    </div>
  )
}
