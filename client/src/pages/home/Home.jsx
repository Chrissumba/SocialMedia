import Share from "../../components/share/Share";
import Stories from "../../components/stories/stories";
import Posts from "../../components/posts/posts";
 
import "./home.scss"

const Home = () => {
  return (
    <div className="home">
      <Stories/>
      <Share/>
      <Posts/>
      
    </div>
  )
}

export default Home