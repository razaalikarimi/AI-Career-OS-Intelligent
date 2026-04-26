import Link from 'next/link';

const Sidebar = () => {
    const menuItems = [
        { name: 'Dashboard', icon: '📊', path: '/dashboard' },
        { name: 'Resume Intelligence', icon: '🧠', path: '/dashboard/resume' },
        { name: 'Skill Gap', icon: '📈', path: '/dashboard/skills' },
        { name: 'Study Planner', icon: '📚', path: '/dashboard/study' },
        { name: 'Interview Lab', icon: '🎙️', path: '/dashboard/interview' },
        { name: 'Job Matching', icon: '💼', path: '/dashboard/jobs' },
    ];

    return (
        <aside className="w-64 bg-[#0a0a0c] border-r border-border h-screen sticky top-0 flex flex-col p-6">
            <div className="mb-10">
                <h1 className="text-xl font-bold gradient-text">AI Career OS</h1>
            </div>
            
            <nav className="flex-1">
                <ul className="space-y-4">
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            <Link href={item.path} className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-secondary text-gray-400 hover:text-white transition-all">
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="pt-6 border-t border-border mt-auto">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold">
                        AR
                    </div>
                    <div>
                        <p className="text-sm font-semibold">Ali Raza</p>
                        <p className="text-xs text-gray-500">Pro Member</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
