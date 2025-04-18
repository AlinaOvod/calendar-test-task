import { Icon } from '@iconify/react';
import { LifeBuoy, MessageCircle, Bell, ChevronDown } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className="header h-[70px] bg-white px-[20px] py-4 flex items-center justify-between shadow-">
      <div className="header-search w-2/5">
        <label className="flex items-center gap-[10px]">
          <Icon icon="mdi:magnify" className="text-[#BCBCCB] text-2xl" />
          <input
            className="w-full"
            type="text"
            placeholder="Search transactions, invoices or help"
          />
        </label>
      </div>
      <div className="header-left flex items-center">
        <div className="header-action flex gap-[30px] text-[#BCBCCB]">
          <div>
            <LifeBuoy />
          </div>
          <div>
            <MessageCircle />
          </div>
          <div className="relative">
            <Bell />
            <span className="absolute bg-[#FFC06A] border border-2 border-white w-3 h-3 rounded-full top-[-4px] right-[0]"></span>
          </div>
        </div>
        <div className="header-user-info flex items-center text-[#A4AFB7]">
          <div className="ml-5 w-[1px] rounded h-6 bg-[#BCBCCB]"></div>
          <p className="ml-3 capitalize text-[#4D4F5C]">John Doe</p>
          <ChevronDown />
          <img
            src="https://randomuser.me/api/portraits/men/73.jpg"
            className="ml-3 w-9 h-9 rounded-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
