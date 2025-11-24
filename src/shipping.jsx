import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import provincesJSON from '../province.json';
import wardsJSON from '../ward.json';
import { Trash2, Package, MapPin, Phone, User, CheckCircle, PlusSquare } from 'lucide-react';

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

    function removeShip(index) {
        const newData = data.filter((_, i) => i !== index);
        setData(newData);
    }

    return (
        <div className='space-y-4'>
            <div>
                <h2 className='text-2xl font-semibold text-gray-700 mb-4'>
                    <Package className="text-blue-600" />
                    Danh sách đơn hàng    
                </h2>
                <p className="text-sm text-gray-500 mt-1">Quản lý các đơn hàng đã tạo</p>
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                {data.length} Đơn
            </span>

            <div className="p-6">
                {data.length === 0 ? (
                    <div className='text-center py-12 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50'>
                        <Package size={48} className="mb-3 opacity-50" />
                        <p>Chưa có đơn hàng nào</p>
                    </div>
                ) : (
                    <ul className='space-y-3'>
                        {data.map((d, index) => (
                            <div key={index} className='flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200'>
                                <li className='flex-1'>
                                    <div className="flex items-center gap-2 text-gray-800 font-bold text-lg">
                                        <User size={18} className="text-blue-500" />
                                        {d.username}
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-600 font-medium">
                                        <Phone size={16} className="text-green-500" />
                                        {d.phone}
                                    </div>
                                    <div className="flex items-start gap-2 text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                                        <MapPin size={16} className="text-red-500 mt-1 shrink-0" />
                                        <p className="leading-relaxed">
                                            <span className="font-semibold text-gray-700">{d.home}</span><br/>
                                            {wards.find(w => w.code === d.ward)?.name_with_type}, {provinces.find(p => p.code === d.province)?.name_with_type}
                                        </p>
                                    </div>
                                </li>
                                <button 
                                    onClick={() => removeShip(index)}
                                    className='ml-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group-hover:scale-110'
                                    title='Xóa đơn hàng'
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </ul>
                )}
            </div>
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
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden h-fit">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <h2 className='text-xl font-bold flex items-center gap-2'>
                    <PlusSquare className="text-blue-200" />
                    Tạo đơn hàng mới
                </h2>
                <p className="text-blue-100 text-sm mt-1 opacity-90">Điền thông tin người nhận bên dưới</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 max-w-2xl mx-auto p-6'>
                {/* Tên */}
                <div>
                    <input
                        {...register('username', { required: true })}
                        placeholder='Họ và tên...'
                        className='bg-white text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                </div>

                {/* Số điện thoại */}
                <div>
                    <input
                        {...register('phone', { 
                            required: true, 
                            pattern: /^\d{10,11}$/
                        })}
                        placeholder='Số điện thoại...'
                        className='bg-white text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                </div>

                {/* Tỉnh/Thành */}
                <div>
                    <select 
                        {...register('province', { required: true })}
                        className='bg-white text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    >
                        <option value=''>-- Chọn tỉnh/thành --</option>
                        {provinces.map((p) => (
                            <option key={String(p.code)} value={p.code}>{p.name_with_type}</option>
                        ))}
                    </select>
                </div>

                {/* Phường/Xã */}
                <div>
                    <select 
                        {...register('ward', { required: true })} 
                        disabled={!selectedProvince}
                        className='bg-white text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed'
                    >
                        <option value=''>-- Chọn phường/xã --</option>
                        {filteredWard.map((w) => (
                            <option key={String(w.code)} value={w.code}>{w.name_with_type}</option>
                        ))}
                    </select>
                </div>

                {/* Số nhà, đường */}
                <div>
                    <input
                        {...register('home', { required: true })}
                        placeholder='Số nhà, tên đường...'
                        className='bg-white text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                </div>

                {/* Cam kết */}
                <div className='flex items-center space-x-3'>
                    <input 
                        type='checkbox' 
                        {...register('agree', { required: true })}
                        className='bg-white w-5 h-5 text-blue-600 rounded focus:ring-blue-500'
                    />
                    <label className='text-gray-700'>
                        Tôi cam kết những thông tin vừa điền là chính xác
                    </label>
                </div>
                {(errors.username || errors.phone || errors.province || errors.ward || errors.home || errors.agree) && <p className='text-red-500 text-sm'>Vui lòng xác nhận cam kết & Nhập đầy đủ, chính xác thông tin</p>}

                <button 
                    type='submit' 
                    className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                >
                    Tạo đơn hàng
                </button>
            </form>
        </div>
    )
}

export { ShippingForm, ShippingStorage };