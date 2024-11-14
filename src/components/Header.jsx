import { useContext } from 'react'
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';
import '../style/Header.css';

export default function Header() {

  const {user} = useContext(UserContext);
  return ( 
      <div>
           <header className="flex items-center justify-between head">
          <Link to={'/'} className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12 text-white -rotate-90 bg-primary rounded-full">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
            <span className="font-bold text-xl">airwnw</span>
          </Link>
          <div className="flex gap-6 border border-color-gray-400 rounded-full px-6 py-2 shadow-md shadow-gray-300 search">
            <div>Anywhere</div>
            <div className='border-r border-color-gray-500'></div>
            <div>Any week</div>
            <div className='border-r border-color-gray-500'></div>
            <div>Add guests</div>
            <button type="button" className="bg-primary text-white rounded-full p-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </div>
          <Link to={user?'/account/profile':'/login'} className='flex gap-2 border border-color-gray-400 rounded-full px-4 py-2 max-sm:px-2 max-sm:py-1' role='login'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 max-sm:hidden" role='menu-burger'>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6" role='user-profile'>
              <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
            </svg>
            {
              !!user && (
                <div role='username'>
                  {user.name}
                </div>
              )
            }
          </Link>
        </header>
        <div className="flex gap-6 border border-color-gray-400 rounded-full px-6 py-2 shadow-md shadow-gray-300 max-sm:hidden w-[90%] max-sm:w-full max-md:text-[14px] max-md:justify-center max-md:mt-[10px]
          max-md:mx-[5%] max-sm:mx-[1%]
        ">
            <div>where</div>
            <div className='border-r border-color-gray-500'></div>
            <div> week</div>
            <div className='border-r border-color-gray-500'></div>
            <div> guests</div>
            <button type="button" className="bg-primary text-white rounded-full p-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </div>
      </div>
    )
  }
