import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import provincesJSON from '../province.json';
import wardsJSON from '../ward.json';

function ShippingStorage() {
    const provinces = Object.values(provincesJSON);
    const wards = Object.values(wardsJSON);

    const [data, setData] = useState(() => {
        const saved = localStorage.getItem('data');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('data', JSON.stringify(data));
    }, [data]);

    function removerShip(index) {
        const newData = data.filter((_, i) => i !== index);
        setData(newData);
    }

    return (
        <div className='space-y-4'>
            <h2 className='text-2xl font-semibold text-gray-700 mb-4'>Danh sách đơn hàng</h2>
            {data.length === 0 ? (
                <p className='text-gray-500 text-center py-8'>Chưa có đơn hàng nào</p>
            ) : (
                <ul className='space-y-3'>
                    {data.map((d, index) => (
                        <div key={index} className='flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200'>
                            <li className='flex-1'>
                                <p className='font-semibold text-gray-800'>{d.username} - {d.phone}</p>
                                <p className='text-gray-600 text-sm mt-1'>
                                    {d.home}, 
                                    {wards.find(w => w.code === d.ward)?.name_with_type}, 
                                    {provinces.find(p => p.code === d.province)?.name_with_type}
                                </p>
                            </li>
                            <button 
                                onClick={() => removerShip(index)}
                                className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors ml-4'
                            >
                                Xóa đơn
                            </button>
                        </div>
                    ))}
                </ul>
            )}
        </div>
    );
}

function ShippingForm() {
    const [data, setData] = useState(() => {
        const saved = localStorage.getItem('data');
        return saved ? JSON.parse(saved) : [];
    });

    const provinces = Object.values(provincesJSON);
    const wards = Object.values(wardsJSON);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset
    } = useForm();

    const selectedProvince = watch('province');
    const filteredWard = selectedProvince ? wards.filter((w) => w['parent_code'] === selectedProvince) : [];

    function onSubmit(dat) {
        console.log(dat);
        setData(prev => [...prev, dat]);
        reset();
    }

    useEffect(() => {
        localStorage.setItem('data', JSON.stringify(data));
    }, [data]);

    return(
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 max-w-2xl mx-auto'>
            <h2 className='text-2xl font-semibold text-gray-700 mb-6'>Tạo đơn hàng mới</h2>
            
            {/* Tên */}
            <div>
                <input
                    {...register('username', { required: true })}
                    placeholder='Họ và tên...'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
                {errors.username && <p className='text-red-500 text-sm mt-1'>Vui lòng nhập tên</p>}
            </div>

            {/* Số điện thoại */}
            <div>
                <input
                    {...register('phone', { 
                        required: true, 
                        pattern: /^\d{10,11}$/
                    })}
                    placeholder='Số điện thoại...'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
                {errors.phone && <p className='text-red-500 text-sm mt-1'>Số điện thoại không hợp lệ (10-11 số)</p>}
            </div>

            {/* Tỉnh/Thành */}
            <div>
                <select 
                    {...register('province', { required: true })}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                    <option value=''>-- Chọn tỉnh/thành --</option>
                    {provinces.map((p) => (
                        <option key={String(p.code)} value={p.code}>{p.name_with_type}</option>
                    ))}
                </select>
                {errors.province && <p className='text-red-500 text-sm mt-1'>Vui lòng chọn tỉnh/thành</p>}
            </div>

            {/* Phường/Xã */}
            <div>
                <select 
                    {...register('ward', { required: true })} 
                    disabled={!selectedProvince}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed'
                >
                    <option value=''>-- Chọn phường/xã --</option>
                    {filteredWard.map((w) => (
                        <option key={String(w.code)} value={w.code}>{w.name_with_type}</option>
                    ))}
                </select>
                {errors.ward && <p className='text-red-500 text-sm mt-1'>Vui lòng chọn phường/xã</p>}
            </div>

            {/* Số nhà, đường */}
            <div>
                <input
                    {...register('home', { required: true })}
                    placeholder='Số nhà, tên đường...'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
                {errors.home && <p className='text-red-500 text-sm mt-1'>Vui lòng nhập địa chỉ</p>}
            </div>

            {/* Cam kết */}
            <div className='flex items-center space-x-3'>
                <input 
                    type='checkbox' 
                    {...register('agree', { required: true })}
                    className='w-5 h-5 text-blue-600 rounded focus:ring-blue-500'
                />
                <label className='text-gray-700'>
                    Tôi cam kết những thông tin vừa điền là chính xác
                </label>
            </div>
            {errors.agree && <p className='text-red-500 text-sm'>Vui lòng xác nhận cam kết</p>}

            <button 
                type='submit' 
                className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
                Tạo đơn hàng
            </button>
        </form>
    )
}

export { ShippingForm, ShippingStorage };