import profile_pic from '../assets/pic.jpg';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';

export default function NewPost(){
    return (
        <div className='flex flex-col bg-slate-50 w-2/5 mt-5 p-4 items-center m-auto rounded-xl shadow-md'>

            <div className="flex">
                <img src={profile_pic} alt="Profile Pic" className="h-14 w-14 rounded-full" />
                <button className='bg-gray-100 rounded-full p-4 text-xl ml-4 pr-60 hover:bg-gray-300'>What's on your mind, Kawal?</button>
            </div>

            <hr className="w-full border-t border-gray-300 my-4" />

            <div className="flex space-x-4 mt-1">
                <div className='flex items-center hover:bg-gray-300 p-2 rounded-xl'>
                    <button className="text-gray-500 flex items-center">
                        <VideoCameraFrontIcon sx={{ fontSize: 40, color: 'red' }}/>
                        <p className='text-xl font-bold text-stone-600'>Live Video</p>
                    </button>
                </div>
                <div className='flex items-center hover:bg-gray-300 p-2 rounded-xl'>
                    <button className="text-gray-500 flex items-center">
                        <PhotoLibraryIcon sx={{ fontSize: 40, color: 'green' }} />
                        <p className='text-xl font-bold text-stone-600'>Photo/Video</p>
                    </button>
                </div>
                <div className='flex items-center hover:bg-gray-300 p-2 rounded-xl'>
                    <button className="text-gray-500 flex items-center">
                        <InsertEmoticonIcon sx={{ fontSize: 40, color: 'orange' }} />
                        <p className='text-xl font-bold text-stone-600'>Feeling/Activity</p>
                    </button>
                </div>
            </div>
        </div>
    );
}