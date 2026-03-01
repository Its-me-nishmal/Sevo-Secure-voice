export const LogoIcon = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="2" width="18" height="20" rx="9" stroke="url(#logo_grad)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M8 9V15M12 6V18M16 10V14" stroke="url(#logo_grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
            <linearGradient id="logo_grad" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#41D1FF" />
                <stop offset="1" stopColor="#BD34FE" />
            </linearGradient>
        </defs>
    </svg>
);

export const SearchIcon = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 20L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const MessageIcon = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M21 11.5C21 16.1944 16.9706 20 12 20C10.6698 20 9.40552 19.7289 8.27181 19.2435L3 21L4.75653 15.7282C4.27106 14.5945 4 13.3302 4 12C4 7.30558 8.02944 3.5 13 3.5C17.9706 3.5 22 7.30558 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const SettingsIcon = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19.4 15A1.65 1.65 0 0 0 21 13.35V10.65A1.65 1.65 0 0 0 19.4 9C19.1 9 18.85 8.7 18.8 8.4C18.7 7.7 18.45 7.1 18.1 6.5C17.95 6.25 18 5.95 18.2 5.75L20.1 3.85A1.65 1.65 0 0 0 20.1 1.5L18.2 3.4C18 3.6 17.7 3.65 17.45 3.5C16.85 3.15 16.25 2.9 15.55 2.8C15.25 2.75 14.95 2.5 14.95 2.2V0.65A1.65 1.65 0 0 0 13.3 0H10.6A1.65 1.65 0 0 0 8.95 1.65V3.25C8.95 3.55 8.75 3.8 8.45 3.85C7.75 3.95 7.15 4.2 6.55 4.55C6.3 4.7 6 4.65 5.8 4.45L3.9 2.55A1.65 1.65 0 0 0 1.55 2.55L3.45 4.45C3.65 4.65 3.7 4.95 3.55 5.2C3.2 5.8 2.95 6.4 2.85 7.1C2.8 7.4 2.5 7.6 2.2 7.6H0.6A1.65 1.65 0 0 0 -1 9.25V11.95A1.65 1.65 0 0 0 0.65 13.6H2.25C2.55 13.6 2.8 13.8 2.85 14.1C2.95 14.8 3.2 15.4 3.55 16C3.7 16.25 3.65 16.55 3.45 16.75L1.55 18.65A1.65 1.65 0 0 0 1.55 21L3.45 19.1C3.65 18.9 3.95 18.85 4.2 19C4.8 19.35 5.4 19.6 6.1 19.7C6.4 19.75 6.6 20 6.6 20.3V21.85A1.65 1.65 0 0 0 8.25 23.5H10.95A1.65 1.65 0 0 0 12.6 21.85V20.25C12.6 19.95 12.8 19.7 13.1 19.65C13.8 19.55 14.4 19.3 15 18.95C15.25 18.8 15.55 18.85 15.75 19.05L17.65 20.95A1.65 1.65 0 0 0 20 20.95L18.1 19.05C17.9 18.85 17.85 18.55 18 18.3C18.35 17.7 18.6 17.1 18.7 16.4C18.75 16.1 19 15.9 19.3 15.9H20.9A1.65 1.65 0 0 0 22.55 14.25V11.55" transform="translate(1 1) scale(0.9)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const MicIcon = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="9" y="2" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M5 10V11C5 14.866 8.13401 18 12 18C15.866 18 19 14.866 19 11V10M12 18V22M9 22H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const ArrowLeftIcon = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const PlayIcon = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M8 5V19L19 12L8 5Z" />
    </svg>
);

export const PauseIcon = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <rect x="6" y="4" width="4" height="16" rx="1" />
        <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
);

export const StopIcon = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
);

export const SendIcon = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

export const XIcon = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export const LoaderIcon = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-spin ${className}`}>
        <line x1="12" y1="2" x2="12" y2="6"></line>
        <line x1="12" y1="18" x2="12" y2="22"></line>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
        <line x1="2" y1="12" x2="6" y2="12"></line>
        <line x1="18" y1="12" x2="22" y2="12"></line>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
    </svg>
);

export const ShieldAlertIcon = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
);

export const MoreVerticalIcon = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="1.5"></circle>
        <circle cx="12" cy="5" r="1.5"></circle>
        <circle cx="12" cy="19" r="1.5"></circle>
    </svg>
);

export const UserCheckIcon = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <polyline points="16 11 18 13 22 9"></polyline>
    </svg>
);

export const UserIcon = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

export const ShieldIcon = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
);

export const InfoIcon = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);

export const ToggleRightIcon = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect>
        <circle cx="16" cy="12" r="3" fill="currentColor"></circle>
    </svg>
);

export const ToggleLeftIcon = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect>
        <circle cx="8" cy="12" r="3" fill="currentColor"></circle>
    </svg>
);
