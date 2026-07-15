import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Calendar as CalendarIcon, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { getMembers } from '../services/member.service';

const Attendance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceType, setServiceType] = useState('Sunday Service');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['members'],
    queryFn: getMembers,
  });

  const filteredMembers = members.filter((member: any) => 
    member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    member.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Attendance Register</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Mark attendance for services and events.</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
           <select 
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none border-r border-gray-200 dark:border-gray-700 pr-2"
           >
             <option>Sunday Service</option>
             <option>Midweek Service</option>
             <option>Workers Meeting</option>
             <option>Special Event</option>
           </select>
           <div className="flex items-center pl-2">
             <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
             <input 
               type="date"
               value={date}
               onChange={(e) => setDate(e.target.value)}
               className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none"
             />
           </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search members to mark..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Member</th>
                <th className="px-6 py-4 font-medium">Position</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium text-right">Mark Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-500">Loading members...</td></tr>
              ) : filteredMembers.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-500">No members found.</td></tr>
              ) : (
                filteredMembers.map((member: any) => (
                  <tr key={member.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase">
                        {member.firstName.charAt(0)}
                      </div>
                      <div>
                        {member.firstName} {member.lastName}
                        {member.isWorker && <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">Worker</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{member.position}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{member.phoneNumber || 'N/A'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="flex items-center gap-1 px-3 py-1.5 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
                          <CheckCircle2 className="w-4 h-4" /> Present
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1.5 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                          <XCircle className="w-4 h-4" /> Absent
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1.5 border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors">
                          <Clock className="w-4 h-4" /> Late
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
