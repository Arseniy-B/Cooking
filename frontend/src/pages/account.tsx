import Header from "@/components/header"
import { logout } from "@/services/api/handlers"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "@/services/contexts"


export default function Account() {
  const navigate = useNavigate()
  const {setIsLogin} = useContext(AuthContext)!;

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
    </>
  )
}
