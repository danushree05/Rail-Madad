import { Clock, MapPin, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Complaint } from '../../types';
import { departments } from '../../lib/mockData';

interface ComplaintCardProps {
  complaint: Complaint;
  onClick?: () => void;
}

export function ComplaintCard({ complaint, onClick }: ComplaintCardProps) {
  const department = departments.find(d => d.id === complaint.departmentId);

  const urgencyColors = {
    High: 'bg-red-100 text-red-800 border-red-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Low: 'bg-green-100 text-green-800 border-green-200'
  };

  const statusIcons = {
    pending: <Clock className="w-5 h-5 text-yellow-500" />,
    in_progress: <AlertCircle className="w-5 h-5 text-blue-500" />,
    resolved: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    closed: <XCircle className="w-5 h-5 text-gray-500" />
  };

  const statusLabels = {
    pending: 'Pending',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed'
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer border border-gray-200"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{complaint.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{complaint.description}</p>
        </div>
        <span className={`ml-4 px-3 py-1 rounded-full text-xs font-medium border ${urgencyColors[complaint.urgencyLevel]}`}>
          {complaint.urgencyLevel}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {complaint.category && (
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
            {complaint.category}
          </span>
        )}
        {department && (
          <span className="px-3 py-1 bg-gray-50 text-gray-700 text-xs rounded-full border border-gray-200">
            {department.name}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center">
          {statusIcons[complaint.status]}
          <span className="ml-2">{statusLabels[complaint.status]}</span>
        </div>

        {complaint.metadata.location && (
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{complaint.metadata.location}</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-400">
        Submitted {new Date(complaint.createdAt).toLocaleDateString()} at {new Date(complaint.createdAt).toLocaleTimeString()}
      </div>
    </div>
  );
}
