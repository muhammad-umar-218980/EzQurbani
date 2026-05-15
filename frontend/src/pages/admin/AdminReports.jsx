import React, { useState, useEffect } from 'react';
import { getAdvancedReports } from '../../api/adminApi';
import { Loader2, Database, TrendingUp, Users, DollarSign, Award, Tag, Table as TableIcon } from 'lucide-react';

const AdminReports = () => {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('subqueries');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await getAdvancedReports();
                setReports(data);
            } catch (err) {
                console.error('Failed to fetch advanced reports');
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-ez-gold" />
            </div>
        );
    }

    if (!reports) {
        return <div className="text-red-500">Failed to load reports.</div>;
    }

    const ReportTable = ({ title, description, columns, data, icon: Icon }) => (
        <div className="bg-white/5 rounded-xl border border-ez-gold/20 overflow-hidden mb-8 shadow-lg">
            <div className="p-4 border-b border-ez-gold/20 bg-ez-gold/5 flex items-center gap-3">
                <Icon className="w-6 h-6 text-ez-gold" />
                <div>
                    <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>
                    <p className="text-xs text-gray-400 font-mono mt-1">{description}</p>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#111827] text-gray-400 border-b border-ez-gold/20">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} className="p-4 font-mono font-semibold uppercase tracking-wider">{col.header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {data?.length > 0 ? (
                            data.map((row, rowIdx) => (
                                <tr key={rowIdx} className="hover:bg-white/5 transition-colors">
                                    {columns.map((col, colIdx) => (
                                        <td key={colIdx} className="p-4 text-gray-300">
                                            {col.render ? col.render(row) : row[col.accessor]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="p-4 text-center text-gray-500 italic">No data returned</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white font-serif flex items-center gap-3">
                    <Database className="text-ez-gold w-8 h-8" />
                    Advanced DBMS Reports
                </h1>
                <p className="text-gray-400 font-mono text-sm">
                    Executing Complex SQL Queries (Subqueries, Group By/Having, String Functions).
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-ez-gold/20 gap-4 mb-4">
                {[
                    { id: 'subqueries', label: '1. Correlated Subqueries' },
                    { id: 'aggregations', label: '2. Aggregations (HAVING)' },
                    { id: 'string_ops', label: '3. String Functions' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-2 px-1 font-mono text-sm tracking-wide transition-all ${
                            activeTab === tab.id 
                            ? 'text-ez-gold border-b-2 border-ez-gold font-bold' 
                            : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="mt-6">
                {activeTab === 'subqueries' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <ReportTable 
                            title="Users Spending Above Average (Subquery)"
                            description="Identifies users whose total spending > the average spending of all users."
                            icon={TrendingUp}
                            columns={[
                                { header: 'Name', accessor: 'name' },
                                { header: 'Email', accessor: 'email' },
                                { header: 'Total Spent (Rs)', accessor: 'total_spent', render: r => 'Rs. ' + parseFloat(r.total_spent).toLocaleString() }
                            ]}
                            data={reports.spendingAboveAvg}
                        />

                        <ReportTable 
                            title="Highest Spending User (Correlated / Ordered)"
                            description="User with the maximum total booking summation."
                            icon={Award}
                            columns={[
                                { header: 'Name', accessor: 'name' },
                                { header: 'Email', accessor: 'email' },
                                { header: 'Total Spent (Rs)', accessor: 'total_spent', render: r => 'Rs. ' + parseFloat(r.total_spent).toLocaleString() }
                            ]}
                            data={reports.highestSpender}
                        />

                        <ReportTable 
                            title="Animals Priced Above Category Average (Subquery)"
                            description="Shows animals exceeding the average price of their specific category."
                            icon={Tag}
                            columns={[
                                { header: 'Tag No', accessor: 'tag_no' },
                                { header: 'Category', accessor: 'category' },
                                { header: 'Price', accessor: 'price', render: r => 'Rs. ' + parseFloat(r.price).toLocaleString() }
                            ]}
                            data={reports.expensiveAnimals}
                        />
                    </div>
                )}

                {activeTab === 'aggregations' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <ReportTable 
                            title="Top 5 Vendors by Supply"
                            description="Aggregated count of animals supplied per vendor."
                            icon={Users}
                            columns={[
                                { header: 'Vendor Name', accessor: 'vendor' },
                                { header: 'Total Animals Supplied', accessor: 'supply_count' }
                            ]}
                            data={reports.topVendors}
                        />

                        <ReportTable 
                            title="High Volume Payment Methods (HAVING > 50,000)"
                            description="Revenue grouped by method, filtered by sum > 50k."
                            icon={DollarSign}
                            columns={[
                                { header: 'Payment Method', accessor: 'method' },
                                { header: 'Total Revenue (Rs)', accessor: 'total_revenue', render: r => 'Rs. ' + parseFloat(r.total_revenue).toLocaleString() }
                            ]}
                            data={reports.revenuePerMethod}
                        />

                        <div className="bg-white/5 rounded-xl border border-ez-gold/20 p-6 flex items-center justify-around shadow-lg">
                            <div className="text-center">
                                <p className="text-xs font-mono text-gray-400 mb-1">Most Expensive Animal</p>
                                <p className="text-3xl font-black text-white">Rs. {parseFloat(reports.extremePrices.highest_price).toLocaleString()}</p>
                            </div>
                            <div className="w-px h-16 bg-ez-gold/20"></div>
                            <div className="text-center">
                                <p className="text-xs font-mono text-gray-400 mb-1">Least Expensive Animal</p>
                                <p className="text-3xl font-black text-white">Rs. {parseFloat(reports.extremePrices.lowest_price).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'string_ops' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <ReportTable 
                            title="Name Splitting (SPLIT_PART)"
                            description="Demonstrates using SPLIT_PART() to separate full names."
                            icon={TableIcon}
                            columns={[
                                { header: 'Full Name', accessor: 'full_name' },
                                { header: 'First Name', accessor: 'first_name', render: r => <span className="text-ez-gold">{r.first_name}</span> },
                                { header: 'Last Name', accessor: 'last_name', render: r => <span className="text-ez-gold">{r.last_name || '-'}</span> }
                            ]}
                            data={reports.splitNames}
                        />

                        <ReportTable 
                            title="Tag Length Analysis (LENGTH)"
                            description="Calculates string length for tag_no and sorts by it."
                            icon={TableIcon}
                            columns={[
                                { header: 'Tag No', accessor: 'tag_no' },
                                { header: 'Character Length', accessor: 'tag_length' }
                            ]}
                            data={reports.tagLengths}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReports;
