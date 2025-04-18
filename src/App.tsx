import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar/Sidebar'
import { Header } from './components/Header/Header'

export const App = () => {
  const location = useLocation(); 

  console.log('location.pathname:', location.pathname)

  const currentPage = location.pathname.replace('/', '') || 'calendar';

  return (
    <>
      <Sidebar />
      <div className='flex-1 ml-[260px] flex flex-col h-screen'>
        <Header />
        <div className='main-wrapper mt-[70px] px-[70px] py-8 bg-[#F0F0F7] flex-1'>
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
