import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

// Simplified container for less JS execution
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05 // Faster stagger
        }
    }
};

// Simplified item - translate only, no scale
const item = {
    hidden: { opacity: 0, y: 15 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    }
};

const SkeletonCard = () => (
    <div className="bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-700 h-[400px]">
        <div className="h-48 bg-neutral-700/30 animate-pulse" />
        <div className="p-6 space-y-4">
            <div className="h-4 bg-neutral-700/30 rounded w-1/3 animate-pulse" />
            <div className="h-6 bg-neutral-700/30 rounded w-3/4 animate-pulse" />
            <div className="space-y-2 pt-2">
                <div className="h-3 bg-neutral-700/30 rounded animate-pulse" />
                <div className="h-3 bg-neutral-700/30 rounded w-5/6 animate-pulse" />
            </div>
        </div>
    </div>
);

const ImageWithFade = ({ src, alt }) => {
    const [loaded, setLoaded] = useState(false);
    return (
        <div className="w-full h-full bg-neutral-800 relative overflow-hidden">
            <img
                src={src}
                alt={alt}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                className={`
          w-full h-full object-cover transition-opacity duration-500 ease-in-out
          ${loaded ? 'opacity-100' : 'opacity-0'}
        `}
            />
        </div>
    );
};

export default function Home() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [city, setCity] = useState('Sydney');

    useEffect(() => {
        fetchEvents();
    }, [city]);

    const fetchEvents = async () => {
        try {
            const res = await api.get('/events', { params: { city } });
            setEvents(res.data.events.filter(e => e.status !== 'inactive'));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div>
            <header className="mb-12 text-center">
                <div className="h-10 w-48 bg-neutral-800 rounded mx-auto mb-4 animate-pulse" />
                <div className="h-4 w-64 bg-neutral-800 rounded mx-auto animate-pulse" />
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => <SkeletonCard key={n} />)}
            </div>
        </div>
    );

    return (
        <div>
            <header className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-300 mb-3 tracking-tight">
                    Sydney Events
                </h1>
                <p className="text-neutral-400 text-lg">
                    Curated events from across the city.
                </p>
            </header>

            {/* Use standard CSS grid for layout stability */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {events.map((event) => (
                    <motion.div
                        key={event._id}
                        variants={item}
                        // Removed backdrop-blur, simplified shadows and transitions
                        className="group flex flex-col bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden hover:border-neutral-600 transition-colors duration-200"
                    >
                        <div className="aspect-video w-full overflow-hidden bg-neutral-900 relative">
                            {event.imageUrl ? (
                                <ImageWithFade src={event.imageUrl} alt={event.title} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-600 bg-neutral-800 text-sm">
                                    No Image
                                </div>
                            )}
                            <div className="absolute top-3 right-3 bg-neutral-900/90 px-2 py-0.5 rounded text-[10px] font-semibold text-white border border-white/10 tracking-wide uppercase">
                                {event.source}
                            </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex items-center gap-1.5 text-rose-400 mb-2 text-xs font-semibold uppercase tracking-wide">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{format(new Date(event.date), 'MMM d • h:mm a')}</span>
                            </div>

                            <h3 className="text-lg font-bold text-neutral-100 mb-2 line-clamp-2 leading-tight group-hover:text-rose-400 transition-colors">
                                {event.title}
                            </h3>

                            <div className="flex items-center gap-1.5 text-neutral-500 mb-3 text-xs">
                                <MapPin className="w-3.5 h-3.5" />
                                <span className="line-clamp-1">{event.venue}</span>
                            </div>

                            <p className="text-neutral-400 text-sm line-clamp-2 mb-4 flex-1">
                                {event.description}
                            </p>

                            <Link
                                to={`/event/${event._id}`}
                                className="
                  mt-auto text-center w-full py-2.5 rounded-lg text-sm font-semibold
                  bg-neutral-700 text-white hover:bg-neutral-600 active:bg-neutral-800
                  transition-colors
                "
                            >
                                Get Tickets
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
