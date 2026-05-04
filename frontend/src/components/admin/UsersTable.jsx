import React from 'react';

const UsersTable = ({ users }) => {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg mt-6">
      <table className="min-w-full text-left">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-4">ID</th>
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Phone</th>
            <th className="p-4">Registered Date</th>
          </tr>
        </thead>
        <tbody>
          {users?.map(u => (
            <tr key={u.person_id} className="border-b">
              <td className="p-4">#{u.person_id}</td>
              <td className="p-4 font-semibold text-gray-800">{u.name}</td>
              <td className="p-4 text-gray-600">{u.email}</td>
              <td className="p-4 text-gray-600">{u.phone}</td>
              <td className="p-4">{u.registration_date ? new Date(u.registration_date).toLocaleDateString() : 'N/A'}</td>
            </tr>
          ))}
          {(!users || users.length === 0) && (
             <tr><td colSpan="5" className="p-4 text-center text-gray-500">No users registered yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;