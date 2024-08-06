import AddIcon from '@mui/icons-material/Add';

export default function CreateStory(){
    return (
        <div className='flex bg-slate-50 w-2/4 mt-20 p-4 items-center m-auto rounded-xl shadow-md hover:bg-stone-300'>
            <div>
                <AddIcon style={{backgroundColor: '#E8EFF0',borderRadius: '50%', width: '40px', height: '40px', color: 'blue'}} className='mr-4'/>
            </div>
            <div>
                <p className='font-bold text-xl'>Create Story</p>
                <p className='text-xl'>Share a photo or write something.</p>
            </div>
        </div>
    );
}