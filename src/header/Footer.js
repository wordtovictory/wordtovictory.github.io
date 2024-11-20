import React from 'react';
import {SocialIcon} from 'react-social-icons/component'
import 'react-social-icons/instagram'
import 'react-social-icons/facebook'
import 'react-social-icons/youtube'

export default function Footer() {
    return (
        <footer style={{
            backgroundColor: '#eeeeee',
            padding: '16px'
        }}>
            {/*<h1>More about BibleTrack</h1>*/}
            {/*<p>About</p>*/}
            {/*<p>Contact</p>*/}
            {/*<SocialIcon bgColor="white" fgColor="#0099ff" url="www.instagram.com"/>*/}
            {/*<SocialIcon bgColor="white" fgColor="#0099ff" url="www.facebook.com"/>*/}
            {/*<SocialIcon bgColor="white" fgColor="#0099ff" url="www.youtube.com"/>*/}
            <p style={{color: '#555555'}}>Developed by <a href={"https://www.linkedin.com/in/florencesytsang/"}>Florence
                T.</a></p>
            {/*<p style={{color: '#555555'}}>© 2024 BibleTrack. All Rights Reserved.</p>*/}
        </footer>
    );
};
