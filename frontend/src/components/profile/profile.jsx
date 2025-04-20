import './profile.css';
import ProfileIcon from 'C:/Users/ahard/Documents/GitHub/JDT-spring-25-beta/frontend/src/assets/profile-icon.png';

function Profile (){
    return (
        <div id="profile">
                <div><img width="250" src={ProfileIcon}/></div>
                <div id="profile-text">
                <p>Hello, I am</p>
                <h2>AJ Hardimon</h2>
                <p>Boston University Student</p>
                <div className="icons">
                    <a target="_blank" href="https://linkedin.com/in/anthony-hardimon-45909733b"><img id="linkedin-img" width="60" src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" /></a>
                    <a target="_blank" href="https://github.com/aj-hardimon"><img id="github-img" width="60" src="https://cdn-icons-png.flaticon.com/512/25/25231.png" /></a>
                </div>
            </div>
        </div>
    )
}

export default Profile;
