import settingIcon from '../assets/settingIcon.png';
import helpIcon from '../assets/helpIcon.png';
import displayIcon from '../assets/displayIcon.png';
import feedbackIcon from '../assets/feedbackIcon.png';
import logoutIcon from '../assets/logoutIcon.png';

export default function NavProfilePopUp({ handleLogout }){

    // Defining common classes to keep code DRY
    const divClass = "flex justify-start items-center space-x-2 p-2 hover:bg-stone-100 rounded-lg cursor-pointer";
    const div2Class = "p-2 rounded-full bg-slate-200";
    const imgClass = "h-5 w-5";
    const spanClass = "font-bold text-black";

    return (
        <div className="bg-white shadow rounded-lg flex flex-col justify-between min-w-max min-h-max p-2">

            <span className='pl-2 font-bold text-2xl mb-2'>Account</span>
           
            <div className={divClass}>
                <div className={div2Class}><img src={settingIcon} alt="Settings & Privacy Icon" className={imgClass}/></div>
                <span className={spanClass}>Settings & Privacy</span>
            </div>

            <div className={divClass}>
                <div className={div2Class}><img src={helpIcon} alt="Help & Support Icon" className={imgClass}/></div>
                <span className={spanClass}>Help & Support</span>
            </div>

            <div className={divClass}>
                <div className={div2Class}><img src={displayIcon} alt="Display & Accessibility Icon" className={imgClass}/></div>
                <span className={spanClass}>Display & Accessibility</span>
            </div>

            <div className={divClass}>
                <div className={div2Class}><img src={feedbackIcon} alt="Feedback Icon" className={imgClass}/></div>
                <span className={spanClass}>Give Feedback</span>
            </div>

            <div className={divClass} onClick={handleLogout}>
                <div className={div2Class}><img src={logoutIcon} alt="Logout Icon" className={imgClass}/></div>
                <span className={spanClass}>Logout</span>
            </div>

        </div>
    );
}