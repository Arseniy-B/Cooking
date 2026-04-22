import { Button } from "@/components/ui/button"


export default function Footer(){
  return (
    <section className="text-white bg-neutral-900 grid grid-cols-1 lg:grid-cols-[auto_auto_30vw] p-[10vw] pb-10 pt-10">
      <div className="flex flex-col gap-35 gl:pr-25">
        <div className="flex justify-between text-[0.7rem]">
          <p>Рецепты</p>
          <p>Завтраки</p>
          <p>Супы</p>
          <p>Десерты</p>
          <p>Выпечка</p>
          <p>Салаты</p>
        </div>
        <div>
          <p>Мы в соцсетях:</p>
          <div className=""></div>
        </div>
        <div>
          <p>Подписаться на новые рецепты:</p>
          <div className="gap-5 pt-5 overflow-hidden">
            <input placeholder="email" className="bg-neutral-700 rounded-[5px] p-2 mr-5"></input>
            <Button className="rounded-[5px] p-2">Подписаться</Button>
          </div>
        </div>
        <div className="flex justify-between text-[0.7rem]">
          <p>Политика конфиденциальности</p>
          <p>Условия использования</p>
          <p>Контакты</p>
        </div>
      </div>
      <div></div>
      <div className="flex flex-col">
        <div className="flex-1"></div>
        <p>© 2026 ВкусныйБлог — рецепты на каждый день</p>
      </div>
    </section>
  )
}
