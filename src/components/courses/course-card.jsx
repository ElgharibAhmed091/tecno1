import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader } from "../ui/card"
import { ImageIcon } from "lucide-react"

export const CourseCard=({item,link})=>{
    return(
        <Link to={`${link}${item?.id}`}>
            <Card key={item.id} className="hover:shadow-xl transition-shadow rounded-lg overflow-hidden border border-gray-200">
                <CardHeader className="p-0">
                    <div className="relative w-full aspect-video bg-gray-100 flex items-center justify-center">
                    {item.image ? (
                        <img 
                        src={item?.image} 
                        alt={item?.title} 
                        className="absolute inset-0 w-full h-full object-cover"
                        />
                    ) : (
                        <ImageIcon className="w-10 h-10 text-gray-400" /> // Smaller fallback icon
                    )}
                    <div className="absolute top-2 left-2 bg-primary text-white text-xs font-semibold px-2 py-1 rounded-md">
                        {item?.category?.name}
                    </div>
                    </div>
                </CardHeader>
                
                {/* Smaller Content Section */}
                <CardContent className="p-3">
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{item?.title}</h3> 
                    <div className="flex items-center gap-2 mt-2">
                    <img 
                        src={item?.instructor?.image || "https://via.placeholder.com/40"} 
                        alt={item?.instructor?.username} 
                        className="w-6 h-6 rounded-full border"
                    />
                    <p className="text-xs text-gray-600">{item?.instructor.username}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-semibold text-primary">${item?.price}</span>
                    <span className="text-xs text-gray-500">{item?.students_count} Students</span>
                    </div>
                </CardContent>
                </Card>
        </Link>
    )
}
export default CourseCard