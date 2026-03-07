import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils.js";

export function NavBar({ items, className }) {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(() => {
        const current = items.find(i => location.pathname === i.url || location.pathname.startsWith(i.url + '/'));
        return current ? current.name : items[0].name;
    });

    useEffect(() => {
        const current = items.find(i => location.pathname === i.url || location.pathname.startsWith(i.url + '/'));
        if (current) {
            setActiveTab(current.name);
        }
    }, [location.pathname, items]);

    return (
        <div className={cn("tubelight-nav-wrapper", className)}>
            <style>{`
        .tubelight-nav-wrapper {
           position: fixed;
           bottom: 1.5rem;
           left: 50%;
           transform: translateX(-50%);
           z-index: 50;
        }
        @media (min-width: 640px) {
           .tubelight-nav-wrapper {
               bottom: auto;
               top: 0;
               padding-top: 1.5rem;
           }
        }
        
        .tubelight-pill-container {
           display: flex;
           align-items: center;
           gap: 12px;
           background: rgba(10, 15, 30, 0.4);
           border: 1px solid rgba(255, 255, 255, 0.1);
           backdrop-filter: blur(16px);
           -webkit-backdrop-filter: blur(16px);
           padding: 6px;
           border-radius: 9999px;
           box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
        }

        .tubelight-item {
           position: relative;
           cursor: pointer;
           font-size: 0.875rem;
           font-weight: 600;
           padding: 8px 24px;
           border-radius: 9999px;
           transition: color 0.15s ease-in-out;
           color: #94a3b8;
           text-decoration: none;
           display: flex;
           align-items: center;
           justify-content: center;
        }
        @media (max-width: 767px) {
           .tubelight-item {
               padding: 10px 16px;
           }
        }

        .tubelight-item:hover {
           color: #06b6d4;
        }
        .tubelight-item.active {
           color: #06b6d4;
           background: rgba(255, 255, 255, 0.05);
        }

        .tubelight-text {
           display: none;
        }
        .tubelight-icon {
           display: flex;
           align-items: center;
           justify-content: center;
        }
        @media (min-width: 768px) {
           .tubelight-text {
               display: inline;
           }
           .tubelight-icon {
               display: none;
           }
        }

        .tubelight-lamp-container {
           position: absolute;
           inset: 0;
           width: 100%;
           height: 100%;
           background: rgba(6, 182, 212, 0.05);
           border-radius: 9999px;
           z-index: -10;
        }
        
        .tubelight-lamp-top {
           position: absolute;
           top: -8px;
           left: 50%;
           transform: translateX(-50%);
           width: 32px;
           height: 4px;
           background: #06b6d4;
           border-top-left-radius: 9999px;
           border-top-right-radius: 9999px;
        }

        .tubelight-lamp-glow-1 {
           position: absolute;
           width: 48px;
           height: 24px;
           background: rgba(6, 182, 212, 0.2);
           border-radius: 9999px;
           filter: blur(12px);
           top: -8px;
           left: -8px;
        }
        .tubelight-lamp-glow-2 {
           position: absolute;
           width: 32px;
           height: 24px;
           background: rgba(6, 182, 212, 0.2);
           border-radius: 9999px;
           filter: blur(12px);
           top: -4px;
           left: 0;
        }
        .tubelight-lamp-glow-3 {
           position: absolute;
           width: 16px;
           height: 16px;
           background: rgba(6, 182, 212, 0.2);
           border-radius: 9999px;
           filter: blur(4px);
           top: 0;
           left: 8px;
        }
      `}</style>
            <div className="tubelight-pill-container">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.name;

                    return (
                        <Link
                            key={item.name}
                            to={item.url}
                            onClick={() => setActiveTab(item.name)}
                            className={cn("tubelight-item", isActive && "active")}
                        >
                            <span className="tubelight-text">{item.name}</span>
                            <span className="tubelight-icon">
                                <Icon size={20} strokeWidth={2.5} />
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="lamp"
                                    className="tubelight-lamp-container"
                                    initial={false}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                    }}
                                >
                                    <div className="tubelight-lamp-top">
                                        <div className="tubelight-lamp-glow-1" />
                                        <div className="tubelight-lamp-glow-2" />
                                        <div className="tubelight-lamp-glow-3" />
                                    </div>
                                </motion.div>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
