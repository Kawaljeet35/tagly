import navlogo from '/favicon.ico';
import profile_pic from '../assets/pic.jpg';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import GroupsIcon from '@mui/icons-material/Groups';
import MenuIcon from '@mui/icons-material/Menu';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full bg-white shadow-md flex items-center justify-between p-2">

            <div className="flex items-center">
                <img src={navlogo} alt="Tagly Logo" className="h-10 w-10 rounded-full" />

                <div className="ml-4 flex items-center bg-gray-100 rounded-full p-2 w-4/5">
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder="Search tagly"
                        className="bg-transparent outline-none ml-2 text-xl"
                    />
                </div>
            </div>

            <div className="flex space-x-8">
                <button className="text-gray-500 hover:bg-stone-200 pt-2 pb-2 pl-12 pr-12 rounded-lg">
                    <HomeIcon sx={{ fontSize: 40 }} />
                </button>
                <button className="text-gray-500 hover:bg-stone-200 pt-2 pb-2 pl-12 pr-12 rounded-lg">
                    <PeopleAltIcon sx={{ fontSize: 40 }} />
                </button>
                <button className="text-gray-500 hover:bg-stone-200 pt-2 pb-2 pl-12 pr-12 rounded-lg">
                    <OndemandVideoIcon sx={{ fontSize: 40 }} />
                </button>
                <button className="text-gray-500 hover:bg-stone-200 pt-2 pb-2 pl-12 pr-12 rounded-lg">
                    <AddBusinessIcon sx={{ fontSize: 40 }} />
                </button>
                <button className="text-gray-500 hover:bg-stone-200 pt-2 pb-2 pl-12 pr-12 rounded-lg">
                    <GroupsIcon sx={{ fontSize: 40 }} />
                </button>
            </div>

            <div className="flex items-center space-x-4">
                <button className="text-gray-500 rounded-full bg-stone-100 hover:bg-stone-200 p-2">
                    <MenuIcon sx={{ fontSize: 40 }} />
                </button>
                <button className="text-gray-500 rounded-full bg-stone-100 hover:bg-stone-200 p-2">
                    <ChatIcon sx={{ fontSize: 40 }} />
                </button>
                <button className="text-gray-500 rounded-full bg-stone-100 hover:bg-stone-200 p-2">
                    <NotificationsActiveIcon sx={{ fontSize: 40 }} />
                </button>
                <img src={profile_pic} alt="Profile Pic" className="h-10 w-10 rounded-full" />
            </div>
        </nav>
    );
}