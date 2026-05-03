import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../api/adminApi';
import { Users, Mail, Phone, Calendar, Loader2, ShieldCheck } from 'lucide-react';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            console.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white font-serif tracking-wide">User Management 👥</h1>
                <div className="text-sm font-medium text-ez-gold bg-ez-gold/10 px-4 py-2 rounded-xl border border-ez-gold/30 shadow-[0_0_15px_rgba(201,168,76,0.1)]">
                    Total Registered: <span className="text-white font-black">{users.length}</span>
                </div>
            </div>

            <div className="bg-white/5 rounded-3xl shadow-lg border border-ez-gold/20 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black/40 border-b border-ez-gold/20 text-xs font-bold text-ez-gold uppercase tracking-wider font-serif">
                            <tr>
                                <th className="px-6 py-4">User Details</th>
                                <th className="px-6 py-4">Contact Info</th>
                                <th className="px-6 py-4">Registration</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ez-gold/10">
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-12"><Loader2 className="animate-spin mx-auto text-ez-gold" /></td></tr>
                            ) : users.map(user => (
                                <tr key={user.person_id} className="hover:bg-ez-gold/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-ez-gold/10 border border-ez-gold/20 rounded-full flex items-center justify-center">
                                                <Users className="w-5 h-5 text-ez-gold" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{user.name}</p>
                                                <p className="text-xs text-gray-500 font-mono capitalize">ID: #{user.person_id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs text-gray-300">
                                                <Mail className="w-3 h-3 text-ez-gold" /> {user.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-300">
                                                <Phone className="w-3 h-3 text-ez-gold" /> {user.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                                            <Calendar className="w-3.5 h-3.5 text-ez-gold" />
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-ez-gold/20 text-ez-gold border border-ez-gold/30">
                                            <ShieldCheck className="w-3 h-3" /> Active
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
