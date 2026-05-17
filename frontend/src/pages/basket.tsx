import Header from "@/components/header"
import CurrentOffers from "@/components/current_offers"
import MainImage from "@/assets/main.webp"
import { useState, useContext, useEffect } from "react"
import { useSpring, animated, useScroll } from "@react-spring/web"
import { BasketContext, UserDataContext } from "@/services/contexts"
import LargeCard from "@/components/large_card"
import {Button} from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useNavigate } from "react-router-dom"
import type { PurchaseData } from "@/services/api/schemas"
import { get_purchase_data } from "@/services/api/handlers"
import IncreaseBalanceButton from "@/components/increase_balance_button"
import { Coins } from "lucide-react"
import DottedRow from "@/components/dotted_row"
import { Tickets } from "lucide-react"


export default function Basket(){
  const navigate = useNavigate()
  const { basketRecipes } = useContext(BasketContext)!;
  const { userData } = useContext(UserDataContext)!;
  const [loaded, setLoaded] = useState(false)
  const { scrollYProgress } = useScroll()
  const [purchaseData, setPurchaseData] = useState<PurchaseData>({
    total_cost: 0,
    positions_count: 0,
    calories: 0,
    avg_proteins: 0,
    avg_fats: 0,
    avg_carbohydrates: 0,
  })
  const [activeSection, setActiveSection] = useState('info');
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -50% 0px' }
    );

    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  async function getPurchasedData(){
    await get_purchase_data()
    .then((ans) => {
      setPurchaseData(ans.data)
    })
  }
  useEffect(()=>{
    getPurchasedData()
  }, [])

  const imageLoaded = useSpring({
    transform: loaded ? scrollYProgress.to(p => `rotate(${p * 50}deg) translateX(${-p * 500}px)`) : "translateX(0px)",
    opacity: loaded ? 1 : 0,
    config: { tension: 120, friction: 20 },
  })

  return (
    <>
      <Header>
        {["info", "basket"].map(section => (
          <a
            key={section}
            href={`#${section}`}
            className={activeSection === section ? '' : ''}
          >
            {section === 'info' ? 'Отчет' : 'Корзина'}
            {activeSection === section && (
              <div className="h-px w-full bg-red-800"></div>
            )}
          </a>
        ))}
      </Header>
      <section id="info" className="w-full min-h-screen pt-15 lg:pt-0 grid grid-rows-[auto_10vh_25vh] lg:grid-rows-1 grid-cols-1 lg:grid-cols-[450px_auto_50vw]">
        <div className="order-3 lg:order-1 bg-red-800 flex justify-center items-center">
          <div className="w-[70vw] lg:w-90 lg:px-2 lg:py-10 rounded-[10px] backdrop-blur-[1px]">
            <CurrentOffers/>
          </div>
        </div>
        <div className="order-2 lg:order-2 overflow-hidden relative">
          <animated.img 
            src={MainImage} 
            className="absolute w-60 lg:w-150 max-w-none left-1/2 lg:left-0 lg:top-1/2 -translate-x-1/2 -translate-y-8 lg:-translate-x-1/2 lg:-translate-y-1/2 aspect-square rotate-180 lg:rotate-0"
            onLoad={(e) => 
              e.currentTarget.decode?.().then(() => {
              setLoaded(true)
            })}
            style={imageLoaded}
          />
        </div>
        <div className="order-1 lg:order-3 flex justify-center lg:justify-normal items-center">
          <div className="w-[80%] lg:w-100">

            <div className="w-full space-y-2">
              <div className="flex justify-center items-center gap-5">
                <DottedRow label="Баланс" value={`${userData.balance} ₽`} />
                <IncreaseBalanceButton><Tickets/></IncreaseBalanceButton>
              </div>
              <div className="flex justify-center items-center gap-5">
                <DottedRow label="Заказов на" value={`${purchaseData.total_cost} ₽`} />
                <Button className="rounded-[5px]" variant="outline">Купить все<Coins/></Button>
              </div>
            </div>
            <Separator className="my-5" />
            <div className="text-sm text-center space-y-1">
              <DottedRow label="Позиций" value={`${purchaseData.positions_count} шт`}/>
              <DottedRow label="Каллорийность" value={`${purchaseData.calories} ккал`}/>
            </div>
            <Separator className="my-5"/>
            <div className="text-sm text-center space-y-1">
              <p className="font-medium">Среднее по всем рецептам</p>
              <DottedRow label="Белки" value={`${purchaseData.avg_proteins} ккал`}/>
              <DottedRow label="Жиры" value={`${purchaseData.avg_fats} ккал`}/>
              <DottedRow label="Углеводы" value={`${purchaseData.avg_carbohydrates} ккал`}/>
            </div>

          </div>
        </div>
      </section>
      {basketRecipes.length>0 ? (
        <section id="basket" className="w-full gap-5 min-h-screen py-[10vh] bg-gray-100 flex flex-col items-center justify-center">
          {basketRecipes.map((value, i) => (
            <LargeCard recipe={value} key={i} />
          ))}
        </section>
      ): (
      <section id="basket" className="h-screen flex flex-col gap-1 bg-gray-100 justify-center items-center">
        <p className="scroll-m-20 text-2xl font-semibold tracking-tight text-center">
        Вы еще не выбрали рецепты для покупки
        </p>
        <Button onClick={() => {
          navigate("/search")
        }} className="rounded-[5px]">Поиск рецептов</Button>
      </section>
      )}
    </>
  )
}
