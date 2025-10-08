import { useState } from 'react';
import { Upload, FileText, Loader, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Complaint } from '../../types';

interface ComplaintFormProps {
  onSuccess?: (complaint: Complaint) => void;
}

export function ComplaintForm({ onSuccess }: ComplaintFormProps) {
  const { user } = useAuth();
  const { createComplaint } = useData();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    trainNumber: '',
    coachNumber: '',
    location: ''
  });
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMediaFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setSuccess(false);

    try {
      const mediaUrls = mediaFiles.map((file, idx) =>
        URL.createObjectURL(file)
      );

      const complaint = await createComplaint({
        userId: user.id,
        title: formData.title,
        description: formData.description,
        status: 'pending',
        mediaUrls,
        metadata: {
          trainNumber: formData.trainNumber,
          coachNumber: formData.coachNumber,
          location: formData.location
        },
        aiAnalysis: {}
      });

      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        trainNumber: '',
        coachNumber: '',
        location: ''
      });
      setMediaFiles([]);

      if (onSuccess) {
        setTimeout(() => onSuccess(complaint), 1500);
      }
    } catch (error) {
      console.error('Error creating complaint:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Complaint Submitted Successfully!</h3>
        <p className="text-gray-600 mb-4">
          Your complaint has been analyzed by our AI system and routed to the appropriate department.
        </p>
        <p className="text-sm text-gray-500">
          You will receive updates on your complaint status.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center mb-6">
        <FileText className="w-8 h-8 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">File a New Complaint</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Complaint Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief description of the issue"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Detailed Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
            placeholder="Provide detailed information about your complaint"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Train Number</label>
            <input
              type="text"
              value={formData.trainNumber}
              onChange={(e) => setFormData({ ...formData, trainNumber: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 12345"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coach Number</label>
            <input
              type="text"
              value={formData.coachNumber}
              onChange={(e) => setFormData({ ...formData, coachNumber: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., A1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Station/City"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Media (Photos/Videos)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                  <span>Upload files</span>
                  <input
                    type="file"
                    className="sr-only"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, MP4 up to 10MB</p>
              {mediaFiles.length > 0 && (
                <p className="text-sm text-green-600 font-medium">
                  {mediaFiles.length} file(s) selected
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>AI-Powered Analysis:</strong> Your complaint will be automatically analyzed to detect the category, urgency level, and routed to the appropriate department.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader className="animate-spin mr-2" />
              Analyzing & Submitting...
            </>
          ) : (
            'Submit Complaint'
          )}
        </button>
      </form>
    </div>
  );
}
