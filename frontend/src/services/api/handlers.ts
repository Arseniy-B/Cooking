import axios, { type AxiosResponse } from "axios"
import type { RecipeSearch, Recipe, UserLogin, UserCreate } from "@/services/api/schemas"
import { data } from "react-router-dom"


export const BASE_URL = "http://localhost:8000"

export async function get_suitable_recipe(search: RecipeSearch, tags?: string[]): Promise<AxiosResponse<Recipe[]>> {
  return await axios.post(
    BASE_URL + "/recipes/", {recipe_search: {...search}, tags: tags}
  )
}

interface Plug {
  success: boolean
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
