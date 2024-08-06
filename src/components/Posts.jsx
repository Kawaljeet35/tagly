import profile_pic from '../assets/pic.jpg';
import ClearIcon from '@mui/icons-material/Clear';
import RecommendIcon from '@mui/icons-material/Recommend';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import NearMeIcon from '@mui/icons-material/NearMe';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export default function Posts(){
    return (
        <div className="flex flex-col bg-slate-50 w-2/5 items-center m-auto mt-6 rounded-xl shadow-md">

            <div className="flex p-3 space-x-4 w-full ml-4">
                <div>
                    <img src={profile_pic} alt="Profile Pic" className="h-14 w-14 rounded-full left-2" />
                </div>
                <div>
                    <button className='hover:underline'><p className='font-bold text-xl'>Kawaljeet Singh</p></button>
                    <p className='font-normal'><button className='hover:underline'>a day ago</button></p>
                </div>
                <div>
                    <button className='text-blue-800 font-bold text-xl hover:underline'>Follow</button>
                </div>
                <div className='flex justify-end'>
                    <p><button className='ml-60 hover:bg-stone-200 rounded-full p-1'><ClearIcon/></button></p>
                </div>
            </div>

            <div>
                <img src={profile_pic} alt='Post Image' className='w-full'/>
            </div>

            <div className='p-2 flex items-center justify-between w-full'>
                <div className='flex items-center'>
                    <button className='flex items-center'>
                        <RecommendIcon fontSize='large' sx={{color:'blue'}}/>
                        <p className='text-xl font-semibold text-slate-500 hover:underline'>110</p>
                    </button>
                </div>
                <div className='flex items-center space-x-2'>
                    <p className='text-xl font-semibold text-slate-500 hover:underline'>910</p>
                    <button><ModeCommentIcon sx={{color:'gray'}}/></button>
                    <p className='text-xl font-semibold text-slate-500 hover:underline'>870</p>
                    <button><NearMeIcon sx={{color:'gray'}}/></button>
                </div>
            </div>

            <hr className="w-full border-t border-gray-300 my-1" />

            <div className='flex items-center w-full p-2 justify-evenly mb-2'>
                <button className='flex items-center space-x-1 hover:bg-stone-200 rounded-md px-4 py-1 w-36 justify-center'>
                    <ThumbUpOffAltIcon fontSize='large' sx={{color:'gray'}}/>
                    <p className='text-xl text-gray-500 font-medium'>Like</p>
                </button>
                <button className='flex items-center space-x-1 hover:bg-stone-200 rounded-md px-4 py-1 w-36 justify-center'>
                    <ModeCommentIcon fontSize='large' sx={{color:'gray'}}/>
                    <p className='text-xl text-gray-500 font-medium'>Comment</p>
                </button>
                <button className='flex items-center space-x-1 hover:bg-stone-200 rounded-md px-4 py-1 w-36 justify-center'>
                    <WhatsAppIcon fontSize='large' sx={{color:'gray'}}/>
                    <p className='text-xl text-gray-500 font-medium'>Send</p>
                </button>
                <button className='flex items-center space-x-1 hover:bg-stone-200 rounded-md px-4 py-1 w-36 justify-center'>
                    <NearMeIcon fontSize='large' sx={{color:'gray'}}/>
                    <p className='text-xl text-gray-500 font-medium'>Share</p>
                </button>
            </div>

        </div>
    );
}