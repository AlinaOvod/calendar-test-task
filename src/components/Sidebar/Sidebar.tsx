import { NavLink, useLocation } from "react-router-dom";
import './Sidebar.scss';
import { JSX } from "react";
import { CalendarDays, ChartNoAxesColumnDecreasing, FileText, House, KeyboardMusic, LifeBuoy, Mail, MessagesSquare, Settings, UserRound } from "lucide-react";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const pages: {name: string, link?: string, icon?: JSX.Element; }[] = [
    {name: 'Home', icon: <House />, link: '/'},
    {name: 'Dashboard', icon: <ChartNoAxesColumnDecreasing />, link: '/dashboard'},
    {name: 'Inbox', icon: <Mail />, link: '/inbox'},
    {name: 'Products', icon: <KeyboardMusic />, link: '/products'},
    {name: 'Invoices', icon: <FileText />, link: '/invoices'},
    {name: 'Customers', icon: <UserRound />, link: '/customers'},
    {name: 'Chat Room', icon: <MessagesSquare />, link: '/chat'},
    {name: 'Calendar', icon: <CalendarDays />, link: '/calendar'},
    {name: 'Help Center', icon: <LifeBuoy />, link: '/help'},
    {name: 'Settings', icon: <Settings />, link: '/settings'},
  ];

  return (
    <div className='sidebar fixed w-[260px] bg-[#44415e] h-screen z-50 overflow-auto'>
        <div className='sidebar-header h-[70px] bg-[#3d3b53] text-white uppercase font-bold tracking-widest'>
          Impekable
        </div>
        <div>
          <ul className="sidebar-list flex flex-col">
            {pages.map(page => (
              <NavLink 
                key={page.name} 
                to={page.link ? page.link : '#'} 
                className={({ isActive }) =>
                  `sidebar-link relative hover:no-underline text-decoration-none hover:bg-[#3d3b53] ${
                    page.link !== '/' && isActive ? 'is-active bg-[#3d3b53]' : ''
                  }
                  ${isHomePage && page.link === '/calendar' && 'is-active bg-[#3d3b53]'}`
                }
              >
                <div className='py-4 flex gap-3 text-[#A5A4BF]'>
                  {page.icon && <span>{page.icon}</span>}
                  <p className='capitalize text-white font-medium'>{page.name}</p>
                </div>
              </NavLink>
            ))}
          </ul>
        </div>

      </div>
  )
}

export default Sidebar;