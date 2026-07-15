import { useQuery } from '@tanstack/react-query';
import { Users, UserPlus, ArrowUpRight, ArrowDownRight, UserMinus, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDashboardStats } from '../services/member.service';

const data = [
  { name: 'Jan', attendance: 4000 },
  { name: 'Feb', attendance: 3000 },
  { name: 'Mar', attendance: 2000 },
  { name: 'Apr', attendance: 2780 },
  { name: 'May', attendance: 1890 },
  { name: 'Jun', attendance: 2390 },
  { name: 'Jul', attendance: 3490 },
];

const StatCard = ({ title, value, icon: Icon, trend, trendUp, isLoading }: any) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : value}
        </div>
      </div>
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
        <Icon className="h-6 w-6 text-primary" />
      </div>
    </div>
    <div className="mt-4 flex items-center">
      {trendUp ? (
        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
      ) : (
        <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
      )}
      <span className={`text-sm font-medium ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
        {trend}
      </span>
      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
    </div>
  </div>
);

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Overview of the Ministry's growth and attendance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Souls" value={stats?.totalSouls || 0} icon={Users} trend="12%" trendUp={true} isLoading={isLoading} />
        <StatCard title="Total Leaders" value={stats?.totalLeaders || 0} icon={UserPlus} trend="4%" trendUp={true} isLoading={isLoading} />
        <StatCard title="Total Workers" value={stats?.totalWorkers || 0} icon={Users} trend="2%" trendUp={true} isLoading={isLoading} />
        <StatCard title="Inactive Members" value={stats?.inactiveMembers || 0} icon={UserMinus} trend="1%" trendUp={false} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance Trend</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <Tooltip />
                <Area type="monotone" dataKey="attendance" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAttendance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Leadership Structure</h3>
          <div className="space-y-4">
            {['Major General', 'Pastors', 'Coordinators', 'S-Men', 'Leaders'].map((role, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{role}</span>
                <div className="w-1/2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${100 - i * 15}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
