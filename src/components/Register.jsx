export default function Register({ onClose, onLoginSuccess }) {

    const handleRegister = (e) => {
        e.preventDefault();
        onLoginSuccess();
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl">

                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Sign Up</h2>
                    <button onClick={onClose} className="text-xl">&times;</button>
                </div>

                <p>It's quick and easy.</p>
                <hr className="mt-1"/>

                <form className="mt-4 space-y-4">

                    <div className="flex space-x-2">
                        <input type="text" placeholder="First name" className="input-default w-1/2 p-2 text-xl rounded" required/>
                        <input type="text" placeholder="Last name" className="input-default w-1/2 p-2 text-xl rounded" required/>
                    </div>

                    <input type="email" placeholder="Email address" className="input-default w-full p-2 text-xl rounded" required/>
                    <input type="password" placeholder="New password" className="input-default w-full p-2 text-xl rounded" required/>
                    <input type="password" placeholder="Confirm password" className="input-default w-full p-2 text-xl rounded" required/>

                    <div>
                        <label className="font-normal">Date of Birth</label>
                        <div className="flex space-x-2 mt-2">

                            <select className="input-default w-1/3 p-2 text-xl rounded" required>
                                <option value="" disabled selected>
                                    Day
                                </option>
                                {/* Options for days */}
                                {Array.from({ length: 31 }, (_, i) => (
                                    <option key={i + 1} value={i + 1} className="input-default w-1/2 p-2 text-xl rounded">
                                        {i + 1}
                                    </option>
                                ))}
                            </select>

                            <select className="input-default w-1/3 p-2 text-xl rounded" required>
                                <option value="" disabled selected>
                                    Month
                                </option>
                                {/* Options for months */}
                                {[
                                    'January',
                                    'February',
                                    'March',
                                    'April',
                                    'May',
                                    'June',
                                    'July',
                                    'August',
                                    'September',
                                    'October',
                                    'November',
                                    'December',
                                ].map((month, index) => (
                                    <option key={index + 1} value={index + 1} className="input-default w-1/2 p-2 text-xl rounded">
                                        {month}
                                    </option>
                                ))}
                            </select>

                            <select className="input-default w-1/3 p-2 text-xl rounded" required>
                                <option value="" disabled selected>
                                    Year
                                </option>
                                {/* Options for years */}
                                {Array.from(
                                    { length: 100 },
                                    (_, i) => new Date().getFullYear() - i
                                ).map((year) => (
                                    <option key={year} value={year} className="input-default w-1/2 p-2 text-xl rounded">
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="font-normal">Gender</label>
                        <div className="flex space-x-2 w-full">
                            <label className="flex items-center border rounded p-2 justify-between cursor-pointer text-xl w-1/3">
                                Female
                                <input type="radio" name="gender" value="female" className="ml-2" required/>
                            </label>
                            <label className="flex items-center border rounded p-2 justify-between cursor-pointer text-xl w-1/3">
                                Male
                                <input type="radio" name="gender" value="male" className="ml-2" required/>
                            </label>
                            <label className="flex items-center border rounded p-2 justify-between cursor-pointer text-xl w-1/3">
                                Other
                                <input type="radio" name="gender" value="other" className="ml-2" required/>
                            </label>
                        </div>
                    </div>
                
                    <p className="text-sm mt-2">
                        By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy. 
                    </p>

                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full p-3 text-xl font-bold rounded">
                        Sign Up
                    </button>

                </form>
            </div>
        </div>
    );
}
