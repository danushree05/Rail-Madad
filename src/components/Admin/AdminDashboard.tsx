import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { ComplaintCard } from '../Complaints/ComplaintCard';
import { ComplaintDetail } from '../Complaints/ComplaintDetail';
import { Complaint } from '../../types';
import { Filter, Search } from 'lucide-react';

export function AdminDashboard() {
  const { complaints, updateComplaint } = useData();
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterUrgency, setFilterUrgency] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComplaints = complaints.filter(complaint => {
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
    const matchesUrgency = filterUrgency === 'all' || complaint.urgencyLevel === filterUrgency;
    const matchesSearch = searchQuery === '' ||
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesUrgency && matchesSearch;
  });

  const handleStatusChange = (complaintId: string, newStatus: Complaint['status']) => {
    updateComplaint(complaintId, {
      status: newStatus,
      ...(newStatus === 'resolved' && { resolvedAt: new Date() })
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Complaint Management</h2>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">{filteredComplaints.length} complaints</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search complaints..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Urgency</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button
            onClick={() => {
              setFilterStatus('all');
              setFilterUrgency('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">No complaints found matching your filters.</p>
          </div>
        ) : (
          filteredComplaints.map(complaint => (
            <div key={complaint.id} className="bg-white rounded-lg shadow p-6">
              <ComplaintCard
                complaint={complaint}
                onClick={() => setSelectedComplaint(complaint)}
              />

              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Status:
                </label>
                <div className="flex space-x-2">
                  {(['pending', 'in_progress', 'resolved', 'closed'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(complaint.id, status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        complaint.status === status
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedComplaint && (
        <ComplaintDetail
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </div>
  );
}
