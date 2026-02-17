import BottomNav from './BottomNav';

const AppLayout = ({ children, hideNav }) => {
    return (
        <div className="flex flex-col h-screen bg-[#0d1117] text-white overflow-hidden relative font-sans selection:bg-[#41D1FF]/30">
            {/* Background decorative blobs for premium feel */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[30%] bg-[#41D1FF]/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[40%] bg-[#BD34FE]/5 blur-[120px] rounded-full pointer-events-none" />
            
            <main className={`flex-1 overflow-y-auto ${!hideNav ? 'pb-20' : ''}`}>
                {children}
            </main>

            {!hideNav && <BottomNav />}
        </div>
    );
};

export default AppLayout;
