import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ShippingForm, ShippingStorage } from './shipping.jsx'

function App() {
  const [tab, setTab] = useState('form');

    return(
        <div className='flex flex-col gap-4'>
            <div className='flex gap-4'>
                <button onClick={() => setTab('form')}>
                    Tạo đơn mới
                </button>
               <button onClick={() => setTab('storage')}>
                    Quản lý đơn
                </button>
            </div>

            {/* Hiển thị tab */}
            {tab === "form" && <ShippingForm />}
            {tab === "storage" && <ShippingStorage />}
        </div>
    );
}

export default App