import React, { useState } from 'react';
import { MessageSquare, Star, Send, ThumbsUp, AlertCircle } from 'lucide-react';
import type { FeedbackForm } from '../types';

export default function Feedback() {
  const [feedbackForm, setFeedbackForm] = useState<FeedbackForm>({
    patientId: 0,
    rating: 0,
    comments: '',
    category: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const categories = [
    'Care Quality',
    'Communication',
    'Wait Times',
    'Facility',
    'Staff Behavior',
    'Treatment Effectiveness',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to an API
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    
    // Reset form
    setFeedbackForm({
      patientId: 0,
      rating: 0,
      comments: '',
      category: ''
    });
  };

  const handleRating = (rating: number) => {
    setFeedbackForm(prev => ({ ...prev, rating }));
  };

  const existingFeedback = [
    {
      id: 1,
      patientName: 'Sarah J.',
      rating: 5,
      category: 'Care Quality',
      comment: 'Excellent care and very thorough risk assessment. The team was professional and caring.',
      date: '2024-03-15'
    },
    {
      id: 2,
      patientName: 'Michael C.',
      rating: 4,
      category: 'Communication',
      comment: 'Good communication about my treatment plan. Would appreciate more frequent updates.',
      date: '2024-03-14'
    },
    {
      id: 3,
      patientName: 'Emily D.',
      rating: 5,
      category: 'Treatment Effectiveness',
      comment: 'The personalized care plan has really helped improve my health outcomes.',
      date: '2024-03-12'
    }
  ];

  const avgRating = existingFeedback.reduce((sum, f) => sum + f.rating, 0) / existingFeedback.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <MessageSquare className="h-6 w-6 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Patient Feedback System</h2>
      </div>

      {/* Feedback Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{existingFeedback.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ThumbsUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Satisfaction Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {((existingFeedback.filter(f => f.rating >= 4).length / existingFeedback.length) * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Response Rate</p>
              <p className="text-2xl font-bold text-gray-900">87%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Submit Your Feedback</h3>
        
        {submitted && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <ThumbsUp className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-800">
                Thank you for your feedback! Your input helps us improve our services.
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient ID (Optional)
              </label>
              <input
                type="number"
                value={feedbackForm.patientId || ''}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, patientId: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter patient ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback Category
              </label>
              <select
                value={feedbackForm.category}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Rating
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRating(star)}
                  className={`p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    star <= feedbackForm.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <Star className="h-8 w-8 fill-current" />
                </button>
              ))}
              <span className="ml-3 text-sm text-gray-600">
                {feedbackForm.rating === 0 ? 'No rating' :
                 feedbackForm.rating === 1 ? 'Poor' :
                 feedbackForm.rating === 2 ? 'Fair' :
                 feedbackForm.rating === 3 ? 'Good' :
                 feedbackForm.rating === 4 ? 'Very Good' : 'Excellent'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comments and Suggestions
            </label>
            <textarea
              rows={4}
              value={feedbackForm.comments}
              onChange={(e) => setFeedbackForm(prev => ({ ...prev, comments: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Please share your experience and suggestions for improvement..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Send className="h-5 w-5 mr-2" />
            Submit Feedback
          </button>
        </form>
      </div>

      {/* Recent Feedback */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Patient Feedback</h3>
        <div className="space-y-6">
          {existingFeedback.map(feedback => (
            <div key={feedback.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8">
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {feedback.patientName.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{feedback.patientName}</p>
                    <p className="text-xs text-gray-500">{feedback.date}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center mr-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {feedback.category}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-700">{feedback.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}