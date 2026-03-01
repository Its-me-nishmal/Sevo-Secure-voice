const AppLayout = ({ children, hideNav }) => {
    return (
        <div className="flex flex-col w-full h-screen h-[100dvh] bg-[var(--color-bg-base)] text-white overflow-hidden relative font-sans selection:bg-[var(--color-primary)]/30 supports-[height:100cqh]:h-[100cqh] supports-[height:100svh]:h-[100svh]">
            {/* Premium Dynamic Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-[var(--color-primary)]/10 blur-[120px] rounded-full pointer-events-none animate-float" />
            <div className="absolute bottom-[10%] right-[-15%] w-[60%] h-[50%] bg-[var(--color-secondary)]/10 blur-[150px] rounded-full pointer-events-none animate-float" style={{ animationDelay: '1.5s' }} />

            <main className="flex-1 overflow-y-auto relative z-10 w-full max-w-screen-md mx-auto flex flex-col">
                {children}
            </main>
        </div>
    );
};

export default AppLayout;
