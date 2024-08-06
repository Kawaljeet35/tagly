import Navbar from "./Navbar";
import CreateStory from "./CreateStory";
import NewPost from "./NewPost";
import SideNavbar from "./SideNavbar";
import Posts from "./Posts";

export default function HomePage(){
    return (
        <div>
            <Navbar />
            <CreateStory />
            <NewPost />
            <SideNavbar />
            <Posts />
            <Posts />
            <Posts />
        </div>
    );
}