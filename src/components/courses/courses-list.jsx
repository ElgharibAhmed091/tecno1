import CourseCard from "./course-card"

export const CoursesList=({items,link})=>{
    return(
        <div>
            <div className="grid sm:grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {items?.map((item)=>(
                    
                    <CourseCard
                        key={item.id}
                        item={item}
                        link={link}
                    />
                ))}
            </div>
            {items.length === 0 && (
                <div className="text-center text-lg text-muted-foreground mt-10">No Courses Found</div>
            )}
        </div>
    )
}