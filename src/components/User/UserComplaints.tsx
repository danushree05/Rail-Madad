import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { ComplaintCard } from '../Complaints/ComplaintCard';
import { ComplaintDetail } from '../Complaints/ComplaintDetail';
import { Complaint } from '../../types';
import { FileText, Star } from 'lucide-react';

export function UserComplaints() {
  const { user } = useAuth();
  const { complaints, feedback, createFeedback } = useData();
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [feedbackModal, setFeedbackModal] = useState<Complaint | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const userComplaints = complaints.filter(c => c.userId === user?.id);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !feedbackModal) return;

    createFeedback({
      complaintId: feedbackModal.id,
      userId: user.id,
      rating,
      comment
    });

    setFeedbackModal(null);
    setRating(5);
    setComment('');
  };

  const hasGivenFeedback = (complaintId: string) => {
    return feedback.some(f => f.complaintId === complaintId && f.userId === user?.id);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <FileText className="w-8 h-8 text-blue-600 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Complaints</h2>
            <p className="text-sm text-gray-600">Track and manage your submitted complaints</p>
          </div>
        </div>
      </div>

      {userComplaints.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No complaints submitted yet</p>
          <p className="text-gray-400 text-sm mt-2">Submit your first complaint to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {userComplaints.map(complaint => (
            <div key={complaint.id} className="bg-white rounded-lg shadow p-6">
              <ComplaintCard
                complaint={complaint}
                onClick={() => setSelectedComplaint(complaint)}
              />

              {complaint.status === 'resolved' && !hasGivenFeedback(complaint.id) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setFeedbackModal(complaint)}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center"
                  >
                    <Star className="w-5 h-5 mr-2" />
                    Provide Feedback
                  </button>
                </div>
              )}

              {hasGivenFeedback(complaint.id) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-green-600 flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    Feedback submitted
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedComplaint && (
        <ComplaintDetail
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}

      {feedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Provide Feedback</h3>
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How satisfied are you with the resolution?
                </label>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className={`w-12 h-12 rounded-lg transition ${
                        rating >= num
                          ? 'bg-yellow-400 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      <Star className="w-6 h-6 mx-auto fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Comments (Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                  placeholder="Share your experience..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setFeedbackModal(null);
                    setRating(5);
                    setComment('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
