import { useState } from 'react';
import logo from '../assets/mainLogoTagly.svg';
import Register from './Register';

export default function Login({ onLoginSuccess }){

    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        onLoginSuccess();
    };

    return (
        <div className="flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-20 bg-white min-h-screen px-4">

            <div className="text-center lg:text-left">
                <img src={logo} alt='logo' className='h-20 mx-auto lg:mx-0'/>
                <h1 className="text-4xl font-normal mt-4">Bringing people closer together,<br/> one post at a time.</h1>
            </div>

            <div className='w-full lg:w-4/12 flex justify-center'>
                <form className="flex flex-col gap-4 p-8 bg-white shadow-lg rounded" style={{ width: '550px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)' }}>
                    <input 
                        required
                        type="email" 
                        placeholder="Email address"
                        className="input-default p-3 text-2xl rounded"
                    />
                    <input 
                        required
                        type="password" 
                        placeholder="Password"
                        className="input-default p-3 text-2xl rounded"
                    />
                    <button 
                        type="submit"
                        className="bg-teal-600 hover:bg-teal-700 text-white p-3 text-2xl font-bold rounded"
                    >
                        Log in
                    </button>
                    <a href="" className='w-max mx-auto text-center font-bold text-teal-700 text-xl hover:underline'>forgot password?</a>
                    <hr/>
                    <div className='flex justify-center mt-6 mb-6'>
                        <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 w-1/2 text-white p-3 text-xl font-bold rounded"
                        onClick={() => setIsRegisterOpen(true)}
                        >
                            Create new account
                        </button>
                    </div>
                </form>
            </div>
            {isRegisterOpen && <Register onClose={() => setIsRegisterOpen(false)} onLoginSuccess={onLoginSuccess} />}
        </div>
    );
}