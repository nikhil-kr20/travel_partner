import React from "react";
import {
    ArrowRight,
    MapPin,
    Target,
    Crown,
    Star,
    Compass,
    Globe,
    Navigation,
    Heart,
    ShieldCheck,
    Award
} from "lucide-react";
import { AnimatedGradient } from "./animated-gradient-with-svg.jsx";

// --- MOCK BRANDS for Travel ---
const CLIENTS = [
    { name: "Expedia", icon: Globe },
    { name: "Lonely Planet", icon: Compass },
    { name: "TripAdvisor", icon: Navigation },
    { name: "Airbnb", icon: Heart },
    { name: "Booking.com", icon: ShieldCheck },
    { name: "Skyscanner", icon: Award },
];

const StatItem = ({ value, label }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'default', transition: 'transform 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>{value}</span>
        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', fontWeight: 600 }}>{label}</span>
    </div>
);

export default function AuthHero({ onLoginClick, onSignupClick }) {
    return (
        <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflowX: 'hidden', overflowY: 'auto', color: 'white', display: 'flex', flexDirection: 'column', padding: '40px' }}>
            <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-fade-in {
          animation: fadeSlideIn 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>

            {/* Dark elegant polite background */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                zIndex: 0,
            }} />

            {/* Polite/gentle animated gradient blobs */}
            <AnimatedGradient
                colors={['#38bdf8', '#818cf8', '#2dd4bf', '#a78bfa']} // softer, polite colors
                speed={0.02}
                blur="heavy"
            />

            {/* Background Image with Gradient Mask */}
            <div
                style={{
                    position: 'absolute', inset: 0, opacity: 0.15, zIndex: 0,
                    backgroundImage: 'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80)',
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    maskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
                    WebkitMaskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
                }}
            />

            <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '100%', flex: 1, justifyContent: 'center' }}>

                {/* Brand / Logo */}
                <div className="animate-fade-in delay-100" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'auto', paddingTop: '10px' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #38bdf8, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <Compass size={20} />
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>TravelPartner</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '20px' }}>

                    {/* Badge */}
                    <div className="animate-fade-in delay-200">
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 9999,
                            border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
                            padding: '6px 14px', backdropFilter: 'blur(10px)', transition: 'background 0.2s', cursor: 'default'
                        }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 6 }}>
                                Top Rated Travel App
                                <Star size={14} color="#facc15" fill="#facc15" />
                            </span>
                        </div>
                    </div>

                    {/* Heading */}
                    <h1
                        className="animate-fade-in delay-300"
                        style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0,
                            maskImage: "linear-gradient(180deg, black 0%, black 80%, transparent 100%)",
                            WebkitMaskImage: "linear-gradient(180deg, black 0%, black 80%, transparent 100%)"
                        }}
                    >
                        Crafting Travel<br />
                        <span style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', color: 'transparent', display: 'inline-block' }}>
                            Experiences
                        </span><br />
                        That Matter
                    </h1>

                    {/* Description */}
                    <p className="animate-fade-in delay-400" style={{ maxWidth: '450px', fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0, marginBottom: '24px' }}>
                        We connect you with trusted companions and seamless rides, creating safe, unforgettable journeys that you'll cherish forever.
                    </p>

                    {/* CTA Buttons */}
                    <div className="animate-fade-in delay-500" style={{ display: 'flex', gap: '16px' }}>
                        <button
                            onClick={onSignupClick}
                            style={{
                                padding: '14px 28px',
                                background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                                borderRadius: '9999px',
                                border: 'none',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '1rem',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                            Get Started <ArrowRight size={18} />
                        </button>
                        <button
                            onClick={onLoginClick}
                            style={{
                                padding: '14px 28px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '9999px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '1rem',
                                cursor: 'pointer',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.2s ease'
                            }}>
                            Sign In
                        </button>
                    </div>
                </div>

                {/* --- STATS & MARQUEE --- */}
                <div style={{ marginTop: 'auto', paddingTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Stats Card */}
                    <div className="animate-fade-in delay-500" style={{
                        position: 'relative', overflow: 'hidden', borderRadius: '24px',
                        border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
                        padding: '24px', backdropFilter: 'blur(20px)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                    }}>
                        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', filter: 'blur(30px)', pointerEvents: 'none' }} />

                        <div style={{ position: 'relative', zIndex: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', width: '48px', height: '48px', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                                    <Target size={24} color="white" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', lineHeight: 1 }}>100K+</div>
                                    <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>Journeys Completed</div>
                                </div>
                            </div>

                            {/* Progress Bar Section */}
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '10px' }}>
                                    <span style={{ color: '#94a3b8' }}>Community Trust Score</span>
                                    <span style={{ color: 'white', fontWeight: 600 }}>99%</span>
                                </div>
                                <div style={{ height: '6px', width: '100%', borderRadius: '9999px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: '99%', borderRadius: '9999px', background: 'linear-gradient(to right, #38bdf8, #818cf8)' }} />
                                </div>
                            </div>

                            <div style={{ height: '1px', width: '100%', background: 'rgba(255,255,255,0.1)', marginBottom: '20px' }} />

                            {/* Mini Stats Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: '8px', alignItems: 'center' }}>
                                <StatItem value="50+" label="Countries" />
                                <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }} />
                                <StatItem value="24/7" label="Support" />
                                <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }} />
                                <StatItem value="100%" label="Verified" />
                            </div>
                        </div>
                    </div>

                    {/* Marquee Card */}
                    <div className="animate-fade-in delay-500" style={{
                        position: 'relative', overflow: 'hidden', borderRadius: '24px',
                        border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)',
                        padding: '24px 0', backdropFilter: 'blur(20px)'
                    }}>
                        <h3 style={{ margin: '0 0 20px 24px', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>Trusted by Travel Leaders</h3>

                        <div style={{
                            position: 'relative', display: 'flex', overflow: 'hidden',
                            maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
                            WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)'
                        }}>
                            <div className="animate-marquee" style={{ display: 'flex', gap: '48px', padding: '0 24px' }}>
                                {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.5, transition: 'all 0.3s', cursor: 'default', whiteSpace: 'nowrap' }}
                                        onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.transform = 'scale(1.05)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.opacity = 0.5; e.currentTarget.style.transform = 'scale(1)'; }}>
                                        <client.icon size={20} color="white" />
                                        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>
                                            {client.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
