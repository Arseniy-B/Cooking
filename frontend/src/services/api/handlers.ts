import axios, { type AxiosResponse } from "axios"
import type { 
  RecipeSearch, 
  Recipe, 
  UserLogin, 
  UserCreate, 
  Plug, 
  PurchaseData, 
  UserData 
} from "@/services/api/schemas"


export const BASE_URL = "http://localhost:8000"

export async function get_suitable_recipe(search: RecipeSearch, tags?: string[]): Promise<AxiosResponse<Recipe[]>> {
  return await axios.post(
    BASE_URL + "/recipes/", {recipe_search: {...search}, tags: tags}
  )
}

export async function sign_up(user: UserCreate): Promise<AxiosResponse<Plug>> {
  return await axios.post(BASE_URL + "/auth/sign_up", user, {withCredentials: true})
}

export async function login(user: UserLogin): Promise<AxiosResponse<Plug>> {
  return await axios.post(BASE_URL + "/auth/login", user, {withCredentials: true})
}

export async function logout(): Promise<AxiosResponse<Plug>> {
  return await axios.get(BASE_URL + "/auth/logout", {withCredentials: true})
}

export async function check_login(): Promise<AxiosResponse<Plug>> {
  return await axios.get(BASE_URL + "/auth/is_login", {withCredentials: true})
}

export async function get_basket(page: number = 1, size: number = 20): Promise<AxiosResponse<Recipe[]>> {
  return await axios.get(BASE_URL + `/basket?page=${page}&size=${size}`, {withCredentials: true})
}
export async function add_to_basket(recipe_uuid: string): Promise<AxiosResponse<Plug>>{
  return await axios.post(BASE_URL + "/basket/add", recipe_uuid, {withCredentials: true})
}
export async function remove_from_basket(recipe_uuid: string): Promise<AxiosResponse<Plug>>{
  return await axios.post(BASE_URL + "/basket/remove", recipe_uuid, {withCredentials: true})
}

export async function get_tags(name: string): Promise<AxiosResponse<string[]>>{
  return await axios.get(BASE_URL + `/recipes/tag?name=${name}`)
}

export async function get_purchased(page: number = 1, size: number = 20):Promise<AxiosResponse<Recipe[]>> {
  return await axios.get(BASE_URL + `/purchased?page=${page}&size=${size}`, {withCredentials: true})
}

export async function buy_recipe(recipe_uuid: string): Promise<AxiosResponse<Plug>> {
  return await axios.post(BASE_URL + "/purchased", recipe_uuid, {withCredentials: true})
}

export async function get_purchase_data(): Promise<AxiosResponse<PurchaseData>> {
  return await axios.get(BASE_URL + "/purchased/data", {withCredentials: true})
}

export async function get_user_data(): Promise<AxiosResponse<UserData>> {
  return await axios.get(BASE_URL + "/user/", {withCredentials: true})
}

export async function increase_balance(amount: number): Promise<AxiosResponse<Plug>> {
  return await axios.post(BASE_URL + "/user/balance", amount, {withCredentials: true})
}

export async function upload_avatar(file: File) {
    const formData = new FormData()

    formData.append("file", file)

    await axios.post(BASE_URL + "/user/avatar", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        withCredentials: true
    })
}

export async function get_avatar(): Promise<string> {
    const response = await axios.get(BASE_URL + "/user/avatar", {
        responseType: "blob",
        withCredentials: true
    })
    return URL.createObjectURL(response.data)
}
