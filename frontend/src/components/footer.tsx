import { SendIcon } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white px-6 lg:px-20 py-12">
      
      <div className="grid gap-10 lg:grid-cols-3">

        <div>
          <p className="text-lg mb-4 font-semibold">Рецепты</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {["Завтраки","Супы","Десерты","Выпечка","Салаты"].map((item) => (
              <p key={item} className="opacity-80 hover:opacity-100 hover:text-orange-400 cursor-pointer transition">
                {item}
              </p>
            ))}
          </div>
        </div>

        <div>
          <p className="text-lg mb-4 font-semibold">Подписка</p>
          <p className="text-sm opacity-70 mb-4">
            Получай новые рецепты на почту
          </p>

          <div className="flex gap-2">
            <InputGroup className="rounded-[5px]">
              <InputGroupInput placeholder="Email"/>
              <InputGroupAddon align="inline-end">
                <SendIcon/>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <p className="text-lg mb-4 font-semibold">Мы в соцсетях</p>
            <div className="flex gap-4 text-sm opacity-80">
              <p className="hover:text-orange-400 cursor-pointer">Instagram</p>
              <p className="hover:text-orange-400 cursor-pointer">Telegram</p>
              <p className="hover:text-orange-400 cursor-pointer">YouTube</p>
            </div>
          </div>

          <p className="text-xs opacity-50 mt-10">
            © 2026 ВкусныйБлог — рецепты на каждый день
          </p>
        </div>

      </div>

      <div className="border-t border-neutral-800 mt-10 pt-5 flex flex-wrap gap-4 text-xs opacity-60">
        <p className="hover:text-white cursor-pointer">Политика конфиденциальности</p>
        <p className="hover:text-white cursor-pointer">Условия использования</p>
        <p className="hover:text-white cursor-pointer">Контакты</p>
      </div>

    </footer>
  )
}
