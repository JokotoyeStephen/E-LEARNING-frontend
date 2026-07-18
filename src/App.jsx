import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import ProtectedRoute       from './routes/ProtectedRoute'
import Navbar               from './components/layout/Navbar'
import Footer               from './components/layout/Footer'
import Login                from './pages/auth/Login'
import Register             from './pages/auth/Register'
import VerifyEmail          from './pages/auth/VerifyEmail'
import Dashboard            from './pages/dashboard/Dashboard'
import InstructorDashboard  from './pages/instructor/InstructorDashboard'
import InstructorCourseAnalytics from './pages/instructor/InstructorCourseAnalytics'
import Courses              from './pages/courses/Courses'
import CourseDetails        from './pages/courses/CourseDetails'
import CourseLearn          from './pages/learn/CourseLearn'
import Quiz                 from './pages/quiz/Quiz'
import Result               from './pages/quiz/Result'
import Progress             from './pages/quiz/Progress'
import Roadmap              from './pages/roadmap/Roadmap'
import LearnSpace           from './pages/learn/LearnSpace'
import Videos               from './pages/videos/Videos'
import LectureSpace         from './pages/lecture/LectureSpace'
import Achievements         from './pages/achievements/Achievements'
import LearningAnalytics    from './pages/analytics/LearningAnalytics'
import ChatWidget           from './components/chat/ChatWidget'
import VerifyCertificate    from './pages/verify/VerifyCertificate'
import NotFound             from './pages/NotFound'

function SmartDashboard() {
  const { user } = useAuth()
  if (!user) return null
  return user.role === 'instructor' || user.role === 'admin'
    ? <InstructorDashboard />
    : <Dashboard />
}

function AuthedChatWidget() {
  const { user } = useAuth()
  if (!user) return null
  return <ChatWidget />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/login"        element={<Login />} />
              <Route path="/register"     element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/verify/:certificateId" element={<VerifyCertificate />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/"                          element={<SmartDashboard />} />
                <Route path="/dashboard"                 element={<SmartDashboard />} />
                <Route path="/courses"                   element={<Courses />} />
                <Route path="/courses/:id"               element={<CourseDetails />} />
                <Route path="/courses/:id/learn"         element={<CourseLearn />} />
                <Route path="/quiz/:courseId"            element={<Quiz />} />
                <Route path="/quiz/:courseId/result"     element={<Result />} />
                <Route path="/quiz/:courseId/progress"   element={<Progress />} />
                <Route path="/roadmap"                   element={<Roadmap />} />
                <Route path="/learn"                     element={<LearnSpace />} />
                <Route path="/videos"                    element={<Videos />} />
                <Route path="/achievements"              element={<Achievements />} />
                <Route path="/analytics"                 element={<LearningAnalytics />} />
                <Route path="/instructor/courses/:id"    element={<InstructorCourseAnalytics />} />
                <Route path="/lecture"                   element={<LectureSpace />} />
                <Route path="/lecture/:courseId/:lectureId" element={<LectureSpace />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <AuthedChatWidget />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
