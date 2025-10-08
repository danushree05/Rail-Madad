import { Train, LogOut, LayoutDashboard, FileText, BarChart3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Train className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">Rail Madad AI</h1>
              <p className="text-xs text-gray-500">AI-Powered Complaint Management</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {isAdmin ? (
              <>
                <button
                  onClick={() => onViewChange('admin-dashboard')}
                  className={`px-4 py-2 rounded-lg transition flex items-center ${
                    currentView === 'admin-dashboard'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Complaints
                </button>
                <button
                  onClick={() => onViewChange('analytics')}
                  className={`px-4 py-2 rounded-lg transition flex items-center ${
                    currentView === 'analytics'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onViewChange('new-complaint')}
                  className={`px-4 py-2 rounded-lg transition flex items-center ${
                    currentView === 'new-complaint'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  New Complaint
                </button>
                <button
                  onClick={() => onViewChange('my-complaints')}
                  className={`px-4 py-2 rounded-lg transition flex items-center ${
                    currentView === 'my-complaints'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  My Complaints
                </button>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-800">{user?.fullName}</p>
              <p className="text-xs text-gray-500">{isAdmin ? 'Administrator' : 'User'}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="md:hidden pb-3 flex space-x-2">
          {isAdmin ? (
            <>
              <button
                onClick={() => onViewChange('admin-dashboard')}
                className={`flex-1 px-3 py-2 rounded-lg transition text-sm ${
                  currentView === 'admin-dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Complaints
              </button>
              <button
                onClick={() => onViewChange('analytics')}
                className={`flex-1 px-3 py-2 rounded-lg transition text-sm ${
                  currentView === 'analytics'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Analytics
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onViewChange('new-complaint')}
                className={`flex-1 px-3 py-2 rounded-lg transition text-sm ${
                  currentView === 'new-complaint'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                New
              </button>
              <button
                onClick={() => onViewChange('my-complaints')}
                className={`flex-1 px-3 py-2 rounded-lg transition text-sm ${
                  currentView === 'my-complaints'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                My Complaints
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
