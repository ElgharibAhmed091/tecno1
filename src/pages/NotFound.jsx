import { Helmet } from "react-helmet-async";

const NotFound = () => {
    return <div className="w-full h-screen flex items-center justify-center">
      <h1 className="text-slate-700">
      <Helmet>
        <title>Not Found</title>
      </Helmet>
        404 - Page Not Found
      </h1>
      </div>;
  };
  
  export default NotFound;
  