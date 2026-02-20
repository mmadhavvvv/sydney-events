import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, ExternalLink, Mail, Check } from 'lucide-react';
import { format } from 'date-fns';

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('');
    const [consent, setConsent] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            const res = await api.get(`/events/${id}`);
            setEvent(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Send email to backend
            await api.post(`/events/${id}/subscribe`, { email, consent });

            // Redirect to external source
            if (event.sourceUrl) {
                window.location.href = event.sourceUrl;
            } else {
                alert("Ticket link not available");
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
        </div>
    );

    if (!event) return <div className="text-center mt-20 text-neutral-400">Event not found</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 relative">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 text-neutral-400 hover:text-white flex items-center gap-2 transition-colors"
            >
                ← Back to events
            </button>

            <div className="bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-700 shadow-2xl">
                <div className="relative h-64 md:h-96">
                    <img
                        src={event.imageUrl || 'https://via.placeholder.com/800x400?text=No+Image'}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent opacity-80" />
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="inline-block px-3 py-1 bg-rose-500/20 text-rose-300 text-xs font-semibold rounded-full mb-3 border border-rose-500/30 backdrop-blur-sm">
                            {event.source}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{event.title}</h1>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                            <p className="text-neutral-400 leading-relaxed whitespace-pre-wrap">
                                {event.description || "No description available."}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-700/50 space-y-4">
                            <div className="flex items-start gap-3 text-neutral-300">
                                <Calendar className="w-5 h-5 text-rose-500 mt-0.5" />
                                <div>
                                    <div className="font-medium">Date & Time</div>
                                    <div className="text-sm text-neutral-400 mt-1">
                                        {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
                                        <br />
                                        {format(new Date(event.date), 'h:mm a')}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 text-neutral-300">
                                <MapPin className="w-5 h-5 text-rose-500 mt-0.5" />
                                <div>
                                    <div className="font-medium">Location</div>
                                    <div className="text-sm text-neutral-400 mt-1">
                                        {event.venue}
                                        <br />
                                        {event.city}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowModal(true)}
                                className="w-full bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-rose-500/20 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                            >
                                Get Tickets <ExternalLink className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-neutral-800 rounded-2xl w-full max-w-md border border-neutral-700 shadow-2xl overflow-hidden"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="p-8">
                                <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-rose-500/20">
                                    <Mail className="w-6 h-6 text-rose-500" />
                                </div>

                                <h2 className="text-2xl font-bold text-center mb-2">Almost there!</h2>
                                <p className="text-neutral-400 text-center mb-8 text-sm">
                                    Enter your email to proceed to the ticket page. We'll send you a confirmation.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-1.5">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                                        />
                                    </div>

                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className="relative flex items-center mt-0.5">
                                            <input
                                                type="checkbox"
                                                checked={consent}
                                                onChange={(e) => setConsent(e.target.checked)}
                                                className="peer sr-only"
                                            />
                                            <div className="w-5 h-5 border-2 border-neutral-600 rounded bg-neutral-800 peer-checked:bg-rose-500 peer-checked:border-rose-500 transition-all"></div>
                                            <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 left-0.5 pointer-events-none transition-opacity" />
                                        </div>
                                        <span className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
                                            I agree to receive event updates and news via email.
                                        </span>
                                    </label>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-neutral-200 active:scale-95 transition-all duration-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? 'Redirecting...' : 'Continue to Tickets'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
