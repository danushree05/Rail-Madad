import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { Header } from './components/Layout/Header';
import { ComplaintForm } from './components/Complaints/ComplaintForm';
import { UserComplaints } from './components/User/UserComplaints';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { Analytics } from './components/Admin/Analytics';
import { Chatbot } from './components/Chatbot/Chatbot';
import { Train } from 'lucide-react';

function AuthScreen() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Train className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Rail Madad AI</h1>
          <p className="text-gray-600">AI-Powered Railway Complaint Management System</p>
        </div>

        {showLogin ? (
          <Login onSwitchToRegister={() => setShowLogin(false)} />
        ) : (
          <Register onSwitchToLogin={() => setShowLogin(true)} />
        )}

        <div className="mt-8 bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Key Features:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ AI-powered automatic categorization</li>
            <li>✓ Intelligent urgency detection</li>
            <li>✓ Smart department routing</li>
            <li>✓ Real-time analytics dashboard</li>
            <li>✓ AI chatbot assistance</li>
            <li>✓ Sentiment analysis on feedback</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function MainApp() {
  const { user, isAdmin } = useAuth();
  const [currentView, setCurrentView] = useState(
    isAdmin ? 'admin-dashboard' : 'new-complaint'
  );

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAdmin ? (
          <>
            {currentView === 'admin-dashboard' && <AdminDashboard />}
            {currentView === 'analytics' && <Analytics />}
          </>
        ) : (
          <>
            {currentView === 'new-complaint' && (
              <ComplaintForm onSuccess={() => setCurrentView('my-complaints')} />
            )}
            {currentView === 'my-complaints' && <UserComplaints />}
          </>
        )}
      </main>

      <Chatbot />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
