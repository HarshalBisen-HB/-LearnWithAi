"use client";

import React from "react";
import { Download, FileText } from "lucide-react";

interface PDFItem {
  filename: string;
  title: string;
  description: string;
  size: string;
}

function PDFDisplayPage() {
  // Your actual PDF data based on the files in public/res
  const pdfs: PDFItem[] = [
    {
      filename: "backend_server.pdf",
      title: "Backend Server",
      description:
        "Complete backend server documentation including API endpoints, database schemas, and server configuration.",
      size: "2.1 MB",
    },
    {
      filename: "Http.pdf",
      title: "HTTP Guide",
      description:
        "Comprehensive HTTP protocol guide covering request methods, status codes, and best practices.",
      size: "1.8 MB",
    },
    {
      filename: "Redux Toolkit.pdf",
      title: "Redux Toolkit",
      description:
        "Modern Redux development guide with Redux Toolkit, including state management patterns and best practices.",
      size: "3.2 MB",
    },
    {
      filename: "tailwind-css-sk.pdf",
      title: "Tailwind CSS",
      description:
        "Complete Tailwind CSS reference guide with utility classes, responsive design, and customization options.",
      size: "2.8 MB",
    },
  ];

  const handleDownload = (filename: string): void => {
    const link = document.createElement("a");
    link.href = `/res/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-[#7e98cc] bg-clip-text text-transparent mb-4">
            PDF Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Download and access our collection of important documents and
            resources
          </p>
        </div>

        {/* PDF Grid */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {pdfs.map((pdf, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-white/20 hover:border-blue-200/50 hover:-translate-y-1"
            >
              {/* PDF Icon and Title */}
              <div className="flex items-start space-x-6 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-[#9ebfff] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {pdf.title}
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className="px-3 py-1 bg-gray-100 rounded-full font-medium">
                      {pdf.filename}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                      {pdf.size}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                {pdf.description}
              </p>

              {/* Action Button */}
              <div>
                <button
                  onClick={() => handleDownload(pdf.filename)}
                  className="w-full bg-[#7e98cc] hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Download className="h-5 w-5" />
                  <span className="text-lg">Download Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
          <div className="inline-block px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-white/30">
            <p className="text-sm text-gray-600">
              Having trouble downloading? Try right-clicking the download button
              and selecting "Save link as..."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PDFDisplayPage;
