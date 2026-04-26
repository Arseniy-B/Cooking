import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { get_tags } from "@/services/api/handlers"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { Plus } from "lucide-react"

interface TagsSelect {
  tags: string[]
  setTags: (tags: string[]) => void
}

export default function TagsSelect({tags, setTags}: TagsSelect){
  const [suitableTags, setSuitableTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const get_suitable_tags = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await get_tags(e.target.value)
    .then((ans) => {
      setSuitableTags(ans.data)
    })
  }
  const get_all_tags = async () => {
    await get_tags("")
    .then((ans)=>{
      setAllTags(ans.data)
    })
  }

  function addTag(value: string){
    if (!tags.includes(value)){
      setTags([...tags, value])
    }
  }
  function removeTag(value: string){
    setTags(tags.filter(f => f !== value))
  }

  useEffect(()=>{
    get_all_tags()
  }, [])

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
          <div className="h-[50vh]">
            <div className="flex flex-wrap">
              {suitableTags && suitableTags.map((value, i)=>(
                <div key={i}>
                  <Button size="sm" className="rounded-[5px]" disabled={tags.includes(value)} onClick={()=>{addTag(value)}}>{value}</Button>
                </div>
              ))}
            </div>
            <Separator className="mt-10 mb-5"/>
            <div>
              {allTags && allTags.map((val, i) => (
                <Button key={i} className="rounded-[5px]" variant="ghost" onClick={()=>{addTag(val)}}>{val}</Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
