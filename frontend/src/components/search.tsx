import {useState} from "react";
import { Search } from "lucide-react";
import {useNavigate} from "react-router-dom";


export default function SearchInput() {
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  const handleEnter = () => {
    navigate(`/search?name=${value}`)
  };


  return (
    <div className="border-2 
      border-orange-400 flex justify-between rounded-[5px] 
      transition-all duration-300 focus-within:-translate-y-2 ease-out 
      group-hover:scale-101 
      hover:shadow-lg active:scale-100
      group-focus-within:scale-105
      focus-within:scale-105 focus-within:shadow-lg
    ">
      <input value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setValue(e.target.value)
        }
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") {
            handleEnter();
          }
        }}
        placeholder="Выберите блюдо" className="w-full pl-6 outline-none"
      />
      <div onClick={handleEnter} className="bg-orange-400 h-15 w-18 flex items-center justify-center">
        <Search/>
      </div>
    </div>
  )
}
