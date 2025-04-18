import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar/Sidebar'
import { Header } from './components/Header/Header'

export const App = () => {
  const location = useLocation(); 

  const currentPage = location.pathname.replace('/', '') || 'calendar';

  return (
    <>
      <Sidebar />
      <div className='flex-1 ml-[260px] bg-[#F0F0F7] h-full'>
        <Header />
        <div className='main-wrapper px-[70px] pt-[102px] pb-10 h-full'>
          <h1 className='text-2xl capitalize mb-8'>{currentPage}</h1>
          <div className='content-wrapper overflow-auto p-[20px] bg-white shadow'>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
