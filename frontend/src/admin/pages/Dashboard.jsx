// admin/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    blog: 0,
    journal: 0,
    project: 0,
    service: 0,
  });

  const api = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [total, blog, journal, project, service] = await Promise.all([
          fetch(`${api}/api/visits`).then((res) => res.json()),
          fetch(`${api}/api/visits/count/blog`).then((res) => res.json()),
          fetch(`${api}/api/visits/count/journal`).then((res) => res.json()),
          fetch(`${api}/api/visits/count/project`).then((res) => res.json()),
          fetch(`${api}/api/visits/count/service`).then((res) => res.json()),
        ]);

        setStats({
          total: total.length,
          blog: blog.count || 0,
          journal: journal.count || 0,
          project: project.count || 0,
          service: service.count || 0,
        });
      } catch (err) {
        console.error("Ziyaret verileri alınamadı", err);
      }
    };

    fetchStats();
  }, []);

  const chartData = [
    { name: "Toplam", count: stats.total },
    { name: "Blog", count: stats.blog },
    { name: "Journal", count: stats.journal },
    { name: "Project", count: stats.project },
    { name: "Service", count: stats.service },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-6">Hoş geldiniz! Buradan blog, proje, hizmet ve haberleri yönetin.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Toplam Ziyaret" count={stats.total} color="bg-blue-100" />
        <StatCard title="Blog Ziyareti" count={stats.blog} color="bg-green-100" />
        <StatCard title="Journal Ziyareti" count={stats.journal} color="bg-yellow-100" />
        <StatCard title="Proje Ziyareti" count={stats.project} color="bg-purple-100" />
      </div>

      <h2 className="text-xl font-semibold mb-4">Ziyaret Dağılımı</h2>
      <div className="w-full h-72 bg-white p-4 rounded shadow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StatCard = ({ title, count, color }) => (
  <div className={`p-4 rounded shadow ${color}`}>
    <h2 className="text-xl font-semibold">{title}</h2>
    <p className="text-3xl font-bold">{count}</p>
  </div>
);

export default Dashboard;