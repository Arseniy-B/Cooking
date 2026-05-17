export interface Ingredient {
  name: string
  fats: number
  proteins: number
  carbohydrates: number
  description: string
}

export interface RecipeStepIngredient {
  ingredient: Ingredient
  quantity: number
}

export interface RecipeStep {
  title: string
  step_number: number
  image_path?: string | null
  time_seconds: number
  description: string
  ingredients: RecipeStepIngredient[]
}

export interface Tag {
  id: number
  name: string
}

export interface Recipe {
  uuid: string
  name: string
  country?: string | null
  difficulty: number
  views: number
  tags: Tag[] | null
  recipe_steps: RecipeStep[]
  image_path: string
  cost: number
}

export interface RecipeSearch {
  name: string
  difficulty?: number
  country?: string
  total_time_from?: number
  total_time_to?: number
  popular?: boolean
  cost?: boolean
  page?: number
  size?: number
}

export interface UserLogin {
  username: string
  password: string
}

export interface UserCreate {
  username: string
  password: string
}

export interface Plug {
  success: boolean
}

export interface PurchaseData {
  total_cost: number 
  positions_count: number
  calories: number
  avg_proteins: number
  avg_fats: number
  avg_carbohydrates: number
}

export interface UserData {
  username: string
  balance: number 
}

