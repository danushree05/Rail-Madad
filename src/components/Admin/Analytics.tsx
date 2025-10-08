import { useData } from '../../contexts/DataContext';
import { BarChart3, TrendingUp, Clock, Star, AlertCircle } from 'lucide-react';

export function Analytics() {
  const { complaints, feedback } = useData();

  const categoryStats = complaints.reduce((acc, c) => {
    if (c.category) {
      acc[c.category] = (acc[c.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const urgencyStats = complaints.reduce((acc, c) => {
    acc[c.urgencyLevel] = (acc[c.urgencyLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusStats = complaints.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const resolvedComplaints = complaints.filter(c => c.resolvedAt);
  const avgResolutionTime = resolvedComplaints.length > 0
    ? resolvedComplaints.reduce((sum, c) => {
        if (c.resolvedAt) {
          return sum + (new Date(c.resolvedAt).getTime() - new Date(c.createdAt).getTime());
        }
        return sum;
      }, 0) / resolvedComplaints.length / (1000 * 60 * 60)
    : 0;

  const avgRating = feedback.length > 0
    ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
    : 0;

  const sentimentStats = feedback.reduce((acc, f) => {
    if (f.sentiment) {
      acc[f.sentiment] = (acc[f.sentiment] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const maxCategory = Object.entries(categoryStats).sort((a, b) => b[1] - a[1])[0];
  const maxUrgency = Object.entries(urgencyStats).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800">Total Complaints</span>
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-900">{complaints.length}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800">Resolved</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-900">{statusStats.resolved || 0}</p>
            <p className="text-xs text-green-700 mt-1">
              {complaints.length > 0 ? ((statusStats.resolved || 0) / complaints.length * 100).toFixed(1) : 0}% resolution rate
            </p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-yellow-800">Avg Resolution Time</span>
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-yellow-900">{avgResolutionTime.toFixed(1)}h</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-orange-800">Avg Satisfaction</span>
              <Star className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-orange-900">{avgRating.toFixed(1)}/5</p>
            <p className="text-xs text-orange-700 mt-1">{feedback.length} ratings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Complaints by Category</h3>
            <div className="space-y-3">
              {Object.entries(categoryStats).sort((a, b) => b[1] - a[1]).map(([category, count]) => (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{category}</span>
                    <span className="font-medium text-gray-900">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(count / complaints.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Urgency Distribution</h3>
            <div className="space-y-3">
              {(['High', 'Medium', 'Low'] as const).map(urgency => (
                <div key={urgency}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{urgency} Priority</span>
                    <span className="font-medium text-gray-900">{urgencyStats[urgency] || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        urgency === 'High' ? 'bg-red-500' :
                        urgency === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${((urgencyStats[urgency] || 0) / complaints.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Overview</h3>
            <div className="space-y-3">
              {Object.entries(statusStats).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 capitalize">{status.replace('_', ' ')}</span>
                  <span className="px-3 py-1 bg-white rounded-full text-sm font-medium border border-gray-300">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sentiment Analysis</h3>
            <div className="space-y-3">
              {Object.entries(sentimentStats).map(([sentiment, count]) => (
                <div key={sentiment} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 capitalize">{sentiment}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                    sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {maxCategory && maxUrgency && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Key Insights</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>Most common category: <strong>{maxCategory[0]}</strong> ({maxCategory[1]} complaints)</li>
              <li>Most common urgency: <strong>{maxUrgency[0]}</strong> ({maxUrgency[1]} complaints)</li>
              <li>Average resolution time: <strong>{avgResolutionTime.toFixed(1)} hours</strong></li>
              {avgRating > 0 && <li>Average satisfaction rating: <strong>{avgRating.toFixed(1)}/5</strong></li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
