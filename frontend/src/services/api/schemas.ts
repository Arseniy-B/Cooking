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
  step_number: number
  image_path?: string | null
  time_seconds: number
  description: string
  ingredients: RecipeStepIngredient[]
}

export interface Recipe {
  uuid: string
  name: string
  country?: string | null
  difficulty: number
  views: number
  recipe_steps: RecipeStep[]
  image_path: string
  cost: number
}

export interface RecipeSearch {
  name?: string
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
