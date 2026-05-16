import { useState, useMemo } from 'react';
import { masterData, Company } from '../data/masterData';
import { Search, Filter } from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';

export default function CompaniesTable() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [aiFilter, setAiFilter] = useState('All');

  const columns: ColumnDef<Company>[] = [
    { accessorKey: 'name', header: 'Company' },
    {
      accessorKey: 'website',
      header: 'Website',
      cell: ({ row }) => {
        const url = row.original.website;
        if (!url) return <span className="text-zinc-500 text-sm">—</span>;
        const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
        let display = url.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/$/, '');
        if (display.length > 28) display = display.slice(0, 27) + '…';
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline text-sm"
            title={url}
          >
            {display}
          </a>
        );
      },
    },
    { accessorKey: 'city', header: 'Location' },
    { accessorKey: 'distance', header: 'Distance to FC' },
    { accessorKey: 'size', header: 'Size' },
    { accessorKey: 'specialties', header: 'Specialties' },
    { 
      accessorKey: 'aiConnection', 
      header: 'AI / Data Center',
      cell: info => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          info.getValue() === 'Yes – Strong' ? 'bg-emerald-500/20 text-emerald-400' : 
          info.getValue().includes('Tangential') ? 'bg-amber-500/20 text-amber-400' : 
          'bg-zinc-700 text-zinc-400'
        }`}>
          {info.getValue()}
        </span>
      )
    },
    { accessorKey: 'rating', header: 'Rating' },
    { 
      accessorKey: 'score', 
      header: 'Score',
      cell: info => <span className="font-bold text-lg">{info.getValue()}</span>
    },
    {
      id: 'actions',
      header: 'Careers',
      cell: ({ row }) => row.original.careersLink ? (
        <a href={row.original.careersLink} target="_blank" className="text-blue-400 hover:underline text-sm">
          Apply →
        </a>
      ) : <span className="text-zinc-500 text-sm">—</span>
    }
  ];

  const filteredData = useMemo(() => {
    let data = [...masterData];
    if (aiFilter !== 'All') {
      data = data.filter(c => c.aiConnection === aiFilter || 
        (aiFilter === 'Strong' && c.aiConnection.includes('Strong')));
    }
    return data;
  }, [aiFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-zinc-500" size={20} />
          <input
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Search companies..."
            className="w-full bg-zinc-900 border border-zinc-700 pl-10 py-3 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={18} />
          <select
            value={aiFilter}
            onChange={(e) => setAiFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 px-4 py-3 rounded-xl"
          >
            <option value="All">All AI Levels</option>
            <option value="Yes – Strong">Strong AI/Data Center</option>
            <option value="Tangential">Tangential</option>
            <option value="None">None</option>
          </select>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-b border-zinc-800">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-6 py-4 text-left text-sm font-medium text-zinc-400 cursor-pointer hover:text-white"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}