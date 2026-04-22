import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { get_tags } from "@/services/api/handlers"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { Plus } from "lucide-react"

interface TagsSelect {
  tags: string[]
  setTags: (tags: string[]) => void
}

export default function TagsSelect({tags, setTags}: TagsSelect){
  const [suitableTags, setSuitableTags] = useState<string[]>([]);
  const get_suitable_tags = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await get_tags(e.target.value)
    .then((ans) => {
      setSuitableTags(ans.data)
    })
  }

  function addTag(value: string){
    setTags([...tags, value])
  }
  function removeTag(value: string){
    setTags(tags.filter(f => f !== value))
  }

  return (
    <div className="flex flex-wrap w-full">
      <div className="p-2">
        {tags.map((value, i)=> (
          <Button onClick={()=>{removeTag(value)}} size="sm" key={i} className="rounded-[5px]">{value}</Button>
        ))}
      </div>
      <Dialog>
        <DialogTrigger className="my-3">
          <Plus/>
        </DialogTrigger>
        <DialogContent className="p-10">
          <Input onChange={get_suitable_tags} placeholder="Введите название тега"/>
          <div className="h-[50vh] flex flex-wrap">
            {suitableTags.map((value, i)=>(
              <div key={i}>
              {!tags.includes(value)? (
                <Button size="sm" className="rounded-[5px]" onClick={()=>{addTag(value)}}>{value}</Button>
              ):<></>}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
