import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
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
import PageTransition       from './components/motion/PageTransition'
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

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login"        element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register"     element={<PageTransition><Register /></PageTransition>} />
        <Route path="/verify-email" element={<PageTransition><VerifyEmail /></PageTransition>} />
        <Route path="/verify/:certificateId" element={<PageTransition><VerifyCertificate /></PageTransition>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/"                          element={<PageTransition><SmartDashboard /></PageTransition>} />
          <Route path="/dashboard"                 element={<PageTransition><SmartDashboard /></PageTransition>} />
          <Route path="/courses"                   element={<PageTransition><Courses /></PageTransition>} />
          <Route path="/courses/:id"               element={<PageTransition><CourseDetails /></PageTransition>} />
          <Route path="/courses/:id/learn"         element={<PageTransition><CourseLearn /></PageTransition>} />
          <Route path="/quiz/:courseId"            element={<PageTransition><Quiz /></PageTransition>} />
          <Route path="/quiz/:courseId/result"     element={<PageTransition><Result /></PageTransition>} />
          <Route path="/quiz/:courseId/progress"   element={<PageTransition><Progress /></PageTransition>} />
          <Route path="/roadmap"                   element={<PageTransition><Roadmap /></PageTransition>} />
          <Route path="/learn"                     element={<PageTransition><LearnSpace /></PageTransition>} />
          <Route path="/videos"                    element={<PageTransition><Videos /></PageTransition>} />
          <Route path="/achievements"              element={<PageTransition><Achievements /></PageTransition>} />
          <Route path="/analytics"                 element={<PageTransition><LearningAnalytics /></PageTransition>} />
          <Route path="/instructor/courses/:id"    element={<PageTransition><InstructorCourseAnalytics /></PageTransition>} />
          <Route path="/lecture"                   element={<PageTransition><LectureSpace /></PageTransition>} />
          <Route path="/lecture/:courseId/:lectureId" element={<PageTransition><LectureSpace /></PageTransition>} />
        </Route>
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <AnimatedRoutes />
          </main>
          <Footer />
          <AuthedChatWidget />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
