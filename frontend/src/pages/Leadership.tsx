import { useQuery } from '@tanstack/react-query';
import { getHierarchy } from '../services/member.service';
import { Loader2 } from 'lucide-react';

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
        {member.ranking && (
          <span className="inline-block px-2 py-0.5 mt-2 bg-purple-100 text-purple-800 text-[10px] rounded-full dark:bg-purple-900/30 dark:text-purple-300">
            {member.ranking}
          </span>
        )}
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

const Leadership = () => {
  const { data: hierarchy, isLoading } = useQuery({
    queryKey: ['hierarchy'],
    queryFn: getHierarchy,
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Leadership Structure</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">View the hierarchical organization of the ministry.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !hierarchy || hierarchy.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No leadership hierarchy found. Assign leaders to members to build the structure.
          </div>
        ) : (
          <div className="flex justify-center gap-16 min-w-max">
            {hierarchy.map((leader: any) => (
              <OrgNode key={leader.id} member={leader} isRoot={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leadership;
