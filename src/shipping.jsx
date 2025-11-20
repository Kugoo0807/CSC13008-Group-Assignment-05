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
        <div>
            <ul>
                {data.map((d, index) => (
                    <div key={index} className='flex gap-4'>
                        <li>
                            <p>{d.username} - {d.phone}</p>
                            <p>
                                {d.home}, 
                                {wards.find(w => w.code === d.ward)?.name_with_type}, 
                                {provinces.find(p => p.code === d.province)?.name_with_type}
                            </p>
                        </li>
                        <button onClick={() => removerShip(index)}>Xóa đơn</button>
                    </div>
                ))}
            </ul>
        </div>
    );
}

// Shipping Form
function ShippingForm() {
    const [data, setData] = useState(() => {
        const saved = localStorage.getItem('data');
        return saved ? JSON.parse(saved) : [];
    });

    // --------------------------------------------
    const provinces = Object.values(provincesJSON);
    const wards = Object.values(wardsJSON);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset
    } = useForm();

    // Tỉnh/Thành
    const selectedProvince = watch('province');
    
    // Lựa chọn ward dựa vào province
    const filteredWard = selectedProvince ? wards.filter((w) => w['parent_code'] === selectedProvince) : [];

    // Lưu trữ đơn
    function onSubmit(dat) {
        console.log(dat);
        setData(prev => [...prev, dat]);
        reset();
    }
    useEffect(() => {
        localStorage.setItem('data', JSON.stringify(data));
    }, [data]);

    return(
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            {/* Tên */}
            <input
                {...register('username', { required: true })}
                placeholder='Tên...'
            />
            {errors.username && <p className='text-red-500'>Bắt buộc</p>}

            {/* Số điện thoại */}
            <input
                {...register('phone', { 
                    required: true, 
                    pattern: /^\d{10,11}$/
                })}
                placeholder='Số điện thoại...'
            />
            {errors.phone && <p className='text-red-500'>Sai định dạng</p>}

            {/* Tỉnh/Thành */}
            <select {...register('province', { required: true })}>
                <option value=''>-- Lựa chọn tỉnh/thành --</option>
                
                {provinces.map((p) => (
                    <option key={String(p.code)} value={p.code}>{p.name_with_type}</option>
                ))}
            </select>
            {errors.province && <p className='text-red-500'>Bắt buộc</p>}

            {/* Phường */}
            <select {...register('ward', { required: true })} disabled={!selectedProvince}>
                <option value=''>-- Choose ward --</option>
                
                {filteredWard.map((w) => (
                    <option key={String(w.code)} value={w.code}>{w.name_with_type}</option>
                ))}
            </select>
            {errors.ward && <p className='text-red-500'>Bắt buộc</p>}

            {/* Số nhà, đường */}
            <input
                {...register('home', { required: true })}
                placeholder='Số nhà, đường...'
            />
            {errors.home && <p className='text-red-500'>Bắt buộc</p>}

            {/* Cam kết */}
            <label>
                <input type='checkbox' {...register('agree', { required: true })} />
                Tôi cam kết những thông tin vừa điền là chính xác
            </label>
            {errors.agree && <p className='text-red-500'>Bắt buộc</p>}

            <button type='submit' className='bg-blue-600 p-2 rounded text-white'>
                Gửi
            </button>
        </form>
    )
}

export { ShippingForm, ShippingStorage };