import React from 'react';
import StatusBadge from '../common/StatusBadge';

const ScheduleTable = ({ schedules }) => {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg mt-6">
      <table className="min-w-full text-left">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-4">Sch ID</th>
            <th className="p-4">Animal</th>
            <th className="p-4">Location</th>
            <th className="p-4">Crew</th>
            <th className="p-4">Date & Time</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {schedules?.map(s => (
            <tr key={s.schedule_id} className="border-b">
              <td className="p-4">#{s.schedule_id}</td>
              <td className="p-4">{s.tag_no}</td>
              <td className="p-4">{s.house_name}</td>
              <td className="p-4">{s.butcher_name} Crew</td>
              <td className="p-4 whitespace-nowrap">{new Date(s.slaughter_date).toLocaleDateString()} at {s.slaughter_time?.substring(0, 5)}</td>
              <td className="p-4"><StatusBadge status={s.status} /></td>
            </tr>
          ))}
          {(!schedules || schedules.length === 0) && (
             <tr><td colSpan="6" className="p-4 text-center text-gray-500">No schedules created yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;