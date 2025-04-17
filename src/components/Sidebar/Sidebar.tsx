import { NavLink } from "react-router-dom";
import './Sidebar.scss';
import { Icon } from '@iconify/react';

const Sidebar: React.FC = () => {
  const pages: {name: string, link?: string, icon?: string }[] = [
    {name: 'Home'},
    {name: 'Dashboard'},
    {name: 'Inbox'},
    {name: 'Products'},
    {name: 'Invoices'},
    {name: 'Customers'},
    {name: 'Chat Room'},
    {name: 'Calendar'},
    {name: 'Help Center'},
    {name: 'Settings'},
  ];

  return (
    <div className='sidebar fixed w-[260px] bg-[#44415e] h-screen z-50'>
        <div className='sidebar-header h-[70px] bg-[#3d3b53] text-white uppercase font-bold tracking-widest'>
          Impekable
        </div>
        <div>
          <ul className="sidebar-list flex flex-col">
            {pages.map(page => (
              <NavLink key={page.name} to={page.link ? page.link : '#'} className="sidebar-link relative hover:no-underline text-decoration-none hover:bg-[#3d3b53]">
                <div className='py-6'>
                  {page.icon && <Icon icon={page.icon} width={24} height={24} />} 
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