import { AuthContext, UserDataContext } from "@/services/contexts";
import { Button } from "@/components/ui/button";
import { useContext, useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { logout, get_avatar, upload_avatar } from "@/services/api/handlers"
import { useNavigate } from "react-router-dom";


export default function AccountWidget(){
  const navigate = useNavigate();
  const { setIsLogin } = useContext(AuthContext)!;
  const { userData } = useContext(UserDataContext)!;
  const [avatar, setAvatar] = useState<string>()
  const inputRef = useRef<HTMLInputElement>(null)

  async function logoutHandle(){
    await logout()
    .then((ans) => {
      if (ans.data.success){
        setIsLogin(false)
        navigate("/auth")
      }
    })
  }

  useEffect(() => {
    get_avatar().then(setAvatar)
  }, [])

  return (
    <>
      <div className="w-80 sm:w-105 rounded-2xl border p-6 flex gap-6">
        <Avatar
          className="size-15 cursor-pointer ring-2 ring-border hover:opacity-80 transition"
          onClick={() => inputRef.current?.click()}
        >
          <AvatarImage src={avatar} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
  
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
  
            if (file) {
              upload_avatar(file).then(() => {
                get_avatar().then(setAvatar)
              })
            }
          }}
        />
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">
                {userData.username}
              </h2>
    
              <p className="text-sm text-muted-foreground">
                Аккаунт
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="rounded-xl"
              onClick={logoutHandle}
            >
              Выход
            </Button>
          </div>
        </div>
      </div>  
      
    </>
  )
}
