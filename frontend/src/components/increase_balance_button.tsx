import { UserDataContext } from "@/services/contexts"
import { Tickets } from "lucide-react"
import { useContext, useState } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { get_user_data, increase_balance } from "@/services/api/handlers";
import { Button } from "./ui/button"


export default function IncreaseBalanceButton(){
  const { setUserData } = useContext(UserDataContext)!;
  const [value, setValue] = useState<number>(100);

  async function increaseBalance() {
    await increase_balance(value)
    await get_user_data()
    .then((ans)=>{
      setUserData(ans.data)
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button className="rounded-[5px]" variant="outline"/>}>
        <Tickets/>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверены, что хотите пополнить баланс?</AlertDialogTitle>
          <AlertDialogDescription>
            Это тестовая процедура оплаты, и реальные деньги или карты 
            использоваться не будут. Все транзакции являются имитацией, и ничего 
            не будет списано или переведено.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mx-auto grid w-full max-w-xs gap-3 py-20">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="slider-demo-temperature">На сколько пополнить?</Label>
            <span className="text-sm text-muted-foreground">
              {value}₽
            </span>
          </div>
          <Slider
            id="slider-demo-temperature"
            value={value}
            onValueChange={(v)=>{setValue(v as number)}}
            min={1}
            max={100}
            step={1}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-[5px]">Отмена</AlertDialogCancel>
          <AlertDialogAction className="rounded-[5px]" onClick={increaseBalance}>Пополнить</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
            
  )
}
