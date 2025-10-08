import { X, Clock, MapPin, Train, AlertTriangle, Building2, User } from 'lucide-react';
import { Complaint } from '../../types';
import { departments } from '../../lib/mockData';

interface ComplaintDetailProps {
  complaint: Complaint;
  onClose: () => void;
}

export function ComplaintDetail({ complaint, onClose }: ComplaintDetailProps) {
  const department = departments.find(d => d.id === complaint.departmentId);

  const urgencyColors = {
    High: 'bg-red-100 text-red-800 border-red-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Low: 'bg-green-100 text-green-800 border-green-200'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Complaint Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{complaint.title}</h3>
              <span className={`px-4 py-1 rounded-full text-sm font-medium border ${urgencyColors[complaint.urgencyLevel]}`}>
                {complaint.urgencyLevel} Priority
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed">{complaint.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-gray-600 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className="font-medium text-gray-800 capitalize">{complaint.status.replace('_', ' ')}</p>
              </div>
            </div>

            {complaint.category && (
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-gray-600 mr-3" />
                <div>
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="font-medium text-gray-800">{complaint.category}</p>
                </div>
              </div>
            )}

            {department && (
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Building2 className="w-5 h-5 text-gray-600 mr-3" />
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="font-medium text-gray-800">{department.name}</p>
                </div>
              </div>
            )}

            {complaint.metadata.location && (
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-600 mr-3" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-medium text-gray-800">{complaint.metadata.location}</p>
                </div>
              </div>
            )}

            {complaint.metadata.trainNumber && (
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Train className="w-5 h-5 text-gray-600 mr-3" />
                <div>
                  <p className="text-xs text-gray-500">Train Details</p>
                  <p className="font-medium text-gray-800">
                    Train {complaint.metadata.trainNumber}
                    {complaint.metadata.coachNumber && ` - Coach ${complaint.metadata.coachNumber}`}
                  </p>
                </div>
              </div>
            )}
          </div>

          {complaint.aiAnalysis.reasoning && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                AI Analysis
              </h4>
              <p className="text-sm text-blue-800">{complaint.aiAnalysis.reasoning}</p>
              {complaint.aiAnalysis.confidence && (
                <p className="text-xs text-blue-600 mt-2">
                  Confidence: {(complaint.aiAnalysis.confidence * 100).toFixed(0)}%
                </p>
              )}
            </div>
          )}

          {complaint.mediaUrls.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Attached Media</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {complaint.mediaUrls.map((url, idx) => (
                  <div key={idx} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={url}
                      alt={`Evidence ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div>
                <p>Submitted: {new Date(complaint.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date(complaint.updatedAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs">ID: {complaint.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
