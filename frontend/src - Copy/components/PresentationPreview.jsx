import React from 'react';
import { Download, FileText } from 'lucide-react';

const PresentationPreview = ({ presentationData, onDownload }) => {
  if (!presentationData) return null;

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-gray-900 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">
                {presentationData.title}
              </h3>
              <p className="text-xs text-gray-600">
                {presentationData.slides.length} slides ready
              </p>
            </div>
          </div>
          <button
            onClick={onDownload}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm shadow-md"
          >
            <Download className="w-4 h-4" />
            Download PPT
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresentationPreview;