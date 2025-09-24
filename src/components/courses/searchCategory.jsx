import CategoriesItem from "@/components/courses/Course_Forms/categoryItem";


export const Categories=({items})=>{
    return(
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            {items?.map((item)=>(
                <CategoriesItem key={item.id} id={item.id} title={item.name}/>
            ))}
        </div>
    )   
}

export default Categories