import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMemberById, getMembers, transferMember } from '../services/member.service';
import { ArrowLeft, Phone, MapPin, Calendar, Briefcase, Activity, Share2, X, Loader2 } from 'lucide-react';

const OrgNode = ({ member, isRoot = false }: { member: any; isRoot?: boolean }) => {
  if (!member) return null;
  return (
    <div className="flex flex-col items-center">
      <div className={`p-4 rounded-xl border-2 min-w-[150px] text-center shadow-sm transition-all ${
        isRoot ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
      }`}>
        <div className="mx-auto w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-2">
          <span className="font-bold text-gray-600 dark:text-gray-300">
            {member.firstName?.charAt(0) || 'U'}
          </span>
        </div>
        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{member.firstName} {member.lastName}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{member.position}</p>
      </div>
      
      {member.children && member.children.length > 0 && (
        <>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
          <div className="flex gap-4 relative">
            {member.children.length > 1 && (
              <div className="absolute top-0 left-[25%] right-[25%] h-px bg-gray-300 dark:bg-gray-600"></div>
            )}
            {member.children.map((child: any, idx: number) => (
              <div key={idx} className="flex flex-col items-center relative pt-4">
                {member.children.length > 1 && (
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                )}
                <OrgNode member={child} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const MemberProfile = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedLeaderId, setSelectedLeaderId] = useState('');

  const { data: member, isLoading, isError } = useQuery({
    queryKey: ['member', id],
    queryFn: () => getMemberById(id!),
    enabled: !!id,
  });

  const { data: allMembers = [] } = useQuery({
    queryKey: ['members'],
    queryFn: getMembers,
  });

  const transferMutation = useMutation({
    mutationFn: (newParentId: string | null) => transferMember(id!, newParentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member', id] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
      setIsTransferModalOpen(false);
    },
  });

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading member profile...</div>;
  }

  if (isError || !member) {
    return <div className="p-8 text-center text-red-500">Error loading profile.</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center space-x-4">
        <Link to="/members" className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Member Profile</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Detailed view and hierarchy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold mb-4">
              {member.firstName.charAt(0)}{member.lastName.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.firstName} {member.lastName}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mt-2">
              {member.position}
            </span>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Phone className="w-4 h-4 mr-3 text-gray-400" />
              {member.phoneNumber || 'No phone provided'}
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <MapPin className="w-4 h-4 mr-3 text-gray-400" />
              {member.homeAddress || 'No address provided'}
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Briefcase className="w-4 h-4 mr-3 text-gray-400" />
              {member.occupation || 'No occupation provided'}
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Calendar className="w-4 h-4 mr-3 text-gray-400" />
              Joined: {new Date(member.dateJoined).toLocaleDateString()}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
             <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h4>
             <div className="flex gap-2">
               <button className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                 Edit Profile
               </button>
               <button 
                 onClick={() => setIsTransferModalOpen(true)}
                 className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
               >
                 Transfer
               </button>
             </div>
          </div>
        </div>

        {/* Analytics & Tree */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-5 h-5 text-green-500" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Attendance Rate</h4>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">85%</p>
              <p className="text-xs text-gray-500 mt-1">Based on last 4 weeks</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <Share2 className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Downline Size</h4>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{member.children?.length || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Direct subordinates</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Leadership Hierarchy</h3>
             <div className="overflow-x-auto pb-8 pt-4 flex justify-center">
                <OrgNode member={member} isRoot={true} />
             </div>
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transfer Member</h3>
              <button 
                onClick={() => setIsTransferModalOpen(false)}
                className="p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Select a new leader for <strong>{member.firstName} {member.lastName}</strong>. This will reassign them and update the hierarchy tree.
              </p>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Leader</label>
                <select
                  value={selectedLeaderId}
                  onChange={(e) => setSelectedLeaderId(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Select a leader...</option>
                  <option value="none">None (Make Top-Level)</option>
                  {allMembers
                    .filter((m: any) => m.id !== member.id && m.position !== 'Soul')
                    .map((m: any) => (
                      <option key={m.id} value={m.id}>
                        {m.firstName} {m.lastName} ({m.position})
                      </option>
                  ))}
                </select>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => setIsTransferModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const newId = selectedLeaderId === 'none' ? null : selectedLeaderId;
                    transferMutation.mutate(newId);
                  }}
                  disabled={!selectedLeaderId || transferMutation.isPending}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex justify-center items-center"
                >
                  {transferMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Transfer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberProfile;
