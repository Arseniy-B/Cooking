import { useState, useContext } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { animated, useTransition } from "@react-spring/web"
import { useNavigate } from "react-router-dom"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { sign_up, login } from "@/services/api/handlers"
import { AuthContext } from "@/services/contexts"


type AuthMode = "sign_in" | "sign_up"


export default function Auth() {
  const {setIsLogin} = useContext(AuthContext)!;
  const [mode, setMode] = useState<AuthMode>("sign_up");
  const navigate = useNavigate()
  const transitions = useTransition(mode, {
    from: {  transform: 'translateY(-680px)' },
    enter: { transform: 'translateY(-10px)' },
    leave: { transform: 'translateY(-680px)' },
    config: { tension: 280, friction: 28 },
    exitBeforeEnter: true,
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (mode === "sign_up"){
      const password = formData.get("password") as string;
      const password_confirm = formData.get("password-confirm") as string;
      const username = formData.get("username") as string;
      if (password == password_confirm){
        await sign_up({
            username: username,
            password: password,
        }).then(async (ans) => {
          if (ans.data.success){
            await login({username, password})
            .then((ans) => {
              if (ans.data.success){
                setIsLogin(true)
                navigate("/")
              }
            })
          }
        })
      }
    }
    if (mode === "sign_in"){
      await login({
        username: formData.get("username") as string,
        password: formData.get("password") as string
      }).then((ans) => {
        if (ans.data.success){
          setIsLogin(true)
          navigate("/")
        }
      })
    }
  }
  
  return (
    <>
      <Header>
        <button onClick={() => {setMode("sign_up")}}>
          <p>Регистрация</p>
          {mode === "sign_up" && (
            <div className="h-px w-full bg-red-800"></div>
          )}
        </button>
        <button onClick={() => {setMode("sign_in")}}>
          <p>Вход</p>
          {mode === "sign_in" && (
            <div className="h-px w-full bg-red-800"></div>
          )}
        </button>
      </Header>
      <section className="h-screen lg:grid lg:grid-cols-[40%_auto] px-3">
        <div></div>
        {transitions((style, item) => (
          <animated.div style={style} key={item}>
            <div className="bg-red-800 w-full lg:w-150 h-[80vh] rounded-b-[10px] p-20 text-white">
              <div className="flex flex-col justify-center items-center w-full h-full">
                {item === "sign_in" && (
                  <h2>Вход в аккаунта</h2>
                )}
                {item === "sign_up" && (
                  <h2>Регистрация аккаунта</h2>
                )}
                <form onSubmit={handleSubmit} className="w-full">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="username">Имя</FieldLabel>
                      <Input id="username" name="username" placeholder="username" className="placeholder:text-white"/>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="password">Пароль</FieldLabel>
                      <Input
                        id="password"
                        type="password"
                        name="password"
                        autoComplete="off"
                        placeholder="password" className="placeholder:text-white"
                      />
                    </Field>
                    <Field>
                      {item === "sign_up" && (
                        <>
                        <FieldLabel htmlFor="confirm-password">Подтвердите пароль</FieldLabel>
                        <Input
                          id="confirm-password"
                          name="password-confirm"
                          type="password"
                          autoComplete="off"
                          placeholder="confirm password" className="placeholder:text-white"
                        />
                        </>
                      )}
                    </Field>
                    <Field orientation="horizontal">
                      <Button className="rounded-[5px]" type="submit">Отправить</Button>
                      {mode === "sign_in" && (
                        <Button variant="ghost" onClick={() => {setMode("sign_up")}} className="rounded-[5px]">создать аккаунт</Button>
                      )}
                      {mode === "sign_up" && (
                        <Button variant="ghost" onClick={() => {setMode("sign_in")}} className="rounded-[5px]">войти в аккаунт</Button>
                      )}
                    </Field>
                  </FieldGroup>
                </form>
              </div>
            </div>
          </animated.div>
        ))}
      </section>
    </>
  )
}
