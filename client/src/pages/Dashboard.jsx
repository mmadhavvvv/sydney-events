import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, Filter, Calendar, MapPin, ExternalLink, RefreshCw, CheckCircle, AlertCircle, X } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        city: '',
        search: '',
        status: '',
        startDate: '',
        endDate: ''
    });
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, [filters]);

    // Debounce search slightly in real app, but let's keep simple
    const fetchEvents = async () => {
        try {
            setLoading(true);
            const res = await api.get('/events', { params: filters });
            setEvents(res.data.events);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.patch(`/events/${id}/status`, { status });
            setEvents(events.map(e => e._id === id ? { ...e, status } : e));
            if (selectedEvent && selectedEvent._id === id) {
                setSelectedEvent({ ...selectedEvent, status });
            }
        } catch (err) {
            console.error(err);
            alert('Failed to update status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'imported': return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'inactive': return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
            case 'updated': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
            default: return 'bg-neutral-800 text-neutral-400';
        }
    };

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6 overflow-hidden">
            {/* Main List Area */}
            <div className={`flex-1 flex flex-col bg-neutral-800/50 border border-neutral-700 rounded-2xl overflow-hidden transition-all duration-300 ${selectedEvent ? 'w-2/3' : 'w-full'}`}>

                {/* Toolbar */}
                <div className="p-4 border-b border-neutral-700 bg-neutral-800/80 backdrop-blur-sm flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 flex-1 max-w-sm">
                        <Search className="w-4 h-4 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-neutral-500"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-2">
                        <select
                            className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-300 outline-none focus:border-rose-500"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                            <option value="">All Status</option>
                            <option value="new">New</option>
                            <option value="imported">Imported</option>
                            <option value="updated">Updated</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <button onClick={fetchEvents} className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white transition-colors">
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Table / List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500"></div>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-neutral-900/50 text-neutral-400 text-xs uppercase sticky top-0 z-10 backdrop-blur-md">
                                <tr>
                                    <th className="p-4 font-medium border-b border-neutral-700">Status</th>
                                    <th className="p-4 font-medium border-b border-neutral-700">Title</th>
                                    <th className="p-4 font-medium border-b border-neutral-700">Date</th>
                                    <th className="p-4 font-medium border-b border-neutral-700 hidden mobile:table-cell">Venue</th>
                                    <th className="p-4 font-medium border-b border-neutral-700 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-700/50">
                                {events.map((event) => (
                                    <tr
                                        key={event._id}
                                        onClick={() => setSelectedEvent(event)}
                                        className={`
                                    cursor-pointer transition-colors hover:bg-neutral-700/30 
                                    ${selectedEvent?._id === event._id ? 'bg-rose-500/10 hover:bg-rose-500/20' : ''}
                                `}
                                    >
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(event.status)}`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="p-4 font-medium text-neutral-200 line-clamp-1 max-w-[200px]">
                                            {event.title}
                                        </td>
                                        <td className="p-4 text-neutral-400 text-sm whitespace-nowrap">
                                            {format(new Date(event.date), 'MMM d, yyyy')}
                                        </td>
                                        <td className="p-4 text-neutral-400 text-sm hidden mobile:table-cell">
                                            {event.venue}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStatusUpdate(event._id, event.status === 'imported' ? 'new' : 'imported');
                                                }}
                                                className={`
                                            p-1.5 rounded-md transition-colors
                                            ${event.status === 'imported'
                                                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                        : 'bg-neutral-700 text-neutral-300 hover:bg-white hover:text-black'}
                                        `}
                                                title={event.status === 'imported' ? "Mark as New" : "Import Event"}
                                            >
                                                {event.status === 'imported' ? <CheckCircle className="w-4 h-4" /> : <div className="text-xs font-bold px-1">IMPORT</div>}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className="p-3 border-t border-neutral-700 bg-neutral-900/50 text-xs text-neutral-500 text-center">
                    Showing {events.length} events
                </div>
            </div>

            {/* Preview Panel */}
            <AnimatePresence mode="popLayout">
                {selectedEvent && (
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        className="w-1/3 bg-neutral-800 border border-neutral-700 rounded-2xl overflow-hidden flex flex-col shadow-2xl relative"
                    >
                        <button
                            onClick={() => setSelectedEvent(null)}
                            className="absolute top-4 right-4 z-10 p-1 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="h-48 relative shrink-0">
                            <img
                                src={selectedEvent.imageUrl || 'https://via.placeholder.com/400x200'}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-800 to-transparent" />
                            <div className="absolute bottom-4 left-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border mb-2 inline-block bg-black/50 backdrop-blur-sm ${getStatusColor(selectedEvent.status)}`}>
                                    {selectedEvent.status}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto">
                            <h2 className="text-2xl font-bold text-white mb-4 leading-tight">{selectedEvent.title}</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-start gap-3 text-neutral-300">
                                    <Calendar className="w-4 h-4 text-rose-500 mt-1" />
                                    <div>
                                        <div className="text-sm font-medium text-neutral-400">Date</div>
                                        <div>{format(new Date(selectedEvent.date), 'PP p')}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 text-neutral-300">
                                    <MapPin className="w-4 h-4 text-rose-500 mt-1" />
                                    <div>
                                        <div className="text-sm font-medium text-neutral-400">Venue</div>
                                        <div>{selectedEvent.venue}</div>
                                        <div className="text-xs text-neutral-500">{selectedEvent.city}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="prose prose-invert prose-sm text-neutral-400 mb-8">
                                {selectedEvent.description}
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => handleStatusUpdate(selectedEvent._id, 'imported')}
                                    className="w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Import to Platform
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(selectedEvent._id, 'inactive')}
                                    className="w-full bg-neutral-700 hover:bg-neutral-600 text-neutral-300 font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    Mark as Inactive
                                </button>
                                <a
                                    href={selectedEvent.sourceUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block w-full text-center text-neutral-500 text-xs hover:text-white transition-colors"
                                >
                                    View Original Source
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
