// // import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// // import { Toaster } from "@/components/ui/toaster";
// // import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// // import Navigation from "@/components/Navigation";
// // import Index from "@/pages/Index";
// // import Auth from "@/pages/Auth";
// // import Dashboard from "@/pages/Dashboard";
// // import Onboarding from "@/pages/Onboarding";
// // import Performance from "@/pages/Performance";
// // import Profile from "@/pages/Profile";
// // import Quiz from "@/pages/Quiz";
// // import Course from "@/pages/Course";
// // import Notes from "@/pages/Notes";

// // // Create a client
// // const queryClient = new QueryClient({
// //   defaultOptions: {
// //     queries: {
// //       staleTime: 5 * 60 * 1000, // 5 minutes
// //       retry: 1,
// //     },
// //   },
// // });

// // function App() {
// //   return (
// //     <QueryClientProvider client={queryClient}>
// //       <Router>
// //         <Navigation />
// //         <div className="pt-16">
// //           <Routes>
// //             <Route path="/" element={<Index />} />
// //             <Route path="/auth" element={<Auth />} />
// //             <Route path="/dashboard" element={<Dashboard />} />
// //             <Route path="/onboarding" element={<Onboarding />} />
// //             <Route path="/performance" element={<Performance />} />
// //             <Route path="/profile" element={<Profile />} />
// //             <Route path="/quiz" element={<Quiz />} />
// //             <Route path="/course" element={<Course />} />
// //             <Route path="/notes" element={<Notes />} />
// //             <Route path="*" element={<Navigate to="/" replace />} />
// //           </Routes>
// //         </div>
// //         <Toaster />
// //       </Router>
// //     </QueryClientProvider>
// //   );
// // }

// // export default App;

// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { Toaster } from "@/components/ui/toaster";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import Navigation from "@/components/Navigation";
// import Index from "@/pages/Index";
// import Auth from "@/pages/Auth";
// import Dashboard from "@/pages/Dashboard";
// import Onboarding from "@/pages/Onboarding";
// import Performance from "@/pages/Performance";
// import Profile from "@/pages/Profile";
// import Quiz from "@/pages/Quiz";
// import Course from "@/pages/Course";
// import Notes from "@/pages/Notes";
// import Summary from "@/pages/Summary";
// import ResearchPaperAnalyzer from "./pages/ResearchPaper";
// import ATSAnalyzer from "./pages/ATS";
// import GitHubChatPage from "./pages/Githubchat";
// import RoadmapPage from "./pages/Roadmap";
// import CreateNewContent from "./pages/TemplatePage";
// import Home from "./pages/Home";

// // Create a client
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 5 * 60 * 1000, // 5 minutes
//       retry: 1,
//     },
//   },
// });

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <Router>
//         <Navigation />
//         <div className="pt-16">
//           <Routes>
//             <Route path="/" element={<Index />} />
//             <Route path="/auth" element={<Auth />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/onboarding" element={<Onboarding />} />
//             <Route path="/performance" element={<Performance />} />
//             <Route path="/profile" element={<Profile />} />
//             <Route path="/quiz" element={<Quiz />} />
//             <Route path="/course" element={<Course />} />
//             <Route path="/notes" element={<Notes />} />
//             <Route path="/summary" element={<Summary />} />
//             <Route path="/researchpaper" element={<ResearchPaperAnalyzer />} />
//             <Route path="*" element={<Navigate to="/" replace />} />
//             <Route path="/ats" element={<ATSAnalyzer />} />
//             <Route path="/githubchat" element={<GitHubChatPage />} />
//             <Route path="/roadmap" element={<RoadmapPage/>} />
//             <Route path="/aidashboard" element={<Home />} />
//             <Route path="/aidashboard/content/:slug" element={<CreateNewContent />} />
//           </Routes>
//         </div>
//         <Toaster />
//       </Router>
//     </QueryClientProvider>
//   );
// }

// export default App;
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Onboarding from "@/pages/Onboarding";
import Performance from "@/pages/Performance";
import Profile from "@/pages/Profile";
import Quiz from "@/pages/Quiz";
import Course from "@/pages/Course";
import Notes from "@/pages/Notes";
import Summary from "@/pages/Summary";
import ResearchPaperAnalyzer from "./pages/ResearchPaper";
import ATSAnalyzer from "./pages/ATS";
import GitHubChatPage from "./pages/Githubchat";
import RoadmapPage from "./pages/Roadmap";
import CreateNewContent from "./pages/TemplatePage";
import Home from "./pages/Home";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Protected Route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or your custom loading component
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Navigation />
        <div className="pt-16">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/researchpaper" element={<ResearchPaperAnalyzer />} />
            <Route path="/ats" element={<ATSAnalyzer />} />
            <Route path="/githubchat" element={<GitHubChatPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/performance"
              element={
                <ProtectedRoute>
                  <Performance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz"
              element={
                <ProtectedRoute>
                  <Quiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course"
              element={
                <ProtectedRoute>
                  <Course />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes"
              element={
                <ProtectedRoute>
                  <Notes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/summary"
              element={
                <ProtectedRoute>
                  <Summary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/aidashboard"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/aidashboard/content/:slug"
              element={
                <ProtectedRoute>
                  <CreateNewContent />
                </ProtectedRoute>
              }
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;