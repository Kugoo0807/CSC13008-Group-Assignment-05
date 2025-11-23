import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ShippingForm, ShippingStorage } from './shipping.jsx'

function App() {
  const [tab, setTab] = useState('form');

  return(
    <div className='min-h-screen bg-gray-100 py-8 px-4'>
      <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6'>
        <h1 className='text-3xl font-bold text-gray-800 mb-8 text-center'>Quản lý đơn hàng</h1>
        
        <div className='flex gap-4 mb-6'>
          <button 
            onClick={() => setTab('form')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              tab === 'form' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tạo đơn mới
          </button>
          <button 
            onClick={() => setTab('storage')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              tab === 'storage' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Quản lý đơn
          </button>
        </div>

        {/* Hiển thị tab */}
        <div className='mt-6'>
          {tab === "form" && <ShippingForm />}
          {tab === "storage" && <ShippingStorage />}
        </div>
      </div>
    </div>
  );
}

export default App