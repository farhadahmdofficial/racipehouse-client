


'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaExclamationTriangle, FaTrash, FaCheck, FaSpinner, FaFlag } from 'react-icons/fa';

const API_BASE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/admin/reports`);
      if (res.data.success) {
        setReports(res.data.reports || []);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleAction = async (reportId, recipeId, action) => {
    const actionText = action === 'dismiss' ? 'dismiss this report' : 'delete this recipe and all related reports';
    if (!confirm(`Are you sure you want to ${actionText}?`)) return;

    setActionLoading(reportId);
    try {
      const res = await axios.delete(`${API_BASE}/api/admin/reports`, {
        data: { reportId, recipeId, action },
      });

      if (res.data.success) {
        if (action === 'remove_recipe') {
          setReports((prev) => prev.filter((r) => r.recipeId !== recipeId));
        } else {
          setReports((prev) => prev.filter((r) => r._id !== reportId));
        }
      } else {
        alert(res.data.message || 'Action failed.');
      }
    } catch (err) {
      console.error('Action error:', err);
      alert('Action failed. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const getBadgeStyle = (reason = '') => {
    const lowerReason = reason.toLowerCase();
    if (lowerReason.includes('spam')) return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400';
    if (lowerReason.includes('offensive') || lowerReason.includes('hate') || lowerReason.includes('abusive')) {
      return 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400';
    }
    return 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <FaExclamationTriangle className="text-amber-500" /> Review Reports
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Inspect reported recipes and take action to enforce community rules.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <FaSpinner className="animate-spin text-3xl text-orange-600" />
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center text-gray-500">
          <FaFlag className="text-4xl text-gray-300 dark:text-gray-700 mx-auto mb-3" />
          <p className="font-medium">No pending reports found.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 text-xs font-semibold uppercase border-b border-gray-200 dark:border-gray-800">
                  <th className="p-4">Recipe Title</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Reported By</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {reports.map((report) => (
                  <tr key={report._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                    <td className="p-4 font-semibold text-gray-900 dark:text-white max-w-xs truncate">
                      {report.recipeTitle || 'Untitled Recipe'}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${getBadgeStyle(report.reason)}`}>
                        {report.reason || 'General Issue'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">
                      {report.reportedByEmail || 'Anonymous'}
                    </td>
                    <td className="p-4 text-gray-500 dark:text-gray-400 text-xs">
                      {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleAction(report._id, report.recipeId, 'dismiss')}
                        disabled={actionLoading === report._id}
                        className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition inline-flex items-center gap-1 disabled:opacity-50"
                      >
                        {actionLoading === report._id ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <>
                            <FaCheck className="text-green-600" /> Dismiss
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleAction(report._id, report.recipeId, 'remove_recipe')}
                        disabled={actionLoading === report._id}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition inline-flex items-center gap-1 disabled:opacity-50"
                      >
                        {actionLoading === report._id ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <>
                            <FaTrash /> Remove Recipe
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}








// ok code 

// 'use client';

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaExclamationTriangle, FaTrash, FaCheck, FaSpinner, FaFlag } from 'react-icons/fa';

// export default function AdminReportsPage() {
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(null);

//   const fetchReports = async () => {
//     try {
//       const res = await axios.get('/api/admin/reports');
//       setReports(res.data.reports || []);
//     } catch (err) {
//       console.error('Failed to load reports', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   const handleAction = async (reportId, recipeId, action) => {
//     if (!confirm(`Are you sure you want to ${action === 'dismiss' ? 'dismiss this report' : 'delete this recipe'}?`)) return;

//     setActionLoading(reportId);
//     try {
//       await axios.delete('/api/admin/reports', {
//         data: { reportId, recipeId, action },
//       });
//       fetchReports();
//     } catch (err) {
//       alert('Action failed. Try again.');
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto space-y-6">
//       <div>
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
//           <FaExclamationTriangle className="text-amber-500" /> Review Reports
//         </h1>
//         <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
//           Inspect reported recipes and take action to enforce community rules.
//         </p>
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-12">
//           <FaSpinner className="animate-spin text-3xl text-orange-600" />
//         </div>
//       ) : reports.length === 0 ? (
//         <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center text-gray-500">
//           <FaFlag className="text-4xl text-gray-300 mx-auto mb-3" />
//           <p className="font-medium">No pending reports found.</p>
//         </div>
//       ) : (
//         <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 text-xs font-semibold uppercase border-b border-gray-200 dark:border-gray-800">
//                   <th className="p-4">Recipe Title</th>
//                   <th className="p-4">Reason</th>
//                   <th className="p-4">Reported By</th>
//                   <th className="p-4">Date</th>
//                   <th className="p-4 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
//                 {reports.map((report) => (
//                   <tr key={report._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
//                     <td className="p-4 font-semibold text-gray-900 dark:text-white">
//                       {report.recipeTitle}
//                     </td>
//                     <td className="p-4">
//                       <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
//                         report.reason === 'Spam' 
//                           ? 'bg-amber-100 text-amber-700' 
//                           : report.reason === 'Offensive Content'
//                           ? 'bg-red-100 text-red-700'
//                           : 'bg-purple-100 text-purple-700'
//                       }`}>
//                         {report.reason}
//                       </span>
//                     </td>
//                     <td className="p-4 text-gray-500 dark:text-gray-400">
//                       {report.reportedByEmail}
//                     </td>
//                     <td className="p-4 text-gray-500 dark:text-gray-400 text-xs">
//                       {new Date(report.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="p-4 text-right space-x-2">
//                       {/* Dismiss Button */}
//                       <button
//                         onClick={() => handleAction(report._id, report.recipeId, 'dismiss')}
//                         disabled={actionLoading === report._id}
//                         className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition inline-flex items-center gap-1"
//                       >
//                         <FaCheck className="text-green-600" /> Dismiss
//                       </button>

//                       {/* Remove Recipe Button */}
//                       <button
//                         onClick={() => handleAction(report._id, report.recipeId, 'remove_recipe')}
//                         disabled={actionLoading === report._id}
//                         className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition inline-flex items-center gap-1"
//                       >
//                         <FaTrash /> Remove Recipe
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }








