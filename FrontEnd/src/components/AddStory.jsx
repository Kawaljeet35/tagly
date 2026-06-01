import PlusIcon from '../assets/PlusIcon.svg';

export default function AddStory(){
    return (
        <div className="flex justify-between space-x-1 mx-auto max-w-lg mt-[70px] text-sm">

            <button className="relative h-40 rounded-xl bg-gray-900 w-32 flex flex-col items-center justify-center">
                <img 
                    src={PlusIcon} 
                    alt='Plus Icon' 
                    className="w-8 h-8 absolute"
                    style={{ top: '70%', left: '50%', transform: 'translate(-50%, -66%)' }}
                />
                <span className="text-white mt-28 absolute font-semibold">Add Story</span>
            </button>

            <div className="relative h-40 rounded-xl bg-gray-900 w-32 flex flex-col items-center justify-center">
                <img 
                    src={PlusIcon} 
                    alt='Plus Icon' 
                    className="w-8 h-8 absolute"
                    style={{ top: '70%', left: '50%', transform: 'translate(-50%, -66%)' }}
                />
                <span className="text-white mt-28 absolute font-semibold">Add Story</span>
            </div>

            <div className="relative h-40 rounded-xl bg-gray-900 w-32 flex flex-col items-center justify-center">
                <img 
                    src={PlusIcon} 
                    alt='Plus Icon' 
                    className="w-8 h-8 absolute"
                    style={{ top: '70%', left: '50%', transform: 'translate(-50%, -66%)' }}
                />
                <span className="text-white mt-28 absolute font-semibold">Add Story</span>
            </div>

            <div className="relative h-40 rounded-xl bg-gray-900 w-32 flex flex-col items-center justify-center">
                <img 
                    src={PlusIcon} 
                    alt='Plus Icon' 
                    className="w-8 h-8 absolute"
                    style={{ top: '70%', left: '50%', transform: 'translate(-50%, -66%)' }}
                />
                <span className="text-white mt-28 absolute font-semibold">Add Story</span>
            </div>

            <div className="relative h-40 rounded-xl bg-gray-900 w-32 flex flex-col items-center justify-center">
                <img 
                    src={PlusIcon} 
                    alt='Plus Icon' 
                    className="w-8 h-8 absolute"
                    style={{ top: '70%', left: '50%', transform: 'translate(-50%, -66%)' }}
                />
                <span className="text-white mt-28 absolute font-semibold">Add Story</span>
            </div>

        </div>
    );
}