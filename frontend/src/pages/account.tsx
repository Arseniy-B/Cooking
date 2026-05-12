import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { PurchasedRecipesContext, UserDataContext } from "@/services/contexts"
import AccountWidget from "@/components/account_widget"
import IncreaseBalanceButton from "@/components/increase_balance_button"
import History from "@/components/history"
import PurchasedRecipeCard from "@/components/purchased_card"


export default function Account() {
  const {userData} = useContext(UserDataContext)!;
  const navigate = useNavigate()
  const { purchasedRecipes } = useContext(PurchasedRecipesContext)!;
  return (
    <>
    <Header></Header>
    <section className="w-full h-screen pt-20 p-10 grid grid-rows-2 grid-cols-1 lg:grid-rows-1 lg:grid-cols-2">
      <div className="order-2 lg:order-1 h-full w-full flex justify-end">
        <History/>
      </div>
      <div className="order-1 lg:order-2 flex justify-center">
        <div>
          <AccountWidget/>
          <div className="sm:w-105 mt-5 flex items-center justify-between bg-muted rounded-xl px-4 py-3">
            <div>
              <p className="text-sm text-muted-foreground">
                Баланс
              </p>

              <p className="text-2xl font-bold">
                {userData.balance}₽
              </p>
            </div>
            <IncreaseBalanceButton/>
          </div>
        </div>
      </div>
    </section>
    <section>
      {purchasedRecipes.length>0 ? (
        <section className="w-full min-h-screen py-[10vh] bg-gray-100 flex flex-wrap justify-center gap-5">
          {purchasedRecipes?.map((value, i) => (
            <PurchasedRecipeCard recipe={value} key={i}/>
          ))}
        </section>
      ): (
      <section className="h-screen flex flex-col gap-1 bg-gray-100 justify-center items-center">
        <p className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Вы еще не выбрали рецепты для покупки
        </p>
        <Button onClick={() => {
          navigate("/search")
        }} className="rounded-[5px]">Поиск рецептов</Button>
      </section>
      )}
    </section>
    </>
  )
}
