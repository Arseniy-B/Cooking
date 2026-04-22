import { Search } from "lucide-react";


export default function SearchInput() {
  return (
    <div className="border-2 
      border-orange-400 flex justify-between rounded-[5px] 
      transition-all duration-300 focus-within:-translate-y-2 ease-out 
      group-hover:scale-101 
      hover:shadow-lg active:scale-100
      group-focus-within:scale-105
      focus-within:scale-105 focus-within:shadow-lg
    ">
      <input placeholder="Выберите блюдо" className="w-full pl-6 outline-none"></input>
      <div className="bg-orange-400 h-15 w-18 flex items-center justify-center">
        <Search/>
      </div>
    </div>
  )
}
