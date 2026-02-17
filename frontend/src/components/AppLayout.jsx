import BottomNav from './BottomNav';

const AppLayout = ({ children, hideNav }) => {
    return (
        <div className="flex flex-col h-screen h-[100dvh] bg-[#0d1117] text-white overflow-hidden relative font-sans selection:bg-[#41D1FF]/30 supports-[height:100cqh]:h-[100cqh] supports-[height:100svh]:h-[100svh]">
            {/* Background decorative blobs for premium feel */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[30%] bg-[#41D1FF]/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[40%] bg-[#BD34FE]/5 blur-[120px] rounded-full pointer-events-none" />
            
            <main className={`flex-1 overflow-y-auto ${!hideNav ? 'pb-[calc(4rem+env(safe-area-inset-bottom))]' : ''}`}>
                {children}
            </main>

            {!hideNav && (
                <div className="pb-[env(safe-area-inset-bottom)] bg-[#0d1117]/80 backdrop-blur-md border-t border-white/10 fixed bottom-0 left-0 right-0 z-50">
                    <BottomNav />
                </div>
            )}
        </div>
    );
};

export default AppLayout;
