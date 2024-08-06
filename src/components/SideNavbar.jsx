import profile_pic from '../assets/pic.jpg';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import HistoryIcon from '@mui/icons-material/History';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import GroupsIcon from '@mui/icons-material/Groups';
import OndemandVideoTwoToneIcon from '@mui/icons-material/OndemandVideoTwoTone';
import StoreIcon from '@mui/icons-material/Store';
import FeedIcon from '@mui/icons-material/Feed';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import BarChartIcon from '@mui/icons-material/BarChart';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function SideNavbar(){
    return (
        <nav className='nav-top w-1/4 flex flex-col'>
            <button>
                <div className='flex items-center ml-4 mb-4 hover:bg-gray-300 p-2 rounded-lg'>
                    <img src={profile_pic} alt="Profile Pic" className="h-9 w-9 rounded-full" />
                    <p className='text-xl font-semibold ml-4'>Kawaljeet Singh</p>
                </div>
            </button>
            <button>
                <div className='flex items-center ml-4 mb-4 hover:bg-gray-300 p-2 rounded-lg'>
                    <PeopleAltIcon fontSize='large' style = {{color:'blue'}}/>
                    <p className='text-xl font-semibold ml-4'>Find friends</p>
                </div>
            </button>
            <button>
                <div className='flex items-center ml-4 mb-4 hover:bg-gray-300 p-2 rounded-lg'>
                    <HistoryIcon fontSize='large' style = {{color:'blue'}}/>
                    <p className='text-xl font-semibold ml-4'>Memories</p>
                </div>
            </button>
            <button>
                <div className='flex items-center ml-4 mb-4 hover:bg-gray-300 p-2 rounded-lg'>
                    <TurnedInIcon fontSize='large' style = {{color:'purple'}}/>
                    <p className='text-xl font-semibold ml-4'>Saved</p>
                </div>
            </button>
            <button>
                <div className='flex items-center ml-4 mb-4 hover:bg-gray-300 p-2 rounded-lg'>
                    <GroupsIcon fontSize='large' style = {{color:'blue'}}/>
                    <p className='text-xl font-semibold ml-4'>Groups</p>
                </div>
            </button>
            <button>
                <div className='flex items-center ml-4 mb-4 hover:bg-gray-300 p-2 rounded-lg'>
                    <OndemandVideoTwoToneIcon fontSize='large' style = {{color:'blue'}}/>
                    <p className='text-xl font-semibold ml-4'>Video</p>
                </div>
            </button>
            <button>
                <div className='flex items-center ml-4 mb-4 hover:bg-gray-300 p-2 rounded-lg'>
                    <StoreIcon fontSize='large' style = {{color:'blue'}}/>
                    <p className='text-xl font-semibold ml-4'>Marketplace</p>
                </div>
            </button>
            <button>
                <div className='flex items-center ml-4 mb-4 hover:bg-gray-300 p-2 rounded-lg'>
                    <FeedIcon fontSize='large' style = {{color:'blue'}}/>
                    <p className='text-xl font-semibold ml-4'>Feed</p>
                </div>
            </button>
            <button>
                <div className='flex items-center ml-4 mb-4 hover:bg-gray-300 p-2 rounded-lg'>
                    <EventAvailableIcon fontSize='large' style = {{color:'red'}}/>
                    <p className='text-xl font-semibold ml-4'>Events</p>
                </div>
            </button>
            <button>
                <div className='flex items-center ml-4 mb-4 hover:bg-gray-300 p-2 rounded-lg'>
                    <BarChartIcon fontSize='large' style = {{color:'blue'}}/>
                    <p className='text-xl font-semibold ml-4'>Ads Manager</p>
                </div>
            </button>
            <button>
                <div className='flex items-center ml-4 mb-4 hover:bg-gray-300 p-2 rounded-lg'>
                    <FavoriteIcon fontSize='large' style = {{color:'blue'}}/>
                    <p className='text-xl font-semibold ml-4'>Fundraisers</p>
                </div>
            </button>
        </nav>
    );
}