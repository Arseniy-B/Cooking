import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { PurchasedRecipesContext, UserDataContext } from "@/services/contexts"
import AccountWidget from "@/components/account_widget"
import IncreaseBalanceButton from "@/components/increase_balance_button"
import History from "@/components/history"
import PurchasedRecipeCard from "@/components/purchased_card"


export default function Account() {
  const {userData} = useContext(UserDataContext)!;
  const navigate = useNavigate()
  const { purchasedRecipes } = useContext(PurchasedRecipesContext)!;
  const [activeSection, setActiveSection] = useState('account');
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

  return (
    <>
    <Header>
      {["account", "purchased"].map(section => (
        <a
          key={section}
          href={`#${section}`}
          className={activeSection === section ? '' : ''}
        >
          {section === 'account' ? 'Аккаунт' : 'Мои рецепты'}
          {activeSection === section && (
            <div className="h-px w-full bg-red-800"></div>
          )}
        </a>
      ))}
    </Header>
    <section id="account" className="w-full h-screen pt-20 p-10 grid grid-rows-2 grid-cols-1 lg:grid-rows-1 lg:grid-cols-2">
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
            <IncreaseBalanceButton>Пополнить</IncreaseBalanceButton>
          </div>
        </div>
      </div>
    </section>
    {purchasedRecipes.length>0 ? (
      <section id="purchased" className="w-full min-h-screen py-[10vh] bg-gray-100 flex flex-wrap justify-center gap-5">
        {purchasedRecipes?.map((value, i) => (
          <PurchasedRecipeCard recipe={value} key={i}/>
        ))}
      </section>
    ): (
    <section id="purchased" className="h-screen flex flex-col gap-1 bg-gray-100 justify-center items-center">
      <p className="scroll-m-20 text-2xl font-semibold tracking-tight">
      Вы еще не купили ни одного рецепта
      </p>
      <Button onClick={() => {
        navigate("/search")
      }} className="rounded-[5px]">Поиск рецептов</Button>
    </section>
    )}
    </>
  )
}
