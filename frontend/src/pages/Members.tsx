import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Plus, MoreVertical, Filter, Download, Loader2 } from 'lucide-react';
import { getMembers } from '../services/member.service';

const Members = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: members = [], isLoading, isError } = useQuery({
    queryKey: ['members'],
    queryFn: getMembers,
  });

  const filteredMembers = members.filter((member: any) => 
    member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Members Directory</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage church members, leaders, and their details.</p>
        </div>
        <button className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Add Member
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search members by name or position..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[300px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
             <div className="flex justify-center items-center h-64 text-red-500">
              Error fetching members. Make sure the backend API is running.
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Position</th>
                  <th className="px-6 py-4 font-medium">Gender</th>
                  <th className="px-6 py-4 font-medium">Phone</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No members found.
                    </td>
                  </tr>
                ) : filteredMembers.map((member: any) => (
                  <tr key={member.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      <Link to={`/members/${member.id}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase">
                          {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                        </div>
                        {member.firstName} {member.lastName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {member.position}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{member.gender}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{member.phoneNumber || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        member.status === 'Active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Members;
