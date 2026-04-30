import Header from "@/components/header"
import { logout } from "@/services/api/handlers"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext, PurchasedRecipesContext} from "@/services/contexts"
import type {Recipe} from "@/services/api/schemas"


function PurchasedRecipeCard({recipe}: {recipe: Recipe}){
  return (
    <div>{recipe.name}</div>
  )
}

export default function Account() {
  const navigate = useNavigate()
  const { setIsLogin } = useContext(AuthContext)!;
  const { purchasedRecipes } = useContext(PurchasedRecipesContext)!;

  async function logoutHandle(){
    await logout()
    .then((ans) => {
      if (ans.data.success){
        setIsLogin(false)
        navigate("/auth")
      }
    })
  }

  return (
    <>
    <Header></Header>
    <section className="w-full h-screen pt-20 p-10">
      <div className="w-full flex justify-end">
        <Button onClick={logoutHandle} size="lg" className="rounded-[5px]">Выход</Button>
      </div>
    </section>
    <section>
      {purchasedRecipes.length>0 ? (
        <section className="w-full min-h-screen py-[10vh] bg-gray-100 flex flex-col items-center">
          {purchasedRecipes.map((value, i) => (
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
