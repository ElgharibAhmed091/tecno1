import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileBadge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import useAxios from '@/utils/useAxios';
import toast from 'react-hot-toast';

const CertificationsList = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axios = useAxios();

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const { data } = await axios.get('api/course/certification');
        setCertifications(data);
        setError(null);
      } catch {
        setError('Failed to load certifications');
        toast.error('Failed to load certifications');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCertifications();
  }, []);

  const handleDownload = (pdfUrl, courseName) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${courseName.replace(/\s+/g, '_')}_certification.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <Skeleton className="h-48 w-full rounded-t-xl" />
            <div className="p-4 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error || !certifications?.length) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-xl">
        <FileBadge className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          {error ? 'Failed to load certifications' : 'No certifications available yet'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {error ? 'Please try again later' : 'Complete course requirements to earn your certification'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          My Certifications
        </motion.h2>
        <p className="mt-2 text-sm text-gray-500">
          Click on any certification to download the PDF
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((certification, index) => (
          <motion.div
            key={certification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200"
          >
            <div className="p-4 space-y-4">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {certification.course_title}
              </h3>
              
              <div 
                className="relative aspect-video rounded-lg overflow-hidden cursor-pointer bg-gray-50"
                onClick={() => handleDownload(certification.certificate_template_pdf, certification.course_title)}
              >
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <FileBadge className="h-12 w-12" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-sm text-white font-medium">
                    Click to Download
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => handleDownload(certification.certificate_template_pdf, certification.course_title)}
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <span className="text-sm text-gray-500">
                  {new Date(certification.date_issued).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CertificationsList;