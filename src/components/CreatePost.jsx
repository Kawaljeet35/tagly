import ProfilePic from '../assets/pic.jpg';

export default function CreatePost(){
    return (
        <div className="bg-white shadow rounded-2xl flex-col p-4 w-full sm:w-2/3 xl:w-5/12 mx-auto mt-24 space-y-4">

            <div className="flex items-center justify-start space-x-3">

                <div className="bg-stone-200 rounded-full">
                    <svg 
                        viewBox="0 0 24.00 24.00" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-11 h-11 p-2"
                    >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier"> 
                            <path 
                                d="M18.3785 8.44975L11.4637 15.3647C11.1845 15.6439 10.8289 15.8342 10.4417 15.9117L7.49994 16.5L8.08829 13.5582C8.16572 13.1711 8.35603 12.8155 8.63522 12.5363L15.5501 5.62132M18.3785 8.44975L19.7927 7.03553C20.1832 6.64501 20.1832 6.01184 19.7927 5.62132L18.3785 4.20711C17.988 3.81658 17.3548 3.81658 16.9643 4.20711L15.5501 5.62132M18.3785 8.44975L15.5501 5.62132" 
                                stroke="#008080" 
                                stroke-width="1.9200000000000004" 
                                stroke-linecap="round" 
                                stroke-linejoin="round">
                            </path> 
                            <path 
                                d="M5 20H19" 
                                stroke="#008080" 
                                stroke-width="1.9200000000000004" 
                                stroke-linecap="round" 
                                stroke-linejoin="round">
                            </path> 
                        </g>
                    </svg>
                </div>

                <div>
                    <p className="font-semibold text-xl text-slate-500">Create Post</p>
                </div>

            </div>

            <div className="relative h-auto">
                
                <textarea 
                    type='text' 
                    placeholder="What's on your mind?" 
                    className='input-default rounded-xl p-4 pl-16 bg-stone-100 border-none text-xl w-full h-1/3' 
                    style={{ height: '8rem' }}
                />

                <div className="absolute left-3 top-3">
                    <a href="" onClick={(e) => e.preventDefault()}>
                        <div className='w-10 h-10 rounded-full flex items-center justify-center hover:scale-105'>
                            <img 
                                src={ProfilePic} 
                                alt='pic' 
                                className='w-full h-full object-cover rounded-full'
                            />
                        </div>
                    </a>
                </div>

            </div>

            <div className='flex justify-evenly space-x-4'>

                <a href="" onClick={(e) => e.preventDefault()}>
                    <div className='flex justify-between items-center gap-1 hover:scale-110'>

                        <svg 
                            fill="#FF0000" 
                            viewBox="-2 -6 24 24" 
                            xmlns="http://www.w3.org/2000/svg" 
                            preserveAspectRatio="xMinYMin" 
                            class="jam jam-video-camera"
                            className='w-12 h-12'
                        >
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path 
                                    d="M4 2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4zm9.98 1.605L16 1.585A2 2 0 0 1 17.414 1H18a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-.586A2 2 0 0 1 16 10.414l-2.02-2.019A4 4 0 0 1 10 12H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4h6a4 4 0 0 1 3.98 3.605zM17.415 9H18V3h-.586l-3 3 3 3zM5 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z">
                                </path>
                            </g>
                        </svg>

                        <p className='font-semibold text-xl text-slate-500'>Live video</p>

                    </div>
                </a>

                <button>
                    <div className='flex justify-between items-center gap-2 hover:scale-110'>

                        <svg 
                            version="1.0" 
                            id="Layer_1" 
                            xmlns="http://www.w3.org/2000/svg" 
                            xmlns:xlink="http://www.w3.org/1999/xlink" 
                            viewBox="0 0 64 64" 
                            enable-background="new 0 0 64 64" 
                            xml:space="preserve" 
                            fill="#000000"
                            className='w-7 h-7'
                        >
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier"> 
                                <g> 
                                    <path 
                                        fill="#00FF00" 
                                        d="M60,0H4C1.789,0,0,1.789,0,4v56c0,2.211,1.789,4,4,4h56c2.211,0,4-1.789,4-4V4C64,1.789,62.211,0,60,0z M8,8h48v32.688l-9.113-9.113c-1.562-1.559-4.094-1.559-5.656,0L16.805,56H8V8z">
                                    </path> 
                                    <circle 
                                        fill="#00FF00" 
                                        cx="24" 
                                        cy="24" 
                                        r="8">
                                    </circle> 
                                </g> 
                            </g>
                        </svg>

                        <p className='font-semibold text-xl text-slate-500'>Photo/video</p>
                    </div>
                </button>

                <button>
                    <div className='flex justify-between items-center gap-2 hover:scale-110'>

                        <svg 
                            viewBox="0 0 1024 1024" 
                            fill="#000000" 
                            className="w-7 h-7" 
                            version="1.1" 
                            xmlns="http://www.w3.org/2000/svg" 
                            stroke="#FFA500" 
                            stroke-width="50"
                        >
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path 
                                    d="M249.6 367.2c0 36 29.6 65.6 65.6 65.6s65.6-29.6 65.6-65.6-29.6-65.6-65.6-65.6-65.6 29.6-65.6 65.6zM512 790.4c214.4 0 259.2-194.4 259.2-194.4H252.8S297.6 790.4 512 790.4z" 
                                    fill="#FFA500">
                                </path>
                                <path 
                                    d="M512 1010.4c-274.4 0-497.6-224-497.6-498.4S237.6 14.4 512 14.4s498.4 223.2 498.4 498.4-224 497.6-498.4 497.6zM512 68C267.2 68 68 267.2 68 512s199.2 444 444 444 444-199.2 444-444S756.8 68 512 68z" 
                                    fill="#FFA500">
                                </path>
                                <path 
                                    d="M643.2 367.2c0 36 29.6 65.6 65.6 65.6 36 0 65.6-29.6 65.6-65.6s-29.6-65.6-65.6-65.6c-36 0-65.6 29.6-65.6 65.6z" 
                                    fill="#FFA500">
                                </path>
                            </g>
                        </svg>

                        <p className='font-semibold text-xl text-slate-500'>Feeling/activity</p>
                    </div>
                </button>
            </div>

        </div>
    );
}



