import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/layout";
import Home from "./pages/student/Home";
import About from "./pages/student/About";
import Courses from "./pages/student/Courses";
import Contact from "./pages/student/Contact";
import NotFound from "./pages/NotFound";
import { CreateCourse } from "./pages/teacher/createCouresPage";
import EditCourse from "./pages/teacher/courseEditPage";
import CreateCategory from "./pages/Admin/AdminCategoryCreate";
import AdminCategoryTable from "./pages/Admin/AdminCategories";
import CategoryDetailPage from "./pages/Admin/AdminCategoryDetails";
import CourseDetailPage from "./pages/student/courseDetails";
import AdminRoutes from "./utils/AdminRoutes";
import TeacherRoutes from "./utils/TeacherRoutes";
import Login from "./pages/student/login";
import Signup from "./pages/student/signUp";
import UserProfile from "./pages/student/profile";
import AdminUsersTable from "./pages/Admin/AdminUsers";
import AdminUserDetailPage from "./pages/Admin/AdminUserProfile";
import VerifyEmail from "./pages/student/verifyEmail";
import RequestResetPassword from "./pages/student/requestResetPassword";
import ResetPassword from "./pages/student/resetPassword";
import UnAuthRoutes from "./utils/unAuthRoutes";
import AuthRoutes from "./utils/authRoutes";
import PaymentPage from "./pages/student/payment";
import CoursePage from "./pages/student/coursePage";
import StudentDashboard from "./pages/student/studentDashboard";
import TeacherDashboard from "./pages/teacher/teacherDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import SignupAdmin from "./pages/Admin/adminCreate";
import Forum from "./pages/student/forum";
import { FAQSection } from "./pages/student/FAQ";
import { CreateFAQForm } from "./pages/Admin/FAQCreate";
import LiveSupport from "./pages/Admin/AdminCreateLiveSupport";
import AdminCoursesTable from "./pages/Admin/AdminCourses";
import { Newsection } from "./pages/student/news";
import { NewsCreate } from "./pages/Admin/createNews";
import { AdminNewsection } from "./pages/Admin/adminNews";
import { UserStatistics } from "./pages/Admin/usersStatistics";
import { CategoryStatistics } from "./pages/Admin/CategoriesStatistics";
import { CourseStatistics } from "./pages/Admin/CoursesStatistics";
import { CourseDetailsPage } from "./pages/Admin/AdminCourseDetails";
import { EnrollmentStatistics } from "./pages/Admin/EnrollmentsStatistics";
import { FinalExamStatistics } from "./pages/Admin/finalExamStatistics";
import { ModuleStatistics } from "./pages/Admin/ModulesStatistics";
import { LessonStatistics } from "./pages/Admin/LessonsStatistics";
import { QuizStatistics } from "./pages/Admin/QuizzesStatistics";
import { AssignmentStatistics } from "./pages/Admin/AssignmentsStatistics";
import { StudentStatistics } from "./pages/student/statistics";
import { TeacherStatistics } from "./pages/teacher/statistics";

const App = () => {
  return (
    <div className="w-full max-w-[100vw] min-w-[320px] mx-auto">
    <Router>
      <Routes>
        <Route element={<Layout />}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/FAQ" element={<FAQSection />} />
          <Route path="/News" element={<Newsection />} />
          {/* authenticated Routes */}
          <Route element={<AuthRoutes />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/statistics" element={<StudentStatistics />} />
            <Route path="/user/profile/:user_id" element={<UserProfile />} />
            <Route path="/payment/:courseId" element={<PaymentPage />} />
            <Route path="/course/:courseId" element={<CoursePage />} />
            <Route path="/course/:courseId/forum" element={<Forum/>} />
          </Route>


          <Route path="/reset/email" element={<RequestResetPassword />} />
          <Route path="/reset/password/:token" element={<ResetPassword />} />


          {/* Unauthenticated Routes */}
          <Route element={<UnAuthRoutes />}>
            <Route path="/login" element={<Login />}/>
            <Route path="/signup" element={<Signup />} />
            <Route path="/teacher/signup" element={<Signup />} />
          </Route>

          {/* Teacher Routes */}
          <Route element={<TeacherRoutes />}>
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/statistics" element={<TeacherStatistics />} />
            <Route path="/teacher/courses/create" element={<CreateCourse />} />
            <Route path="/teacher/courses/edit/:courseId" element={<EditCourse />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoutes />}>
            <Route path="/admin/category/create" element={<CreateCategory />} />
            <Route path="/admin/categories" element={<AdminCategoryTable />} />
            <Route path="/admin/courses" element={<AdminCoursesTable />} />
            <Route path="/admin/courses/:courseId" element={<CourseDetailsPage />} />
            <Route path="/admin/users" element={<AdminUsersTable />} />
            <Route path="/admin/categories/:categoryId" element={<CategoryDetailPage />} />
            <Route path="/admin/users/:userId" element={<AdminUserDetailPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/create" element={<SignupAdmin/>} />
            <Route path="/admin/FAQ" element={<CreateFAQForm/>} />
            <Route path="/admin/News" element={<AdminNewsection/>} />
            <Route path="/admin/News/create" element={<NewsCreate/>} />
            <Route path="/admin/live/support/create" element={<LiveSupport/>} />
            <Route path="/admin/statistics/users" element={<UserStatistics/>} />
            <Route path="/admin/statistics/categories" element={<CategoryStatistics/>} />
            <Route path="/admin/statistics/courses" element={<CourseStatistics/>} />
            <Route path="/admin/statistics/Enrollments" element={<EnrollmentStatistics/>} />
            <Route path="/admin/statistics/FinalExams" element={<FinalExamStatistics/>} />
            <Route path="/admin/statistics/modules" element={<ModuleStatistics/>} />
            <Route path="/admin/statistics/lessons" element={<LessonStatistics/>} />
            <Route path="/admin/statistics/Quizzes" element={<QuizStatistics/>} />
            <Route path="/admin/statistics/Assignment" element={<AssignmentStatistics/>} />
          </Route>
        </Route>
        {/* Not Found Page */}
        <Route path="*" element={<NotFound />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
      </Routes>
    </Router>
    </div>
  );
};

export default App;
